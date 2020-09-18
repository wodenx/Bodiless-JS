import React from 'react';
import { flow } from 'lodash';
import { withDesign, replaceWith } from '@bodiless/fclasses';
import { mount } from 'enzyme';
import asBodilessList, { asSubList } from '../src/List/asBodilessList';

const withTitle = withDesign({
  Title: replaceWith(() => <span>Foo</span>),
});

const asSimpleList = withDesign({
  Item: asSubList,
});

const SimpleList = flow(
  asBodilessList(),
  asSimpleList,
  withTitle,
  withDesign({
    Item: withTitle,
  }),
)('ul');

describe('withSublist', () => {
  it('Works correctly', () => {
    const wrapper = mount(<SimpleList />);
    console.log(wrapper.debug());
  });
});
