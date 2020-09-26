import { v1 } from 'uuid';
import { identity, flow } from 'lodash';
import { withDesign, HOC, Design } from '@bodiless/fclasses';
import { useEditContext, PageEditContextInterface } from '@bodiless/core';
import { useCallback } from 'react';
import { useChamelionContext, asBodilessChamelion } from '../Chamelion';

const hasChildSubList = (context: PageEditContextInterface): boolean => {
  const descendants = context.activeDescendants || [];
  // The first child list is the one to which this toggle applies,
  // so we check to see if more than one.
  return descendants.filter(c => c.type === 'sublist-toggle').length > 1;
};

const useChamelionOverrides = () => {
  const context = useEditContext();
  const { isOn } = useChamelionContext();
  return {
    isHidden: useCallback(() => hasChildSubList(context), []),
    icon: isOn ? 'repeat' : 'playlist_add',
    label: 'Sub',
    name: `chamelion-sublist-${v1()}`,
  };
};

const useToggleOverrides = () => {
  const { isOn } = useChamelionContext();
  const context = useEditContext();
  return {
    isHidden: useCallback(() => isOn || hasChildSubList(context), [isOn]),
    icon: 'playlist_add',
    label: 'Sub',
    name: `chamelion-sublist-${v1()}`,
  };
};

const useOverrides = () => {
  const { selectableComponents } = useChamelionContext();
  return Object.keys(selectableComponents).length > 1
    ? useChamelionOverrides()
    : useToggleOverrides();
};

const asChamelionSubList = asBodilessChamelion('cham-sublist', {}, useOverrides, { type: 'sublist-toggle' });

const withSubListDesign$ = (depth: number) => (design: Design<any>, hoc: HOC = identity): HOC => (
  depth === 0 ? identity
    : withDesign({
      Item: flow(
        hoc,
        withDesign(design),
        withDesign(
          Object.keys(design).reduce(
            (acc, key) => ({ ...acc, [key]: withSubListDesign$(depth - 1)(design, hoc) }),
            {},
          ),
        ),
      ),
    }) as HOC
);

const withSubListDesign = (depth: number) => (
  withDesign$: HOC|Design<any>,
  hoc: HOC = identity,
): HOC => (
  typeof withDesign$ === 'function'
    ? withSubListDesign$(depth)({ On: withDesign$ }, hoc)
    : withSubListDesign$(depth)(withDesign$, hoc)
);

/**
 * Attaches nested chamelion sublists of arbitrary depth to a list.
 *
 * This returns a function which takes a sublist definition, either as a single HOC or a
 * design.  If a single HOC is provided, the effect is a single sublist type which can
 * be toggled on and off.  If a design is provided, the effect is a set of different
 * sublist types which can be swapped (eg for different bullet styles).
 *
 * @param Depth The number of nested sublists to attach.
 * @return An function accepting a sublist definition and returning an HOC which adds the sublists.
 */
const withSubLists = (depth: number) => (asSubList$: HOC|Design<any>): HOC => (
  withSubListDesign(depth)(asSubList$, asChamelionSubList)
);
export default asChamelionSubList;
export { withSubLists, withSubListDesign };
