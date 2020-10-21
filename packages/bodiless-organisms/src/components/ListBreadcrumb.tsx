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
import { flow } from 'lodash';

import { useNode } from '@bodiless/core';
import type { WithNodeKeyProps, WithNodeProps } from '@bodiless/core';
import {
  asComponent,
  extendDesignable,
  Li,
  Span,
  Ul,
  A,
} from '@bodiless/fclasses';
import type { DesignableComponentsProps } from '@bodiless/fclasses';
import {
  asBreadcrumb,
  withSimpleSubListDesign,
  BreadcrumbStoreProvider,
  BreadcrumbStore,
  useBreadcrumbStore,
  BreadcrumbItemInterface,
} from '@bodiless/components';
import type { BreadcrumbSettings as BaseBreadcrumbSettings } from '@bodiless/components'
import { observer } from 'mobx-react-lite';

type BreadcrumbSettings = BaseBreadcrumbSettings & {
  depth?: number;
};

type BreadCrumbComponents = {
  StartingTrail: ComponentType<HTMLProps<HTMLSpanElement>> | null,
  Separator: ComponentType<HTMLProps<HTMLSpanElement>>,
  BreadcrumbWrapper: ComponentType<HTMLProps<HTMLUListElement>>,
  BreadcrumbItem: ComponentType<HTMLProps<HTMLLIElement>>,
  BreadcrumbLink: ComponentType<HTMLProps<HTMLAnchorElement> & WithNodeKeyProps>,
  BreadcrumbTitle: ComponentType<HTMLProps<HTMLSpanElement> & WithNodeKeyProps>,
  FinalTrail: ComponentType<HTMLProps<HTMLSpanElement>> | null,
};

// @ts-ignore StartingTrail, FinalTrail is incompatible with index signature
type BreadcrumbProps = DesignableComponentsProps<BreadCrumbComponents> & WithNodeProps;

const asBreadcrumbListItem = asBreadcrumb;

const BreadcrumbsClean$ = observer((props: BreadcrumbProps) => {
  const { components, nodeCollection } = props;
  const {
    StartingTrail,
    Separator,
    BreadcrumbWrapper,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbTitle,
    FinalTrail,
  } = components;
  const store = useBreadcrumbStore();
  if (store === undefined) return <></>;
  const breadcrumbTrail = store.breadcrumbTrail;
  const { node } = useNode(nodeCollection);
  const basePath = node.path;
  const items = breadcrumbTrail.map<React.ReactNode>((item: BreadcrumbItemInterface) => {
    // ToDo make relative path logic reusable 
    const linkNodePath = item.getLink().nodePath.replace(`${basePath}$`, '');
    const titleNodePath = item.getTitle().nodePath.replace(`${basePath}$`, '');
    return (
      <BreadcrumbItem key={item.getUUID()}>
        <BreadcrumbLink nodeKey={linkNodePath} nodeCollection={nodeCollection}>
          <BreadcrumbTitle nodeKey={titleNodePath} nodeCollection={nodeCollection} />
        </BreadcrumbLink>
      </BreadcrumbItem>
    );
  });
  // join elements by separator
  const items$1 = items.length > 1 ? items.reduce((
    prev,
    curr,
    index,
  ) => [prev, <Separator key={`item${index}`}/>, curr]) : items;
  return (
    <BreadcrumbWrapper>
      { StartingTrail &&
        <>
          <BreadcrumbItem key="startingTrail">
            <StartingTrail />
          </BreadcrumbItem>
          <Separator key="startingTrailSeparator" />
        </>
      }
      {items$1}
      { FinalTrail && !store.hasLastItem() &&
        <>
          <Separator key="finalTrailSeparator" />
          <BreadcrumbItem key="finalTrail">
            <FinalTrail />
          </BreadcrumbItem>
        </>
      }
    </BreadcrumbWrapper>
  );
});

const designableBreadcrumb = extendDesignable((
  {
    StartingTrail,
    Separator,
    BreadcrumbWrapper,
    BreadcrumbLink,
    BreadcrumbItem,
    BreadcrumbTitle,
    FinalTrail,
    ...rest
// ToDo: improve types
}: any) => rest);

const BreadcrumbsClean = designableBreadcrumb({
  // @ts-ignore Type 'null' is not assignable to type 'ComponentType<any>'
  StartingTrail: null,
  Separator: asComponent(Span),
  BreadcrumbWrapper: asComponent(Ul),
  BreadcrumbItem: asComponent(Li),
  BreadcrumbLink: asComponent(A),
  BreadcrumbTitle: asComponent(Span),
  // @ts-ignore Type 'null' is not assignable to type 'ComponentType<any>'
  FinalTrail: null,
// @ts-ignore ToDo: resolve type
})(BreadcrumbsClean$);

const withBreadcrumbStore = (Component: ComponentType<any>) => {
  const WithBreadcrumbStore = (props: any) => {
    const { node } = useNode();
    const { pagePath } = node;
    const store = new BreadcrumbStore(pagePath);
    return (
      <BreadcrumbStoreProvider store={store}>
        <Component {...props}/>
        <BreadcrumbsClean {...props} />
      </BreadcrumbStoreProvider>
    );
  }
  return WithBreadcrumbStore;
}

/**
 * HOC which can be applied to a base list to make it into a site's breadcrumbs
 *
 * @param A base list component created via asBodilessList()
 *
 * @return A clean (unstyled) site breadcrumb component.
 */
const asBreadcrumbsClean = ({ depth = 1, ...rest }: BreadcrumbSettings) => flow(
  withSimpleSubListDesign(depth)(flow(
    asBreadcrumbListItem(rest),
  )),
  withBreadcrumbStore,
);

export {
  asBreadcrumbsClean,
  asBreadcrumbListItem,
  BreadcrumbsClean,
  withBreadcrumbStore,
};


