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

import request from 'supertest';

const backendPrefix = '/prefix';
const backendFilePath = '/files';

const mockPageWrite = jest.fn();

jest.mock('../src/page', () => () => ({
  write: mockPageWrite.mockResolvedValue(true),
}));

jest.mock('../src/logger');

const getApp = () => {
  // eslint-disable-next-line global-require
  const Backend = require('../src/backend');
  const backend = new Backend();
  return backend.getApp();
};

describe('set content endpoint', () => {
  // preparing environment variables
  // clearing mocks
  beforeEach(() => {
    jest.resetModules();
    process.env.GATSBY_BACKEND_PREFIX = backendPrefix;
    process.env.BODILESS_BACKEND_DATA_PAGE_PATH = backendFilePath;
    mockPageWrite.mockReset();
  });

  const performRequest = (app$: any, data: any, headers: any) => request(app$)
    .post(`${backendPrefix}/content/test`)
    .send(data)
    .set(headers);

  describe('when request does not have x-bl-clientid', () => {
    it('should write payload to json file', async () => {
      const app = getApp();
      const data = {
        text: 'testData',
      };
      await performRequest(app, data, {});
      expect(mockPageWrite.mock.calls[0][0]).toStrictEqual(data);
    });
  });
  describe('when request contains x-bl-clientid', () => {
    it('should write payload and metadata to json file', async () => {
      const app = getApp();
      const clientId = 'clientA';
      const data = {
        text: 'testData',
      };
      const headers = {
        'x-bl-clientid': clientId,
      };
      const expectedData = {
        ___meta: {
          author: clientId,
        },
        ...data,
      };
      await performRequest(app, data, headers);
      expect(mockPageWrite.mock.calls[0][0]).toStrictEqual(expectedData);
    });
  });
});
