import { useChamelionContext, asBodilessChamelion } from '../Chamelion';

const useChamelionOverrides = () => {
  const { isOn } = useChamelionContext();
  return {
    icon: isOn ? 'repeat' : 'playlist_add',
    label: 'Sub',
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
  };
};

// Defines the sublist type for the top level menu items.
const asToggledSubList = asBodilessChamelion('cham-sublist', {}, useToggleOverrides);

export default asChamelionSubList;
export { asToggledSubList };
