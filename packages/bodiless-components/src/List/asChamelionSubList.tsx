import { v1 } from 'uuid';
import { identity, flow } from 'lodash';
import { withDesign, HOC } from '@bodiless/fclasses';
import { useChamelionContext, asBodilessChamelion } from '../Chamelion';

const useChamelionOverrides = () => {
  const { isOn } = useChamelionContext();
  return {
    icon: isOn ? 'repeat' : 'playlist_add',
    label: 'Sub',
    name: `chamelion-sublist-${v1()}`,
  };
};

const useToggleOverrides = () => {
  const { isOn } = useChamelionContext();
  return {
    isHidden: isOn,
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

const asChamelionSubList = asBodilessChamelion('cham-sublist', {}, useOverrides);

const withSubLists = (depth: number) => (asSubList$: HOC): HOC => (
  depth === 0 ? identity
    : withDesign({
      Item: flow(
        asChamelionSubList,
        withDesign({ On: asSubList$ }),
        withDesign({ On: withSubLists(depth - 1)(asSubList$) }),
      ),
    }) as HOC
);

// const withSubLists$$ = (depth: number) => (withSubList$: HOC): HOC => (
//   withSubLists$(depth)({ On: withSubList$ })
// );

const withSubListDesign = (depth: number) => (withDesign$: HOC): HOC => (
  depth === 0 ? identity
    : withDesign({
      Item: withDesign({
        On: flow(
          withDesign$,
          withSubListDesign(depth - 1)(withDesign$),
        ),
      }),
    }) as HOC
);

export default asChamelionSubList;
export { withSubLists, withSubListDesign };
