import React, { ReactElement } from 'react';

import {
  Token, withDesign, Design, asToken, addProps,
} from '@bodiless/fclasses';
import { withDefaultContent } from '@bodiless/core';
import { flow } from 'lodash';
import { render, ComponentType } from 'enzyme';
import { withSubLists } from '../src/List/asChameleonSubList';
import asBodilessList, { asSubList } from '../src/List/asBodilessList';
import { asBodilessChameleon } from '../src/Chameleon';

const withItemTitle = (title: string) => withDesign({
  Title: flow(
    () => (props: any) => <span {...props}>{title}</span>,
  ),
}) as Token;

describe.only('list styling', () => {
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
          Wrapper: withDesign({
            List: addProps({ id: 'middle-a' }),
          }),
          Item: withDesign({
            A: withDesign({
              Wrapper: withDesign({
                List: addProps({ id: 'inner-a-a' }),
              }),
            }),
            B: withDesign({
              Wrapper: withDesign({
                List: addProps({ id: 'inner-a-b' }),
              }),
            }),
          }),
        }),
        B: withDesign({
          Wrapper: withDesign({
            List: addProps({ id: 'middle-b' }),
          }),
          Item: withDesign({
            A: withDesign({
              Wrapper: withDesign({
                List: addProps({ id: 'inner-b-a' }),
              }),
            }),
            B: withDesign({
              Wrapper: withDesign({
                List: addProps({ id: 'inner-b-b' }),
              }),
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

  const renderTest = (C: ComponentType<any>) => {
    return render(<div><C /></div>);
  };

  it.only('Applies a design on Item to the li for all sublist types', () => {
    const Test = withDesign<any>({
      Item: addProps({ 'data-test': 'foo' }),
    })(TestList);
    let wrapper;
    wrapper = renderTest(withSubListData()(Test));
    expect(wrapper.find('ul#top>li').prop('data-test')).toBe('foo');
    wrapper = renderTest(withSubListData('A')(Test));
    console.log(wrapper.html());
    return;
    expect(wrapper.find('ul#top>li').prop('data-test')).toBe('foo');
    wrapper = renderTest(withSubListData('B')(Test));
    expect(wrapper.find('ul#top>li').prop('data-test')).toBe('foo');
  });

  it('Applies a design on Wrapper to the ul for all sublist types', () => {
    const Test = withDesign<any>({
      Item: withDesign({
        Wrapper: addProps({ 'data-test': 'foo' }),
      }),
    })(TestList);
    let wrapper;
    wrapper = renderTest(withSubListData()(Test));
    expect(wrapper.find('ul#top>li').prop('data-test')).toBeUndefined();
    wrapper = renderTest(withSubListData('A')(Test));
    expect(wrapper.find('ul#top>li').prop('data-test')).toBeUndefined();
    expect(wrapper.find('ul#top>li>ul').prop('data-test')).toBe('foo');
    wrapper = renderTest(withSubListData('B')(Test));
    expect(wrapper.find('ul#top>li').prop('data-test')).toBeUndefined();
    expect(wrapper.find('ul#top>li>ul').prop('data-test')).toBe('foo');
  });
});

describe('list design', () => {
  const applyTokenDeep = (token: Token, targetDepth: number, currentDepth: number = 0): Token => (
    targetDepth === currentDepth
      ? token
      : withDesign({
        Item: withDesign({
          SubList: applyTokenDeep(token, targetDepth, currentDepth + 1),
        }),
      }) as Token
  );

  type ListStyles = 'Bulleted'|'Numbered'|'_default';
  type WithListDesign = (
    styles?: ListStyles|ListStyles[],
    depths?: number|number[],
  ) => (designOrToken:Design<any>|Token) => Token;

  const ALL_STYLES = ['Bulleted', 'Numbered', '_default'] as ListStyles[];
  const ALL_DEPTHS = [0, 1, 2];

  const withListDesign: WithListDesign = (
    styles = ALL_STYLES, depths = ALL_DEPTHS,
  ) => (designOrToken) => {
    const token = typeof designOrToken === 'function'
      ? designOrToken : withDesign(designOrToken as Design<any>) as Token;
    const styles$ = Array.isArray(styles) ? styles : [styles];
    const depths$ = Array.isArray(depths) ? depths : [depths];
    const designs = styles$.map(
      style => {
        const designsForStyle = depths$.map(
          depth => applyTokenDeep(token, depth),
        );
        return withDesign({
          [style]: asToken(...designsForStyle),
        }) as Token;
      },
    );
    return asToken(
      asToken.meta.term('Component')('List'),
      ...designs,
    );
  };

  const TestList = flow(
    asBodilessList('testlist'),
    withItemTitle('item'),
    withSubLists(2)(flow(asSubList(), withItemTitle('item'))),
    // Add some id's so we can find the elements.
    withDesign({
      Wrapper: addProps({ id: 'top' }),
      Item: withDesign({
        SubList: withDesign({
          Wrapper: withDesign({
            List: addProps({ id: 'middle' }),
          }),
          Item: withDesign({
            SubList: withDesign({
              Wrapper: withDesign({
                List: addProps({ id: 'inner' }),
              }),
            }),
          }),
        }),
      }),
    }),
    asBodilessChameleon('list-type'),
    // Add a prop to the top level list to identify it (for debugging only).
    withDesign({
      Bulleted: withDesign({
        Wrapper: addProps({ 'data-bullets': true }),
      }),
      Numbered: withDesign({
        Wrapper: addProps({ 'data-numbers': true }),
      }),
      _default: withDesign({
        Wrapper: addProps({ 'data-plain': true }),
      }),
    }),
  )('ul');

  const testToken = (value: string = 'test'): Token => withDesign({
    Title: addProps({ 'data-test': value }),
  }) as Token;

  const withListContent = (style?: ListStyles) => withDefaultContent({
    'testlist$default$cham-sublist': {
      component: 'SubList',
    },
    'testlist$default$sublist$default$cham-sublist': {
      component: 'SubList',
    },
    ...style ? {
      'list-type': {
        component: style,
      },
    } : {},
  });

  it('Applies a token at only the top level only to a single type', () => {
    const TestBase = withListDesign('Bulleted', 0)(testToken())(TestList);
    let Test;
    let $;
    Test = withListContent('Bulleted')(TestBase);
    $ = render(<div><Test /></div>);
    // console.log($.html());
    expect($.find('ul#top>li>span').prop('data-test')).toBe('test');
    Test = withListContent('Numbered')(TestBase);
    $ = render(<div><Test /></div>);
    expect($.find('ul#top>li>span').prop('data-test')).toBeUndefined();
    Test = withListContent()(TestBase);
    $ = render(<div><Test /></div>);
    expect($.find('ul#top>li>span').prop('data-test')).toBeUndefined();
  });
});
