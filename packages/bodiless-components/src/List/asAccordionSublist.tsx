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

import React, {
  FC,
  ComponentType as CT,
  PropsWithChildren,
  HTMLProps,
  useState,
} from 'react';
import { flow } from 'lodash';
import {
  withDesign,
  designable,
  Button,
  StylableProps,
  Span,
  addClasses,
  DesignableComponentsProps,
} from '@bodiless/fclasses';
import { withToggleTo } from '../Toggle';
import { FinalProps as ListProps } from './types';

export type ListAccordionComponents = {
  Wrapper: CT<StylableProps & HTMLProps<HTMLButtonElement>>,
  Icon: CT<StylableProps>,
};

export type ListAccordionTitleProps = {
  expanded: boolean,
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
} & DesignableComponentsProps<ListAccordionComponents>;

const listAccordionComponentsStart:ListAccordionComponents = {
  Wrapper: Button,
  Icon: Span,
};

const ListAccordionTitleBase: FC<ListAccordionTitleProps> = ({
  components,
  expanded = false,
  setExpanded,
  children,
  ...rest
}) => {
  const { Wrapper, Icon } = components;

  return (
    <Wrapper
      data-accordion-element="accordion-icon"
      data-accordion-icon={expanded ? 'remove' : 'add'}
      onClick={() => setExpanded(!expanded)}
      {...rest}
    >
      {children}
      <Icon>
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
    Wrapper: addClasses('flex justify-between w-full'),
    Icon: addClasses('material-icons cursor-pointer select-none'),
  }),
)(ListAccordionTitleClean);


/**
 * Takes a sublist component and returns a HOC which, when applied to a list item,
 * adds a toggled version of the sublist to the list item.
 *
 * @param Sublist The sublist component to add to the list item.
 */
const asAccordionSublist = (Sublist: CT<ListProps>) => (
  (Item: CT<PropsWithChildren<{}>> | string) => {
    const ItemWithSublist: CT<ListProps> = ({ children, ...rest }) => {
      const [expanded, setExpanded] = useState(false);

      return (
        <Item>
          <ListAccordionTitle expanded={expanded} setExpanded={setExpanded}>
            {children}
          </ListAccordionTitle>

          <div className={expanded ? 'block' : 'hidden'}>
            <Sublist {...rest} />
          </div>
        </Item>
      );
    };
    const ItemWithoutSublist: CT<ListProps> = ({ wrap, nodeKey, ...rest }) => (
      <Item {...rest} />
    );
    return withToggleTo(ItemWithoutSublist)(ItemWithSublist);
  }
);

export default asAccordionSublist;
