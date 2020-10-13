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

import React from 'react';
import { v4 } from 'uuid';
import {
  BreadcrumbItem,
  BreadcrumbStore,
  useBreadcrumbStore,
  BreadcrumbStoreProvider,
} from '../src/Breadcrumb/BreadcrumbStore';
import { useContext } from 'react';
import { mount } from 'enzyme';
import { wrap } from 'lodash';

describe('BreadcrumbItem', () => {
  describe('isSubpathOf', () => {
    it('works for internal links', () => {
      const breadcrumbItem = new BreadcrumbItem({
        uuid: v4(),
        title: {
          data: 'Products',
          nodePath: 'title',
        },
        link: {
          data: '/products',
          nodePath: 'link',
        },
        store: new BreadcrumbStore('/'),
      });
      expect(breadcrumbItem.isSubpathOf('/products/productA')).toBeTruthy();
      expect(breadcrumbItem.isSubpathOf('/articles/productA')).toBeFalsy();
    });
  });
});

describe('BreadcrumbStore', () => {
  describe('setItem', () => {
    it('allows updating an existing item in the store', () => {
    const pagePath = '/home';
    const store = new BreadcrumbStore(pagePath);
    const breadcrumbItem = new BreadcrumbItem({
      uuid: v4(),
      title: {
        data: 'title1',
        nodePath: 'title1&path',
      },
      link: {
        data: '/link1',
        nodePath: 'link1$path',
      },
      store,
    });
    const item = store.setItem(breadcrumbItem);
    item.setTitle({
      ...item.getTitle(),
      data: 'title2',
    });
    store.setItem(item);
    const breadcrumb = store.export();
    expect(breadcrumb.length).toBe(1);
    expect(breadcrumb[0]?.getTitle().data).toBe('title2')
    expect(breadcrumb[0]?.getLink().data).toBe('/link1')
    });
  });

  describe('deleteItem', () => {
    it('allows deleting an item from the store', () => {
      const pagePath = '/home';
      const store = new BreadcrumbStore(pagePath);
      const breadcrumbItem = new BreadcrumbItem({
        uuid: 'test',
        title: {
          data: 'title1',
          nodePath: 'title1&path',
        },
        link: {
          data: '/link1',
          nodePath: 'link1$path',
        },
        store,
      });
      const item = store.setItem(breadcrumbItem);
      expect(store.export().length).toBe(1);
      store.deleteItem(item.getUUID());
      expect(store.export().length).toBe(0);
    });  
  });

  describe('breadcrumbTrail', () => {
    it('builds and returns breadcrumb for 1-level list', () => {
      const pagePath = '/products';
      const store = new BreadcrumbStore(pagePath);
      const breadcrumbItems = [
        {
          uuid: v4(),
          title: {
            data: 'home',
            nodePath: 'title',
          },
          link: {
            data: '/',
            nodePath: 'link',
          },
        },
        {
          uuid: v4(),
          title: {
            data: 'Products',
            nodePath: 'title',
          },
          link: {
            data: '/products',
            nodePath: 'link',
          },
        },
      ];
      breadcrumbItems.map(item => store.setItem(new BreadcrumbItem({...item, store})));
      const breadcrumb = store.breadcrumbTrail;
      expect(breadcrumb.length).toBe(1);
      expect(breadcrumb[0]?.getTitle().data).toBe('Products');
      expect(breadcrumb[0]?.getLink().data).toBe('/products');
    });
    it('builds and returns breadcrumb for 2-level list', () => {
      const pagePath = '/products/productA';
      const store = new BreadcrumbStore(pagePath);
      const homeItem = new BreadcrumbItem({
        uuid: v4(),
        title: {
          data: 'home',
          nodePath: 'title',
        },
        link: {
          data: '/',
          nodePath: 'link',
        },
        store,
      });
      const productsItem = new BreadcrumbItem({
        uuid: v4(),
        title: {
          data: 'Products',
          nodePath: 'title',
        },
        link: {
          data: '/products',
          nodePath: 'link',
        },
        store,
      });
      const productAItem = new BreadcrumbItem({
        uuid: v4(),
        title: {
          data: 'ProductA',
          nodePath: 'title',
        },
        link: {
          data: '/products/productA',
          nodePath: 'link',
        },
        parent: productsItem,
        store,
      });
      const articlesItem = new BreadcrumbItem({
        uuid: v4(),
        title: {
          data: 'Articles',
          nodePath: 'title',
        },
        link: {
          data: '/articles',
          nodePath: 'link',
        },
        store,
      });
      store.setItem(homeItem);
      store.setItem(productsItem);
      store.setItem(productAItem);
      store.setItem(articlesItem);
      const breadcrumb = store.breadcrumbTrail;
      expect(breadcrumb.length).toBe(2);
      expect(breadcrumb[0]?.getTitle().data).toBe('Products');
      expect(breadcrumb[0]?.getLink().data).toBe('/products');
      expect(breadcrumb[1]?.getTitle().data).toBe('ProductA');
      expect(breadcrumb[1]?.getLink().data).toBe('/products/productA');
    });
    it('builds and returns breadcrumb for 2-level list with inactive leaves', () => {
      const pagePath = '/products';
      const store = new BreadcrumbStore(pagePath);
      const homeItem = new BreadcrumbItem({
        uuid: v4(),
        title: {
          data: 'home',
          nodePath: 'title',
        },
        link: {
          data: '/',
          nodePath: 'link',
        },
        store,
      });
      const productsItem = new BreadcrumbItem({
        uuid: v4(),
        title: {
          data: 'Products',
          nodePath: 'title',
        },
        link: {
          data: '/products',
          nodePath: 'link',
        },
        store,
      });
      const productAItem = new BreadcrumbItem({
        uuid: v4(),
        title: {
          data: 'ProductA',
          nodePath: 'title',
        },
        link: {
          data: '/products/productA',
          nodePath: 'link',
        },
        parent: productsItem,
        store,
      });
      const articlesItem = new BreadcrumbItem({
        uuid: v4(),
        title: {
          data: 'Articles',
          nodePath: 'title',
        },
        link: {
          data: '/articles',
          nodePath: 'link',
        },
        store,
      });
      store.setItem(homeItem);
      store.setItem(productsItem);
      store.setItem(productAItem);
      store.setItem(articlesItem);
      const breadcrumb = store.breadcrumbTrail;
      expect(breadcrumb.length).toBe(1);
      expect(breadcrumb[0]?.getTitle().data).toBe('Products');
      expect(breadcrumb[0]?.getLink().data).toBe('/products');
    });
  });
});

describe('withBreadcrumbStore', () => {
  it('allows a react component to consume breadcrumb trail', () => {
    const pagePath = '/products/productA';
    const store = new BreadcrumbStore(pagePath);
    const homeItem = new BreadcrumbItem({
      uuid: v4(),
      title: {
        data: 'home',
        nodePath: 'title',
      },
      link: {
        data: '/',
        nodePath: 'link',
      },
      store,
    });
    const productsItem = new BreadcrumbItem({
      uuid: v4(),
      title: {
        data: 'Products',
        nodePath: 'title',
      },
      link: {
        data: '/products',
        nodePath: 'link',
      },
      store,
    });
    const productAItem = new BreadcrumbItem({
      uuid: v4(),
      title: {
        data: 'ProductA',
        nodePath: 'title',
      },
      link: {
        data: '/products/productA',
        nodePath: 'link',
      },
      parent: productsItem,
      store,
    });
    const articlesItem = new BreadcrumbItem({
      uuid: v4(),
      title: {
        data: 'Articles',
        nodePath: 'title',
      },
      link: {
        data: '/articles',
        nodePath: 'link',
      },
      store,
    });
    store.setItem(homeItem);
    store.setItem(productsItem);
    store.setItem(productAItem);
    store.setItem(articlesItem);
    const BreadcrumbTrailComponent = (props: any) => {
      const store$1 = useBreadcrumbStore();
      const breadcrumbTrail = store$1?.breadcrumbTrail || [];
      const items = breadcrumbTrail.map(item => <li key={item.getUUID()}>
        <a href={item.getLink().data}>{item.getTitle().data}</a>
      </li>
      );
      return <ul>{items}</ul>;
    };
    const wrapper = mount(
      <BreadcrumbStoreProvider store={store}>
        <BreadcrumbTrailComponent />
      </BreadcrumbStoreProvider>
    );
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('rerendes react component when breadcrumb trail changes', () => {
    const pagePath = '/products/productA';
    const store = new BreadcrumbStore(pagePath);
    const homeItem = new BreadcrumbItem({
      uuid: v4(),
      title: {
        data: 'home',
        nodePath: 'title',
      },
      link: {
        data: '/',
        nodePath: 'link',
      },
      store,
    });
    const productsItem = new BreadcrumbItem({
      uuid: v4(),
      title: {
        data: 'Products',
        nodePath: 'title',
      },
      link: {
        data: '/products',
        nodePath: 'link',
      },
      store,
    });
    const productAItem = new BreadcrumbItem({
      uuid: v4(),
      title: {
        data: 'ProductA',
        nodePath: 'title',
      },
      link: {
        data: '/products/productA',
        nodePath: 'link',
      },
      parent: productsItem,
      store,
    });
    const articlesItem = new BreadcrumbItem({
      uuid: v4(),
      title: {
        data: 'Articles',
        nodePath: 'title',
      },
      link: {
        data: '/articles',
        nodePath: 'link',
      },
      store,
    });
    store.setItem(homeItem);
    store.setItem(productsItem);
    store.setItem(productAItem);
    store.setItem(articlesItem);
    const BreadcrumbTrailComponent = (props: any) => {
      const store$1 = useBreadcrumbStore();
      const breadcrumbTrail = store$1?.breadcrumbTrail || [];
      const items = breadcrumbTrail.map(item => <li key={item.getUUID()}>
        <a href={item.getLink().data}>{item.getTitle().data}</a>
      </li>
      );
      return <ul>{items}</ul>;
    };
    const wrapper = mount(
      <BreadcrumbStoreProvider store={store}>
        <BreadcrumbTrailComponent />
      </BreadcrumbStoreProvider>
    );
    productsItem.setTitle({
      ...productsItem.getTitle(),
      data: 'ProductsUpdated'
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});