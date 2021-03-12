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
import { flowRight } from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount, ReactWrapper } from 'enzyme';
// eslint-disable-next-line import/no-extraneous-dependencies
import cheerio from 'cheerio';
import { withDefaultContent, withSidecarNodes } from '@bodiless/core';
import { asBodilessLink, asEditable } from '@bodiless/components';
import { replaceWith, withDesign } from '@bodiless/fclasses';
import {
  asBodilessMenu, withListSubMenu, withColumnSubMenu, withToutSubMenu,
  withBreadcrumbStore, asBreadcrumbs, BreadcrumbsClean,
} from '../src';

const { DefaultContentNode } = require('@bodiless/core');

const Breadcrumbs = asBreadcrumbs(BreadcrumbsClean);

const setPagePath = (pagePath: string) => {
  Object.defineProperty(DefaultContentNode.prototype, 'pagePath', {
    value: pagePath,
    writable: false,
  });
};
const createBreadcrumbComponent = ({
  content = {},
}) => {
  const Source = flowRight(
    withListSubMenu(),
    withColumnSubMenu(),
    withToutSubMenu(),
    asBodilessMenu('testMenu'),
  )('ul');

  const BreadcrumbComponent = (props: any) => (
    <>
      <Source />
      <Breadcrumbs {...props} />
    </>
  );

  return flowRight(
    withDefaultContent(content),
    withDesign({
      BreadcrumbLink: replaceWith(
        withSidecarNodes(asBodilessLink())('a'),
      ),
      BreadcrumbTitle: replaceWith<any>(
        asEditable()(React.Fragment),
      ),
    }),
    withBreadcrumbStore,
  )(BreadcrumbComponent);
};

// Helper to get the html of only the breadcrumbs.
const breadcrumbHtml = (wrapper: ReactWrapper) => {
  // We use cheerio directly here bc using enzyme's 'render'
  // method generates warnings about not using layout
  // effects on the server.
  const $ = cheerio.load(wrapper.html());
  return $.html($('body>ul').last());
};

const generateMegaMenuContent = (component: string) => ({
  testMenu: {
    items: [
      'home',
      'products',
    ],
  },
  testMenu$home$title$link: {
    href: '/',
  },
  testMenu$home$title$text: {
    text: 'home',
  },
  testMenu$products$title$link: {
    href: '/products',
  },
  testMenu$products$title$text: {
    text: 'products',
  },
  testMenu$products$sublist: {
    items: [
      'productA',
      'productB',
    ],
  },
  'testMenu$products$cham-sublist': {
    component,
  },
  testMenu$products$sublist$productA$title$link: {
    href: '/products/productA',
  },
  testMenu$products$sublist$productA$title$text: {
    text: 'ProductA',
  },
  testMenu$products$sublist$productB$title$link: {
    href: '/products/productB',
  },
  testMenu$products$sublist$productB$title$text: {
    text: 'ProductB',
  },
});

describe('asBreadcrumbsClean', () => {
  it('creates breadcrumbs for 2-level Touts MegaMenu', () => {
    setPagePath('/products/productA');
    const Breadcrumb = createBreadcrumbComponent({
      content: generateMegaMenuContent('Touts'),
    });
    const wrapper = mount(<Breadcrumb />);
    expect(breadcrumbHtml(wrapper)).toMatchSnapshot();
  });
  it('creates breadcrumbs for 2-level List MegaMenu', () => {
    setPagePath('/products/productA');
    const Breadcrumb = createBreadcrumbComponent({
      content: generateMegaMenuContent('List'),
    });
    const wrapper = mount(<Breadcrumb />);
    expect(breadcrumbHtml(wrapper)).toMatchSnapshot();
  });
  it('creates breadcrumbs for 2-level Columns MegaMenu', () => {
    setPagePath('/products/productA');
    const Breadcrumb = createBreadcrumbComponent({
      content: generateMegaMenuContent('Columns'),
    });
    const wrapper = mount(<Breadcrumb />);
    expect(breadcrumbHtml(wrapper)).toMatchSnapshot();
  });
  it('creates breadcrumbs for 3-level Columns MegaMenu', () => {
    setPagePath('/products/productA/subProduct');
    const Breadcrumb = createBreadcrumbComponent({
      content: {
        ...generateMegaMenuContent('Columns'),
        testMenu$products$sublist$productA$sublist: {
          items: [
            'subProduct',
          ],
        },
        testMenu$products$sublist$productA$sublist$subProduct$title$link: {
          href: '/products/productA/subProduct',
        },
        testMenu$products$sublist$productA$sublist$subProduct$title$text: {
          text: 'SubProduct',
        },
      },
    });
    const wrapper = mount(<Breadcrumb />);
    expect(breadcrumbHtml(wrapper)).toMatchSnapshot();
  });
});
