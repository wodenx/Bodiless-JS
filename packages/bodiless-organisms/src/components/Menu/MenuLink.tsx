/**
 * Copyright © 2019 Johnson & Johnson
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

import React, { FC, ComponentType, HTMLProps } from 'react';
import {
  A,
  designable,
  DesignableComponentsProps,
  addClasses,
} from '@bodiless/fclasses';
import { useBreadcrumbStore, useBreadcrumbContext } from '@bodiless/components';
import { observer } from 'mobx-react-lite';
import { flow } from 'lodash';

type MenuLinkComponents = {
  Link: ComponentType<any>,
  ActiveLink: ComponentType<any>,
  ActiveTrailLink: ComponentType<any>,
};

const menulinkComponents: MenuLinkComponents = {
  Link: A,
  ActiveLink: A,
  ActiveTrailLink: addClasses('text-orange-700')(A),
};

const isCurrentPage = (href: string | undefined) => {
  if (!href || (typeof window === 'undefined')) {
    return false;
  }
  const urls = [];
  urls.push(window.location.toString());

  let relativeUrl = window.location.pathname;
  urls.push(relativeUrl);
  if (window.location.search) {
    relativeUrl += window.location.search;
    urls.push(relativeUrl);
  }
  if (window.location.hash) {
    relativeUrl += window.location.hash;
    urls.push(relativeUrl);
    urls.push(window.location.hash); // a case when only a hash presents in link href
  }
  return urls.indexOf(href) > -1;
};

export type Props = {
  href?: string,
  unwrap?: Function,
} & DesignableComponentsProps<MenuLinkComponents> & HTMLProps<HTMLElement>;

/**
 * Toggles between two states. Render <ActiveLink /> when the active page URL (window.location)
 * matches to href attribute of the component. Otherwise the <Link /> will be rendered
 * Note - below the href prop is passed in by the withData() HOC which is part of asBodilessLink.
 * @constructor
 */
const MenuLinkBase: FC<Props> = ({ components, unwrap, ...rest }) => {
  const { Link, ActiveLink, ActiveTrailLink } = components;
  const { href } = rest;
  const item = useBreadcrumbContext();
  const store = useBreadcrumbStore();

  if (isCurrentPage(href)) {
    return <ActiveLink {...rest} />;
  }
  if (item && store && store.breadcrumbTrail.find(tItem => tItem.isEqual(item))) {
    return <ActiveTrailLink {...rest} />;
  }
  return <Link {...rest} />;
};

const MenuLink = flow(
  observer,
  designable(menulinkComponents),
)(MenuLinkBase);

export default MenuLink;
