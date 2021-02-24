import React from 'react';
import { withDesign, Token, addProps } from '@bodiless/fclasses';
import { flow, identity } from 'lodash';
import {
  asSubList, asBodilessList, withSubLists, asBodilessChameleon,
} from '@bodiless/components';
import { withDefaultContent } from '@bodiless/core';

const withItemTitle = (title: string = 'Item') => withDesign({
  Title: flow(
    () => (props: any) => <span {...props}>{title}</span>,
  ),
}) as Token;

const asTestSubList = flow(
  asSubList(),
  withItemTitle(),
);

const data = {
  'testlist$default$cham-sublist': {
    component: 'SubList',
  },
  'testlist$default$sublist$default$cham-sublist': {
    component: 'SubList',
  },
  // 'list-type': {
  //   component: 'Bulleted',
  // }
};

const data$ = {
  'list-type': {
    component: 'Bulleted',
  },
};

const TestList = flow(
  asBodilessList('testlist'),
  withItemTitle(),
  withSubLists(2)(asTestSubList),
  asBodilessChameleon('list-type'),
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
  //withDefaultContent(data),
  withDefaultContent({ ...data, ...data$ }),
  // withDefaultContent(data$),
)('ul');

const withListStyle = (style: ListStyles) => withDefaultContent({
  'list-type': {
    component: style,
  },
});


// export default withListStyle('Bulleted')(TestList);
// export default withDefaultContent(data$)(TestList);
export default TestList;
