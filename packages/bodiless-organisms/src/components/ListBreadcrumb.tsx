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
import { flow, identity } from 'lodash';

import {
  withDesign,
  replaceWith,
  asComponent,
  withOnlyProps,
  extendDesignable,
  designable,
  Li,
  Span,
} from '@bodiless/fclasses';
import {  withSidecarNodes, WithNodeKeyProps } from '@bodiless/core';
import {
  asBreadcrumb,
  useIsActiveBreadcrumb,
  withSimpleSubListDesign,
  useBreadcrumbContext,
} from '@bodiless/components';

type Settings = {
  nodeKeys?: WithNodeKeyProps;
  depth?: number;
}

/**
 * HOC which is used to hide a list item with inactive breadcrumb
 * wait until component is mounted, so that children are rendered
 * hide the component if breadcrumb is not active
 * @param Component 
 */
const withHiddenInactiveBreadcrumbsItem = (Component: ComponentType<any>) => {
  const WithHiddenInactiveBreadcrumbsItem = (props: any) => {
    const [ mounted, setMounted ] = useState(false);
    const isActive = useIsActiveBreadcrumb();
    useEffect(() => {
      setMounted(true);
    }, []);
    const props$1 = {
      ...props,
      className: !isActive || !mounted ? 'hidden' : '',
    }
    return !isActive && mounted ? <></> : (<Component {...props$1} />)
  }
  WithHiddenInactiveBreadcrumbsItem.displayName = 'WithHiddenInactiveBreadcrumbsItem';
  return WithHiddenInactiveBreadcrumbsItem;
}

const asBreadcrumbListItem = (nodeKeys?: WithNodeKeyProps) => withSidecarNodes(
  asBreadcrumb(nodeKeys),
  withHiddenInactiveBreadcrumbsItem,
);

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
  /*withDesign({
    Item: flow(
      withBreadcrumbSeparator,
      withDesign({
        Separator: replaceWith(() => <div id="parentSeparator" />),
      }),
      withDesign({
        Item: flow(
          withBreadcrumbSeparator,
          withDesign({
            Separator: replaceWith(() => <div id="parentSeparator2" />),
          }),
        ),
      }),
    ),
  }),*/
  withSimpleSubListDesign(depth)(flow(
    asBreadcrumbListItem(nodeKeys),
    asBreadcrumbSubList,
  )),
);


// ToDo: remediate types
const withBreadcrumbSeparator = (Component: ComponentType<any>) => {
  const WithBreadcrumbSeparator = (props: any) => {
    const { components, ...rest } = props;
    const { Separator } = components;
    const isActiveBreadcrumb = useIsActiveBreadcrumb();
    return (
      <>
        <Component {...rest} />
        { isActiveBreadcrumb &&  <Separator /> }
      </>
    );
  }
  WithBreadcrumbSeparator.displayName = 'WithBreadcrumbSeparator';
  const extendDesignable$ = extendDesignable(({Separator, ...rest}: any) => rest);
  return extendDesignable$({ Separator: asComponent('span') })(WithBreadcrumbSeparator);
}

const TrailItem = (props: any) => {
  const { components } = props;
  const { Wrapper, Item } = components;
  return (
    <Wrapper>
      <Item />
    </Wrapper>
  )
}
const DesignableTrailItem = designable({
  Wrapper: Li,
  Item: Span,
})(TrailItem);


// ToDo: remediate types
const withBreadcrumbCustomItems = (Component: ComponentType<any>) => {
  const WithBreadcrumbCustomItems = (props: any) => {
    const { components, children, ...rest } = props;
    const { StartingTrail, Separator, FinalTrail, } = components;
    const breadcrumbContext = useBreadcrumbContext();
    console.log('hey from withBreadcrumbCustomItems');
    console.log(breadcrumbContext.hasActive)
    return (
      <Component {...rest}>
        <StartingTrail />
        { StartingTrail && <Separator /> }
        {children}
        { FinalTrail && !breadcrumbContext.hasActive  && <Separator /> }
        { !breadcrumbContext.hasActive && <FinalTrail /> }
      </Component>
    );
  }
  WithBreadcrumbCustomItems.displayName = 'withBreadcrumbCustomItems';
  const extendDesignable$ = extendDesignable(({
    StartingTrail, Separator, FinalTrail, ...rest
  }: any) => rest);
  return extendDesignable$({
    StartingTrail: DesignableTrailItem,
    Separator: asComponent('span'),
    FinalTrail: DesignableTrailItem,
  })(WithBreadcrumbCustomItems);
}

/*const withBreadcrumbSeparatorDesign = withSimpleSubListDesign(2)(withDesign({
  Item: flowRight(
    withBreadcrumbSeparator
  ),
}))*/

const defaultDepth = 3;

const withBreadcrumbDesign = ({ Title: TitleDesign, Item: ItemDesign, Separator: SeparatorDesign }: any) => flow(
  TitleDesign ? flow(
    // @ts-ignore ToDo: resolve types
    withSimpleSubListDesign(defaultDepth)(withDesign({ Title: TitleDesign })),
    withDesign({ Title: TitleDesign }),
  ) : identity,
  ItemDesign ?
    withSimpleSubListDesign(defaultDepth)(flow(
      withDesign({ Item: ItemDesign }),
      withDesign({
        Wrapper: withDesign({
          SubListTitleWrapper: ItemDesign,
        }),
      }),
    ),
  ) : identity,
);

export default asBreadcrumbsClean;
export {
  withHiddenInactiveBreadcrumbsItem,
  withBreadcrumbSeparator,
  asBreadcrumbListItem,
  asBreadcrumbSubList,
  withBreadcrumbDesign,
  withBreadcrumbCustomItems,
};


