import type { TMenuOption, EditButtonProps } from '@bodiless/core';
import {
  DesignableComponentsProps,
  DesignableComponents,
} from '@bodiless/fclasses';

export type ChamelionData = {
  component?: string | null;
};

export type ChamelionComponents = DesignableComponents;

export type ChamelionState = {
  isOn: boolean,
  activeComponent: string,
  setActiveComponent: (key: string|null) => void,
  selectableComponents: Partial<ChamelionComponents>,
};

export type ChamelionProps =
  EditButtonProps<ChamelionData> & DesignableComponentsProps<ChamelionComponents>;
export type ChamelionButtonProps = ChamelionProps & EditButtonProps<ChamelionData>;
export type UseOverrides<P = any> = (props: P) => Partial<TMenuOption>;
