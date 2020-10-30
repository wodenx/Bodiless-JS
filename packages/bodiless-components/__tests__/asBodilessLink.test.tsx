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
import { asBodilessLink } from '../src/Link';
import { HrefNormalizer } from '../src/Link/NormalHref';

// class MockContentNode implements ContentNode<any> {
//   data = {};
//   setData = jest.fn();
//   delete = jest.fn();
//   keys = [];
//   path = [];
//   pagePath = '';
//   baseResourcePath = '';
//   child = jest.fn();
//   peer = jest.fn();
//   hasError = jest.fn();
// };

const mockCreateNormalHref = jest.fn((href: string) => ({
  toString: () => `mock://${href}`,
}));
jest.mock('../src/Link/NormalHref', () => (
  jest.fn().mockImplementation((href: string) => mockCreateNormalHref(href))
));

describe('asBodilessLink', () => {
  describe('link normalization', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('invokes the default normalizer on render', () => {
      const A = asBodilessLink()('a');
      const wrapper = mount(<A href="foo" id="test" />);
      console.log(wrapper.debug());
      expect(mockCreateNormalHref).toBeCalledWith('foo');
      expect(wrapper.find('a#test').prop('href')).toBe('mock://foo');
    });

    // it('invokes the default normalizer on save', () => {
    //   const node = new MockContentNode();
    //   const A = asBodilessLink()('a');
    //   const wrapper = mount(<NodeProvider node={node}><A /></NodeProvider>);
    //   console.log(wrapper.debug());
    //   // const nodes = wrapper.findWhere(n => n.prop('setComponentData') !== undefined);
    //   // nodes.at(0).prop('setComponentData')({ href: 'foo' });
    //   // expect(node.setData).toBeCalledWith({ href: 'mock://foo' });
    // });

    it('invokes a custom normalizer on render', () => {
      const normalizeHref: HrefNormalizer = jest.fn((href?: string) => `custommock://${href}`);
      const A = asBodilessLink(undefined, undefined, () => ({ normalizeHref }))('a');
      const wrapper = mount(<A href="foo" id="test" />);
      expect(mockCreateNormalHref).not.toBeCalled();
      expect(normalizeHref).toBeCalledWith('foo');
      expect(wrapper.find('a#test').prop('href')).toBe('custommock://foo');
    });
  });
});
