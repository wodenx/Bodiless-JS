import React, { createContext, useContext, ComponentType, useEffect } from 'react';
import { observable, action } from 'mobx';
import { useGatsbyPageContext } from '@bodiless/gatsby-theme-bodiless';
import {
  useNode, WithNodeKeyProps, withNode, withNodeKey,
} from '@bodiless/core';
import { flow } from 'lodash';

const DEFAULT_URL_BASE = 'http://host';

type LinkData = {
  href: string,
};

type MenuPathInterface = {
  readonly url: URL;
  readonly parent?: MenuPathInterface;
  isSubpathOf: (parent: MenuPathInterface) => boolean;
  isAncestorOf: (descendant: MenuPathInterface) => boolean;
  spawn: (href: string) => MenuPathInterface;
  readonly isActive: boolean;
  activate: () => void;
};

type BreadcrumbStoreInterface = {
  setActiveItem: (item: MenuPathInterface) => void;
  isActive: (item: MenuPathInterface) => boolean;
};

class BreadcrumbStore implements BreadcrumbStoreInterface {
  @observable activeItem: MenuPathInterface | undefined = undefined;

  @action setActiveItem(item: MenuPathInterface) {
    if (this.activeItem && item.isAncestorOf(this.activeItem)) {
      return;
    }
    this.activeItem = item;
  }

  isActive(item: MenuPathInterface) {
    return this.activeItem && this.activeItem.isAncestorOf(item);
  }
}

const defaultStore = new BreadcrumbStore();

class MenuPath implements MenuPathInterface {
  protected store: BreadcrumbStoreInterface = defaultStore;

  readonly url: URL;

  readonly parent: MenuPathInterface|undefined;

  constructor(href: string = '/', parent?: MenuPathInterface) {
    const base = window === undefined
      ? DEFAULT_URL_BASE
      : `${window.location.protocol}//${window.location.host}`;
    this.url = new URL(href, base);
    this.parent = parent;
  }

  isSubpathOf(parent: MenuPathInterface) {
    if (!parent || parent.url.host !== this.url.host) return false;
    return new RegExp(`^${parent.url.pathname}`).test(this.url.pathname);
  }

  isAncestorOf(descendant: MenuPathInterface) {
    if (!descendant || descendant.url.host !== this.url.host) return false;
    for (let current = descendant; current; current = current.parent) {
      if (current === this) return true;
    }
    return false;
  }

  spawn(path: string) {
    return new MenuPath(path, this);
  }

  get isActive() {
    return this.store.isActive(this);
  }

  activate() {
    this.store.setActiveItem(this);
  }

  static useCurrentPage(parent?: MenuPathInterface) {
    const { slug } = useGatsbyPageContext();
    return new MenuPath(slug, parent);
  }
}

const BreadcrumbContext = createContext<MenuPathInterface>(new MenuPath());

export const useBreadcrumbContext = () => useContext(BreadcrumbContext);
export const BreadcrumbContextProvider = BreadcrumbContext.Provider;

const withBreadcrumbContext$ = <P extends object>(Component: ComponentType<P>) => {
  const WithBreadcrumbContext = (props: P) => {
    const { node } = useNode<LinkData>();
    const current = useBreadcrumbContext();
    // @TODO: What should we do if link has no href?
    const next = current.spawn(node.data.href || '/');
    const { slug } = useGatsbyPageContext();
    const page = new MenuPath(slug);
    useEffect(() => {
      if (page.isSubpathOf(next)) {
        next.activate();
      }
    }, []);
    return (
      <BreadcrumbContextProvider value={next}>
        <Component {...props} />
      </BreadcrumbContextProvider>
    );
  };
  return WithBreadcrumbContext;
};

export const withBreadcrumbContext = (nodeKeys: WithNodeKeyProps) => flow(
  withBreadcrumbContext$,
  withNode,
  withNodeKey(nodeKeys),
);

export const asBreadcrumb = <P extends object>(Component: ComponentType<P>) => {
  const AsBreadcrumb = (props: P) => {
    const { isActive } = useBreadcrumbContext();
    return isActive ? <Component {...props} /> : <></>;
  };
  return AsBreadcrumb;
};
