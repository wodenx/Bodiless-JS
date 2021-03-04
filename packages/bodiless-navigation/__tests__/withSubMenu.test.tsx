/**
 * Copyright © 2020 Johnson & Johnson
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

/* eslint-disable quote-props */
import React from 'react';
import { flow } from 'lodash';
import { withDesign, addProps } from '@bodiless/fclasses';
import { withDefaultContent } from '@bodiless/core';
import { mount } from 'enzyme';

import {
  asBodilessMenu, withListSubMenu, withMenuDesign, withColumnSubMenu, withToutSubMenu,
  withColumnSubMenuDesign,
} from '../src';

describe('Bodiless Menu', () => {
  const withTopMenuItems = (...items: string[]) => {
    const menuItems = items.map((item, i) => ({ title: item, nodeKey: i === 0 ? 'default' : item.replace(' ', '_').toLowerCase() }));
    const mappedItems = menuItems.reduce((acc, item) => ({
      ...acc,
      [`testMenu$${item.nodeKey}$title$text`]: { text: item.title },
    }), {
      testMenu: { items: [...menuItems.map(item => item.nodeKey)] },
    });

    return withDefaultContent(mappedItems);
  };

  const withSubmenuItems = (submenuType: string = 'List') => (...items: string[]) => {
    const menuItems = items.map((item, i) => ({ title: item, nodeKey: i === 0 ? 'default' : item.replace(' ', '_').toLowerCase() }));
    const mappedItems = menuItems.reduce((acc, item) => ({
      ...acc,
      [`testMenu$default$sublist$${item.nodeKey}$title$text`]: { text: item.title },
    }), {});

    const sublistStructure = {
      'testMenu$default$cham-sublist': { component: submenuType },
      'testMenu$default$sublist': { items: [...menuItems.map(item => item.nodeKey)] },
    };

    return withDefaultContent({ ...sublistStructure, ...mappedItems });
  };

  const withColumnSubMenuItems = (...items: string[]) => {
    const menuItems = items.map((item, i) => ({ title: item, nodeKey: i === 0 ? 'default' : item.replace(/ /g, '_').toLowerCase() }));
    const mappedItems = menuItems.reduce((acc, item) => ({
      ...acc,
      [`testMenu$default$sublist$default$sublist$${item.nodeKey}$title$text`]: { text: item.title },
    }), {});

    const sublistStructure = {
      'testMenu$default$cham-sublist': { component: 'Columns' },
      'testMenu$default$sublist$default$cham-sublist': { component: 'SubList' },
      'testMenu$default$sublist$default$sublist': { items: [...menuItems.map(item => item.nodeKey)] },
      'testMenu$default$sublist$default$title$text': { text: 'Column 1' },
    };

    return withDefaultContent({ ...sublistStructure, ...mappedItems });
  };

  const withTopMenuDesign = withDesign({
    Wrapper: addProps({ 'data-test': 'menu-wrapper' }),
    Item: addProps({ 'data-test': 'menu-item' }),
    Title: addProps({ 'data-test': 'menu-title' }),
  });

  const withSubMenuDesign = (submenuType: string = 'List') => withMenuDesign(submenuType)(
    withDesign({
      Wrapper: addProps({ 'data-test-submenu': `${submenuType.toLowerCase()}-submenu` }),
      Title: addProps({ 'data-test-submenu': `${submenuType.toLowerCase()}-submenu-title` }),
      Item: addProps({ 'data-test-submenu': `${submenuType.toLowerCase()}-submenu-item` }),
    }),
  );

  const BaseMenu = asBodilessMenu('testMenu')('ul');

  it('Creates a one level menu by default', () => {
    const menuItems = ['Item 1', 'Item 2', 'Item 3'];
    const DefaultMenu = flow(
      withTopMenuDesign,
      withTopMenuItems(...menuItems),
    )(BaseMenu);

    const wrapper = mount(<DefaultMenu />);
    expect(wrapper.find('li[data-test="menu-item"]').length).toBe(3);

    const menuTitles = wrapper.find('div[data-test="menu-title"]');
    expect(menuTitles.length).toBe(menuItems.length);

    menuTitles.forEach((title, i) => expect(title.text()).toBe(menuItems[i]));
  });

  it('withListSubMenu may be used to add a List submenu', () => {
    const subMenuItems = ['List 1', 'List 2', 'List 3'];
    const MenuWithList = flow(
      withListSubMenu(),
      withSubmenuItems('List')(...subMenuItems),
      withTopMenuDesign,
      withSubMenuDesign('List'),
    )(BaseMenu);

    const wrapper = mount(<MenuWithList />);
    expect(wrapper.find('ul[data-test-submenu="list-submenu"]').length).toBe(1);

    const subMenuTitles = wrapper.find('div[data-test-submenu="list-submenu-title"]');
    expect(subMenuTitles.length).toBe(subMenuItems.length);

    subMenuTitles.forEach((title, i) => expect(title.text()).toBe(subMenuItems[i]));
  });

  it('withColumnSubMenu may be used to add a Columns submenu', () => {
    const subMenuItems = ['Column Submenu 1', 'Column Submenu 2', 'Column Submenu 3'];
    const MenuWithColumns = flow(
      withColumnSubMenu(),
      withColumnSubMenuItems(...subMenuItems),
      withTopMenuDesign,
      withSubMenuDesign('Columns'),
      withMenuDesign('Columns')(
        withColumnSubMenuDesign(
          withDesign({
            Wrapper: addProps({ 'data-test-submenu': 'sub-column-submenu' }),
            Title: addProps({ 'data-test-submenu': 'sub-column-submenu-title' }),
            Item: addProps({ 'data-test-submenu': 'sub-column-submenu-item' }),
          }),
        ),
      ),
    )(BaseMenu);

    const wrapper = mount(<MenuWithColumns />);
    expect(wrapper.find('ul[data-test-submenu="columns-submenu"]').length).toBe(1);
    expect(wrapper.find('ul[data-test-submenu="sub-column-submenu"]').length).toBe(1);

    expect(wrapper.find('div[data-test-submenu="columns-submenu-title"]').length).toBe(1);

    const columnSubMenuTitles = wrapper.find('div[data-test-submenu="sub-column-submenu-title"]');
    expect(columnSubMenuTitles.length).toBe(subMenuItems.length);

    columnSubMenuTitles.forEach((title, i) => expect(title.text()).toBe(subMenuItems[i]));
  });

  it('withToutSubMenu may be used to add a Columns submenu', () => {
    const subMenuItems = ['Tout 1', 'Tout 2', 'Tout 3'];
    const MenuWithTouts = flow(
      withToutSubMenu(),
      withSubmenuItems('Touts')(...subMenuItems),
      withSubMenuDesign('Touts'),
      withTopMenuDesign,
    )(BaseMenu);

    const wrapper = mount(<MenuWithTouts />);
    expect(wrapper.find('ul[data-test-submenu="touts-submenu"]').length).toBe(1);

    const subMenuTouts = wrapper.find('div[data-test-submenu="touts-submenu-title"]');
    expect(subMenuTouts.length).toBe(subMenuItems.length);
  });
});
