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

enum ItemStatus {
  Stale,
  Flushing,
  Normal,
};

class Item {
  @observable data = {};

  @observable dirty = false;

  status: ItemStatus = ItemStatus.Normal;

  metaData?: MetaData;

  store: GatsbyMobxStore;

  dispose?: IReactionDisposer;

  lockTimeout?: NodeJS.Timeout;

  unLock() {
    this.lockTimeout = setTimeout(() => {
      this.dirty = false;
    }, 5000);
  }

  lock() {
    this.dirty = true;
    if (this.lockTimeout !== undefined) {
      clearTimeout(this.lockTimeout);
    }
  }

  private shouldAccept(metaData: MetaData) {
    // We want to reject data if it was created by this client
    const isAuthor = metaData !== undefined && metaData.author === this.store.storeId;
    return !isAuthor;
  }

  // eslint-disable-next-line class-methods-use-this
  private shouldSave(resourcePath: string) {
    const saveEnabled = (process.env.BODILESS_BACKEND_SAVE_ENABLED || '1') === '1';
    // Determine if the resource path is for a page created for preview purposes
    // we do not want to save data for these pages
    const isPreviewTemplatePage = resourcePath.includes(path.join('pages', '___templates'));
    return saveEnabled && !isPreviewTemplatePage;
  }

  private setData(data: any) {
    const { ___meta, ...rest } = data;
    if (this.shouldAccept(___meta)) {
      this.metaData = ___meta;
      this.data = rest;
    }
  }

  private setStatus(newStatus: ItemStatus) {
    if (newStatus === ItemStatus.Normal && this.status !== ItemStatus.Flushing) {
      return;
    }
    this.status = newStatus;
  }

  constructor(
    store: GatsbyMobxStore,
    key: string,
    initialData = {},
    save = true,
  ) {
    this.store = store;
    this.setData(initialData);
    this.dirty = save;
    const preparePostData = () => (this.dirty ? this.data : null);

    // Extract the collection name (query alias) from the left-side of the key name.
    const [collection, ...rest] = key.split('$');
    // Re-join the rest of the key's right-hand side.
    const fileName = rest.join('$');

    // The query alias (collection) determines the filesystem location
    // where to store the JSON data files.
    const resourcePath = collection === 'Page'
      ? path.join('pages', this.store.slug || '', fileName)
      : path.join('site', fileName);

    // Post this.data back to filesystem if dirty flag is true.
    const postData = (data: {} | null) => {
      if (!data) {
        return;
      }

      // TODO: Don't hardcode 'pages' and provide mechanism for shared (cross-page) content.
      // const resourcePath = path.join('pages', this.store.slug || '', fileName);
      this.lock();
      this.setStatus(ItemStatus.Flushing);
      this.store.client.savePath(resourcePath, data).then(() => {
        this.setStatus(ItemStatus.Normal);
        this.unLock();
      });
    };
    if (this.shouldSave(resourcePath)) {
      postData(preparePostData());
      this.dispose = reaction(preparePostData, postData, {
        delay: 2000,
      });
    } else {
      this.setStatus(ItemStatus.Normal);
    }
  }

  @action update(data = {}, save = true) {
    if (save) {
      this.dirty = true;
      this.setData(data);
      this.setStatus(ItemStatus.Stale);
    } else if (!this.dirty) {
      this.setData(data);
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
            .filter(item => item.status !== ItemStatus.Normal);
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
            this.setNode([key], data, false);
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
  @action setNode = (keyPath: string[], value = {}, save = true) => {
    const key = keyPath.join(nodeChildDelimiter);
    const item = this.store.get(key);
    if (item) {
      item.update(value, save);
    } else {
      this.store.set(key, new Item(this, key, value, save));
    }
  };
}
