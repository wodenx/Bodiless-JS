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

import React, { useState, useEffect } from 'react';
import { useEditContext } from '@bodiless/core';
import { Spinner } from '@bodiless/ui';
import { isEmpty } from 'lodash';
import BackendClient from './BackendClient';

type ResponseData = {
  upstream: Upstream;
};

type Upstream = {
  branch: string;
  commits: [string];
  files: [string];
};

const renderSelectableList = (message: string) => (
  <div className="bl-h-xl-grid-1 bl-overflow-auto bl-max-w-xl-grid-4">
    {message}
  </div>
);

const handleResponse = ({ upstream }: ResponseData) => {
  let message = '';
  const { commits, files } = upstream;
  if (isEmpty(commits)) {
    message = 'There aren\'t any changes to download.';
  } else if (!isEmpty(files) && files.some(file => file.includes('package.json'))) {
    // @Todo how do we determine if a change require restart?
    message = 'Upstream changes are available but cannot be fetched via the UI';
  }
  return renderSelectableList(message);
};

type Props = {
  client: BackendClient;
};

const WrappedSpinner = () => (
  <div className="bl-pt-5">
    <Spinner color="bl-bg-white" />
  </div>
);

// @Todo remove.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const RemoteChanges = ({ client }: Props) => {
  const [state, setState] = useState<{ content: any }>({
    content: <WrappedSpinner />,
  });
  const context = useEditContext();

  useEffect(() => {
    (async () => {
      try {
        context.showPageOverlay({
          hasSpinner: false,
          maxTimeoutInSeconds: 10,
        });
        // @todo delay to see the spinner, remove.
        await delay(3000);
        const response = await client.getChanges();
        setState({
          content: handleResponse(response.data),
        });
        context.hidePageOverlay();
      } catch (error) {
        context.showError({
          message: error.message || 'An unexpected error has occurred',
        });
        setState({
          content: 'An unexpected error has occurred',
        });
      }
    })();
  }, []);

  const { content } = state;
  return content;
};

export default RemoteChanges;
