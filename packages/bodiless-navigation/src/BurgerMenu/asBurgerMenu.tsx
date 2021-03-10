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

import React, { ComponentType, HTMLProps } from 'react';
import { useNode } from '@bodiless/core';
import { asAccordionWrapper, asAccodionTitle, asAccordionBody } from '@bodiless/organisms';
import {
  A, Fragment, withDesign, replaceWith, asToken, addProps, Token,
} from '@bodiless/fclasses';
import BurgerMenuClean from './BurgerMenuClean';

import { withDisabledTitleLink } from './BurgerMenu.token';
import { withMenuDesign } from '../Menu/Menu.token';

const DefaultOverviewLink: ComponentType<HTMLProps<HTMLAnchorElement>> = (props) => (
  <A {...props}>Overview</A>
);

const withOverviewLink = (OverviewLink: ComponentType<any>) => {
  let hasLink = false;

  const Overview = (props: any) => {
    const { node } = useNode();
    const parentNodePath = node.path.slice(0, node.path.length - 1);
    const linkNode = node.peer<{ href: string }>([...parentNodePath, 'title', 'link']);

    if (linkNode.data.href) {
      hasLink = true;
    }

    return linkNode.data.href
      ? <OverviewLink {...props} href={linkNode.data.href} />
      : <></>;
  };

  return hasLink
    ? addProps({ insertChildren: <Overview /> }) as Token
    : asToken();
};

const withBurgerMenuSchema = asToken(
  asAccordionWrapper,
  withOverviewLink(DefaultOverviewLink),
  withDesign({
    Wrapper: asAccordionBody,
    OuterWrapper: withDesign({
      Title: asAccodionTitle,
    }),
  }),
  asToken.meta.term('Attribute')('Submenu'),
  asToken.meta.term('Component')('Element'),
);

/**
 * HOC that wraps the supplied Component in the burger menu chrome.
 *
 * @param Component Component to be wrapped in the burger menu chrome.
 *
 * @return Original component wrapped in the burger menu chrome with 'Menu' design key.
 */
const withBurgerMenuWrapper = <P extends object>(Component: ComponentType<P>) => asToken(
  replaceWith(BurgerMenuClean),
  withDesign({
    Menu: replaceWith(Component),
  }),
)(Fragment);

/**
 * Helper which allows specifying which submenu types are configured
 * by default for the Burger Menu. Transforms selected submenus into accordions.
 *
 * @param keys List of the submenu key(s) to which the default styles will be applied to.
 *
 * @return Token that applies default burger menu styles based on provided keys.
 */
const asBurgerMenu = (...keys: string[]) => asToken(
  withMenuDesign(keys)(withBurgerMenuSchema),
  withDisabledTitleLink,
  // @todo what meta?
);

export default asBurgerMenu;
export {
  withBurgerMenuWrapper,
};
