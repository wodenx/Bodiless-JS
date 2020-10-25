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

import React, { ComponentType, HTMLProps } from 'react';
import { useNode } from '@bodiless/core';
import type { WithNodeKeyProps, WithNodeProps } from '@bodiless/core';
import { asComponent, designable } from '@bodiless/fclasses';
import { observer } from 'mobx-react-lite';
import { flowRight } from 'lodash';
import type { BreadcrumbItemType as BreadcrumbStoreItemType } from './BreadcrumbStore';
import { useBreadcrumbStore } from './BreadcrumbStoreProvider';

type BreadCrumbComponents = {
  StartingTrail: ComponentType<HTMLProps<HTMLSpanElement>> | null,
  Separator: ComponentType<HTMLProps<HTMLSpanElement>>,
  BreadcrumbWrapper: ComponentType<HTMLProps<HTMLUListElement>>,
  BreadcrumbItem: ComponentType<HTMLProps<HTMLLIElement>>,
  BreadcrumbLink: ComponentType<HTMLProps<HTMLAnchorElement> & WithNodeKeyProps>,
  BreadcrumbTitle: ComponentType<HTMLProps<HTMLSpanElement> & WithNodeKeyProps>,
  FinalTrail: ComponentType<HTMLProps<HTMLSpanElement>> | null,
};

type BreadcrumbItemKeys = {
  uuid: string;
  title: WithNodeProps;
  link: WithNodeProps;
};

type DesignableComponents = {
  [key: string]: ComponentType<any> | null,
};
type DesignableComponentsProps<C extends DesignableComponents> = {
  components: C,
};

type BreadcrumbProps = DesignableComponentsProps<BreadCrumbComponents> & {
  items?: BreadcrumbItemKeys[],
  hasLastItem?: boolean | (() => boolean),
} & WithNodeProps;

const BreadcrumbClean$ = (props: BreadcrumbProps) => {
  const {
    components,
    items = [],
    hasLastItem,
  } = props;
  const {
    StartingTrail,
    Separator,
    BreadcrumbWrapper,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbTitle,
    FinalTrail,
  } = components;
  const items$ = items.map((item: BreadcrumbItemKeys, index: number) => (
    <>
      <BreadcrumbItem key={item.uuid}>
        <BreadcrumbLink nodeKey={item.link.nodeKey} nodeCollection={item.link.nodeCollection}>
          <BreadcrumbTitle
            nodeKey={item.title.nodeKey}
            nodeCollection={item.title.nodeCollection}
          />
        </BreadcrumbLink>
      </BreadcrumbItem>
      {index <= items.length - 1 && <Separator key={`separator${item.uuid}`} />}
    </>
  ));
  const hasLastItem$ = (typeof hasLastItem === 'function' ? hasLastItem() : hasLastItem) || true;
  return (
    <BreadcrumbWrapper>
      { StartingTrail
        && (
        <>
          <BreadcrumbItem key="startingTrail">
            <StartingTrail />
          </BreadcrumbItem>
          <Separator key="startingTrailSeparator" />
        </>
        )}
      {items$}
      { FinalTrail && !hasLastItem$
        && (
        <>
          <Separator key="finalTrailSeparator" />
          <BreadcrumbItem key="finalTrail">
            <FinalTrail />
          </BreadcrumbItem>
        </>
        )}
    </BreadcrumbWrapper>
  );
};

const BreadcrumbClean = designable({
  Separator: asComponent('span'),
  BreadcrumbWrapper: asComponent('ul'),
  BreadcrumbItem: asComponent('li'),
  BreadcrumbLink: asComponent('a'),
  BreadcrumbTitle: asComponent('span'),
})(BreadcrumbClean$);

const withBreadcrumbItemsFromStore = (Component: ComponentType<BreadcrumbProps>) => {
  const WithBreadcrumbItemsFromStore = (props: BreadcrumbProps) => {
    const { nodeCollection, ...rest } = props;
    const store = useBreadcrumbStore();
    if (store === undefined) return <Component {...props} />;
    const { breadcrumbTrail } = store;
    const { node } = useNode(nodeCollection);
    const basePath = node.path;
    const items = breadcrumbTrail.map((item: BreadcrumbStoreItemType) => {
      const linkNodePath = item.link.nodePath.replace(`${basePath}$`, '');
      const titleNodePath = item.title.nodePath.replace(`${basePath}$`, '');
      return {
        uuid: item.uuid,
        link: {
          nodeKey: linkNodePath,
          nodeCollection,
        },
        title: {
          nodeKey: titleNodePath,
          nodeCollection,
        },
      };
    });
    const hasLastItem = store.hasLastItem();
    return <Component {...rest} items={items} hasLastItem={hasLastItem} />;
  };
  return WithBreadcrumbItemsFromStore;
};

const Breadcrumb = flowRight(
  observer,
  withBreadcrumbItemsFromStore,
)(BreadcrumbClean);

export {
  BreadcrumbClean,
  Breadcrumb,
};
