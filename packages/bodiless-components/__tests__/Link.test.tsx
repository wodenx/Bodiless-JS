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
import { mount, ReactWrapper } from 'enzyme';
import { asBodilessLink } from '../src/Link';
import DefaultNormalHref, { HrefNormalizer } from '../src/Link/NormalHref';
import { ContentNode, NodeProvider } from '@bodiless/core';

export { DefaultNormalHref };

class MockContentNode implements ContentNode<any> {
  data = {};
  setData = jest.fn();
  delete = jest.fn();
  keys = [];
  path = [];
  pagePath = '';
  baseResourcePath = '';
  child = jest.fn();
  peer = jest.fn();
  hasError = jest.fn();
};


const mockCreateNormalHref = jest.fn((href: string) => ({
  toString: () => `mock://${href}`,
}));
jest.mock('../src/Link/NormalHref', () => (
  jest.fn().mockImplementation((href: string) => {
    return mockCreateNormalHref(href);
  })
));

const setEditMode = (isEdit: boolean) => {
  // @TODO bodiless-core internals should not be touched
  // bodiless-core should be refactored to allow injecting of default edit mode
  window.sessionStorage.isEdit = isEdit;
};
setEditMode(true);

let wrapper: ReactWrapper;
let menuButton: ReactWrapper;
let menuForm: ReactWrapper;
let menuPopup: ReactWrapper;

const firstLinkProps = { nodeKey: 'oneLink' };
const secondLinkProps = { nodeKey: 'anotherLink' };

describe('asBodilessLink', () => {
  describe('link normalization', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('invokes the default normalizer on render', () => {
      const A = asBodilessLink()('a');
      wrapper = mount(<A href="foo" id="test" />);
      console.log(wrapper.debug());
      expect(mockCreateNormalHref).toBeCalledWith('foo');
      expect(wrapper.find('a#test').prop('href')).toBe('mock://foo');
    });

    it('invokes the default normalizer on save', () => {
      const node = new MockContentNode();
      const A = asBodilessLink()('a');
      wrapper = mount(<NodeProvider node={node}><A /></NodeProvider>);
      console.log(wrapper.debug());
      // const nodes = wrapper.findWhere(n => n.prop('setComponentData') !== undefined);
      // nodes.at(0).prop('setComponentData')({ href: 'foo' });
      // expect(node.setData).toBeCalledWith({ href: 'mock://foo' });
    });

    it('invokes a custom normalizer on render', () => {
      const normalizeHref: HrefNormalizer = jest.fn((href?: string) => `custommock://${href}`);
      const A = asBodilessLink(undefined, undefined, () => ({ normalizeHref }))('a');
      wrapper = mount(<A href="foo" id="test" />);
      expect(mockCreateNormalHref).not.toBeCalled();
      expect(normalizeHref).toBeCalledWith('foo');
      expect(wrapper.find('a#test').prop('href')).toBe('custommock://foo');
    });
  });
});

describe.only('link interactions', () => {
  const Link = asBodilessLink()('a');
  it('should render a link menu item when clicked', () => {
    wrapper = mount(
      <div>
        <Link {...firstLinkProps}>This is a link</Link>
        <Link {...secondLinkProps}>This is another link</Link>
      </div>,
    );
    const firstLink = wrapper.find({ ...firstLinkProps }).at(0);
    expect(firstLink).toHaveLength(1);

    firstLink.find('a').simulate('click');
    menuButton = wrapper.find('i');
    expect(menuButton.text()).toBe('link');
  });

  it('link button should toggle context menu visibility when clicked', () => {
    menuButton.simulate('click');
    let tooltips = wrapper.find('Tooltip');

    menuPopup = tooltips.at(1);
    expect(menuPopup.prop('visible')).toBeTruthy();

    menuButton.simulate('click');

    tooltips = wrapper.find('Tooltip');

    menuPopup = tooltips.at(1);
    expect(menuPopup.prop('visible')).toBeFalsy();
  });

  it('context form should have link-href input field with cancel and done buttons', () => {
    menuButton.simulate('click');
    const tooltips = wrapper.find('Tooltip');
    menuPopup = tooltips.at(1);
    menuForm = menuPopup.find('form');

    const inputField = menuForm.find('input#link-href');
    expect(inputField).toHaveLength(1);

    const cancelButton = menuForm.find('button[aria-label="Cancel"]');
    expect(cancelButton).not.toBeUndefined();
    expect(cancelButton.prop('type')).toBe('button');
    const submitButton = menuForm.find('button[aria-label="Submit"]');
    expect(submitButton).not.toBeUndefined();
    expect(submitButton.prop('type')).toBeUndefined();
  });

  it('context menu form should close and save content when done is clicked', () => {
    let inputField = menuForm.find('input#link-href');
    inputField.simulate('change', { target: { value: 'ok' } });

    expect(wrapper.find('Popup[visible=true]')).toHaveLength(2);

    const doneButton = menuForm.find('button[aria-label="Submit"]');
    doneButton.simulate('submit');

    expect(wrapper.find('Popup[visible=true]')).toHaveLength(1);

    menuButton = wrapper.find('i');
    menuButton.simulate('click');

    menuPopup = wrapper.find('Tooltip[visible=true]').at(1);
    menuForm = menuPopup.find('form');
    inputField = menuForm.find('input#link-href');

    expect(inputField.prop('value')).toBe('ok');

    wrapper.find({ ...secondLinkProps }).find('a').simulate('click');
    wrapper.find({ ...firstLinkProps }).find('a').simulate('click');

    menuButton = wrapper.find('i');
    menuButton.simulate('click');

    menuPopup = wrapper.find('Tooltip[visible=true]').at(1);
    menuForm = menuPopup.find('form');
    inputField = menuForm.find('input#link-href');
    expect(inputField.prop('value')).toBe('ok');
  });

  it('context form should not save content when cancel is clicked', () => {
    const inputField = menuForm.find('input#link-href');
    inputField.simulate('change', { target: { value: 'this should not be saved' } });
    expect(wrapper.find('Popup[visible=true]')).toHaveLength(2);
    const cancelButton = menuForm.find('button[aria-label="Cancel"]');
    cancelButton.simulate('submit');
    expect(wrapper.find('Popup[visible=true]')).toHaveLength(1);
    expect(inputField.prop('value')).toBe('ok');
  });
});
