import React, {
  createContext, useContext, ComponentType, useEffect,
} from 'react';
import { observable, action } from 'mobx';
import {
  useNode, WithNodeKeyProps, withNode, withNodeKey,
} from '@bodiless/core';
import { flow } from 'lodash';
import useCurrentPage from './useCurrentPage';

const DEFAULT_URL_BASE = 'http://host';

type LinkData = {
  href: string,
};

type BreadcrumbContextInterface = {
  readonly url: URL;
  readonly parent?: BreadcrumbContextInterface;
  isSubpathOf: (parent?: BreadcrumbContextInterface) => boolean;
  isAncestorOf: (descendant?: BreadcrumbContextInterface) => boolean;
  spawn: (href: string) => BreadcrumbContextInterface;
  readonly isActive: boolean;
  activate: () => void;
};

type BreadcrumbStoreInterface = {
  setActiveItem: (item: BreadcrumbContextInterface) => void;
  isActive: (item: BreadcrumbContextInterface) => boolean;
};

class BreadcrumbStore implements BreadcrumbStoreInterface {
  @observable activeItem: BreadcrumbContextInterface | undefined = undefined;

  @action setActiveItem(item: BreadcrumbContextInterface) {
    if (this.activeItem && item.isAncestorOf(this.activeItem)) {
      return;
    }
    this.activeItem = item;
  }

  isActive(item: BreadcrumbContextInterface) {
    return item.isAncestorOf(this.activeItem);
  }
}

const defaultStore = new BreadcrumbStore();

export class BreadcrumbContext implements BreadcrumbContextInterface {
  protected store: BreadcrumbStoreInterface = defaultStore;

  readonly url: URL;

  readonly parent: BreadcrumbContextInterface|undefined;

  constructor(href: string = '/', parent?: BreadcrumbContextInterface) {
    const base = window === undefined
      ? DEFAULT_URL_BASE
      : `${window.location.protocol}//${window.location.host}`;
    this.url = new URL(href, base);
    this.parent = parent;
  }

  isSubpathOf(parent?: BreadcrumbContextInterface) {
    if (!parent || parent.url.host !== this.url.host) return false;
    return new RegExp(`^${parent.url.pathname}`).test(this.url.pathname);
  }

  isAncestorOf(descendant?: BreadcrumbContextInterface) {
    if (!descendant || descendant.url.host !== this.url.host) return false;
    for (let current: BreadcrumbContextInterface|undefined = descendant;
      current;
      current = current.parent
    ) {
      if (current === this) return true;
    }
    return false;
  }

  spawn(path: string): BreadcrumbContextInterface {
    return new BreadcrumbContext(path, this);
  }

  get isActive(): boolean {
    return this.store.isActive(this);
  }

  activate() {
    this.store.setActiveItem(this);
  }
}

const breadcrumbContext = createContext<BreadcrumbContextInterface>(new BreadcrumbContext());

export const useBreadcrumbContext = () => useContext(breadcrumbContext);
export const BreadcrumbContextProvider = breadcrumbContext.Provider;

const withBreadcrumbContext$ = <P extends object>(Component: ComponentType<P>) => {
  const WithBreadcrumbContext = (props: P) => {
    const { node } = useNode<LinkData>();
    const current = useBreadcrumbContext();
    // @TODO: What should we do if link has no href?
    const next = current.spawn(node.data.href || '/');
    const slug = useCurrentPage();
    const page = new BreadcrumbContext(slug);
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
