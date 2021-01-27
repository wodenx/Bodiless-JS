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
import { useNode, withChild } from '@bodiless/core';
import { withDesign, A, addProps } from '@bodiless/fclasses';

import { asAccordionWrapper, asAccodionTitle, asAccordionBody } from '../../Accordion';
import { withMenuDesign as withSimpleMenuDesign } from '../SimpleMenu';
import { withMenuDesign as withMegaMenuDesign } from '../MegaMenu';
import { flow } from 'lodash';

// type OverviewItem = {
//   overview: JSX.Element,
// };
// 
// type WithOverviewLink = {
//   OverviewLink: ComponentType<HTMLProps<HTMLAnchorElement>>
// };
// 
// const DefaultOverviewLink: ComponentType<HTMLProps<HTMLAnchorElement>> = (props) => (
//   <A {...props}>Overview</A>
// );
// 
// const asBurgerMenuOverviewLink = <P extends object>(Item: ComponentType<P>) => {
//   const ItemWithOverview: ComponentType<P & WithOverviewLink> = ({
//     OverviewLink = DefaultOverviewLink,
//     ...rest
//   }) => {
//     const { node } = useNode();
//     const linkNode = node.child<{ href: string }>('title$link');
//     const overview = <li><OverviewLink href={linkNode.data.href} /></li>;
//     const overviewProps = linkNode.data.href ? { overview } : undefined;
// 
//     return (
//       <Item {...overviewProps} {...rest as P} />
//     );
//   };
// 
//   return ItemWithOverview;
// };
// 
// const withOverlayLinkAccordion = <P extends object>(Component: ComponentType<P>) => {
//   const WithOverlayLinkAccordion: FC<P & OverviewItem> = ({ children, overview, ...rest }) => (
//     <Component {...rest as P}>
//       { overview }
//       { children }
//     </Component>
//   );
// 
//   return asAccordionBody(WithOverlayLinkAccordion as ComponentType<P>);
// };

const withBurgerSubMenu = withDesign({
  Item: withDesign({
    List: flow(
      // @TODO Get actual link data as before
      addProps({ insertChildren: <>Overview</> }),
      withDesign({
        Wrapper: withDesign({
          List: asAccordionBody,
          Title: asAccodionTitle,
          WrapperItem: asAccordionWrapper,
        }),
      }),
    ),
  }),
});

// @TODO Add this to all sublist types (after menu refactor)
const asSimpleBurgerMenu = withBurgerSubMenu;
const asMegaBurgerMenu = withBurgerSubMenu;

export {
  asSimpleBurgerMenu,
  asMegaBurgerMenu,
};
