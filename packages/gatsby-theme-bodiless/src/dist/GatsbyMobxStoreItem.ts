/**
 * Copyright © 2020 Johnson & Johnson
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
// eslint-disable-next-line import/no-cycle
import GatsbyMobxStore from './GatsbyMobxStore';
import { ItemStateEvent } from './types';

enum ItemState {
  Clean,
  Dirty,
  Flushing,
  Locked,
}

export default class GatsbyMobxStoreItem {
  @observable data = {};

  @observable state: ItemState = ItemState.Clean;

  isDeleted = false;

  key: string;

  store: GatsbyMobxStore;

  dispose?: IReactionDisposer;

  private shouldAccept() {
    const isClean = this.state === ItemState.Clean;
    return isClean;
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
        // If an update happens from the server
        // Then we do not update state
        break;
      case ItemStateEvent.BeginPostData:
        this.state = ItemState.Flushing;
        break;
      case ItemStateEvent.EndPostData:
        // If an update happens while flushing, the status will be set to dirty.
        // In this case we don't want to reset it to clean.
        if (this.state === ItemState.Dirty) {
          break;
        }
        // Lock the item for a period of time before setting it to clean
        // So that mitigate the problem with stale data coming from the server
        this.state = ItemState.Locked;
        setTimeout(() => {
          this.state = this.state === ItemState.Locked ? ItemState.Clean : this.state;
        }, 10000);
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

  private enableDataTracking() {
    if (this.shouldSave()) {
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
      this.dispose = reaction(preparePostData, postData, {
        delay: 2000,
      });
    }
  }

  constructor(
    store: GatsbyMobxStore,
    key: string,
    initialData = {},
    event = ItemStateEvent.UpdateFromBrowser,
  ) {
    this.store = store;
    this.key = key;
    this.enableDataTracking();
    this.setData(initialData);
    this.updateState(event);
  }

  update(data = {}, event = ItemStateEvent.UpdateFromBrowser) {
    switch (event) {
      case ItemStateEvent.UpdateFromBrowser:
        this.setData(data);
        this.updateState(event);
        break;
      case ItemStateEvent.UpdateFromServer:
        if (this.shouldAccept()) {
          this.setData(data);
          this.updateState(event);
        }
        break;
      default:
        throw new Error('Invalid item event specified.');
    }
  }

  delete() {
    this.isDeleted = true;
    this.store.client.deletePath(this.getResoucePath());
  }

  isPending() {
    return this.state === ItemState.Dirty || this.state === ItemState.Flushing;
  }
}
