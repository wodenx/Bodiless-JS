import {
  WithNodeKeyProps, withNodeKey, useNode, NodeProvider,
} from '@bodiless/core';
import React, { ComponentType, PropsWithChildren, FC } from 'react';
import { flow } from 'lodash';
import {
  replaceWith, withDesign, asComponent, DesignableComponentsProps, designable,
} from '@bodiless/fclasses';

import asEditableList from './asEditableList';
import BodilessList from '.';

type ComponentOrTag<P> = ComponentType<P>|keyof JSX.IntrinsicElements;

export type TitledItemProps = PropsWithChildren<{
  title: JSX.Element,
}>;

const asTitledItem = <P extends TitledItemProps>(Item: ComponentType<P>) => {
  const TitledItem: ComponentType<P> = ({ children, ...rest }) => {
    // prepare and pass the submenu title as a prop according to rc-menu <SubMenu /> specification
    // wrap the title with current node,
    // otherwise the title will read data from incorrect node when it is rendered by <SubMenu />
    const { node } = useNode();
    const children$ = <NodeProvider node={node}>{children}</NodeProvider>;
    return (
      <Item title={children$} {...rest as any} />
    );
  };
  return TitledItem;
};

type SubListComponents = {
  WrapperItem: ComponentType<any>,
  List: ComponentType<any>,
};

const startComponents: SubListComponents = {
  WrapperItem: asComponent('li'),
  List: asComponent('ul'),
};

type SubListProps = TitledItemProps & DesignableComponentsProps<SubListComponents>;

const SubList$: FC<SubListProps> = ({
  title, children, components, ...rest
}) => {
  const { WrapperItem, List } = components;
  return (
    <WrapperItem {...rest}>
      {title}
      <List>
        {children}
      </List>
    </WrapperItem>
  );
};

const SubList = designable(startComponents)(SubList$);

const asBodilessList = (
  nodeKeys?: WithNodeKeyProps,
  // @TODO - Handle default data
  // defaultData?: Data,
) => <P extends object>(Component: ComponentOrTag<P>) => flow(
  replaceWith(BodilessList),
  asEditableList,
  withDesign({
    Wrapper: replaceWith(typeof Component === 'string' ? asComponent(Component) : Component),
  }),
  withNodeKey(nodeKeys),
)(Component);

const asSubList = flow(
  asBodilessList(),
  withDesign({
    Wrapper: replaceWith(SubList),
  }),
  asTitledItem,
);

export default asBodilessList;
export { asSubList, asTitledItem };
