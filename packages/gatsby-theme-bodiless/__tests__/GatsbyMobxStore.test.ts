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

import GatsbyMobxStore from '../src/dist/GatsbyMobxStore';

const generateData = (name: string, data: any, clientId?: string) => {
  let data$ = data;
  if (clientId) {
    data$ = {
      ___meta: {
        author: clientId,
      },
      ...data,
    };
  }
  return {
    Page: {
      edges: [
        {
          node: {
            name,
            content: JSON.stringify(data$),
          },
        },
      ],
    },
  };
};

const dataSource = {
  slug: 'slug',
};

describe('GatsbyMobxStore', () => {
  describe('when it receives data originated from different client', () => {
    it('accepts the data', () => {
      const store = new GatsbyMobxStore(dataSource);
      const data = generateData('foo', { text: 'bar' });
      store.updateData(data);
      const data$0 = generateData('foo', { text: 'bar2' }, 'ClientA');
      store.updateData(data$0);
      const node$0 = store.getNode(['Page', 'foo']);
      expect(node$0.text).toBe('bar2');
    });
  });
  describe('when it receives data originated from the same client', () => {
    it('rejects the data', () => {
      const store = new GatsbyMobxStore(dataSource);
      const data = generateData('foo', { text: 'bar' });
      store.updateData(data);
      const thisClientId = store.storeId;
      const data$0 = generateData('foo', { text: 'bar2' }, thisClientId);
      store.updateData(data$0);
      const node$0 = store.getNode(['Page', 'foo']);
      expect(node$0.text).toBe('bar');
    });
  });
});
