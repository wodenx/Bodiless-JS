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

import React, { ComponentType} from 'react';
import { mount } from 'enzyme';
import {
  withDefaultContent,
  DefaultContentNode,
  NodeProvider,
  useNode,
} from '@bodiless/core';
import {
  asBodilessList,
  asBodilessLink,
  asSubList,
  withSimpleSubListDesign,
} from '@bodiless/components';
import { withDesign, replaceWith, A } from '@bodiless/fclasses';
import { flowRight } from 'lodash';
import { html_beautify } from 'js-beautify';

import { asBreadcrumbsClean } from '../src/components/Menu/SimpleMenu';

const withSubList = withDesign({
  Item: flowRight(
    withDesign({
      Title: replaceWith(
        asBodilessLink('link')(A)
      ),
    }),
    asSubList,
  ),
});

class MockedContentNode extends DefaultContentNode<object> {
  
  _pagePath: string = '/';

  static createNode(baseNode: DefaultContentNode<object>, pagePath: string) {
    const mockedNode = new DefaultContentNode(
      baseNode.getActions(),
      baseNode.getGetters(),
      baseNode.path,
    ) as MockedContentNode;
    mockedNode.setPagePath(pagePath);
    return mockedNode;
  }

  public setPagePath(pagePath: string) {
    this._pagePath = pagePath
  }

  get pagePath() {
    return this.pagePath;
  }

}

const withPagePath = (pagePath: string) => (Component: ComponentType<any>) => {
  const MockNodeProvider: ComponentType<any> = props => {
    const { node } = useNode();
    const mockedNode = MockedContentNode.createNode((node as DefaultContentNode<object>), pagePath);
    return (
      <NodeProvider node={mockedNode}>
        <Component {...props} />
      </NodeProvider>
    );
  };
  return MockNodeProvider;
};

const TestList = flowRight(
  withPagePath('/products/productA'),
  withDefaultContent({
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
        "productB",
      ],
    },
    testList$products$sublist$productA$link: {
      'href': '/products/productA'
    },
    testList$products$sublist$productB$link: {
      'href': '/products/productB'
    },
  }),
  withDesign({
    Title: replaceWith(
      asBodilessLink('link')(A)
    ),
  }),
  withSubList,
  asBodilessList('testList')
)('ul');

const TestBreadCrumb = asBreadcrumbsClean(TestList);

describe('asBreadcrumbsClean', () => {
  it('executes', () => {
    const wrapper = mount(<TestBreadCrumb />);
    console.log(wrapper.debug());
    console.log(html_beautify(wrapper.html()));
    expect(1).toBe(1);
  });
});