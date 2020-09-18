import React, { ComponentType } from 'react';
import { asSubList } from '../src/List/asBodilessList';
import { flow } from 'lodash';
import asChamelionSubList from '../src/List/asChamelionSubList';

import TestList from './TestChamelionList';
import { render, mount } from 'enzyme';

describe('asChamelionSubList', () => {
  it('works', () => {
    const $ = render(<TestList />);
    console.log($.html());
    const wrapper = mount(<TestList />);
    console.log(wrapper.debug());

  });
});
