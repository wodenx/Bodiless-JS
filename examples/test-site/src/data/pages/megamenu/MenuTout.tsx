import { flow } from 'lodash';
import { asToutHorizontal, ToutClean } from '@bodiless/organisms';
import {
  withExtendHandler, withNode, withNodeKey,
} from '@bodiless/core';
import { replaceWith, withDesign, H2 } from '@bodiless/fclasses';
import { asEditable } from '@bodiless/components';
import { asToutWithPaddings, asToutDefaultStyle } from '../../../components/Tout/token';
import './megamenu.css';
import { withToutEditors } from '../../../components/Tout';

function stopPropagation(e: MouseEvent) {
  e.stopPropagation();
}

const asMenuTout = flow(
  replaceWith(ToutClean),
  withToutEditors,
  withDesign({
    Title: flow(
      replaceWith(H2),
      // We set the editor to match the one in asMenuLink
      asEditable('text', 'Title'),
    ),
  }),
  asToutWithPaddings,
  asToutDefaultStyle,
  asToutHorizontal,
  withNode,
  withNodeKey('title'),
  // Prevent clicks on the tout from closing the submenu
  withExtendHandler('onClick', () => stopPropagation),
);

export default asMenuTout;
