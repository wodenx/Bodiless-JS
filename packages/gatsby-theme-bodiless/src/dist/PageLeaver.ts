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

import { v1 } from 'uuid';

export default class PageLeaver {
  private pendingRequests: string[] = [];

  private attachBeforeUnload() {
    window.addEventListener('beforeunload', function(e) {
      // @ts-ignore
      if (this.pendingRequests > 0) {
        // Cancel the event
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = 'Are you sure you want to leave?';
      } else {
        // the absence of a returnValue property on the event will guarantee the browser unload happens
        delete e['returnValue'];
      }
    }.bind(this));
  }

  constructor() {
    this.attachBeforeUnload();
  }

  onRequestStart() {
    const requestId = v1();
    this.pendingRequests.push(requestId);
  }

  onRequestEnd() {
    const requestId = v1();
    this.pendingRequests = this.pendingRequests.filter(item => item !== requestId);
  }
}