import { flow, identity } from 'lodash';
import { ToutClean } from '@bodiless/organisms';
import { withNode, withNodeKey } from '@bodiless/core';
import { replaceWith } from '@bodiless/fclasses';
import { asSubMenuTitle } from './asMenu';

const asMenuTout = (withToutEditors: any) => flow(
  replaceWith(ToutClean),
  withToutEditors,
  withNode,
  withNodeKey('title'),
  asSubMenuTitle,
);

export const asDefaultMenuTout = asMenuTout(identity);

export default asMenuTout;
