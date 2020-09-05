import { ComponentType, Fragment } from 'react';
import {
  withSidecarNodes,
  ifReadOnly, ifEditable, withOnlyProps,
} from '@bodiless/core';
import { flowRight } from 'lodash';
import { replaceWith, asComponent } from '@bodiless/fclasses';
import { withBodilessComponentFormToggle, ifBodilessToggleOff } from './BodilessToggle';

const SafeFragment = withOnlyProps('key', 'children')(Fragment);
const Span = asComponent('span');

type HOC<P = any, Q = any> = (Component: ComponentType<P>|string) => ComponentType<Q>;

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
