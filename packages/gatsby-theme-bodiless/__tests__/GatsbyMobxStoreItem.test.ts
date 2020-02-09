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

import GatsbyMobxStoreItem from '../src/dist/GatsbyMobxStoreItem';
import GatsbyMobxStore from '../src/dist/GatsbyMobxStore';
import BackendClient from '../src/dist/BackendClient';

const deletePathMock = jest.fn();
jest.mock('../src/dist/BackendClient', () => () => ({
  deletePath: deletePathMock,
}));
jest.mock('../src/dist/GatsbyMobxStore', () => () => ({
  client: new BackendClient(),
}));

const dataSource = {
  slug: 'slug',
};

describe('GatsbyMobxStoreItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('delete', () => {
    it('should invoke backendClient delete', () => {
      const item = new GatsbyMobxStoreItem(new GatsbyMobxStore(dataSource), 'Page$foo$bar');
      item.delete();
      expect(deletePathMock.mock.calls[0][0]).toBe('pages/foo$bar');
    });
  });
});
