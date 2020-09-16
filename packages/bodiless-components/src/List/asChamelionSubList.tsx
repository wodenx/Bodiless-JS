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
// Defines the sublist type for the top level menu items.
const asChamelionSubList = asBodilessChamelion('cham-sublist', {}, useChamelionOverrides);

// Provides overrides for the chamelion button
const useToggleOverrides = () => {
  const { isOn } = useChamelionContext();
  return {
    isHidden: isOn,
    icon: 'playlist_add',
    label: 'Sub',
    name: `chamelion-sublist-${v1()}`,
  };
};

// Defines the sublist type for the top level menu items.
const asToggledSubList = asBodilessChamelion('cham-sublist', {}, useToggleOverrides);

const withSubLists = (depth: number) => (asSubList$: HOC): HOC => (
  depth === 0 ? identity
    : withDesign({
      Item: flow(
        asToggledSubList,
        withDesign({
          On: flow(
            asSubList$,
            withSubLists(depth - 1)(asSubList$),
          ),
        }),
      ),
    }) as HOC
);

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
export { asToggledSubList, withSubLists, withSubListDesign };
