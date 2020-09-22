/**
 * Copyright © 2019 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FC, ComponentType } from 'react';
import { observer } from 'mobx-react-lite';
import Tooltip from 'rc-tooltip';

import { useEditContext } from '../hooks';
import { useUI } from './PageEditor';
import { TMenuOption } from '../Types/ContextMenuTypes';

/**
 * @private
 *
 * Purpose of this event handler to control a case when the tooltip shows on a component
 * that became invisible for any reason and the tooltip positioned to the top-left corner
 * of the screen.
 *
 * @param domNode The element to which the popup is attached.
 */
const onPopupAlign = (domNode: Element) => {
  const element = domNode as HTMLElement;
  if (element.getBoundingClientRect().left <= 0) {
    element.style.visibility = 'hidden';
  } else {
    element.style.visibility = 'visible';
  }
};

// const findInnerContext = (options: TMenuOption[]): PageEditContextInterface|undefined => {
//   let innerContext: PageEditContextInterface|undefined;
//   const isDescendant = (c: PageEditContextInterface|undefined): boolean => {
//     if (!c) return false;
//     if (!innerContext) return true;
//     if (c === innerContext) return false;
//     for (let c$ = c.parent; c$; c$ = c$.parent) {
//       if (c$ === c) return true;
//     }
//     return false;
//   };
//   options.forEach(op => {
//     if (isDescendant(op.context)) innerContext = op.context;
//   });
//
//   return innerContext;
// };

const filterOptions = (initialOptions: TMenuOption[]) => {
  const options = new Map<string, TMenuOption>();
  initialOptions.forEach(op => {
    if (op.local) options.set(op.name, op);
  });
  return options;
};

const recordNamedGroups = (options: Map<string, TMenuOption>) => {
  const groups = new Set<string>();
  options.forEach(op => {
    if (op.group) groups.add(op.group);
  });
  return groups;
};

// Set a default group for this context only if:
// - it is not itself a named custom group
// - it does not already belong to a named custom group
// - it has an associated context from which to get group name
const addDefaultGroup = (option: TMenuOption, groups: Set<string>) => {
  if (groups.has(option.name) || option.group || !option.context) return [option];
  const { context } = option;
  const { id: name, name: label } = context;
  const options: TMenuOption[] = [{ ...option, group: name }];
  if (!groups.has(name)) {
    // Create the group and record it so we don't add it twice.
    options.push({
      name, label, context, Component: 'group',
    });
    groups.add(name);
  }
  return options;
};

const useLocalOptions = () => {
  const { contextMenuOptions } = useEditContext();
  const options = filterOptions(contextMenuOptions);
  const groups = recordNamedGroups(options);
  const finalOptions: TMenuOption[] = [];
  options.forEach(op => {
    finalOptions.push(...addDefaultGroup(op, groups));
  });
  return finalOptions;
};

/**
 * @private
 *
 * Renders children inside an rc-tooltip whose overlay contents contain all local menu option icons.
 */
const ContextMenuOverlay = observer<{}>(() => {
  const { LocalContextMenu: Menu } = useUI();
  const options = useLocalOptions();
  return <Menu options={options} />;
});

/*
 * Wraps its children in a tooltip displaying local context menu options, but only if the
 * current context is the innermost context to which a local context menu has been assigned.
 */
const LocalContextMenu: FC = ({ children }) => {
  const context = useEditContext();
  // console.log('render tooltip for', context.name);
  // let the context know it has a localMenu
  context.hasLocalMenu = true;
  const { isInnermostLocalMenu, areLocalTooltipsDisabled } = context;
  // TODO: Only render tooltip when needed. Currently this causes focus issues with editables.
  // (The editable gets the focus, then the tooltip re-renders and creates a new editable
  // which is not focused.  Might be worth investigating this at some point.)
  // if (!isInnermostLocalMenu) {
  //   return <>{children}</>;
  // }
  return (
    <Tooltip
      visible={isInnermostLocalMenu && !areLocalTooltipsDisabled}
      overlay={<ContextMenuOverlay />}
      trigger={[]}
      destroyTooltipOnHide
      placement="bottomLeft"
      onPopupAlign={onPopupAlign}
    >
      {children}
    </Tooltip>
  );
};

export default observer(LocalContextMenu) as ComponentType;
