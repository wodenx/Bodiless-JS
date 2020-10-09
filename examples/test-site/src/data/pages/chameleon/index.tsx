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

import React, { FC, HTMLProps, ComponentType } from 'react';
import { graphql } from 'gatsby';
import { Page } from '@bodiless/gatsby-theme-bodiless';
import {
  addClasses, H1 as H1$, H2 as H2$, withDesign, stylable, addProps, addClassesIf, Div, HOC,
} from '@bodiless/fclasses';
import { flow, flowRight } from 'lodash';
import {
  withContextActivator, withLocalContextMenu, withNodeKey, withNode,
} from '@bodiless/core';

import {
  asBodilessChameleon, useChameleonContext, withChameleonContext, withChameleonButton,
} from '@bodiless/components/src/Chameleon';
import { withTitle } from '@bodiless/layouts';
import { asBodilessLink } from '@bodiless/components';
import { asHeader1, asHeader2 } from '../../../components/Elements.token';
import Layout from '../../../components/Layout';

const H1 = flow(addClasses('pt-5'), asHeader1)(H1$);
const H2 = flow(addClasses('pt-5'), asHeader2)(H2$);


const A = asBodilessLink('link')('a');

const addPropsIf = (condition: () => boolean) => (newProps: any) => (C: ComponentType<any>) => (
  (props: any) => (condition() ? <C {...props} {...newProps} /> : <C {...props} />)
);

const withBaseStyles = addClasses('border-8 py-5 w-1/6 text-center');
const BaseComponent = withBaseStyles(Div);
const chameleonDesign = {
  Red: addClasses('border-red-500 text-red-500'),
  Blue: addClasses('border-blue-500 text-blue-500'),
  Green: addClasses('border-green-500 text-green-500'),
};
const Chameleon = flow(
  asBodilessChameleon('basic-chameleon'),
  withDesign(chameleonDesign),
)(BaseComponent);

const BaseToggle = ({ isAvailable = false, ...rest }) => (
  <BaseComponent {...rest}>
    {isAvailable ? 'Available Now!' : 'Call for availability'}
  </BaseComponent>
);

const toggleDesign = {
  Available: flow(
    addClasses('border-red-500 text-red-500'),
    addProps({ isAvailable: true })
  ),
};

const Toggle = flow(
  asBodilessChameleon('toggle', undefined, () => ({ label: 'Avail' })),
  withDesign(toggleDesign),
)(BaseToggle);


/*
const useIs = (key: String) => () => useChameleonContext().activeComponent === key;

const BetterBox = flowRight(
  withNodeKey('chameleon-2'),
  withNode,
  withChameleonContext('chameleon'),
  withChameleonButton(),
  withLocalContextMenu,
  withContextActivator('onClick'),
  addClassesIf(useIs('Red'))('border-red-500 text-red-500'),
  addClassesIf(useIs('Blue'))('border-blue-500 text-blue-500'),
  addClassesIf(useIs('Green'))('border-green-500 text-green-500'),
  asBox,
  stylable,
)(ComponentBase);

const withToggleDesign = withDesign({
  On: addProps({ on: true }),
  _default: addProps({ on: false }),
});

const Toggle$: FC<HTMLProps<HTMLDivElement>&{ on: boolean }> = ({ on, ...rest }) => (
  <div {...rest}>
    <A>
      Toggle:
      {on ? 'On' : 'Off'}
    </A>
  </div>
);

const Toggle = flowRight(
  withNodeKey('toggle'),
  withNode,
  withToggleDesign,
  asBodilessChameleon('toggle-chameleon'),
  withLocalContextMenu,
  withContextActivator('onClick'),
  asBox,
  stylable,
)(Toggle$);

const useIsOn = () => useChameleonContext().isOn;

const BetterToggle = flowRight(
  withNodeKey('toggle-2'),
  withNode,
  withChameleonContext('toggle'),
  withChameleonButton(),
  withLocalContextMenu,
  withContextActivator('onClick'),
  addPropsIf(useIsOn)({ on: true }),
  asBox,
  stylable,
)(Toggle$);
*/

export default (props: any) => (
  <Page {...props}>
    <Layout>
      <H1>Chameleon</H1>
      <H2>Basic</H2>
      <Chameleon>Click Me</Chameleon>
      <H2>Toggle</H2>
      <Toggle />
      {/*
      <BetterBox />

      <H2>Toggle</H2>
      <Toggle />
      <BetterToggle />
      */}
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
