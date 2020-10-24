import { v1 } from 'uuid';
import { identity, flow } from 'lodash';
import type { EditButtonOptions } from '@bodiless/core';
import {
  withDesign, HOC, Design, withoutProps,
} from '@bodiless/fclasses';
import {
  useChameleonContext, withChameleonContext,
  withChameleonComponentFormControls, applyChameleon, withChameleonButton,
} from '../Chameleon';

const useChameleonOverrides = ():Partial<EditButtonOptions<any, any>> => {
  const { isOn } = useChameleonContext();
  return {
    icon: isOn ? 'repeat' : 'playlist_add',
    name: `chameleon-sublist-${v1()}`,
    label: 'Sub',
    groupMerge: 'merge-up',
    // label: isOn ? 'Swap' : 'Add',
    // groupLabel: 'Sublist',
    formTitle: 'Sublist',
  };
};

const useToggleOverrides = ():Partial<EditButtonOptions<any, any>> => {
  const { isOn } = useChameleonContext();
  return {
    isHidden: isOn,
    icon: 'playlist_add',
    name: `chameleon-sublist-${v1()}`,
    label: 'Sub',
    groupMerge: 'merge-up',
    // label: 'Add',
    // groupLabel: 'Sublist',
    formTitle: 'Sublist',
  };
};

const useOverrides = () => {
  const { selectableComponents } = useChameleonContext();
  return Object.keys(selectableComponents).length > 1
    ? useChameleonOverrides()
    : useToggleOverrides();
};

const asChameleonSubList = flow(
  applyChameleon,
  withoutProps('onSubmit'),
  withChameleonComponentFormControls,
  withChameleonButton(useOverrides),
  withChameleonContext('cham-sublist'),
);

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
    ? withSubListDesign$(depth)({ SubList: withDesign$ }, hoc)
    : withSubListDesign$(depth)(withDesign$, hoc)
);

/**
 * Attaches nested chameleon sublists of arbitrary depth to a list.
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
  withSubListDesign(depth)(asSubList$, asChameleonSubList)
);
export default asChameleonSubList;
export { withSubLists, withSubListDesign };
