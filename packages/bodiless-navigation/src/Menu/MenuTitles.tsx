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

import React, { ComponentType, FC } from 'react';
import { flow } from 'lodash';
import {
  withSidecarNodes, withNode, withNodeKey, WithNodeProps,
} from '@bodiless/core';
import { asEditable, asBodilessLink, withBodilessLinkToggle } from '@bodiless/components';
import { ToutClean } from '@bodiless/organisms';
import {
  A,
  Div,
  HOC,
  Design,
  asToken,
  Fragment,
  designable,
  withDesign,
  startWith,
  DesignableProps,
  DesignableComponentsProps,
} from '@bodiless/fclasses';

import { useBreadcrumbContext, asBreadcrumbSource as asBreadcrumbSourceBase } from '../Breadcrumbs';

type MenuTitleComponents = {
  Link: ComponentType<any>,
  Title: ComponentType<any>,
};

type MenuTitleProps = DesignableComponentsProps<MenuTitleComponents>;

const DEFAULT_NODE_KEYS = {
  toggleNodeKey: 'title$link-toggle',
  linkNodeKey: 'title$link',
  titleNodeKey: 'title$text',
};

/**
 * Hook which can be used to determine if a menu item is part of
 * the current active breadcrumb trail.
 *
 * This hook is only accurate if
 * - The menu is inside a BreadcrumbStoreProvider.
 * - The menu item has been wrapped in asBreadcrumb
 *
 * @return true if the item is in the active trail, false otherwise.
 */
const useIsActiveTrail = () => useBreadcrumbContext()?.isActive();

const asBreadcrumbSource = flow(
  asBreadcrumbSourceBase(DEFAULT_NODE_KEYS),
  withNode,
);

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
  Title: Fragment,
};

const MenuTitle = designable(MenuTitleComponents, 'MenuTitle')(MenuTitleBase);

const asMenuLink = (asEditableLink: typeof asBodilessLink) => asToken(
  withSidecarNodes(
    asEditableLink('link', undefined, () => ({ groupLabel: 'Menu Link' })),
  ),
);

const asMenuTitle = (asEditableTitle: typeof asEditable) => asToken(
  asEditableTitle('text', 'Menu Item'),
);

const asEditableMenuTitle = flow(
  startWith(MenuTitle),
  withDesign({
    Link: asMenuLink(withBodilessLinkToggle(asBodilessLink, startWith(Div) as HOC)),
    Title: asMenuTitle(asEditable),
  }),
  withNode,
  withNodeKey('title'),
);

const withEditableMenuTitle = withDesign({
  Title: asEditableMenuTitle,
});

const asMenuTout = (linkNodeKey = 'link', titleNodeKey = 'text') => {
  const transformDesign = (design: Design<any> = {}) => {
    const Link = asToken(
      withSidecarNodes(
        design.Link || withBodilessLinkToggle(asBodilessLink, startWith(Div) as HOC)(),
        withNodeKey(linkNodeKey),
      ),
    );
    const Title = asToken(
      design.Title || asEditable(undefined, 'Menu Item'),
      withNodeKey(titleNodeKey),
    );
    return { ...design, Link, Title };
  };

  const CleanTout: ComponentType<DesignableProps<any> & WithNodeProps> = ({ design, ...rest }) => (
    <ToutClean design={transformDesign(design)} {...rest} />
  );

  return startWith(CleanTout);
};

export default MenuTitle;
export {
  DEFAULT_NODE_KEYS,
  asMenuLink,
  asMenuTitle,
  asMenuTout,
  useIsActiveTrail,
  asEditableMenuTitle,
  withEditableMenuTitle,
  asBreadcrumbSource,
};
