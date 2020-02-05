/**
 * Copyright © 2019 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path from 'path';
import {
  observable, action, reaction, IReactionDisposer,
} from 'mobx';
import { AxiosPromise } from 'axios';
import { v1 } from 'uuid';
// import isEqual from 'react-fast-compare';
import BackendClient from './BackendClient';
import addPageLeaver from './addPageLeaver';

export type DataSource = {
  slug: string,
};

type GatsbyNode = {
  node: {
    content: string;
    name: string;
  };
};

export type GatsbyData = {
  [collection: string]: {
    edges: GatsbyNode[];
  };
};

// const Logger = require('../service/Logger.js');

// const logger = new Logger('GatsbyMobxStore', HttpService);

const nodeChildDelimiter = '$';

type Client = {
  savePath(resourcePath: string, data: any): AxiosPromise<any>;
};

type MetaData = {
  author: string;
};

enum ItemState {
  Clean,
  Dirty,
  Flushing,
}

enum ItemStateEvent {
  UpdateFromServer,
  UpdateFromBrowser,
  BeginPostData,
  EndPostData,
}

class Item {
  @observable data = {};

  @observable state: ItemState = ItemState.Clean;

  key: string;

  metaData?: MetaData;

  store: GatsbyMobxStore;

  dispose?: IReactionDisposer;

  private shouldAccept(data: any) {
    const { ___meta: metaData } = data;
    // We want to reject data if it was created by this client
    const isAuthor = metaData !== undefined && metaData.author === this.store.storeId;
    return !isAuthor;
  }

  // eslint-disable-next-line class-methods-use-this
  private reduceMeta(data: any) {
    const { ___meta, ...rest } = data;
    return rest;
  }

  // eslint-disable-next-line class-methods-use-this
  private shouldSave() {
    const saveEnabled = (process.env.BODILESS_BACKEND_SAVE_ENABLED || '1') === '1';
    // Determine if the resource path is for a page created for preview purposes
    // we do not want to save data for these pages
    const resourcePath = this.getResoucePath();
    const isPreviewTemplatePage = resourcePath.includes(path.join('pages', '___templates'));
    return saveEnabled && !isPreviewTemplatePage;
  }

  @action private setData(data: any) {
    this.data = data;
  }

  @action private updateState(event: ItemStateEvent) {
    switch (event) {
      case ItemStateEvent.UpdateFromBrowser:
        this.state = ItemState.Dirty;
        break;
      case ItemStateEvent.UpdateFromServer:
        this.state = ItemState.Clean;
        break;
      case ItemStateEvent.BeginPostData:
        this.state = ItemState.Flushing;
        break;
      case ItemStateEvent.EndPostData:
        // If an update happens while flushing, the status will be set to dirty.
        // In this case we don't want to reset it to clean.
        this.state = this.state === ItemState.Dirty ? ItemState.Dirty : ItemState.Clean;
        break;
      default:
        throw new Error('Invalid item event specified.');
    }
  }

  private getResoucePath() {
    // Extract the collection name (query alias) from the left-side of the key name.
    const [collection, ...rest] = this.key.split('$');
    // Re-join the rest of the key's right-hand side.
    const fileName = rest.join('$');

    // The query alias (collection) determines the filesystem location
    // where to store the JSON data files.
    // TODO: Don't hardcode 'pages' and provide mechanism for shared (cross-page) content.
    // const resourcePath = path.join('pages', this.store.slug || '', fileName);
    const resourcePath = collection === 'Page'
      ? path.join('pages', this.store.slug || '', fileName)
      : path.join('site', fileName);
    return resourcePath;
  }

  constructor(
    store: GatsbyMobxStore,
    key: string,
    initialData = {},
    event = ItemStateEvent.UpdateFromBrowser,
  ) {
    this.store = store;
    this.key = key;
    this.setData(initialData);
    this.updateState(event);

    const preparePostData = () => (this.state === ItemState.Dirty ? this.data : null);
    // Post this.data back to filesystem if item state is dirty.
    const postData = (data: {} | null) => {
      if (!data) {
        return;
      }
      this.updateState(ItemStateEvent.BeginPostData);
      this.store.client.savePath(this.getResoucePath(), data)
        .then(() => this.updateState(ItemStateEvent.EndPostData));
    };
    if (this.shouldSave()) {
      this.dispose = reaction(preparePostData, postData, {
        delay: 2000,
      });
    }
  }

  update(data = {}, event = ItemStateEvent.UpdateFromBrowser) {
    switch (event) {
      case ItemStateEvent.UpdateFromBrowser:
        this.setData(data);
        this.updateState(event);
        break;
      case ItemStateEvent.UpdateFromServer:
        if (this.shouldAccept(data)) {
          this.setData(this.reduceMeta(data));
          this.updateState(event);
        }
        break;
      default:
        throw new Error('Invalid item event specified.');
    }
  }
}

/**
 * Query names returned by GraphQL as object keys, with query results
 * contained in the edges property.
 *
 * Query names can be dynamic therefore is best to not hardcode the query names.
 */

export default class GatsbyMobxStore {
  @observable store = new Map<string, Item>();

  client: Client;

  slug: string | null = null;

  data: any;

  storeId: string;

  constructor(nodeProvider: DataSource) {
    this.setNodeProvider(nodeProvider);
    this.storeId = v1();
    this.client = new BackendClient({ clientId: this.storeId });
    addPageLeaver(this.getPendingItems.bind(this));
  }

  private getPendingItems() {
    return Array.from(this.store.values())
      .filter(item => item.state !== ItemState.Clean);
  }

  setNodeProvider(nodeProvider: DataSource) {
    this.slug = nodeProvider.slug;
  }

  /**
   * Called at initial page render to initialize our data from the Gatsby Page Query.
   * Note - we just copy the results to our unobserved data structure unless modifications
   * have been made, in which case we update the observable store.
   *
   * @param gatsbyData
   */
  updateData(gatsbyData: GatsbyData) {
    // The gatsbyData parameter comes in as undefined when there is no query data.
    if (gatsbyData === undefined) {
      return;
    }
    this.data = {};
    const { store } = this;

    // Add all query results into the Mobx store.
    Object.keys(gatsbyData).forEach(collection => {
      if (gatsbyData[collection] === null) return;
      gatsbyData[collection].edges.forEach(({ node }) => {
        try {
          // Namespace the key name to the query name.
          const key = `${collection}${nodeChildDelimiter}${node.name}`;
          const data = JSON.parse(node.content);
          const existingData = store.get(key);
          // TODO: Determine why isEqual gives (apparently) false positives for RGLGrid data.
          // if (!existingData || !isEqual(existingData.data, data)) {

          // Invoke Mobx @action to update store.
          if (
            !existingData
            || JSON.stringify(existingData.data) !== JSON.stringify(data)
          ) {
            this.setNode([key], data, ItemStateEvent.UpdateFromServer);
          }
        } catch (e) {
          // console.log(e);
          // Just ignore any nodes which fail to parse.
        }
      });
    });
  }

  getKeys = () => Array.from(this.store.keys());

  getNode = (keyPath: string[]) => {
    const key = keyPath.join(nodeChildDelimiter);
    const item = this.store.get(key);
    const storeValue = item ? item.data : null;
    const dataValue = this.data[key];
    return storeValue || dataValue || {};
  };

  /**
   * Mobx action saves or updates items to GatsbyMobxStore.store.
   */
  @action setNode = (keyPath: string[], value = {}, event = ItemStateEvent.UpdateFromBrowser) => {
    const key = keyPath.join(nodeChildDelimiter);
    const item = this.store.get(key);
    if (item) {
      item.update(value, event);
    } else {
      this.store.set(key, new Item(this, key, value, event));
    }
  };
}
