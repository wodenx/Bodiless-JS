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

import React, { FC } from 'react';
import { withDesign } from '@bodiless/fclasses';
import { asOverviewItem } from '@bodiless/components';

import { asAccordionWrapper, asAccodionTitle, asAccordionBody } from '../../Accordion';
import { withMenuDesign as withSimpleMenuDesign } from '../SimpleMenu';
import { withMenuDesign as withMegaMenuDesign } from '../MegaMenu';

const withOverlayLinkAccordion = (Component: any) => {
  const FinalComponent: FC<any> = ({ children, overview, ...rest }) => (
    <Component {...rest}>
      { overview }
      { children }
    </Component>
  );

  return asAccordionBody(FinalComponent);
};

const asBurgerMenuDesign = {
  Wrapper: withDesign({
    List: withOverlayLinkAccordion,
    Title: asAccodionTitle,
    WrapperItem: asAccordionWrapper,
  }),
  Item: asOverviewItem,
};

const asSimpleBurgerMenu = withSimpleMenuDesign(asBurgerMenuDesign);
const asMegaBurgerMenu = withMegaMenuDesign(asBurgerMenuDesign);

export {
  asSimpleBurgerMenu,
  asMegaBurgerMenu,
};
