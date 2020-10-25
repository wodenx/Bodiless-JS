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

import React, { ComponentType } from 'react';
import { mount } from 'enzyme';
import {
  withDesign, asComponent, addProps, replaceWith, withoutProps,
} from '@bodiless/fclasses';
import { flowRight } from 'lodash';
import { BreadcrumbClean } from '../../src/Breadcrumb';

const withAttrRename = (oldAttr: string, newAttr: string) => (Component: ComponentType) => {
  const WithAttrRename = (props: any) => {
    const { [oldAttr]: oldAttrVal, ...rest } = props;
    const props$ = {
      ...rest,
      [newAttr]: oldAttrVal,
    };
    return <Component {...props$} />;
  };
  return WithAttrRename;
};

describe('BreadcrumbClean', () => {
  it('renders as empty unordered list by default', () => {
    // @ts-ignore
    const wrapper = mount(<BreadcrumbClean />);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('allows adding starting trail using design api', () => {
    const Breadcrumb = withDesign({
      StartingTrail: flowRight(
        addProps({
          className: 'starting-trail',
        }),
        replaceWith(asComponent('span')),
      ),
    // @ts-ignore
    })(BreadcrumbClean);
    // @ts-ignore
    const wrapper = mount(<Breadcrumb />);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('allows passing items as a prop', () => {
    const items = [
      {
        uuid: Math.random(),
        link: {
          nodeKey: 'linkNodeKey1',
        },
        title: {
          nodeKey: 'titleNodeKey1',
        },
      },
      {
        uuid: Math.random(),
        link: {
          nodeKey: 'linkNodeKey1',
        },
        title: {
          nodeKey: 'titleNodeKey1',
        },
      },
    ];
    const Breadcrumb = withDesign({
      BreadcrumbLink: flowRight(
        withAttrRename('nodeKey', 'href'),
        withoutProps('nodeCollection'),
      ),
      BreadcrumbTitle: flowRight(
        withAttrRename('nodeKey', 'aria-label'),
        withoutProps('nodeCollection'),
      ),
    // @ts-ignore
    })(BreadcrumbClean);
    // @ts-ignore
    const wrapper = mount(<Breadcrumb items={items} />);
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('allows designing separator using design api', () => {
    const items = [
      {
        uuid: Math.random(),
        link: {
          nodeKey: 'linkNodeKey1',
        },
        title: {
          nodeKey: 'titleNodeKey1',
        },
      },
      {
        uuid: Math.random(),
        link: {
          nodeKey: 'linkNodeKey1',
        },
        title: {
          nodeKey: 'titleNodeKey1',
        },
      },
    ];
    const Breadcrumb = withDesign({
      BreadcrumbLink: flowRight(
        withAttrRename('nodeKey', 'href'),
        withoutProps('nodeCollection'),
      ),
      BreadcrumbTitle: flowRight(
        withAttrRename('nodeKey', 'aria-label'),
        withoutProps('nodeCollection'),
      ),
      Separator: addProps({
        className: 'separator',
      }),
    // @ts-ignore
    })(BreadcrumbClean);
    // @ts-ignore
    const wrapper = mount(<Breadcrumb items={items} />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
