import React from 'react';

import { render } from 'enzyme';
import TestList from './TestChamelionList';

describe('asChamelionSubList', () => {
  it('works', () => {
    const $ = render(<TestList />);
    expect($).toMatchSnapshot();
  });
});
