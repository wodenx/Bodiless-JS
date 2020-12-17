import React, {
  FC, ReactElement, ComponentType,
} from 'react';
import { asBodilessList, ListDesignableComponents } from '@bodiless/components';
import { flow } from 'lodash';
import {
  replaceWith, withDesign, designable,
} from '@bodiless/fclasses';
import { AsBodiless } from '@bodiless/core';
import {
  TabsProps, TabItemComponents, TabItemProps, ShowAs,
} from './types';

const tabItemComponents: TabItemComponents = {
  TabName: 'span' as any as ComponentType<any>,
  TabContent: 'span' as any as ComponentType<any>,
};
const TabItemBase: FC<TabItemProps> = props => {
  const {
    components, showAs, children, ...rest
  } = props;
  const { TabName, TabContent } = components;
  return showAs === ShowAs.TabName
    ? <TabName {...rest} />
    : <TabContent />;
};
const TabItem = designable(tabItemComponents, 'TabItem')(TabItemBase);

const asTabWrapper = (TabsComponent: ComponentType<TabsProps>) => {
  const TabWrapper: FC = ({ children, ...rest }) => {
    const tabs = React.Children.map(children, (child: ReactElement) => ({
      tabName: React.cloneElement(child, { showAs: ShowAs.TabName }),
      tabContent: React.cloneElement(child, { showAs: ShowAs.TabContent }),
      key: `${child.key}`,
    }));
    return <TabsComponent {...rest} tabs={tabs} />;
  };
  return TabWrapper;
};

const asBodilessTabs: AsBodiless<TabsProps, any> = nodeKeys => flow(
  asBodilessList(nodeKeys, undefined, () => ({ groupLabel: 'Tab' })),
  withDesign<ListDesignableComponents>({
    Item: replaceWith(TabItem),
    Wrapper: asTabWrapper,
  }),
);

export default asBodilessTabs;
