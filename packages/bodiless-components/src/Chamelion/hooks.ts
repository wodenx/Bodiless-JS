import { pick } from 'lodash';
import type { ChamelionButtonProps } from './types';

export const DEFAULT_KEY = '_default';

export const useSelectableComponents = (props: ChamelionButtonProps) => {
  const { components } = props;
  // @ts-ignore @TODO need to add metadata to component type
  const keys = Object.keys(components).filter(key => Boolean(components[key].title));
  return pick(components, keys);
};

export const useActiveKey = (props: ChamelionButtonProps) => {
  const { componentData: { component }, components } = props;
  return (component && components[component]) ? component : DEFAULT_KEY;
};

export const useActiveComponent = (props: ChamelionButtonProps) => {
  const { components } = props;
  return components[useActiveKey(props)];
};

export const useIsOn = (props: ChamelionButtonProps) => useActiveKey(props) !== DEFAULT_KEY;
