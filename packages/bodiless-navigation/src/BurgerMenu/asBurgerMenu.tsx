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

import React, { FC, ComponentType, HTMLProps } from 'react';
import { useNode } from '@bodiless/core';
import { asAccordionWrapper, asAccodionTitle, asAccordionBody } from '@bodiless/organisms';
import {
  A, Fragment, withDesign, replaceWith, asToken,
} from '@bodiless/fclasses';
import BurgerMenuClean from './BurgerMenuClean';

import { withColumnSubMenuDesign } from '../withSubMenu';
import { withSubMenuToken } from '../Menu.token';

type OverviewItem = {
  overview: JSX.Element,
};

type WithOverviewLink = {
  OverviewLink: ComponentType<HTMLProps<HTMLAnchorElement>>
};

const DefaultOverviewLink: ComponentType<HTMLProps<HTMLAnchorElement>> = (props) => (
  <A {...props}>Overview</A>
);

const asBurgerMenuOverviewLink = <P extends object>(Item: ComponentType<P>) => {
  const ItemWithOverview: ComponentType<P & WithOverviewLink> = ({
    OverviewLink = DefaultOverviewLink,
    ...rest
  }) => {
    const { node } = useNode();
    const linkNode = node.child<{ href: string }>('link');
    const overview = <li><OverviewLink href={linkNode.data.href} /></li>;
    const overviewProps = linkNode.data.href ? { overview } : undefined;

    return (
      <Item {...overviewProps} {...rest as P} />
    );
  };

  return ItemWithOverview;
};

const withOverlayLinkAccordion = <P extends object>(Component: ComponentType<P>) => {
  const WithOverlayLinkAccordion: FC<P & OverviewItem> = ({ children, overview, ...rest }) => (
    <Component {...rest as P}>
      { overview }
      { children }
    </Component>
  );

  return asAccordionBody(WithOverlayLinkAccordion as ComponentType<P>);
};

const asBurgerMenuDesign = asToken(
  asAccordionWrapper,
  withDesign({
    Wrapper: withOverlayLinkAccordion,
    OuterWrapper: withDesign({
      Title: asAccodionTitle,
    }),
    Item: asBurgerMenuOverviewLink,
  }),
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
  withSubMenuToken(...keys)(asBurgerMenuDesign),
  keys.indexOf('Columns') > -1
    ? withSubMenuToken('Columns')(withColumnSubMenuDesign(asBurgerMenuDesign))
    : {},
);

export default asBurgerMenu;
export {
  withBurgerMenuWrapper,
};
