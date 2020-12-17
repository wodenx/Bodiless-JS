import { ReactNode, ComponentType } from 'react';
import { DesignableComponentsProps } from '@bodiless/fclasses';

type Tab = {
  // Note the material-kit tabName prop seems to be a string. In order for
  // this implementation to work we must pass it a react node (so we can
  // render it as editable and attach the +/- buttons to it.
  tabName: ReactNode;
  tabContent: ReactNode;
  key: string;
};
export type TabsProps = { tabs: Tab[]; };
export enum ShowAs {
  TabName,
  TabContent
}
export type TabItemComponents = {
  TabName: ComponentType<any>;
  TabContent: ComponentType<any>;
};
export type TabItemProps = DesignableComponentsProps<TabItemComponents> & {
  showAs: ShowAs;
};
