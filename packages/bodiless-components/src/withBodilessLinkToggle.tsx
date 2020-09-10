import { Fragment } from 'react';
import {
  withSidecarNodes,
  ifReadOnly, ifEditable, withOnlyProps,
} from '@bodiless/core';
import { flowRight } from 'lodash';
import { replaceWith, withoutProps } from '@bodiless/fclasses';
import type { HOC } from '@bodiless/fclasses';
import { withBodilessComponentFormToggle, ifBodilessToggleOff } from './asBodilessToggle';

const SafeFragment = withOnlyProps('key', 'children')(Fragment);
const Span = withoutProps('')('span');

// type HOC<P = any, Q = any> = (Component: ComponentType<P>|string) => ComponentType<Q>;

const withBodilessLinkToggle = (asLink: HOC) => flowRight(
  withBodilessComponentFormToggle('toggle'),
  withSidecarNodes(
    asLink,
  ),
  ifBodilessToggleOff('toggle')(
    ifEditable(replaceWith(Span)),
    ifReadOnly(replaceWith(SafeFragment)),
  ),
);

export default withBodilessLinkToggle;
