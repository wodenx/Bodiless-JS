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
import { useFormApi, Checkbox, Text } from 'informed';


type ResponseData = {
  upstream: Upstream;
};

type Upstream = {
  branch: string;
  commits: [string];
  files: [string];
};

type CommitListProps = {
  commits : [string];
};

const RemoteCommitList = (props : CommitListProps) => {
  const { commits } = props;
  const listItems = commits.map((commit, index) => (
    <li key={index.toString()}>{commit}</li>
  ));
  return (
    <>
      <Text type="hidden" field="allowed" initialValue />
      <ul>{listItems}</ul>
    </>
  );
};

const handleResponse = ({ upstream }: ResponseData) => {
  const { commits, files } = upstream;
  if (isEmpty(commits)) {
    return 'There aren\'t any changes to download.';
  } if (files.some(file => file.includes('package-lock.json'))) {
    return 'Upstream changes are available but cannot be fetched via the UI';
  }
  return <RemoteCommitList commits={commits} />;
};

type Props = {
  client: any;
};

const Wrapper = () => (
  <div className="bl-pt-3">
    <Spinner color="bl-bg-white" />
  </div>
);

// @Todo remove.
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const RemoteChanges = ({ client }: Props) => {
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
