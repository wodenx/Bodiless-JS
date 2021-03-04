import React, { FC } from 'react';

import {
  Token, withDesign, addProps, replaceWith, withoutProps,
} from '@bodiless/fclasses';
import { withDefaultContent } from '@bodiless/core';
import { flow, isEqual } from 'lodash';
import { render, ComponentType } from 'enzyme';
import { withSubLists } from '../src/List/asChameleonSubList';
import asBodilessList, { asSubList } from '../src/List/asBodilessList';

import {
  ListSchemaDef, buildTree, buildSchema, subKeysForPath, realPath,
} from '../src/List/withListDesign';

const withItemTitle = (title: string) => withDesign({
  Title: flow(
    () => (props: any) => <span {...props}>{title}</span>,
  ),
}) as Token;

describe('list styling', () => {
  const TestList = flow(
    asBodilessList('testlist'),
    withItemTitle('TopList'),
    withSubLists(2)({
      A: flow(asSubList(), withItemTitle('SublistA')),
      B: flow(asSubList(), withItemTitle('SubListB')),
    }),
    // Add some id's so we can find the elements.
    withDesign({
      Wrapper: addProps({ id: 'top' }),
      Item: withDesign({
        A: withDesign({
          Wrapper: addProps({ id: 'middle-a' }),
          Item: withDesign({
            A: withDesign({
              Wrapper: addProps({ id: 'inner-a-a' }),
            }),
            B: withDesign({
              Wrapper: addProps({ id: 'inner-a-b' }),
            }),
          }),
        }),
        B: withDesign({
          Wrapper: addProps({ id: 'middle-b' }),
          Item: withDesign({
            A: withDesign({
              Wrapper: addProps({ id: 'inner-b-a' }),
            }),
            B: withDesign({
              Wrapper: addProps({ id: 'inner-b-b' }),
            }),
          }),
        }),
      }),
    }),
  )('ul');

  const withSubListData = (levelOne?: 'A'|'B', levelTwo?: 'A'|'B') => withDefaultContent<any, any>({
    'testlist$default$cham-sublist': {
      component: levelOne,
    },
    'testlist$default$sublist$default$cham-sublist': {
      component: levelTwo,
    },
  });

  const renderTest = (C: ComponentType<any>) => render(<div><C /></div>);

  let wrapper;

  it('Applies a design on Item to the li for all sublist types', () => {
    const Test = withDesign<any>({
      Item: addProps({ 'data-test': 'foo' }),
    })(TestList);
    wrapper = renderTest(withSubListData()(Test));
    expect(wrapper.find('ul#top>li').prop('data-test')).toBe('foo');
    wrapper = renderTest(withSubListData('A')(Test));
    console.log(wrapper.html());
    expect(wrapper.find('ul#top>li').prop('data-test')).toBe('foo');
    wrapper = renderTest(withSubListData('B')(Test));
    expect(wrapper.find('ul#top>li').prop('data-test')).toBe('foo');
  });

  it('Applies a design on Wrapper to the ul for all sublist types', () => {
    const Test = withDesign<any>({
      Item: withDesign({
        // NOTE: we cannot apply the design directly to the item bc the
        // chameleon consumes it.  Perhaps look at using extendDesignable
        // for chameleons...
        A: withDesign({
          Wrapper: addProps({ 'data-test': 'foo' }),
        }),
        B: withDesign({
          Wrapper: addProps({ 'data-test': 'foo' }),
        }),
      }),
    })(TestList);
    wrapper = renderTest(withSubListData()(Test));
    expect(wrapper.find('ul#top>li').prop('data-test')).toBeUndefined();
    wrapper = renderTest(withSubListData('A')(Test));
    expect(wrapper.find('ul#top>li').prop('data-test')).toBeUndefined();
    expect(wrapper.find('ul#top>li>ul').prop('data-test')).toBe('foo');
    wrapper = renderTest(withSubListData('B')(Test));
    expect(wrapper.find('ul#top>li').prop('data-test')).toBeUndefined();
    expect(wrapper.find('ul#top>li>ul').prop('data-test')).toBe('foo');
  });

  it('Supports an rc-menu style sublist', () => {
    const TitledSubList: FC<any> = ({ title, children, ...rest }) => (
      <li id="title-sub-list" {...rest}>
        {title}
        <ul>
          {children}
        </ul>
      </li>
    );
    const Test = flow(
      withDesign({
        Item: flow(
          addProps({ 'data-item': true }),
          withDesign({
            A: withDesign({
              OuterWrapper: flow(
                replaceWith(TitledSubList),
                // @todo find a way to avoid this.
                withoutProps(['addItem', 'deleteItem', 'canDelete', 'unwrap']),
              ) as Token,
            }),
          }),
        ),
      }),
      withSubListData('A'),
    )(TestList);
    wrapper = renderTest(Test);
    expect(wrapper.find('ul#top>li').prop('id')).toBe('title-sub-list');
    console.log(wrapper.html());
  });
});



describe('withListDesign', () => {
  const schema: ListSchemaDef = {
    keySpace: ['Bullets', 'Numbers', 'SubList'],
    maxDepth: 3,
    hasNode: path => {
      if (!['_default', 'Bullets', 'Numbers'].includes(path[0])) return false;
      if (path.length === 1) return true;
      if (!['_default', 'SubList'].includes(path[1])) return false;
      if (path.length === 2) return true;
      if (path[1] === '_default') return false;
      if (!['_default', 'SubList'].includes(path[2])) return false;
      return true;
    },
  };

  it('Test schema evaluates paths correctly', () => {
    expect(schema.hasNode(['Bullets'])).toBeTruthy();
    expect(schema.hasNode(['None'])).toBeTruthy();
    expect(schema.hasNode(['Numbers'])).toBeTruthy();
    expect(schema.hasNode(['Bullets', 'SubList'])).toBeTruthy();
    expect(schema.hasNode(['Bullets', 'SubList', 'SubList'])).toBeTruthy();
    expect(schema.hasNode(['Numbers', 'SubList', 'SubList'])).toBeTruthy();
    expect(schema.hasNode(['Bullets', 'Numbers'])).toBeFalsy();
    expect(schema.hasNode(['Numbers', 'Bullets'])).toBeFalsy();
    expect(schema.hasNode(['Bullets', 'Numbers', 'SubList'])).toBeFalsy();
    expect(schema.hasNode(['Numbers', 'Bullets', 'SubList'])).toBeFalsy();
  });

  it('Finds subkeys correctly', () => {
    expect(subKeysForPath(schema)(['Bullets'])).toEqual(['_default', 'SubList']);
    expect(subKeysForPath(schema)(['Bullets', '_default'])).toEqual([]);
    expect(subKeysForPath(schema)(['Bullets', 'SubList'])).toEqual(['_default', 'SubList']);
  });

  it('Creates the correct paths list from a schema', () => {
    const paths = buildSchema(schema);
    const expected = [
      [ '_default' ],
      [ '_default', '_default' ],
      [ '_default', 'SubList' ],
      [ '_default', 'SubList', '_default' ],
      [ '_default', 'SubList', 'SubList' ],
      [ 'Bullets' ],
      [ 'Bullets', '_default' ],
      [ 'Bullets', 'SubList' ],
      [ 'Bullets', 'SubList', '_default' ],
      [ 'Bullets', 'SubList', 'SubList' ],
      [ 'Numbers' ],
      [ 'Numbers', '_default' ],
      [ 'Numbers', 'SubList' ],
      [ 'Numbers', 'SubList', '_default' ],
      [ 'Numbers', 'SubList', 'SubList' ],
    ];
    expect(paths).toEqual(expected);
  });

  describe.only('realPath',  () => {
});
