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

import Editable, { withPlaceholder, asEditable } from './Editable';
import { asBodilessLink } from './Link';
import Image, {
  asBodilessImage,
  TImagePickerUI,
  withImagePlaceholder,
} from './Image';
import NodeViewer from './NodeViewer';
import withLinkToggle from './LinkToggle';
import List from './List_DEPRECATED';
import asTaggableItem from './Taggable/asTaggableItem';
import withListTitle from './List_DEPRECATED/withListTitle';
import asEditableList from './List_DEPRECATED/asEditableList';
import asBasicSublist from './List_DEPRECATED/asBasicSublist';
import withSublist, { withBasicSublist } from './List_DEPRECATED/withSublist';
import withDeleteSublistOnUnwrap from './List_DEPRECATED/withDeleteSublistOnUnwrap';
import {
  withMeta, withMetaStatic, withMetaHtml, withTitle,
} from './Meta/Meta';
import withMetaForm, { withMetaSnippet } from './Meta/withMetaForm';
import type { FieldType as MetaFormFieldType } from './Meta/withMetaForm';
import asBodilessHelmet from './Helmet/Helmet';
import withEvent from './GTM/gtm';
import { withToggle, withToggleTo, withToggleButton } from './Toggle';
import withEditPlaceholder from './Placeholder';
import { TagButtonProps, withTagButton, useTagsAccessors } from './TagButton';
import withFilterByTags from './withFilterByTags';
import asBodilessIframe, {
  asBaseBodilessIframe,
  withoutPointerEvents,
  withIframeFormHeader,
  withIframeFormHeightSnippet,
  withIframeFormSrcSnippet,
  useIframeBodilessOptions,
} from './Iframe';
import YouTube, {
  asBaseBodilessYouTube,
  asBodilessYouTube,
  withYouTubeFormHeader,
  withYouTubePlayerSettings,
  withYouTubeFormSrcSnippet,
  withYouTubePlayerTransformer,
  useYouTubePlayerAPI,
  withYouTubePlayerAPI,
  ifYouTubePlayerAPILoaded,
  ifNotYouTubePlayerAPILoaded,
  YouTubePlayerAPIProvider,
} from './YouTube';
import type { YouTubePlayerSettings } from './YouTube';
import PageDimensionsProvider, {
  usePageDimensionsContext,
  withPageDimensionsContext,
  BreakpointsType,
} from './PageDimensionsProvider';
import {
  ifViewportIs,
  ifViewportIsNot,
} from './withResponsiveToggle';
import asBreadcrumb, { useBreadcrumbContext } from './asBreadcrumb';
import withBodilessLinkToggle from './withBodilessLinkToggle';

export {
  withBodilessLinkToggle,
  asBodilessLink,
  Image,
  asBodilessImage,
  withImagePlaceholder,
  TImagePickerUI,
  Editable,
  NodeViewer,
  withLinkToggle,
  List,
  asEditableList,
  asBasicSublist,
  withBasicSublist,
  withSublist,
  withDeleteSublistOnUnwrap,
  withListTitle,
  withToggle,
  withToggleTo,
  withToggleButton,
  withPlaceholder,
  asEditable,
  withMeta,
  withTitle,
  withMetaStatic,
  withMetaHtml,
  asBodilessHelmet,
  withEditPlaceholder,
  withEvent,
  withTagButton,
  TagButtonProps,
  asTaggableItem,
  withFilterByTags,
  useTagsAccessors,
  asBaseBodilessIframe,
  asBodilessIframe,
  withoutPointerEvents,
  withIframeFormHeader,
  withIframeFormHeightSnippet,
  withIframeFormSrcSnippet,
  useIframeBodilessOptions,
  asBaseBodilessYouTube,
  asBodilessYouTube,
  withYouTubePlayerSettings,
  withYouTubePlayerTransformer,
  withYouTubeFormSrcSnippet,
  withYouTubeFormHeader,
  useYouTubePlayerAPI,
  withYouTubePlayerAPI,
  ifYouTubePlayerAPILoaded,
  ifNotYouTubePlayerAPILoaded,
  YouTubePlayerAPIProvider,
  YouTube,
  PageDimensionsProvider,
  usePageDimensionsContext,
  withPageDimensionsContext,
  BreakpointsType,
  ifViewportIs,
  ifViewportIsNot,
  withMetaForm,
  withMetaSnippet,
  asBreadcrumb,
  useBreadcrumbContext,
};

export * from './Chameleon/index';
export * from './List';

export type { MetaFormFieldType, YouTubePlayerSettings };
