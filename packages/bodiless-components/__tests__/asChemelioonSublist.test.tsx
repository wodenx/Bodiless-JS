import React from 'react';

import { render, mount } from 'enzyme';
import TestList from './TestChamelionList';

describe('asChamelionSubList', () => {
  it('works', () => {
    const $ = render(<TestList />);
    console.log($.html());
    const wrapper = mount(<TestList />);
    console.log(wrapper.debug());
  });
});
