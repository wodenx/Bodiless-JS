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

import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'enzyme';
import { FetchChanges } from '../src/dist/RemoteChanges';

const changes = {
  data: {
    upstream: {
      branch: 'origin/feat/test',
      commits: ['Test Commit'],
      files: ['packages/gatsby-theme-bodiless/src/dist/RemoteChanges.tsx'],
    },
  },
};
const mockChangesClient = {
  getChanges: jest.fn(() => Promise.resolve(changes)),
};
const noChanges = {
  data: {
    upstream: {
      branch: 'null',
      commits: [],
      files: [],
    },
  },
};
const noChangesClient = {
  getChanges: jest.fn(() => Promise.resolve(noChanges)),
};
const nonPullableChanges = {
  data: {
    upstream: {
      branch: 'null',
      commits: ['Test Commit'],
      files: ['packages/gatsby-theme-bodiless/src/dist/package-lock.json'],
    },
  },
};
const nonPullableChangesClient = {
  getChanges: jest.fn(() => Promise.resolve(nonPullableChanges)),
};
describe('Fetch Changes component', () => {
  it('should show a spinner while a request to the back-end is processed', () => {
    const wrapper = mount(<FetchChanges client={mockChangesClient} />);
    expect(wrapper.find('.bodiless-spinner').length > 0).toBe(true);
  });
  it('should detect changes are available', async () => {
    const wrapper = mount(<FetchChanges client={mockChangesClient} />);
    return new Promise(resolve => setImmediate(resolve)).then(() => {
      wrapper.update();
      expect(wrapper.find('input[name="allowed"]').length > 0).toBe(true);
      expect(wrapper.text()).toBe(
        'There are changes ready to be pulled. Click check (✓) to initiate.',
      );
    });
  });

  it('should detect changes are not available', async () => {
    const wrapper = mount(<FetchChanges client={noChangesClient} />);
    return new Promise(resolve => setImmediate(resolve)).then(() => {
      wrapper.update();
      expect(wrapper.find('input[name="allowed"]').length).toBe(0);
      expect(wrapper.text()).toBe("There aren't any changes to download.");
    });
  });

  it('should detect changes are available but cannot be pulled', async () => {
    const wrapper = mount(<FetchChanges client={nonPullableChangesClient} />);
    return new Promise(resolve => setImmediate(resolve)).then(() => {
      wrapper.update();
      expect(wrapper.find('input[name="allowed"]').length).toBe(0);
      expect(wrapper.text()).toBe(
        'Upstream changes are available but cannot be fetched via the UI.',
      );
    });
  });
});
