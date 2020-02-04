import { Fragment } from 'react';
import { useEditContext } from '@bodiless/core';

// Prepare mock for componentSelectorForm.
jest.mock('../../src/ComponentSelector/componentSelectorForm');
const componentSelectorForm = require('../../src/ComponentSelector/componentSelectorForm').default;

jest.mock('../../src/FlexboxGrid/model');
const { useItemHandlers, useFlexboxDataHandlers } = require('../../src/FlexboxGrid/model');

const useGetMenuOptions = require('../../src/FlexboxGrid/useGetMenuOptions').default;

const Foo = () => Fragment;
const Bar = () => Fragment;

describe('useGetMenuOptions', () => {
  function getMenuOptions() {
    const props = {
      components: [Foo, Bar],
    };
    return useGetMenuOptions(props)();
  }
  beforeEach(() => {
    // @ts-ignore
    useEditContext.mockReturnValue({ isEdit: true });
  })

  it('Returns no buttons when edit mode is off', () => {
    // @ts-ignore
    useEditContext.mockReturnValue({ isEdit: false });
    const options = getMenuOptions();
    expect(options).toHaveLength(0);
  });

  it('Returns no buttons for the flexbox when it is not empty', () => {
    const { getItems } = useItemHandlers();
    getItems.mockReturnValue([{
      uuid: 'foo',
      type: 'Foo',
    }]);
    const options = getMenuOptions();
    expect(options).toHaveLength(0);
  });
  it('Returns a single add button for the flexbox when it is empty', () => {
    const { getItems } = useItemHandlers();
    getItems.mockReturnValue([]);
    const { insertFlexboxItem } = useFlexboxDataHandlers();
    const props = {
      components: [Foo, Bar],
    };
    const options = useGetMenuOptions(props)();
    expect(options.length).toBe(1);
    expect(options[0].name).toBe('add');
    options[0].handler();
    expect(componentSelectorForm).toHaveBeenCalledTimes(1);
    expect(componentSelectorForm.mock.calls[0][0]).toEqual(props);
    const action = componentSelectorForm.mock.calls[0][1];
    action(null, 'Bar');
    expect(insertFlexboxItem).toHaveBeenCalledTimes(1);
    expect(insertFlexboxItem.mock.calls[0][0]).toBe('Bar');
    expect(insertFlexboxItem.mock.calls[0][1]).toBeUndefined();
  });
});
