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
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'enzyme';
import { withDefaultContent, withSidecarNodes } from '@bodiless/core';
import { asBodilessLink } from '@bodiless/components';
import { replaceWith, withDesign, withOnlyProps } from '@bodiless/fclasses';
import { flowRight } from 'lodash';

import { asBreadcrumbsClean, asMenuBase } from '../src/components/Menu/MegaMenu';

const { DefaultContentNode } = require('@bodiless/core');

const setPagePath = (pagePath: string) => {
  Object.defineProperty(DefaultContentNode.prototype, 'pagePath', {
    value: pagePath,
    writable: false,
  });
};

const createBreadcrumbComponent = ({
  content = {},
}) => flowRight(
  withDefaultContent(content),
  withDesign({
    // @ts-ignore
    BreadcrumbLink: replaceWith(withSidecarNodes(
      asBodilessLink(),
    ))('a'),
    BreadcrumbTitle: replaceWith(withOnlyProps('key', 'children')(React.Fragment)),
  }),
  asBreadcrumbsClean({
    linkNodeKey: 'title$link',
    titleNodeKey: 'title$text',
  }),
  asMenuBase('testMenu'),
)('ul');

describe('asBreadcrumbsClean', () => {
  it('creates breadcrumbs for 2-level Touts MegaMenu', () => {
    setPagePath('/products/productA');
    const Breadcrumb = createBreadcrumbComponent({
      content: {
        testMenu: {
          items: [
            'home',
            'products',
          ],
        },
        testMenu$home$title$link: {
          href: '/',
        },
        testMenu$products$title$link: {
          href: '/products',
        },
        testMenu$products$sublist: {
          items: [
            'productA',
            'productB',
          ],
        },
        'testMenu$products$cham-sublist': {
          component: 'Touts',
        },
        testMenu$products$sublist$productA$title$link: {
          href: '/products/productA',
        },
        testMenu$products$sublist$productB$title$link: {
          href: '/products/productB',
        },
      },
    });
    const wrapper = mount(<Breadcrumb />);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('creates breadcrumbs for 2-level List MegaMenu', () => {
    setPagePath('/products/productA');
    const Breadcrumb = createBreadcrumbComponent({
      content: {
        testMenu: {
          items: [
            'home',
            'products',
          ],
        },
        testMenu$home$title$link: {
          href: '/',
        },
        testMenu$products$title$link: {
          href: '/products',
        },
        testMenu$products$sublist: {
          items: [
            'productA',
            'productB',
          ],
        },
        'testMenu$products$cham-sublist': {
          component: 'List',
        },
        testMenu$products$sublist$productA$title$link: {
          href: '/products/productA',
        },
        testMenu$products$sublist$productB$title$link: {
          href: '/products/productB',
        },
      },
    });
    const wrapper = mount(<Breadcrumb />);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('creates breadcrumbs for 2-level Columns MegaMenu', () => {
    setPagePath('/products/productA');
    const Breadcrumb = createBreadcrumbComponent({
      content: {
        testMenu: {
          items: [
            'home',
            'products',
          ],
        },
        testMenu$home$title$link: {
          href: '/',
        },
        testMenu$products$title$link: {
          href: '/products',
        },
        testMenu$products$sublist: {
          items: [
            'productA',
            'productB',
          ],
        },
        'testMenu$products$cham-sublist': {
          component: 'Columns',
        },
        testMenu$products$sublist$productA$title$link: {
          href: '/products/productA',
        },
        testMenu$products$sublist$productB$title$link: {
          href: '/products/productB',
        },
      },
    });
    const wrapper = mount(<Breadcrumb />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
