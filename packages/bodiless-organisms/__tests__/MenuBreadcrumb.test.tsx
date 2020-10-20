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
import { asBodilessLink, } from '@bodiless/components';
import {
  withDesign,
  replaceWith,
  addProps,
  addClasses,
} from '@bodiless/fclasses';
import { flowRight, identity } from 'lodash';
// ToDo: remove this
import { html_beautify } from 'js-beautify';

import {
  asMenuBase,
  asBreadcrumbsClean,
  withMenuDesign,
} from '../src/components/Menu/SimpleMenu';

const { DefaultContentNode } = require('@bodiless/core');

const setPagePath = (pagePath: string) => {
  Object.defineProperty(DefaultContentNode.prototype, 'pagePath', {
    value: pagePath,
    writable: false
  });
};

const createBreadcrumbComponent = ({
  content = {},
}) => flowRight(
  withDesign({
    Item: addClasses('testItemClass'),
  }),
  withMenuDesign({
    Title: replaceWith(
      asBodilessLink('link')('a')
    ),
  }),
  asBreadcrumbsClean({
    linkNodeKey: 'title$link',
    titleNodeKey: 'title$text',
  }),
  withDefaultContent(content),
  asMenuBase('testMenu'),
)('ul');


describe('asBreadcrumbsClean', () => {
  it('creates breadcrumbs for basic 1-level menu', () => {
    setPagePath('/products');
    const Breadcrumb = createBreadcrumbComponent({
      content: {
        testMenu: {
          "items": [
            "home",
            "products",
            "articles",
          ],
        },
        testMenu$home$link: {
          'href': '/'
        },
        testMenu$products$link: {
          'href': '/products'
        },
        testMenu$articles$link: {
          'href': '/articles'
        },
      }      
    });
    const wrapper = mount(<Breadcrumb />);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it ('creates breadcrumbs for basic 2-level menu', () => {
    setPagePath('/products/productA');
    const Breadcrumb = createBreadcrumbComponent({
      content: {
        testMenu: {
          "items": [
            "home",
            "products",
            "articles",
          ],
        },
        testMenu$home$link: {
          'href': '/'
        },
        testMenu$products$link: {
          'href': '/products'
        },
        testMenu$products$sublist: {
          "items": [
            "productA",
            "productB",
          ],
        },
        "testMenu$products$cham-sublist": {
          "component": "SubMenu"
        },
        testMenu$products$sublist$productA$link: {
          'href': '/products/productA'
        },
        testMenu$products$sublist$productB$link: {
          'href': '/products/productB'
        },
        testMenu$articles$link: {
          'href': '/articles'
        },
        testMenu$articles$sublist: {
          "items": [
            "articleA",
          ],
        },
        testMenu$articles$sublist$articleA$link: {
          'href': '/articles/articleA'
        },
      }
    });
    const wrapper = mount(<Breadcrumb />);
    console.log(html_beautify(wrapper.html()));
    expect(wrapper.html()).toMatchSnapshot();
  });
});
