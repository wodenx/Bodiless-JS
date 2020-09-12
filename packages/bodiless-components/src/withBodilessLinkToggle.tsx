import { Fragment } from 'react';
import {
  withSidecarNodes,
  ifReadOnly, ifEditable, withOnlyProps,
} from '@bodiless/core';
import { flowRight } from 'lodash';
import { replaceWith, withoutProps, withDesign } from '@bodiless/fclasses';
import type { HOC } from '@bodiless/fclasses';
import { applyChamelion, withChamelionComponentFormControls } from './asBodilessChamelion';

const SafeFragment = withOnlyProps('key', 'children')(Fragment);
const Span = withoutProps('')('span');

// type HOC<P = any, Q = any> = (Component: ComponentType<P>|string) => ComponentType<Q>;

const withBodilessLinkToggle = (asLink: HOC) => flowRight(
  withDesign({
    Off: flowRight(
      ifEditable(replaceWith(Span)),
      ifReadOnly(replaceWith(SafeFragment)),
    )
  }),
  withChamelionComponentFormControls('toggle'),
  withSidecarNodes(
    asLink,
  ),
  applyChamelion('toggle'),
);

export default withBodilessLinkToggle;
