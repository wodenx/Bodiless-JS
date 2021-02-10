/**
 * Copyright © 2020 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Fragment, ComponentType, FC } from 'react';
import { flow } from 'lodash';
import { withSidecarNodes, withOnlyProps } from '@bodiless/core';
import { asEditable, asBodilessLink, withBodilessLinkToggle } from '@bodiless/components';
import {
  A,
  Div,
  designable,
  withDesign,
  replaceWith,
  DesignableComponentsProps,
} from '@bodiless/fclasses';

type MenuTitleComponents = {
  Link: ComponentType<any>,
  Title: ComponentType<any>,
};

type MenuTitleProps = DesignableComponentsProps<MenuTitleComponents>;

const MenuTitleBase: FC<MenuTitleProps> = ({ components, ...rest }) => {
  const { Link, Title } = components;
  return (
    <Link {...rest}>
      <Title />
    </Link>
  );
};

const MenuTitleComponents: MenuTitleComponents = {
  Link: A,
  Title: withOnlyProps('key', 'children')(Fragment),
};

const MenuTitle = designable(MenuTitleComponents, 'Menu Title')(MenuTitleBase);

const asMenuLink = (asEditableLink: typeof asBodilessLink) => flow(
  withSidecarNodes(
    asEditableLink('link', undefined, () => ({ groupLabel: 'Menu Item' })),
  ),
);

const asMenuTitle = (asEditableTitle: typeof asEditable) => flow(
  asEditableTitle('title', 'Menu Item'),
);

const asEditableMenuTitle = flow(
  replaceWith(MenuTitle),
  withDesign({
    Link: asMenuLink(withBodilessLinkToggle(asBodilessLink, replaceWith(Div))),
    Title: asMenuTitle(asEditable),
  }),
);

const withEditableMenuTitle = withDesign({
  Title: asEditableMenuTitle,
});

export default MenuTitle;
export {
  asMenuLink,
  asMenuTitle,
  asEditableMenuTitle,
  withEditableMenuTitle,
};
