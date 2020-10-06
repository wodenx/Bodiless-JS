import React, { HTMLProps } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { withDefaultContent, withNodeKey } from '@bodiless/core';
import { flow } from 'lodash';
// import content from './taco-content.json';
import { FlowContainerDefault } from '../../../components/FlowContainer';
import { DefaultContentPrinter } from './DataPrinter';

/* eslint-disable max-len */
/* Target Schema (flow container)
tacos-1
{"items":[{"uuid":"bdacbef0-0738-11eb-b926-cddd34bda3ed","wrapperProps":{"className":" lg:w-1/3"},"type":"ToutVerticalWithTitleBodyWithCTA"},{"uuid":"dd6b93b0-0738-11eb-b926-cddd34bda3ed","wrapperProps":{"className":" lg:w-1/3"},"type":"ToutVerticalWithTitleBodyWithCTA"},{"uuid":"d28b2730-0738-11eb-b926-cddd34bda3ed","wrapperProps":{"className":" lg:w-1/3"},"type":"ToutVerticalWithTitleBodyWithCTA"}]}
tacos-1$bdacbef0-0738-11eb-b926-cddd34bda3ed$image
{"src":"/images/pages/headless/0107f5d429b8d9d68c5f97f56d13e70f/Miranda.O.5s.jpg","alt":"Alt Text"}
tacos-1$bdacbef0-0738-11eb-b926-cddd34bda3ed$title
{"document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Title","marks":[]}]}]}]}}
tacos-1$bdacbef0-0738-11eb-b926-cddd34bda3ed$body
{"document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"Body","marks":[]}]}]}]}}
tacos-1$bdacbef0-0738-11eb-b926-cddd34bda3ed$ctatext
{"document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","leaves":[{"object":"leaf","text":"CTA","marks":[]}]}]}]}}
tacos-1$bdacbef0-0738-11eb-b926-cddd34bda3ed$link
{"href":"https://link.com"}
*/

/* Sample API Response:
https://ghn3btyvqf.execute-api.ap-southeast-1.amazonaws.com/dev/v1/content/imodium/au/en/taco-list/home-sections
[
    {
        "title": "Which IMODIUM® product is right for me?",
        "summary": "Not everyone’s situation is the same, so we’ve designed a range of products to suit your needs.",
        "link": {
            "href": "https://www.imodium.com.au/treatment/healthy-food",
            "title": "IMODIUM<sup>®</sup> range",
            "target": "_blank"
        },
        "image": {
            "src": "https://www.imodium.com.au/sites/imodium_au/files/tout_1.9_0.jpg"
        }
    },
    {
        "title": "Which IMODIUM® product is right for me?",
        "summary": "Not everyone’s situation is the same, so we’ve designed a range of products to suit your needs.",
        "link": {
            "href": "https://www.imodium.com.au/treatment/healthy-food",
            "title": "IMODIUM<sup>®</sup> range",
            "target": "_blank"
        },
        "image": {
            "src": "https://www.imodium.com.au/sites/imodium_au/files/tout_1.9_0.jpg"
        }
    },
    {
        "title": "Which IMODIUM® product is right for me?",
        "summary": "Not everyone’s situation is the same, so we’ve designed a range of products to suit your needs.",
        "link": {
            "href": "https://www.imodium.com.au/treatment/healthy-food",
            "title": "IMODIUM<sup>®</sup> range",
            "target": "_blank"
        },
        "image": {
            "src": "https://www.imodium.com.au/sites/imodium_au/files/tout_1.9_0.jpg"
        }
    }
]
*/

type CTacoImage = {
  src: string,
};

type CTacoLink = {
  href: string,
  title: string,
  target: string,
};

type CTaco = {
  title: string,
  summary: string,
  link: CTacoLink,
  image: CTacoImage,
};
type CTacoNode = {
  node: CTaco,
};

const baseItem = {
  wrapperProps: {
    className: 'lg:w-1/3',
  },
  type: 'ToutVerticalWithTitleBodyWithCTA',
};

const plainTextToSlate = (text: string) => ({
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                text,
                marks: [],
              },
            ],
          },
        ],
      },
    ],
  },
});

const translateItems = (items: CTaco[], prefix = '') => {
  const entries = items.reduce<any>((acc, item, index) => ({
    ...acc,
    [`${prefix}$${index}$image`]: item.image,
    [`${prefix}$${index}$title`]: plainTextToSlate(item.title),
    [`${prefix}$${index}$body`]: plainTextToSlate(item.summary),
    [`${prefix}$${index}$ctatext`]: plainTextToSlate(item.link.title),
    [`${prefix}$${index}$link`]: { href: item.link.href },
  }), {});
  return {
    [`${prefix}`]: { items: items.map((item, index) => ({ uuid: `${index}`, ...baseItem })) },
    ...entries,
  };
};

const useTacoListData = () => {
  const data = useStaticQuery(graphql`
    query MyQuery {
      allTacos {
        edges {
          node {
            image {
              src
            }
            title
            summary
            link {
              href
              title
            }
          }
        }
      }
    }
  `);
  const normalizedData = data.allTacos.edges.map((item: CTacoNode) => item.node);
  return translateItems(normalizedData, 'tacos-1');
};

export const TacoContent = (props: HTMLProps<HTMLDivElement>) => (
  <DefaultContentPrinter title="API Taco Data" content={useTacoListData()} {...props} />
);

const TacoContainer = flow(
  withNodeKey('tacos-1'),
  withDefaultContent(useTacoListData),
)(FlowContainerDefault);

export default TacoContainer;
