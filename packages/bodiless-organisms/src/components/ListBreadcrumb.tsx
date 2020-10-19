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

import React, {
  useState,
  useEffect,
  ComponentType,
} from 'react';
import { flow } from 'lodash';

import {
  withDesign,
  replaceWith,
  asComponent,
  withOnlyProps,
  extendDesignable,
  Li,
  Span,
  Ul,
  A,
} from '@bodiless/fclasses';
import { WithNodeKeyProps, useNode } from '@bodiless/core';
import {
  asBreadcrumb,
  withSimpleSubListDesign,
} from '@bodiless/components';
import {
  BreadcrumbStoreProvider,
  BreadcrumbStore,
  useBreadcrumbStore,
} from '@bodiless/components';

type Settings = {
  nodeKeys?: WithNodeKeyProps;
  depth?: number;
}

const asBreadcrumbListItem = asBreadcrumb;

const asBreadcrumbSubList = withDesign({
  Wrapper: withDesign({
    List: replaceWith(withOnlyProps('key', 'children')(React.Fragment)),
    WrapperItem: replaceWith(withOnlyProps('key', 'children')(React.Fragment)),
    SubListTitleWrapper: replaceWith((props: any) => {
      const [ mounted, setMounted ] = useState(false);
      useEffect(() => {
        setMounted(true);
      }, []);
      const props$1 = {
        ...props,
        className: !mounted ? 'hidden' : '',
      }
      return <Li {...props$1} />;
    }),
  }),
});

/**
 * HOC which can be applied to a base list to make it into a site's breadcrumbs
 *
 * @param A base list component created via asBodilessList()
 *
 * @return A clean (unstyled) site breadcrumb component.
 */
const asBreadcrumbsClean = ({ nodeKeys = 'link', depth = 1 }: Settings) => flow(
  withSimpleSubListDesign(depth)(flow(
    asBreadcrumb,
  )),
);

const BreadcrumbsClean = (props: any) => {
  const { components } = props;
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
  const breadcrumbTrail = store?.breadcrumbTrail || [];
  const { node } = useNode();
  const basePath = node.path;
  console.log(breadcrumbTrail);
  // @ts-ignore
  const items = breadcrumbTrail.map(item => {
    // ToDo make relative path logic reusable 
    const linkNodePath = item.getLink().nodePath.replace(`${basePath}$`, '');
    const titleNodePath = item.getTitle().nodePath.replace(`${basePath}$`, '');
    console.log('linkNodePath', linkNodePath);
    console.log('titleNodePath', titleNodePath);
    return (
      <BreadcrumbItem key={item.getUUID()}>
        <BreadcrumbLink nodeKey={linkNodePath}>
          <BreadcrumbTitle nodeKey={titleNodePath} />
        </BreadcrumbLink>
      </BreadcrumbItem>
    );
  // @ts-ignore
  }).reduce((prev, curr) => [prev, <Separator/>, curr]);
  return (
    <BreadcrumbWrapper>
      { StartingTrail &&
        <>
          <BreadcrumbItem>
            <StartingTrail />
          </BreadcrumbItem>
          <Separator />
        </>
      }
      {items}
      { FinalTrail &&
        <BreadcrumbItem>
          <FinalTrail />
        </BreadcrumbItem>
      }
    </BreadcrumbWrapper>
  );
};

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
}: any) => rest);

const DesignableBreadcrumbsClean = designableBreadcrumb({
  StartingTrail: React.Fragment,
  Separator: asComponent(Span),
  BreadcrumbWrapper: asComponent(Ul),
  BreadcrumbItem: asComponent(Li),
  BreadcrumbLink: asComponent(A),
  BreadcrumbTitle: asComponent(Span),
  FinalTrail: React.Fragment,
})(BreadcrumbsClean);

const withBreadcrumb = (Component: ComponentType<any>) => (props: any) => {
  const { node } = useNode();
  const { pagePath } = node;
  const store = new BreadcrumbStore(pagePath);
  return (
    <BreadcrumbStoreProvider store={store}>
      <Component {...props}/>
      <DesignableBreadcrumbsClean {...props} />
    </BreadcrumbStoreProvider>
  );
}

export default asBreadcrumbsClean;
export {
  asBreadcrumbListItem,
  asBreadcrumbSubList,
  DesignableBreadcrumbsClean,
  withBreadcrumb,
};


