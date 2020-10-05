import React from 'react';
import { v1 } from 'uuid';
import { withDefaultContent } from '@bodiless/core';
import content from './simple-menu-content.json';
import { SimpleMenu } from './SimpleMenu';

type JMenuLink = {
  path: string,
  external: boolean,
  has_children?: boolean,
};

type JMenuItem = {
  title: string,
  link: JMenuLink,
  children: JMenuItem[],
};

type LinkData = {
  href: string,
};

type TextData = {
  text: string,
};

type ChamelionData = {
  component: string,
};

type Entries = {
  [path: string]: LinkData|TextData|ChamelionData|undefined,
};

const translateItems = (items: JMenuItem[], prefix: string = '') => {
  const ids = new Set<string>();
  const entries = items.reduce<Entries>((acc, item) => {
    const id = v1();
    ids.add(id);
    const itemPath = `${prefix}$${id}`;
    const hasLink = Boolean(item.link.path.trim().length);
    return {
      ...acc,
      [`${itemPath}$title$text`]: { text: item.title },
      [`${itemPath}$title$link`]: hasLink ? { href: item.link.path } : undefined,
      [`${itemPath}$title$link-toggle`]: hasLink ? { component: 'Link' } : undefined,
      [`${itemPath}$cham-sublist`]: item.link.has_children ? { component: 'SubMenu' } : undefined,
      ...translateItems(item.children, `${itemPath}$sublist`),
    };
  }, {} as Entries);
  return {
    [`${prefix}`]: { items: Array.from(ids.values()) },
    ...entries,
  };
};

const defaultContent = translateItems(content, 'list2');

export const MenuContent = () => <pre>{JSON.stringify(defaultContent, undefined, 2)}</pre>;

const ContentfulSimpleMenu = withDefaultContent(defaultContent)(SimpleMenu);
// const ContentfulSimpleMenu = SimpleMenu;
export default ContentfulSimpleMenu;
