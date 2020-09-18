import React, { ComponentType } from 'react';
import { asSubList } from '../src/List/asBodilessList';
import { flow } from 'lodash';
import { asChamelionSubList } from '../lib';

describe('asChamelionSubList', () => {
  const withProps = (props$: any) => (Component: ComponentType<any>) => (props: any) => (
    <Component {...props} {...props$} />
  );

  const asTestSubList = flow(
    asChamelionSubList,
    withDesign({
      A: flow(asSubList, withProps({ 'data-sublist': 'A' }),
      B: flow(asSubList, withProps({ 'data-sublist': 'B' }),
    });
  )as
  const asTest

  it('preserves sublist styling when swapped', () => {

  });
});
