import { flow, identity } from 'lodash';
import { ToutClean, MenuLink } from '@bodiless/organisms';
import { withNode, withNodeKey, withSidecarNodes } from '@bodiless/core';
import { replaceWith, HOC } from '@bodiless/fclasses';
import { asBodilessLink, withBodilessLinkToggle } from '@bodiless/components';
import { asSubMenuTitle } from './asMenu';

export const asMenuTout = (withToutEditors: any) => flow(
  replaceWith(ToutClean),
  withToutEditors,
  withNode,
  withNodeKey('title'),
  asSubMenuTitle,
);

export const asMenuLink = (asEditable: HOC) => flow(
  replaceWith(MenuLink),
  withSidecarNodes(
    withBodilessLinkToggle(
      asBodilessLink('link'),
    ),
  ),
  asSubMenuTitle,
  asEditable,
  withNode,
  withNodeKey('title'),
) as HOC;

export const asDefaultMenuLink = asMenuLink(identity);

export const asDefaultMenuTout = asMenuTout(identity);
