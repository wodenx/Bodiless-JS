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

import React, {
  useState, useEffect, SetStateAction, Dispatch,
} from 'react';
import { useEditContext } from '@bodiless/core';
import { Spinner } from '@bodiless/ui';
import { isEmpty } from 'lodash';
import { useFormApi, Text } from 'informed';

type ResponseData = {
  upstream: {
    branch: string;
    commits: [string];
    files: [string];
  };
};

type Props = {
  client: any;
};

type PullStatus = {
  complete: boolean;
  error?: string;
};

const SpinnerWrapper = () => (
  <div className="bl-pt-3">
    <Spinner color="bl-bg-white" />
  </div>
);

/**
 * Component for showing and pulling remote changes.
 *
 * @component
 * @param {BackendClient} client
 * @constructor
 */
const RemoteChanges = ({ client }: Props) => {
  const [state, setState] = useState<{ content: any }>({
    content: <SpinnerWrapper />,
  });
  const [pullStatus, setPullStatus] = useState<PullStatus>({ complete: false, error: '' });
  const formApi = useFormApi();
  // @Todo revise the use of formState, possibly use informed multistep.
  if (formApi.getState().submits > 0) {
    return <PullChanges client={client} formApi={formApi} pullStatus={pullStatus} setPullStatus={setPullStatus} />;
  }
  // if (formApi.getState().submits === 0) return (<FetchChanges client={client} />);
  return (<FetchChanges client={client} formApi={formApi} state={state} setState={setState} />);
  //return <SpinnerWrapper />;
};

const handleChangesResponse = ({ upstream }: ResponseData, formApi) => {
  const { commits, files } = upstream;
  // if (isEmpty(commits)) {
  //   return 'There aren\'t any changes to download.';
  // }
  // if (files.some(file => file.includes('package-lock.json'))) {
  //   return 'Upstream changes are available but cannot be fetched via the UI.';
  // }
  formApi.setValue('allowed', true);
  return (
    <>
      There are changes ready to be pulled. Click check (✓) to initiate.
    </>
  );
};

/**
 * Component for showing remote changes.
 *
 * @component
 * @param {BackendClient} client
 * @constructor
 */
const FetchChanges = ({ client, formApi, state, setState }: Props) => {
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
          content: handleChangesResponse(response.data, formApi),
        });
        context.hidePageOverlay();
      } catch (error) {
        setState({
          content: 'An unexpected error has occurred',
        });
      }
    })();
  }, []);
  const { content } = state;
  return content;
};

type PullChangesProps = {
  client: any;
  setPullStatus: Dispatch<SetStateAction<PullStatus>>;
};

/**
 * Component for pulling remote changes.
 *
 * @component
 * @param {BackendClient} client
 * @param setPullStatus
 * @constructor
 */
const PullChanges = ({ client, formApi, pullStatus, setPullStatus }: PullChangesProps) => {
  const context = useEditContext();
  const { complete, error } = pullStatus;
  if (error) return <>{error}</>;
  if (complete) {
    return <>Operation completed.</>;
  }
  useEffect(() => {
    (async () => {
      try {
        context.showPageOverlay({
          hasSpinner: false,
          maxTimeoutInSeconds: 10,
        });
        const response = await client.getChanges(); // @Todo replace client.pull();
        // formApi.setValue('allowed', false);
        if (response.status === 200) {
          setPullStatus({ complete: true });
        } else {
          setPullStatus({
            complete: false,
            error: 'An unexpected error has occurred.',
          });
        }
        context.hidePageOverlay();
      } catch (error) {
        setPullStatus({
          complete: false,
          error: 'An unexpected error has occurred.',
        });
      }
    })();
    return () => {};
  }, []);

  return null;
};

export default RemoteChanges;
export { PullChanges, FetchChanges };
