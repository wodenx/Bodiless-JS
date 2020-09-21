/**
 * Copyright © 2019 Johnson & Johnson
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

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["isInnermost"] }] */

import React, { FC, useEffect } from 'react';
import { mount, shallow } from 'enzyme';
import { v1 } from 'uuid';
import PageEditContext from '../src/PageEditContext';
import LocalContextMenu from '../src/components/LocalContextMenu';
import ContextMenu from '../src/components/ContextMenu';
import { TMenuOptionGetter } from '../src/PageEditContext/types';
import { useUUID, useEditContext } from '../src/hooks';
import PageEditor from '../src/components/PageEditor';
import { TMenuOption } from '../src/Types/ContextMenuTypes';

const testOptions = () => [
  {
    icon: 'add',
    name: 'add',
    local: true,
  },
];

type Props = {
  getMenuOptions?: TMenuOptionGetter;
  id?: string;
  name?: string;
  active?: boolean;
  tooltipsDisabled?: boolean;
};

const fooText = Math.random().toString();
const Foo: React.FC<any> = props => <span {...props}>{fooText}</span>;

const MockContextProvider: FC<Props> = ({
  active, children, getMenuOptions, id, name, tooltipsDisabled,
}) => {
  class MockPageEditContext extends PageEditContext {
    // Overides PageEditContext.isInnermost to test LocalContextMenu Tooltip behavior.
    get isInnermost() {
      return Boolean(active);
    }

    // eslint-disable-next-line class-methods-use-this
    get areLocalTooltipsDisabled() {
      return Boolean(tooltipsDisabled);
    }
  }

  const newValues = {
    getMenuOptions,
    id: id || useUUID(),
    name: name || 'Unknown',
  };

  const context = useEditContext();
  const mockPageContext = new MockPageEditContext(newValues, context);

  // Activate the context.
  useEffect(() => {
    if (active) mockPageContext.activate();
  });

  return (
    <PageEditContext.context.Provider value={mockPageContext}>
      {children}
    </PageEditContext.context.Provider>
  );
};

describe('LocalContextMenu', () => {
  it('renders Tooltip with overlay of default ContextMenu ui element.', () => {
    const wrapper = mount(
      <PageEditor>
        <MockContextProvider active getMenuOptions={testOptions} id="t1" name="defaultUI">
          <LocalContextMenu><Foo /></LocalContextMenu>
        </MockContextProvider>
      </PageEditor>,
    );
    const content = wrapper.find('div.rc-tooltip-content');
    expect(content.find(ContextMenu)).toHaveLength(1);
  });

  it('renders Tooltip with overlay of customized ui element.', () => {
    const Foo1: React.FC<any> = () => <div>Global</div>;
    const Foo2: React.FC<any> = () => <div>Local</div>;
    const ui = {
      GlobalContextMenu: Foo1,
      LocalContextMenu: Foo2,
    };
    const wrapper = mount(
      <PageEditor ui={ui}>
        <MockContextProvider active getMenuOptions={testOptions} id="t2" name="customUI">
          <LocalContextMenu><Foo /></LocalContextMenu>
        </MockContextProvider>
      </PageEditor>,
    );
    const content = wrapper.find('div.rc-tooltip-content');
    expect(content.find(Foo2)).toHaveLength(1);
    expect(content.find(ContextMenu)).toHaveLength(0);
  });

  it('renders child component correctly.', () => {
    const wrapper = mount(
      <MockContextProvider getMenuOptions={testOptions} id="t3" name="childRendering">
        <LocalContextMenu><Foo /></LocalContextMenu>
      </MockContextProvider>,
    );
    expect(wrapper.find('Foo')).toHaveLength(1);
  });

  it('displays menu options which have "local" flag set.', () => {
    const options1 = () => [
      {
        icon: 'icon1',
        name: 'itemNonLocal',
        local: false,
      },
      {
        icon: 'icon2',
        name: 'itemLocal',
        local: true,
      },
      {
        icon: 'icon3',
        name: 'itemLocalOmit',
      },
    ];
    const wrapper = mount(
      <MockContextProvider active getMenuOptions={options1} id="t5" name="menuOptionLocal">
        <LocalContextMenu><Foo /></LocalContextMenu>
      </MockContextProvider>,
    );

    expect(wrapper.find('Tooltip').get(0).props.visible).toBe(true);

    // Available menu option names from rendered tooltip.
    const optionNames = wrapper.find('ContextMenu').get(0).props.options.map((item: any) => item.name);
    expect(optionNames).toEqual(expect.arrayContaining(['itemLocal']));
    expect(optionNames).not.toEqual(expect.arrayContaining(['itemNonLocal']));
    expect(optionNames).not.toEqual(expect.arrayContaining(['itemLocalOmit']));
  });

  it('renders invisible Tooltip when ContextProvider is not inner most.', () => {
    const wrapper = mount(
      <MockContextProvider active={false} getMenuOptions={testOptions} id="t6" name="contextInActive">
        <LocalContextMenu><Foo /></LocalContextMenu>
      </MockContextProvider>,
    );

    expect(wrapper.find('Tooltip[visible=true]')).toHaveLength(0);
  });

  it('renders visible Tooltip when ContextProvider is inner most.', () => {
    const wrapper = mount(
      <MockContextProvider active getMenuOptions={testOptions} id="t7" name="contextActive">
        <LocalContextMenu><Foo /></LocalContextMenu>
      </MockContextProvider>,
    );

    expect(wrapper.find('Tooltip[visible=true]')).toHaveLength(1);
  });

  it('does not render visible Tooltip when local tooltips are disabled via edit context.', () => {
    const wrapper = mount(
      <MockContextProvider active getMenuOptions={testOptions} id="t8" name="toolbarActive" tooltipsDisabled>
        <LocalContextMenu><Foo /></LocalContextMenu>
      </MockContextProvider>,
    );
    expect(wrapper.find('Tooltip[visible=true]')).toHaveLength(0);
  });
});

describe('Ordered options', () => {
  let mockOptionsGetter:jest.SpyInstance<TMenuOption[], []>;

  const setMockOptions = (ops: TMenuOption[]) => {
    mockOptionsGetter.mockReturnValue(ops);
  };

  beforeEach(() => {
    mockOptionsGetter = jest.spyOn(PageEditContext.prototype, 'contextMenuOptions', 'get');
  });

  afterEach(() => {
    mockOptionsGetter.mockRestore();
  });

  const getRenderedOptions = ():TMenuOption[] => {
    const wrapper = shallow(<LocalContextMenu><Foo /></LocalContextMenu>);
    const overlay = shallow(wrapper.prop('overlay'));
    return overlay.prop('options');
  };

  it('Renders only local options', () => {
    const foo = { name: 'Foo', local: true };
    const bar = { name: 'Bar' };
    const baz = { name: 'Baz', local: false };
    setMockOptions([foo, bar, baz]);
    const options = getRenderedOptions();
    expect(options).toEqual([foo]);
  });

  it.only('Creates groups based on context', () => {
    const local = true;
    const c1 = new PageEditContext({ name: 'C1', id: v1() });
    const c2 = new PageEditContext({ name: 'C2', id: v1() });

    const c1a = { name: 'c1a', context: c1, local };
    const c1b = { name: 'c1b', context: c1, local };
    const c2a = { name: 'c2a', context: c2, local };

    setMockOptions([c1a, c2a, c1b]);
    const options = getRenderedOptions();
    const groups = options.filter(o => o.Component === 'group');
    expect(groups).toHaveLength(2);
    const g1 = groups.find(g => g.label === 'C1');
    const g2 = groups.find(g => g.label === 'C2');
    expect(g1).toBeDefined();
    expect(g2).toBeDefined();
    expect(options.find(o => o.name === 'c1b')!.group).toBe(g1!.name);
    expect(options.find(o => o.name === 'c2a')!.group).toBe(g2!.name);
  });

  it('Orders groups correctly', () => {
    const c1 = new PageEditContext({ name: 'C1', id: v1() });
    const c2 = new PageEditContext({ name: 'C2', id: v1() }, c1);
    const c3 = new PageEditContext({ name: 'C3', id: v1() }, c2);
    const local = true;

    const c1a = { name: 'c1a', context: c1, local };
    const c2a = { name: 'c2a', context: c2, local };
    const c3a = { name: 'c2a', context: c3, local };

    setMockOptions([c1a, c3a, c2a]);
    const options = getRenderedOptions().filter(o => o.Component === 'group');
    expect(options[0].label).toBe(c3.name);
    expect(options[1].label).toBe(c2.name);
    expect(options[2].label).toBe(c1.name);
  });
});
