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

import React, { FC, ComponentType } from 'react';
import { useNode } from '@bodiless/core';
import { withDesign } from '@bodiless/fclasses';

import { asAccordionWrapper, asAccodionTitle, asAccordionBody } from '../../Accordion';
import { withMenuDesign as withSimpleMenuDesign } from '../SimpleMenu';
import { withMenuDesign as withMegaMenuDesign } from '../MegaMenu';

type OverviewItem = {
  overview: JSX.Element,
};

type WithOverviewLinkTitle = {
  overviewLinkTitle: string
};

const asBurgerMenuOverviewLink = <P extends object>(Item: ComponentType<P>) => {
  const ItemWithOverview: ComponentType<P & WithOverviewLinkTitle> = ({ overviewLinkTitle = 'Overview', ...rest }) => {
    const { node } = useNode();
    const linkNode = node.child<{ href: string }>('title$link');
    const overview = linkNode.data.href
      ? <li><a href={linkNode.data.href}>{ overviewLinkTitle }</a></li>
      : <></>;

    return (
      <Item overview={overview} {...rest as P} />
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

const asBurgerMenuDesign = {
  Wrapper: withDesign({
    List: withOverlayLinkAccordion,
    Title: asAccodionTitle,
    WrapperItem: asAccordionWrapper,
  }),
  Item: asBurgerMenuOverviewLink,
};

const asSimpleBurgerMenu = withSimpleMenuDesign(asBurgerMenuDesign);
const asMegaBurgerMenu = withMegaMenuDesign(asBurgerMenuDesign);

export {
  asSimpleBurgerMenu,
  asMegaBurgerMenu,
};
