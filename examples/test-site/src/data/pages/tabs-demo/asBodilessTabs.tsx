import React, {
  ReactNode, FC, ReactElement, ComponentType,
} from 'react';
import { asBodilessList, ListDesignableComponents } from '@bodiless/components';
import { flow } from 'lodash';
import {
  replaceWith, withDesign, DesignableComponentsProps, designable,
} from '@bodiless/fclasses';
import { AsBodiless } from '@bodiless/core';

type Tab = {
  tabName: ReactNode;
  tabContent: ReactNode;
  key: string;
};

type TabsProps = { tabs: Tab[]; };

export const MockTabs = ({ tabs }: TabsProps) => {
  const elems = tabs.map(tab => (
    <div key={tab.key} className="w-1/6 border p-1 m-1">
      <div className="border-bottom bg-teal-700 text-white">
        {tab.tabName}
      </div>
      <div>
        {tab.tabContent}
      </div>
    </div>
  ));
  return (
    <div className="flex w-100">{elems}</div>
  );
};
enum ShowAs {
  TabName,
  TabContent
}
type TabItemComponents = {
  TabName: ComponentType<any>;
  TabContent: ComponentType<any>;
};
type TabItemProps = DesignableComponentsProps<TabItemComponents> & {
  showAs: ShowAs;
};
const TabItemComponents: TabItemComponents = {
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
const TabItem = designable(TabItemComponents, 'TabItem')(TabItemBase);

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

export const asBodilessTabs: AsBodiless<TabsProps, any> = nodeKeys => flow(
  asBodilessList(nodeKeys, undefined, () => ({ groupLabel: 'Tab' })),
  withDesign<ListDesignableComponents>({
    Item: replaceWith(TabItem),
    Wrapper: asTabWrapper,
  }),
);

// const TabWrapper = asTabWrapper(MockTabs);
// export const EditableTabs = flow(
//   asBodilessList('listData'),
//   withDesign({
//     Item: flow(
//       replaceWith(TabItem),
//       withDesign<TabItemComponents>({
//         TabName: asEditable('title', 'Title'),
//         TabContent: asEditable('content', 'Content'),
//       }),
//     ),
//   }),
// )(TabWrapper);
