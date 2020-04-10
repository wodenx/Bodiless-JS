import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount, ReactWrapper } from 'enzyme';
import { flow } from 'lodash';

const setEditMode = (isEdit: boolean) => {
  // @TODO bodiless-core internals should not be touched
  // bodiless-core should be refactored to allow injecting of default edit mode
  window.sessionStorage.isEdit = isEdit;
};
setEditMode(true);

// eslint-disable-next-line import/first
import { asTaggableItem } from '../src/Taggable/Item';

const suggestions = [
  { id: 3, name: 'Bananas' },
  { id: 4, name: 'Mangos' },
  { id: 5, name: 'Lemons' },
  { id: 6, name: 'Apricots' },
];

const TagableItem = flow(asTaggableItem())('span');

let wrapper: ReactWrapper;
let menuButton: ReactWrapper;
let menuForm: ReactWrapper;
let menuPopup: ReactWrapper;

const itemProps = { nodeKey: 'tags', suggestions:  [...suggestions]  };

describe('Filter item interactions', () => {
  it('should render menu item when clicked', () => {
    wrapper = mount(
      <div>
        <TagableItem {...itemProps}>
          <div>test</div>
        </TagableItem>
      </div>,
    );
    console.log(itemProps);
    const item = wrapper.find({ ...itemProps }).at(0);
    expect(item).toHaveLength(1);
    item.find('div').simulate('click');
    menuButton = wrapper.find('i');
    console.log(menuButton.text());
    expect(menuButton.text()).toBe('local_offer');
  });

  it('menu button should toggle context menu visibility when clicked', () => {
    menuButton.simulate('click');
    let tooltips = wrapper.find('Tooltip');

    menuPopup = tooltips.at(1);
    expect(menuPopup.prop('visible')).toBeTruthy();

    menuButton.simulate('click');

    tooltips = wrapper.find('Tooltip');

    menuPopup = tooltips.at(1);
    expect(menuPopup.prop('visible')).toBeFalsy();
  });
  //
  it('context form should have input fields and all tags with cancel and done buttons', () => {
    menuButton.simulate('click');
    menuForm = menuPopup.find('form');
    // Test for input fields:
    const tagsInputFields = menuForm.find('input');
    expect(tagsInputFields).toHaveLength(2);
    expect(tagsInputFields.at(0).prop('value')).toBeNull;
    expect(tagsInputFields.at(0).prop('type')).toBe('hidden');
    expect(tagsInputFields.at(1).prop('placeholder')).toBe('Add or creat');

    // Cancel and add buttons:
    const cancelButton = menuForm.find('button[aria-label="Cancel"]');
    expect(cancelButton).not.toBeUndefined();
    expect(cancelButton.prop('type')).toBe('button');
    const submitButton = menuForm.find('button[aria-label="Submit"]');
    expect(submitButton).not.toBeUndefined();
    expect(submitButton.prop('type')).toBeUndefined();
  });

    it('context form should have interactive all tags button', () => {
    menuButton.simulate('click');
    menuForm = menuPopup.find('form');
    // Test for input fields:
    const tagsInputFields = menuForm.find('input');
    expect(tagsInputFields).toHaveLength(2);
    expect(tagsInputFields.at(0).prop('value')).toBeNull;
    expect(tagsInputFields.at(0).prop('type')).toBe('hidden');
    expect(tagsInputFields.at(1).prop('placeholder')).toBe('Add or creat');

    // Cancel and add buttons:
    const cancelButton = menuForm.find('button[aria-label="Cancel"]');
    expect(cancelButton).not.toBeUndefined();
    expect(cancelButton.prop('type')).toBe('button');
    const submitButton = menuForm.find('button[aria-label="Submit"]');
    expect(submitButton).not.toBeUndefined();
    expect(submitButton.prop('type')).toBeUndefined();
  });
  //
  //
  it('context menu form should close and save content when done is clicked', () => {
    let tagField = menuForm.find( "input[name='tags']");
    tagField.simulate('change', { target: { name: 'bananas' } });

    expect(wrapper.find('Popup[visible=true]')).toHaveLength(2);

    const doneButton = menuForm.find('button[aria-label="Submit"]');
    doneButton.simulate('submit');

    expect(wrapper.find('Popup[visible=true]')).toHaveLength(1);

    menuButton = wrapper.find('i');
    menuButton.simulate('click');

    menuPopup = wrapper.find('Tooltip[visible=true]').at(1);
    menuForm = menuPopup.find('form');
    tagField = menuForm.find('input#image-src');

    expect(tagField.prop('value')).toBe('ok');
  });
});
