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
import { flow } from 'lodash';
import {
  withDesign,
  designable,
  Div,
  Span,
  addClasses,
} from '@bodiless/fclasses';
import { usePageDimensionsContext } from '@bodiless/core';
import {
  ListAccordionComponents,
  ListAccordionTitleProps,
} from './types';

const listAccordionComponentsStart:ListAccordionComponents = {
  Wrapper: Div,
  Icon: Span,
};

const ListAccordionTitleBase: FC<ListAccordionTitleProps> = ({
  components,
  expanded,
  setExpanded,
  children,
  ...rest
}) => {
  const { Wrapper, Icon } = components;
  const { size } = usePageDimensionsContext();

  return (
    <Wrapper onClick={() => setExpanded(!expanded)} {...rest}>
      {children}
      <Icon
        className={size === 'lg' ? 'hidden' : 'material-icons'}
        data-accordion-element="accordion-icon"
        data-accordion-icon={expanded ? 'remove' : 'add'}
      >
        {expanded ? 'remove' : 'add'}
      </Icon>
    </Wrapper>
  );
};

const ListAccordionTitleClean = flow(
  designable(listAccordionComponentsStart),
)(ListAccordionTitleBase);

const ListAccordionTitle = flow(
  withDesign({
    Wrapper: addClasses('flex justify-between items-center'),
    Icon: addClasses('cursor-pointer select-none'),
  }),
)(ListAccordionTitleClean);

export default ListAccordionTitle;
export {
  ListAccordionTitle,
  ListAccordionTitleClean,
};
