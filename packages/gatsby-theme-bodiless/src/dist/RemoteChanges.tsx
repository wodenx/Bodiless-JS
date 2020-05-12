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
import { useFormApi, Text } from 'informed';

type ResponseData = {
  upstream: Upstream;
};

type Upstream = {
  branch: string;
  commits: [string];
  files: [string];
};

type PullCommitsProps = {
  message : string;
};

const FetchedChanged = ({ message } : PullCommitsProps) => (
  <>
    <Text type="hidden" field="allowed" initialValue />
    <Text type="hidden" field="pulled" initialValue={false} />
    {message}
  </>
);

const handleResponse = ({ upstream }: ResponseData) => {
  const { commits, files } = upstream;
  if (isEmpty(commits)) {
    return 'There aren\'t any changes to download.';
  } if (files.some(file => file.includes('package-lock.json'))) {
    return 'Upstream changes are available but cannot be fetched via the UI';
  }
  return <FetchedChanged message="There are changes ready to be pulled. Click check to initiate." />;
};

type Props = {
  client: any;
};

// @Todo remove.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const RemoteChanges = ({ client }: Props) => {
  const formApi = useFormApi();
  const formState = formApi.getState();
  if (formState.submits === 1 && formApi.getValue('allowed') === true) {
    return (
      <>
        <PullChanges client={client} />
      </>
    );
  }
  return (
    <>
      <Changes client={client} />
    </>
  );
};

const Wrapper = () => (
  <div className="bl-pt-3">
    <Spinner color="bl-bg-white" />
  </div>
);

const Changes = ({ client }: Props) => {
  const [state, setState] = useState<{ content: any }>({
    content: <Wrapper />,
  });
  const context = useEditContext();
  useEffect(() => {
    (async () => {
      try {
        context.showPageOverlay({
          hasSpinner: false,
          maxTimeoutInSeconds: 10,
        });
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

const PullChanges = ({ client }: Props) => {
  const [state, setState] = useState<{ content: any }>({
    content: <Wrapper />,
  });
  const context = useEditContext();
  const formApi = useFormApi();
  useEffect(() => {
    (async () => {
      try {
        console.log('in pull changes');
        context.showPageOverlay({
          hasSpinner: false,
          maxTimeoutInSeconds: 10,
        });
        // @todo delay to see the spinner, remove.
        await delay(1);
        const response = await client.pull();
        if (response.status === 200) {
          formApi.setValue('pulled', true);
          setState({
            content: 'success', // <Text type="hidden" field="pulled" initialValue />,
          });
        } else {
          setState({
            content: 'An error occurred. Please try again later.',
          });
        }
        context.hidePageOverlay();
      } catch (error) {
        // context.showError({
        //   message: error.message || 'An unexpected error has occurred',
        // });
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
