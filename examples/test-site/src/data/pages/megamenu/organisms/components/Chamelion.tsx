import React, { FC, ComponentType } from 'react';
import { DesignableComponents, extendDesignable } from '@bodiless/fclasses';
import {
  useMenuOptionUI, asBodilessComponent, BodilessOptions,
  withSidecarNodes, WithNodeKeyProps, EditButtonOptions, useNode,
} from '@bodiless/core';
import { flowRight } from 'lodash';

type NodeDataHandlers<D> = {
  setComponentData: (data: D) => void,
  componentData: D,
};

export type ChamelionData = {
  component?: string,
};

export type ChamelionProps = ChamelionData & {
  components: DesignableComponents,
};

const asChamelion = <P extends object>(Component: ComponentType<P>|string) => {
  const Chamelion: FC<P & ChamelionProps> = props => {
    const { node } = useNode();
    const unwrap = () => node.delete();
    const { component, components, ...rest } = props;
    const NewComponent = component && components[component];
    return NewComponent ? <NewComponent {...rest} unwrap={unwrap} /> : <Component {...rest as P} />;
  };
  return Chamelion;
};

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
      <ComponentFormLabel key={name}>
        <ComponentFormRadio value={name} />
        {/* @ts-ignore @TODO Fix this, components need to have attributes */}
        {components[name].title || name}
      </ComponentFormLabel>
    ));
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

type EditProps = ChamelionProps & NodeDataHandlers<ChamelionData>;

const asBodilessChamelion = (
  nodeKeys?: WithNodeKeyProps,
  defaultData?: ChamelionData,
  overrides?: (props: EditProps) => Partial<EditButtonOptions<EditProps, ChamelionData>>,
) => flowRight(
  extendDesignable()({}),
  withSidecarNodes(
    asBodilessComponent(options)(nodeKeys, defaultData, overrides),
  ),
  asChamelion,
);

export default asBodilessChamelion;
