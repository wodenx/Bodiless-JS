import React, { HTMLProps } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { withDefaultContent, withNodeKey } from '@bodiless/core';
import { flow } from 'lodash';
// import content from './taco-content.json';
import { FlowContainer } from '@bodiless/layouts-ui';
import { DefaultContentPrinter } from '../../data/pages/headless/DataPrinter';
import withHeadlessTouts from './withHeadlessTouts';
import { asFlowContainerWithMargins } from '../FlowContainer/token';

type CImage = {
  alt: string,
  src: string,
};

type CLink = {
  href: string,
  title: string,
};

type CTaco = {
  title: string,
  description: string,
  edit_link: string,
  image: CImage,
  group: string,
  link: CLink,
  title_wrapper: string,
  view_mode: string,
  width: string,
};

const mapWidthToClass = (width: string) => {
  const map = {
    '33%': 'lg:w-1/3',
    '50%': 'lg:w-1/2',
  };
  return map[width] || 'lg:w-full';
};

const getItem = (taco: CTaco) => ({
  wrapperProps: {
    className: mapWidthToClass(taco.width),
  },
  type: 'HeadlessToutVertical',
});

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

const buildEditLink = (item: CTaco) => {
  const img = new URL(item.image.src);
  img.hostname = `edit-${img.hostname}`;
  img.protocol = 'https';
  const edit = new URL(item.edit_link, img.href);
  return edit.href;
};

export const translateItems = (items: CTaco[], prefix = '') => {
  const entries = items.reduce<any>((acc, item, index) => ({
    ...acc,
    [`${prefix}$${index}$image`]: item.image,
    [`${prefix}$${index}$title`]: plainTextToSlate(item.title),
    [`${prefix}$${index}$body`]: plainTextToSlate(item.description),
    [`${prefix}$${index}$ctatext`]: plainTextToSlate(item.link.title),
    [`${prefix}$${index}$link`]: { href: item.link.href },
    [`${prefix}$${index}$edit-url`]: { url: buildEditLink(item) },
  }), {});
  return {
    [`${prefix}`]: { items: items.map((item, index) => ({ uuid: `${index}`, ...getItem(item) })) },
    ...entries,
  };
};

const useTacoListData = () => {
  const data = useStaticQuery(graphql`
    query TacoListQuery {
      pages {
        taco_list {
          content {
            description
            edit_link
            image {
              alt
              src
            }
            group
            link {
              href
              title
            }
            title
            title_wrapper
            view_mode
            width
          }
        }
      }
    }
  `);
  return translateItems(data.pages.taco_list.content, 'tacos-1');
};

export const TacoContent = (props: HTMLProps<HTMLDivElement>) => (
  <DefaultContentPrinter title="API Taco Data" content={useTacoListData()} {...props} />
);

const TacoContainer = flow(
  withHeadlessTouts,
  asFlowContainerWithMargins,
  withNodeKey('tacos-1'),
  withDefaultContent(useTacoListData),
)(FlowContainer);

export default TacoContainer;
