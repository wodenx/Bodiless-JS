import { flow } from 'lodash';
import { asToutHorizontal, ToutClean } from '@bodiless/organisms';
import {
  withExtendHandler, withNode, withNodeKey,
} from '@bodiless/core';
import { replaceWith, withDesign } from '@bodiless/fclasses';
import AsEditable from '@bodiless/organisms/lib/components/MainMenu/types/AsEditable';
import { asToutWithPaddings, asToutDefaultStyle } from '../../../components/Tout/token';
import './megamenu.css';
import { asEditableImage, asEditableLink } from '../../../components/Elements.token';
import { withEditorSimple, withEditorBasic } from '../../../components/Editors';

function stopPropagation(e: MouseEvent) {
  e.stopPropagation();
}

export const withToutEditors = (asEditable: AsEditable) => flow(
  withDesign({
    Image: asEditableImage('image'),
    ImageLink: asEditableLink('component'),
    Title: asEditable('component$text', 'Menu Item Text'),
    Link: flow(
      withEditorSimple('button-text', 'CTA'),
      asEditableLink('component'),
      // ifEditable(asNonDraggable),
    ),
    Body: withEditorBasic('body', 'Tout Body Text'),
  }),
);

const asMenuTout = (asEditable: AsEditable) => flow(
  replaceWith(ToutClean),
  withToutEditors(asEditable),
  asToutWithPaddings,
  asToutDefaultStyle,
  asToutHorizontal,
  withNode,
  withNodeKey('title'),
  // Prevent clicks on the tout from closing the submenu
  withExtendHandler('onClick', () => stopPropagation),
);

export default asMenuTout;
