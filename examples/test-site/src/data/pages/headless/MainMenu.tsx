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
  has_children?: boolean,
};

type CMenuItem = {
  title: string,
  link: CMenuLink,
  children: CMenuItem[],
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
    const hasChildren = Boolean(item.children && item.children.length > 0);
    return {
      ...acc,
      [`${itemPath}$title$text`]: { text: item.title },
      [`${itemPath}$title$link`]: hasLink ? { href: item.link.path } : undefined,
      [`${itemPath}$title$link-toggle`]: hasLink ? { component: 'Link' } : undefined,
      [`${itemPath}$cham-sublist`]: hasChildren ? { component: 'SubMenu' } : undefined,
      ...translateItems(item.children, `${itemPath}$sublist`),
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
              external
              path
            }
            title
            alternative_children {
              link {
                external
                path
              }
              title
            }
          }
        }
      }
    }`);
  const normalizedData = data.allNav.edges.map((item: CMenuItemNode) => ({
    ...omit(item.node, 'alternative_children'),
    // title: item.node.title,
    // link: item.node.link,
    children: item.node.alternative_children,
  }));
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

/* Sample API Response:
https://ghn3btyvqf.execute-api.ap-southeast-1.amazonaws.com/dev/v1/content/imodium/au/en/navigation/main-menu

[
    {
        "title": "Home",
        "link": {
            "path": "home",
            "external": true,
            "has_children": false
        },
        "children": []
    },
    {
        "title": "Causes of Diarrhoea",
        "link": {
            "path": "common-causes-frequent-diarrhoea",
            "external": false,
            "has_children": true
        },
        "children": [
            {
                "title": "Understanding Diarrhoea",
                "link": {
                    "path": "causes-of-frequent-diarrhoea/understanding-diarrhoea",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Stress and Anxiety",
                "link": {
                    "path": "causes-of-frequent-diarrhoea/stress-and-anxiety",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Food Allergies & Intolerance",
                "link": {
                    "path": "causes-of-frequent-diarrhoea/food-allergies",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Eating Habits",
                "link": {
                    "path": "causes-of-frequent-diarrhoea/eating-habits-diet-tips",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Menstruation",
                "link": {
                    "path": "causes-of-frequent-diarrhoea/menstruation",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Stomach Infection",
                "link": {
                    "path": "causes-of-frequent-diarrhoea/stomach-infection",
                    "external": false
                },
                "children": []
            }
        ]
    },
    {
        "title": "Types of Diarrhoea",
        "link": {
            "path": "types-of-diarrhoea",
            "external": false,
            "has_children": true
        },
        "children": [
            {
                "title": "Children and Diarrhoea",
                "link": {
                    "path": "types-of-diarrhoea/children",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Gastroenteritis (gastro)",
                "link": {
                    "path": "types-of-diarrhoea/gastroenteritis",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Diarrhoea During Pregnancy",
                "link": {
                    "path": "types-of-diarrhoea/pregnancy",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Frequent Diarrhoea",
                "link": {
                    "path": "types-of-diarrhoea/frequent",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Travellers' Diarrhoea",
                "link": {
                    "path": "types-of-diarrhoea/travellers",
                    "external": false
                },
                "children": []
            }
        ]
    },
    {
        "title": "Treatment of Diarrhoea",
        "link": {
            "path": "treatment",
            "external": false,
            "has_children": true
        },
        "children": [
            {
                "title": "Why Treat Diarrhoea",
                "link": {
                    "path": "treatment/why-treat-diarrhoea",
                    "external": false
                },
                "children": []
            },
            {
                "title": "How to Treat Diarrhoea",
                "link": {
                    "path": "treatment/how-to-treat-diarrhoea",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Advice - Food",
                "link": {
                    "path": "treatment/healthy-food",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Advice - Mood",
                "link": {
                    "path": "treatment/mood",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Advice - Movement",
                "link": {
                    "path": "treatment/movement",
                    "external": false
                },
                "children": []
            }
        ]
    },
    {
        "title": "IMODIUM® Products",
        "link": {
            "path": "imodium-products",
            "external": false,
            "has_children": true
        },
        "children": [
            {
                "title": "How IMODIUM® Products Work",
                "link": {
                    "path": "treatment/how-imodium-works",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Which IMODIUM® Product is Right for Me?",
                "link": {
                    "path": "products/imodium-products",
                    "external": false
                },
                "children": []
            },
            {
                "title": "Where To Buy IMODIUM®",
                "link": {
                    "path": "imodium-products/where-to-buy-diarrhoea-relief-products",
                    "external": false
                },
                "children": []
            }
        ]
    },
    {
        "title": "FAQ: Ask IMODIUM®",
        "link": {
            "path": "diarrhoea-faq",
            "external": false,
            "has_children": false
        },
        "children": []
    }
]
*/
