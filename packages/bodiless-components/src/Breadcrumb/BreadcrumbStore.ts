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

/* eslint-disable no-underscore-dangle */

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
  parent?: BreadcrumbItemType;
  title: BreadcrumbItemTitle;
  link: BreadcrumbItemLink;
  store: BreadcrumbStoreType;
};
export type BreadcrumbItemType = {
  setTitle: (title: BreadcrumbItemTitle) => void,
  setLink: (link: BreadcrumbItemLink) => void,
  uuid: string,
  title: BreadcrumbItemTitle;
  link: BreadcrumbItemLink;
  isSubpathOf: (item: BreadcrumbItemType | string) => boolean;
  hasPath: (item: BreadcrumbItemType | string) => boolean;
  isAncestorOf: (item: BreadcrumbItemType) => boolean;
  isDescendantOf: (item: BreadcrumbItemType) => boolean;
  getAncestors: () => BreadcrumbItemType[];
  parent: BreadcrumbItemType | undefined;
};

const DEFAULT_URL_BASE = 'http://host';

const withoutTrailingSlash = (str: string) => str.replace(/\/$/, '');

const isChildOf = (child: string, parent: string) => {
  if (child === parent) return false;
  const childTokens = child.split('/').filter(i => i.length);
  const parentTokens = parent.split('/').filter(i => i.length);
  return parentTokens.every((t, i) => childTokens[i] === t);
};

export class BreadcrumbItem implements BreadcrumbItemType {
  _uuid: string;

  _parent?: BreadcrumbItemType;

  _title: BreadcrumbItemTitle;

  _link: BreadcrumbItemLink;

  _store: BreadcrumbStoreType;

  constructor({
    uuid,
    title,
    link,
    store,
    parent,
  }: BreadcrumbItemSettings) {
    this._uuid = uuid;
    this._parent = parent;
    this._title = title;
    this._link = link;
    this._store = store;
  }

  isSubpathOf(item: BreadcrumbItemType | string) {
    const base = typeof window === 'undefined'
      ? DEFAULT_URL_BASE
      : `${window.location.protocol}//${window.location.host}`;
    const itemURL = typeof item === 'string' ? new URL(item, base) : new URL(item.link.data, base);
    const thisURL = new URL(this.link.data, base);
    if (itemURL.host !== thisURL.host) return false;
    return isChildOf(itemURL.pathname, thisURL.pathname);
  }

  hasPath(item: BreadcrumbItemType | string) {
    const base = typeof window === 'undefined'
      ? DEFAULT_URL_BASE
      : `${window.location.protocol}//${window.location.host}`;
    const itemURL = typeof item === 'string' ? new URL(item, base) : new URL(item.link.data, base);
    const thisURL = new URL(this.link.data, base);
    if (itemURL.host !== thisURL.host) return false;
    return withoutTrailingSlash(thisURL.pathname) === withoutTrailingSlash(itemURL.pathname);
  }

  isDescendantOf(item: BreadcrumbItemType) {
    for (let current: BreadcrumbItemType | undefined = this._parent;
      current;
      current = this._parent
    ) if (current === item) return true;
    return false;
  }

  isAncestorOf(item: BreadcrumbItemType) {
    const isDescendant = item.isDescendantOf(this);
    return isDescendant;
  }

  getAncestors() {
    const ancestors = [];
    for (let current = this._parent;
      current;
      current = current.parent
    ) {
      ancestors.push(current);
    }
    return ancestors;
  }

  get uuid() {
    return this._uuid;
  }

  get title() {
    return this._title;
  }

  get link() {
    return this._link;
  }

  get parent() {
    return this._parent;
  }

  setTitle(title: BreadcrumbItemTitle) {
    this._title = title;
  }

  setLink(link: BreadcrumbItemLink) {
    this._link = link;
  }
}

export type BreadcrumbStoreType = {
  setItem: (item: BreadcrumbItemType) => BreadcrumbItemType | undefined;
  deleteItem: (item: BreadcrumbItemType) => boolean;
  getPagePath: () => string;
  breadcrumbTrail: BreadcrumbItemType[];
  export: () => BreadcrumbItemType[];
  hasLastItem: () => boolean;
};

export class BreadcrumbStore implements BreadcrumbStoreType {
  // eslint-disable-next-line max-len
  @observable private items: Map<string, BreadcrumbItemType> = new Map<string, BreadcrumbItemType>();

  @observable private activeItem?: BreadcrumbItemType = undefined;

  private pagePath: string;

  constructor(pagePath: string) {
    this.pagePath = pagePath;
  }

  @action private setActiveItem(item: BreadcrumbItemType) {
    this.activeItem = item;
  }

  @action setItem(item: BreadcrumbItemType) {
    if (
      (item.hasPath(this.pagePath) || item.isSubpathOf(this.pagePath))
      && (!this.activeItem || this.activeItem.isSubpathOf(item))
    ) {
      this.setActiveItem(item);
    }
    this.items.set(item.uuid, item);
    return item;
  }

  deleteItem(item: BreadcrumbItemType | string) {
    const uuid = typeof item === 'string' ? item : item.uuid;
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
