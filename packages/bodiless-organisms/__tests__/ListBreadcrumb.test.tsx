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
import { mount } from 'enzyme';
import { withDefaultContent } from '@bodiless/core';
import {
  asBodilessList,
  asBodilessLink,
  asSubList,
  withSimpleSubListDesign,
  ifActiveBreadcrumb,
} from '@bodiless/components';
import {
  withDesign,
  replaceWith,
  asComponent,
  addProps,
} from '@bodiless/fclasses';
import { flowRight, identity } from 'lodash';
// ToDo: remove this
import { html_beautify } from 'js-beautify';

import asBreadcrumbsClean, {
  withBreadcrumbSeparator,
  withBreadcrumbDesign,
} from '../src/components/ListBreadcrumb';

const { DefaultContentNode } = require('@bodiless/core');

const withSubList = (depth: number) => withSimpleSubListDesign(depth)(
  // @ts-ignore ToDo: resolve types
  flowRight(
    withDesign({
      Title: replaceWith(
        asBodilessLink('link')('a')
      ),
    }),
    asSubList,
  ),
);

const setPagePath = (pagePath: string) => {
  Object.defineProperty(DefaultContentNode.prototype, 'pagePath', {
    value: pagePath,
    writable: false
  });
};

const createBreadcrumbComponent = ({
  // ToDo: we can determine depth automatically based on content
  depth = 1,
  content = {},
}) => flowRight(
  asBreadcrumbsClean({ depth }),
  withDefaultContent(content),
  depth > 1 ? withSubList(depth - 1) : identity,
  withDesign({
    Title: replaceWith(
      asBodilessLink('link')('a')
    ),
  }),
  asBodilessList('testList')
)('ul');

describe('asBreadcrumbsClean', () => {
  it('creates breadcrumbs for basic 1-level list', () => {
    setPagePath('/products');
    const Breadcrumb = createBreadcrumbComponent({
      depth: 1,
      content: {
        testList: {
          "items": [
            "home",
            "products",
            "articles",
          ],
        },
        testList$home$link: {
          'href': '/'
        },
        testList$products$link: {
          'href': '/products'
        },
        testList$articles$link: {
          'href': '/articles'
        },
      }      
    });
    const wrapper = mount(<Breadcrumb />);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it ('creates breadcrumbs for basic 2-level list', () => {
    setPagePath('/products/productA');
    const Breadcrumb = createBreadcrumbComponent({
      depth: 2,
      content: {
        testList: {
          "items": [
            "home",
            "products",
            "articles",
          ],
        },
        testList$home$link: {
          'href': '/'
        },
        testList$products$link: {
          'href': '/products'
        },
        testList$products$sublist: {
          "items": [
            "productA",
            "productB",
          ],
        },
        testList$products$sublist$productA$link: {
          'href': '/products/productA'
        },
        testList$products$sublist$productB$link: {
          'href': '/products/productB'
        },
        testList$articles$link: {
          'href': '/articles'
        },
        testList$articles$sublist: {
          "items": [
            "articleA",
          ],
        },
        testList$articles$sublist$articleA$link: {
          'href': '/articles/articleA'
        },
      }
    });
    const wrapper = mount(<Breadcrumb />);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it ('creates breadcrumbs for basic 3-level list', () => {
    setPagePath('/articles/news/newsA');
    const Breadcrumb = createBreadcrumbComponent({
      depth: 3,
      content: {
        testList: {
          "items": [
            "home",
            "articles",
          ],
        },
        testList$home$link: {
          'href': '/'
        },
        testList$articles$link: {
          'href': '/articles'
        },
        testList$articles$sublist: {
          "items": [
            "news",
          ],
        },
        testList$articles$sublist$news$link: {
          'href': '/articles/news'
        },
        testList$articles$sublist$news$sublist: {
          "items": [
            "newsA",
          ],
        },
        testList$articles$sublist$news$sublist$newsA$link: {
          'href': '/articles/news/newsA'
        },
      }
    });
    const wrapper = mount(<Breadcrumb />);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('creates breadcrumbs when child is active and parent is not subpath of child', () => {
    setPagePath('/productA');
    const Breadcrumb = createBreadcrumbComponent({
      depth: 2,
      content: {
        testList: {
          "items": [
            "home",
            "products",
          ],
        },
        testList$home$link: {
          'href': '/'
        },
        testList$products$link: {
          'href': '/products'
        },
        testList$products$sublist: {
          "items": [
            "productA",
          ],
        },
        testList$products$sublist$productA$link: {
          'href': '/productA'
        },
      }
    });
    const wrapper = mount(<Breadcrumb />);
    console.log(html_beautify(wrapper.html()));
    expect(wrapper.html()).toMatchSnapshot();
  });
});

describe('withBreadcrumbSeparator', () => {
  it('can add a separator to breadcrumbs', () => {
    setPagePath('/products/productA');
    const Breadcrumb = createBreadcrumbComponent({
      depth: 2,
      content: {
        testList: {
          "items": [
            "home",
            "products",
            "articles",
          ],
        },
        testList$home$link: {
          'href': '/'
        },
        testList$products$link: {
          'href': '/products'
        },
        testList$products$sublist: {
          "items": [
            "productA",
            "productB",
          ],
        },
        testList$products$sublist$productA$link: {
          'href': '/products/productA'
        },
        testList$products$sublist$productB$link: {
          'href': '/products/productB'
        },
        testList$articles$link: {
          'href': '/articles'
        },
        testList$articles$sublist: {
          "items": [
            "articleA",
          ],
        },
        testList$articles$sublist$articleA$link: {
          'href': '/articles/articleA'
        },
      }
    });
    // @ts-ignore
    const BreadcrumbWithSeparator = withDesign({
      Item: flowRight(
        withDesign({
          Separator: replaceWith(() => <div id="parentSeparator" />),
        }),
      ),
    })(Breadcrumb);
    const wrapper = mount(<BreadcrumbWithSeparator />);
    console.log(html_beautify(wrapper.html()));
    expect(wrapper.html()).toMatchSnapshot();
  });
});

describe('withBreadcrumbDesign', () => {
  it('allows designing breadcrumb components', () => {
    setPagePath('/products/productA');
    const Breadcrumb = createBreadcrumbComponent({
      depth: 2,
      content: {
        testList: {
          "items": [
            "home",
            "products",
            "articles",
          ],
        },
        testList$home$link: {
          'href': '/'
        },
        testList$products$link: {
          'href': '/products'
        },
        testList$products$sublist: {
          "items": [
            "productA",
            "productB",
          ],
        },
        testList$products$sublist$productA$link: {
          'href': '/products/productA'
        },
        testList$products$sublist$productB$link: {
          'href': '/products/productB'
        },
        testList$articles$link: {
          'href': '/articles'
        },
        testList$articles$sublist: {
          "items": [
            "articleA",
          ],
        },
        testList$articles$sublist$articleA$link: {
          'href': '/articles/articleA'
        },
      }
    });
    const DesignedBreadcrumb = flowRight(
      withBreadcrumbDesign({
        Title: addProps({ className: 'breadcrumb-title'}),
        Item: addProps({ className: 'breadcrumb-item'}),
      }),
    )(Breadcrumb);
    const wrapper = mount(<DesignedBreadcrumb />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});