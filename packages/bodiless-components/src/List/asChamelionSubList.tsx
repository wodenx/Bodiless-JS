import { identity, flow } from 'lodash';
import { withDesign, HOC, Design } from '@bodiless/fclasses';
import { useChamelionContext, asBodilessChamelion } from '../Chamelion';
import { UseOverrides } from '../Chamelion/types';

const MERGE = true;

const useChamelionOverrides: UseOverrides = () => {
  const { isOn } = useChamelionContext();
  return {
    // eslint-disable-next-line no-nested-ternary
    icon: isOn ? (MERGE ? 'list' : 'repeat') : 'playlist_add',
    groupLabel: 'Sublist',
    // eslint-disable-next-line no-nested-ternary
    label: MERGE ? 'Sub' : (isOn ? 'Swap' : 'Add'),
    groupMerge: MERGE ? 'merge' : 'none',
  };
};

const useToggleOverrides: UseOverrides = () => {
  const { isOn } = useChamelionContext();
  return {
    isHidden: isOn,
    icon: 'playlist_add',
    groupLabel: 'Sublist',
    label: MERGE ? 'Sub' : 'Add',
    groupMerge: MERGE ? 'merge' : 'none',
  };
};

const useOverrides: UseOverrides = (props: any) => {
  const { selectableComponents } = useChamelionContext();
  return Object.keys(selectableComponents).length > 1
    ? useChamelionOverrides(props)
    : useToggleOverrides(props);
};

const asChamelionSubList = asBodilessChamelion('cham-sublist', {}, useOverrides);

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
