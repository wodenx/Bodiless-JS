import { asEditableList, List } from '@bodiless/components';
import { WithNodeKeyProps, withNodeKey } from '@bodiless/core';
import { ComponentType } from 'react';
import { flow } from 'lodash';
import { replaceWith, withDesign, asComponent } from '@bodiless/fclasses';

type Data = {
  items?: string[],
};

type ComponentOrTag<P> = ComponentType<P>|keyof JSX.IntrinsicElements;

const asBodilessList = (
  nodeKeys?: WithNodeKeyProps,
  // @TODO - Handle default data
  // defaultData?: Data,
) => <P extends object>(Component: ComponentOrTag<P>) => flow(
  replaceWith(List),
  asEditableList,
  withDesign({
    Wrapper: replaceWith(typeof Component === 'string' ? asComponent(Component) : Component),
  }),
  withNodeKey(nodeKeys),
);

export default asBodilessList;
