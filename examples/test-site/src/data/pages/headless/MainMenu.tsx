/* eslint-disable max-len */
import React from 'react';
import {
  withDefaultContent, withNodeKey,
} from '@bodiless/core';
import { useStaticQuery, graphql } from 'gatsby';
import { flow, omit } from 'lodash';
import { SimpleMenu } from '../../../components/MegaMenu/SimpleMenu';
import { DefaultContentPrinter } from './DataPrinter';

type CMenuLink = {
  path: string,
  external: boolean,
};

type CMenuItem = {
  title: string,
  link: CMenuLink,
  submenu: CMenuItem[],
};

type CMenuItemNode = {
  node: Omit<CMenuItem, 'children'> & { alternative_children: CMenuItem[] }
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

const translateItems = (items: CMenuItem[], prefix: string = '') => {
  if (!items) return {};
  const ids = new Set<string>();
  const entries = items.reduce<Entries>((acc, item, id) => {
    ids.add(`${id}`);
    const itemPath = `${prefix}$${id}`;
    const hasLink = Boolean(item.link && item.link.path.trim().length);
    const hasChildren = Boolean(item.submenu && item.submenu.length > 0);
    return {
      ...acc,
      [`${itemPath}$title$text`]: { text: item.title },
      [`${itemPath}$title$link`]: hasLink ? { href: item.link.path } : undefined,
      [`${itemPath}$title$link-toggle`]: hasLink ? { component: 'Link' } : undefined,
      [`${itemPath}$cham-sublist`]: hasChildren ? { component: 'SubMenu' } : undefined,
      ...translateItems(item.submenu, `${itemPath}$sublist`),
    };
  }, {} as Entries);
  return {
    [`${prefix}`]: { items: Array.from(ids.values()) },
    ...entries,
  };
};

const useDefaultContent = () => {
  const data = useStaticQuery(graphql`
    query Navigation {
      allNav(filter: {id: {ne: "dummy"}}) {
        edges {
          node {
            link {
    
              path
            }
            title
            submenu {
              link {
    
                path
              }
              title
            }
          }
        }
      }
    }`);
  const normalizedData = data.allNav.edges.map((item: CMenuItemNode) => item.node);
  // const normalizedData = data.allNav.edges.map((item: CMenuItemNode) => ({
  //   ...omit(item.node, 'alternative_children'),
  //   // title: item.node.title,
  //   // link: item.node.link,
  //   children: item.node.alternative_children,
  // }));
  return translateItems(normalizedData, 'menu');
};

export const MenuContent = () => (
  <DefaultContentPrinter title="API Menu Data" content={useDefaultContent()} />
);

const MainMenu = flow(
  withNodeKey('menu'),
  withDefaultContent(useDefaultContent),
)(SimpleMenu);

export default MainMenu;
