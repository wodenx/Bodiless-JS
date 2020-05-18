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
  const formApi = useFormApi();
  // @Todo revise the use of formState, possibly use informed multistep.
  if (formApi.getState().submits === 0) {
    return (<FetchChanges client={client} />);
  }
  return <PullChanges client={client} />;
};

enum ChangeStatus {
  Pending,
  NoChanges,
  CanBePulled,
  CannotBePulled,
  Error,
};

const handleChangesResponse = ({ upstream }: ResponseData) => {
  const { commits, files } = upstream;
  // if (isEmpty(commits)) {
  //   return 'There aren\'t any changes to download.';
  // }
  // if (files.some(file => file.includes('package-lock.json'))) {
  //   return 'Upstream changes are available but cannot be fetched via the UI.';
  // }
  return {
    status: ChangeStatus.CanBePulled,
    message: 'There are changes ready to be pulled. Click check (✓) to initiate.',
  };
};

/**
 * Component for showing remote changes.
 *
 * @component
 * @param {BackendClient} client
 * @constructor
 */
const FetchChanges = ({ client }: Props) => {
  const [state, setState] = useState<{ status: ChangeStatus, message: string }>({
    status: ChangeStatus.Pending,
    message: '',
  });
  const formApi = useFormApi();
  const context = useEditContext();
  useEffect(() => {
    (async () => {
      try {
        context.showPageOverlay({
          hasSpinner: false,
        });
        const response = await client.getChanges();
        if (response.status !== 200) {
          throw new Error(`Error pulling changes, status=${response.status}`);
        }
        const newState = handleChangesResponse(response.data);
        if (newState.status === ChangeStatus.CanBePulled) {
          formApi.setValue('keepOpen', true);
        }
        setState(newState);
      } catch (error) {
        setState({
          status: ChangeStatus.Error,
          message: error.message,
        });
      } finally {
        context.hidePageOverlay();
      }
    })();
  }, []);
  const { status, message } = state;
  if (status === ChangeStatus.Pending) {
    return <SpinnerWrapper />;
  }
  return <>{message}</>;
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

const PullChanges = ({ client }: PullChangesProps) => {
  const context = useEditContext();
  const formApi = useFormApi();
  const [pullStatus, setPullStatus] = useState<PullStatus>({ complete: false, error: '' });
  useEffect(() => {
    (async () => {
      try { 
        context.showPageOverlay({
          hasSpinner: false,
        });
        const response = await client.getChanges(); // @Todo replace client.pull();
        if (response.status !== 200) {
          throw new Error(`Error pulling changes, status=${response.status}`);
        }
        setPullStatus({ complete: true });
      } catch (error) {
        setPullStatus({
          complete: false,
          error: error.message,
        });
      } finally {
        context.hidePageOverlay();
        formApi.setValue('keepOpen', false);
      }
    })();
    return () => {};
  }, []);
  const { complete, error } = pullStatus;
  if (error) return <>{error}</>;
  if (complete) {
    return <>Operation completed.</>;
  }

  return <SpinnerWrapper />;
};

export default RemoteChanges;
export { PullChanges, FetchChanges };
