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

import React, { ComponentType } from 'react';
import { observable, action, computed } from 'mobx';

type BreadcrumbItemTitle = {
  // ToDo: Remove it, there is no need to store it here
  data: string | object;
  nodePath: string;
};
type BreadcrumbItemLink = {
  data: string ;
  nodePath: string;
};
type BreadcrumbItemSettings = {
  uuid: string;
  parent?: BreadcrumbItemInterface;
  title: BreadcrumbItemTitle;
  link: BreadcrumbItemLink;
  store: BreadcrumbStoreInterface;
};
export interface BreadcrumbItemInterface {
  setTitle: (title: BreadcrumbItemTitle) => void,
  setLink: (link: BreadcrumbItemLink) => void,
  getUUID: () => string,
  getTitle: () => BreadcrumbItemTitle;
  getLink: () => BreadcrumbItemLink;
  isSubpathOf: (item: BreadcrumbItemInterface | string) => boolean;
  hasPath: (item: BreadcrumbItemInterface | string) => boolean;
  isAncestorOf: (item: BreadcrumbItemInterface) => boolean;
  isDescendantOf: (item: BreadcrumbItemInterface) => boolean;
  getAncestors: () => BreadcrumbItemInterface[];
  getParent: () => BreadcrumbItemInterface | undefined;
};

const DEFAULT_URL_BASE = 'http://host';

const withoutTrailingSlash = (str: string) => str.replace(/\/$/, '');

const isChildOf = (child: string, parent: string) => {
  if (child === parent) return false;
  const childTokens = child.split('/').filter(i => i.length);
  const parentTokens = parent.split('/').filter(i => i.length);
  return parentTokens.every((t, i) => childTokens[i] === t);
}

export class BreadcrumbItem {
  uuid: string;
  parent?: BreadcrumbItemInterface;
  title: BreadcrumbItemTitle;
  link: BreadcrumbItemLink;
  store: BreadcrumbStoreInterface;

  constructor({
    uuid,
    title,
    link,
    store,
    parent
  }: BreadcrumbItemSettings) {
    this.uuid = uuid;
    this.parent = parent;
    this.title = title;
    this.link = link;
    this.store = store;
  }

  isSubpathOf(item: BreadcrumbItemInterface | string) {
    const base = typeof window === 'undefined'
      ? DEFAULT_URL_BASE
      : `${window.location.protocol}//${window.location.host}`;
    const itemURL = typeof item === 'string' ? new URL(item, base) : new URL(item.getLink().data, base);
    const thisURL = new URL(this.getLink().data, base);
    if (itemURL.host !== thisURL.host) return false;
    return isChildOf(itemURL.pathname, thisURL.pathname);
  }

  hasPath(item: BreadcrumbItemInterface | string) {
    const base = typeof window === 'undefined'
      ? DEFAULT_URL_BASE
      : `${window.location.protocol}//${window.location.host}`;
    const itemURL = typeof item === 'string' ? new URL(item, base) : new URL(item.getLink().data, base);
    const thisURL = new URL(this.getLink().data, base);
    if (itemURL.host !== thisURL.host) return false;
    return withoutTrailingSlash(thisURL.pathname) === withoutTrailingSlash(itemURL.pathname);
  }

  isDescendantOf(item: BreadcrumbItemInterface) {
    for (let current: BreadcrumbItemInterface | undefined = this.parent;
      current;
      current = this.parent
    ) if (current === item) return true;
    return false;
  }

  isAncestorOf(item: BreadcrumbItemInterface) {
    const isDescendant = item.isDescendantOf(this);
    return isDescendant;
  }

  getAncestors() {
    const ancestors = [];
    for (let current = this.getParent();
      current;
      current = current.getParent()
    ) {
      ancestors.push(current);
    }
    return ancestors;
  }

  getUUID() {
    return this.uuid;
  }

  getTitle() {
    return this.title;
  }

  getLink() {
    return this.link;
  }

  getParent() {
    return this.parent;
  }

  setTitle(title: BreadcrumbItemTitle) {
    this.title = title;
  }

  setLink(link: BreadcrumbItemLink) {
    this.link = link;
  }
};

interface BreadcrumbStoreInterface {
  setItem: (item: BreadcrumbItemInterface) => BreadcrumbItemInterface | undefined;
  deleteItem: (item: BreadcrumbItemInterface) => boolean;
  getPagePath: () => string;
  breadcrumbTrail: BreadcrumbItemInterface[];
  export: () => BreadcrumbItemInterface[];
  hasLastItem: () => boolean;
};

export class BreadcrumbStore implements BreadcrumbStoreInterface {
  @observable private items: Map<string, BreadcrumbItemInterface> = new Map<string, BreadcrumbItemInterface>();
  @observable private activeItem?: BreadcrumbItemInterface = undefined;
  private pagePath: string;

  constructor(pagePath: string ) {
    this.pagePath = pagePath;
  }

  @action private setActiveItem(item: BreadcrumbItemInterface) {
    console.log('setActiveItem into', item.getLink().data, item.getTitle().nodePath);
    this.activeItem = item;
  }

  @action setItem(item: BreadcrumbItemInterface) {
    if (
      item.isSubpathOf(this.pagePath) 
      && (!this.activeItem || this.activeItem.isSubpathOf(item))
    ) {
      this.setActiveItem(item);
    }
    this.items.set(item.getUUID(), item);
    return item;
  }

  deleteItem(item: BreadcrumbItemInterface | string) {
    const uuid = typeof item === 'string' ? item : item.getUUID();
    return this.items.delete(uuid);
  }

  getPagePath() {
    return this.pagePath;
  }

  @computed get breadcrumbTrail() {
    if (this.activeItem === undefined) return [];
    return [
      this.activeItem,
      ...this.activeItem.getAncestors(),
    ].reverse();
  }

  export() {
    return Array.from(this.items.values());
  }

  hasLastItem() {
    return this.activeItem !== undefined && this.activeItem.hasPath(this.pagePath);
  }
}

// ToDo: probably we should not have undefined
const BreadcrumbStoreContext = React.createContext<BreadcrumbStoreInterface | undefined>(undefined);
 
export const BreadcrumbStoreProvider: ComponentType<any> = ({ children, store }: any) => {
  return (
    <BreadcrumbStoreContext.Provider value={store}>{children}</BreadcrumbStoreContext.Provider>
  );
};
 
export const useBreadcrumbStore = () => React.useContext(BreadcrumbStoreContext);

// ToDo: refactor this since we know pagePath only in runtime
export const withBreadcrumbStore = (pagePath: string) => (Component: ComponentType) => (props: any) => {
  const store = new BreadcrumbStore(pagePath);
  return <Component {...props} store={store} />;
};