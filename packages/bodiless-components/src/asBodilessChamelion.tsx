import React, { FC, ComponentType } from 'react';
import {
  DesignableComponents, extendDesignable, asComponent, DesignableComponentsProps,
} from '@bodiless/fclasses';
import {
  useMenuOptionUI, asBodilessComponent, BodilessOptions,
  withSidecarNodes, WithNodeKeyProps, EditButtonOptions, EditButtonProps, AsBodiless, useNode,
} from '@bodiless/core';
import { flowRight } from 'lodash';

export type ChamelionData = {
  component?: string|null,
};

type ChamelionComponents = DesignableComponents & {
  _default: ComponentType<any>,
};

export type ChamelionProps = ChamelionData & DesignableComponentsProps<ChamelionComponents>;

const options: BodilessOptions<ChamelionProps, ChamelionData> = {
  name: 'chamelion-swap',
  label: 'Swap',
  icon: 'repeat',
  global: false,
  local: true,
  Wrapper: 'div',
  defaultData: { component: '' },
  // @TODO: Allow use of a true cmponent selector
  renderForm: ({ componentProps }) => {
    const {
      ComponentFormLabel,
      ComponentFormRadioGroup,
      ComponentFormRadio,
      ComponentFormTitle,
    } = useMenuOptionUI();
    const { components } = componentProps;
    const radios = Object.getOwnPropertyNames(components).map(name => (
      // We only display options for components with titles.
      // @ts-ignore @TODO Fix this, components need to have attributes
      components[name].title && (
        <ComponentFormLabel key={name}>
          <ComponentFormRadio value={name} />
          {/* @ts-ignore @TODO Fix this, components need to have attributes */}
          {components[name].title || name}
        </ComponentFormLabel>
      )
    )).filter(Boolean);
    return (
      <div>
        <ComponentFormTitle>Choose a component</ComponentFormTitle>
        <ComponentFormRadioGroup field="component">
          {radios}
        </ComponentFormRadioGroup>
      </div>
    );
  },
};

type EditProps = ChamelionProps & EditButtonProps<ChamelionData>;

const withUnwrapChamelion = <P extends object>(Component: ComponentType<P>) => {
  const WithUnwrapChamelion = (props: P) => {
    // @TODO: Find a way to have this receive componentData and setComponentData
    const { node } = useNode<ChamelionData>();
    const { component } = node.data;
    if (!component) return <Component {...props} />;
    const unwrap = () => node.setData({ component: null });
    return <Component {...props} unwrap={unwrap} />;
  };
  return WithUnwrapChamelion;
};

const asBodilessChamelion: AsBodiless<ChamelionProps, ChamelionData> = (
  nodeKeys?: WithNodeKeyProps,
  defaultData?: ChamelionData,
  useOverrides?: (props: EditProps) => Partial<EditButtonOptions<ChamelionProps, ChamelionData>>,
) => <P extends object>(
  Component: ComponentType<P>|string,
) => {
  const startComponents = {
    _default: asComponent(Component as ComponentType<P>),
  };
  const Chamelion: FC<P & ChamelionProps> = props => {
    const { component, components, ...rest } = props;
    const NewComponent = components[component || '_default'] || Component;
    return <NewComponent {...rest} />;
  };
  return flowRight(
    extendDesignable()(startComponents),
    withSidecarNodes(
      asBodilessComponent<ChamelionProps, ChamelionData>(options)(
        nodeKeys, defaultData, useOverrides,
      ),
      withUnwrapChamelion,
    ),
  )(Chamelion as any);
};

export default asBodilessChamelion;
