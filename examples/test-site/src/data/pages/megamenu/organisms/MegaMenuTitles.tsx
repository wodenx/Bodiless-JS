import { flow, identity } from 'lodash';
import { ToutClean, MenuLink } from '@bodiless/organisms';
import { withNode, withNodeKey, withSidecarNodes } from '@bodiless/core';
import { replaceWith, HOC } from '@bodiless/fclasses';
import { asBodilessLink } from '@bodiless/components';
import { asSubMenuTitle } from './asMenu';
import withBodilessLinkToggle from './components/LinkToggle';

export const asMenuTout = (withToutEditors: any) => flow(
  replaceWith(ToutClean),
  withToutEditors,
  withNode,
  withNodeKey('title'),
  asSubMenuTitle,
);

export const asMenuLink = (asEditable: any) => flow(
  replaceWith(MenuLink),
  withSidecarNodes(
    withBodilessLinkToggle(
      asBodilessLink('link'),
    ),
  ),
  asSubMenuTitle,
  asEditable('text', 'Menu Item'),
  withNode,
  withNodeKey('title'),
) as HOC;

export const asDefaultMenuTout = asMenuTout(identity);
