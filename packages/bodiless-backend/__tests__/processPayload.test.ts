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

const processPayload = require('../src/processPayload');

describe('procesPayload', () => {
  describe('when request contains clientId in header', () => {
    it('should return request body augmented with metadata', () => {
      const clientId = 'clientA';
      const testInputData = {
        'text': 'testData',
      };
      const request = {
        headers: {
          'x-clientid': clientId,
        },
        body: testInputData,
      };
      const expectedData = {
        ___meta: {
          author: clientId,
        },
        ...testInputData,
      }
      const processedData = processPayload(request);
      expect(processedData).toStrictEqual(expectedData);
    });
  });
  describe('when request does not contain clientId in header', () => {
    it('should return request body', () => {
      const testInputData = {
        'text': 'testData',
      };
      const request = {
        body: testInputData,
      };
      const processedData = processPayload(request);
      expect(processedData).toBe(testInputData);
    });
  });
});