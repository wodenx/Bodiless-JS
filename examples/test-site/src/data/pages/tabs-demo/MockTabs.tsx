import React from 'react';
import { TabsProps } from './types';

/**
 * This is standing in for the material-kit tabs component.
 */
const MockTabs = ({ tabs }: TabsProps) => {
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

export default MockTabs;
