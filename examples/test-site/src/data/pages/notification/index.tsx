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

import React, {
  useState, FC, useContext, useEffect, useCallback, useRef,
} from 'react';
import { graphql } from 'gatsby';
import { Page } from '@bodiless/gatsby-theme-bodiless';
import { flowRight } from 'lodash';
import { v1 } from 'uuid';
import { observer } from 'mobx-react-lite';
import { useNode, withNodeKey, withNode } from '@bodiless/core';
import Layout from '../../../components/Layout';

type Notification = {
  owner?: string,
  id: string,
  message: string,
};

type Notifier = (owner: string, notifications: Notification[]) => void;
type ContextType = {
  notify: Notifier,
};

const NotificationContext = React.createContext<ContextType>({
  notify: () => undefined,
});


const NotificationProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notify = useCallback(
    (owner: string, newNotifications: Notification[]) => setNotifications(
      (oldNotifications: Notification[]) => oldNotifications
        .filter(n => n.owner !== owner)
        .concat(
          newNotifications.map(n => ({ ...n, owner })),
        ),
    ),
    [setNotifications],
  );

  return (
    <div>
      <div>
        <pre>
          {JSON.stringify(notifications, undefined, 2)}
        </pre>
      </div>
      <NotificationContext.Provider value={{ notify }}>
        {children}
      </NotificationContext.Provider>

    </div>
  );
};

const asBodiless = flowRight(
  withNodeKey('notifier'),
  withNode,
  observer,
);

type Data = {
  notifications: Notification[],
};

type Props = {
  owner?: string,
};

const ChildWithNotifications = asBodiless(({ owner: ownerProp }: Props) => {
  const { node } = useNode<Data>();

  const owner = ownerProp || useRef(v1()).current;

  const { notify } = useContext(NotificationContext);
  useEffect(
    () => notify(owner, node.data.notifications || []),
    [notify, owner, node.data.notifications],
  );
  const addRandomNotification = useCallback(
    () => {
      const id = v1();
      const message = `Notification ${id}`;
      const notifications = node.data.notifications || [];
      node.setData({
        notifications: [...notifications, { id, message }],
      });
    },
    [node, node.data],
  );
  return (
    <div className="border p-2">
      <h2 className="text-lg">I Have Notifications</h2>
      {/* <pre>{JSON.stringify(myNotifications, undefined, 2)}</pre> */}
      <button type="button" className="border p-2 m-2" onClick={addRandomNotification}>Add a notification</button>
      <button type="button" className="vborder p-2 m-2" onClick={() => node.setData({ notifications: [] })}>Clear All</button>
    </div>
  );
});


export default (props: any) => (
  <Page {...props}>
    <Layout>
      <h1 className="text-3xl font-bold">Notifications</h1>
      <NotificationProvider>
        Hello.
        <ChildWithNotifications />
      </NotificationProvider>
    </Layout>
  </Page>
);

export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
  }
`;
