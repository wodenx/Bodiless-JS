import type { ComponentType } from 'react';
import type { TMenuOption, EditButtonProps } from '@bodiless/core';
import {
  DesignableComponentsProps,
  DesignableComponents,
} from '@bodiless/fclasses';

export type ChamelionData = {
  component?: string | null;
};

type ChamelionComponents = DesignableComponents & {
  DEFAULT_KEY: ComponentType<any>;
};

export type ChamelionProps =
  EditButtonProps<ChamelionData> & DesignableComponentsProps<ChamelionComponents>;
export type ChamelionButtonProps = ChamelionProps & EditButtonProps<ChamelionData>;
type UseOverrides<P> = (props: P) => Partial<TMenuOption>;
export type UseChamelionOverrides = UseOverrides<ChamelionButtonProps>;
