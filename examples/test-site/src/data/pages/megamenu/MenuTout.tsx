import { flow } from 'lodash';
import { asToutHorizontal } from '@bodiless/organisms';
import { withExtendHandler } from '@bodiless/core';
import { replaceWith } from '@bodiless/fclasses';
import Tout from '../../../components/Tout';
import { asToutWithPaddings, asToutDefaultStyle } from '../../../components/Tout/token';
import './megamenu.css';

function stopPropagation(e: MouseEvent) {
  e.stopPropagation();
}

const MenuTout = flow(
  asToutWithPaddings,
  asToutDefaultStyle,
  asToutHorizontal,
)(Tout);

const asMenuTout = flow(
  replaceWith(MenuTout),
  // Prevent clicks on the tout from closing the submenu
  withExtendHandler('onClick', () => stopPropagation),
);

export default asMenuTout;
