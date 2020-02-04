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

import React from 'react';
import { graphql } from 'gatsby';
import { Page } from '@bodiless/gatsby-theme-bodiless';
import { flow } from 'lodash';
import { asTestableTout } from '@bodiless/organisms';
import Layout from '../../../components/Layout';
import Tout from '../../../components/Tout';
import {
  asToutVertical,
  asToutHorizontal,
  asToutNoBody,
  asToutNoTitle,
  asToutDefaultStyle,
  asToutOverlayTitle,
  asToutOverlayCta,
  asToutNoCta,
  asToutNoBodyNoTitle,
} from '../../../components/Tout/token';

const ToutHorizontal = flow(
  asTestableTout('tout-horizontal'),
  asToutDefaultStyle,
  asToutHorizontal,
)(Tout);
const ToutHorizontalNoTitle = flow(
  asTestableTout('tout-horizontal-no-title'),
  asToutDefaultStyle,
  asToutHorizontal,
  asToutNoTitle,
)(Tout);
const ToutVertical = flow(
  asTestableTout('tout-vertical'),
  asToutDefaultStyle,
  asToutVertical,
)(Tout);
const ToutVerticalNoTitle = flow(
  asTestableTout('tout-vertical-no-title'),
  asToutDefaultStyle,
  asToutVertical,
  asToutNoTitle,
)(Tout);
const ToutVerticalNoTitleNoBody = flow(
  asTestableTout('tout-vertical-no-title-no-body'),
  asToutDefaultStyle,
  asToutVertical,
  asToutNoBodyNoTitle,
)(Tout);
const ToutNoTitleNoBodyOverlayCta = flow(
  asTestableTout('tout-no-title-no-body-overlay-cta'),
  asToutDefaultStyle,
  asToutVertical,
  asToutNoBodyNoTitle,
  asToutOverlayCta,
)(Tout);
const ToutOverlayTitleNoBodyNoCta = flow(
  asTestableTout('tout-overlay-title-no-body-no-cta'),
  asToutDefaultStyle,
  asToutVertical,
  asToutOverlayTitle,
  asToutNoBody,
  asToutNoCta,
)(Tout);
const ToutOverlayTitleNoBodyNoCta2 = flow(
  asTestableTout('tout-overlay-title-no-body-no-cta=2'),
  asToutDefaultStyle,
  asToutVertical,
  asToutOverlayTitle,
  asToutNoBody,
  asToutNoCta,
)(Tout);

const ToutOverlaytTitleNoBodyOverlayCta = flow(
  asTestableTout('tout-overlay-title-no-body-overlay-cta'),
  asToutDefaultStyle,
  asToutVertical,
  asToutOverlayTitle,
  asToutNoBody,
  asToutOverlayCta,
)(Tout);
const ToutOverlaytTitleNoBody = flow(
  asTestableTout('tout-overlay-title-no-body'),
  asToutDefaultStyle,
  asToutVertical,
  asToutOverlayTitle,
  asToutNoBody,
)(Tout);

export default props => (
  <Page {...props}>
    <Layout>
      <h1 className="text-3xl font-bold">touts</h1>
      <div className="flex flex-wrap my-3">
        <div className="w-full">
          <ToutHorizontal nodeKey="horizontal" />
        </div>
        <div id="tout-2" className="w-full">
          <ToutHorizontalNoTitle nodeKey="horizontalNoTitle" />
        </div>
        <div className="w-full">
          <ToutNoTitleNoBodyOverlayCta nodeKey="noTitleNoBodyOverlayCta" />
        </div>
        <div className="w-full">
          <ToutOverlayTitleNoBodyNoCta nodeKey="overlayTitlenBodyNoCta" />
        </div>
        <div className="w-full">
          <ToutOverlaytTitleNoBodyOverlayCta nodeKey="overlayTitleNoBodyOverlayCta" />
        </div>
        <div className="w-full lg:w-1/3">
          <ToutVerticalNoTitle nodeKey="verticalNoTitle" />
        </div>
        <div className="w-full lg:w-1/3">
          <ToutVertical nodeKey="vertical" />
        </div>
        <div className="w-full lg:w-1/3">
          <ToutVerticalNoTitleNoBody nodeKey="verticalNoTitleNoBody" />
        </div>
        <div className="w-full lg:w-1/3">
          <ToutOverlayTitleNoBodyNoCta2 nodeKey="overlayTitleNoBodyNoCta2" />
        </div>
        <div className="w-full lg:w-1/3">
          <ToutOverlaytTitleNoBody nodeKey="overlayTitleNoBody" />
        </div>
      </div>
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
