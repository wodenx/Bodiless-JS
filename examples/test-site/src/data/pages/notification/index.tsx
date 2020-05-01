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
import {
  useNode, withNodeKey, withNode, useEditContext, contextMenuForm, ContextProvider,
} from '@bodiless/core';
import Layout from '../../../components/Layout';

type Notification = {
  id: string,
  message: string,
};

type NotificationProviderItem = Notification & {
  owner: string,
};

type Notifier = (owner: string, notifications: Notification[]) => void;
type ContextType = {
  notify: Notifier,
  notifications: Notification[],
};

const NotificationContext = React.createContext<ContextType>({
  notify: () => undefined,
  notifications: [],
});

const NotificationViewer = () => {
  const { notifications } = useContext(NotificationContext);
  return (
    <pre>{JSON.stringify(notifications, undefined, 2)}</pre>
  );
};

const DefaultActiveMenuOptions = observer(({ children }: any) => {
  const context = useEditContext();
  useEffect(() => {
    context.activate();
  });
  return <>{children}</>;
});

const NotificationProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationProviderItem[]>([]);
  const notify = useCallback(
    (owner: string, newNotifications: Notification[]) => setNotifications(
      (oldNotifications: NotificationProviderItem[]) => oldNotifications
        .filter(n => n.owner !== owner)
        .concat(
          newNotifications.map(n => ({ ...n, owner })),
        ),
    ),
    [setNotifications],
  );

  return (
    <NotificationContext.Provider value={{ notify, notifications }}>
      {children}
    </NotificationContext.Provider>
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

type Options = {
  owner?: string,
};

/**
 * The useNotify() hook allows you to register notifications which should be
 * displayed to the user upon clicking the "Notifications" button on the main
 * menu.
 *
 * Note that you are responsible for maintaining and persisting the notifications
 * you want to display. Every time your component re-renders, all the notifications
 * it owns will be regenerated from the list provided to this hook.
 *
 * @param notifications An array of Notification objects which should be displayed
 */
const useNotify = (notifications: Notification[]) => {
  const owner = useRef(v1()).current;
  const { notify } = useContext(NotificationContext);
  useEffect(
    () => notify(owner, notifications || []),
    [notify, owner, notifications],
  );
};

const useNotifyFromNode = () => {
  const { node } = useNode<Data>();
  useNotify(node.data.notifications);
  return {
    notifications: node.data.notifications || [],
    setNotifications: (notifications: Notification[]) => node.setData({ notifications }),
  };
};

const ChildWithNotifications = asBodiless(() => {
  const { notifications, setNotifications } = useNotifyFromNode();

  const addRandomNotification = useCallback(
    () => {
      const id = v1();
      const message = `Notification ${id}`;
      setNotifications([...notifications, { id, message }]);
    },
    [notifications, setNotifications],
  );
  return (
    <div className="border p-2">
      <h2 className="text-lg">I Have Notifications</h2>
      {/* <pre>{JSON.stringify(myNotifications, undefined, 2)}</pre> */}
      <button type="button" className="border p-2 m-2" onClick={addRandomNotification}>Add a notification</button>
      <button type="button" className="vborder p-2 m-2" onClick={() => setNotifications([])}>Clear All</button>

    </div>
  );
});

const NotificationButtonProvider: FC = ({ children }) => {
  const { notifications } = useContext(NotificationContext);
  const handler = () => contextMenuForm({})(
    () => (
      <>{notifications.map(n => <p key={n.id}>{n.message}</p>)}</>
    ),
  );
  const getMenuOptions = () => [{
    name: 'Notifications',
    label: 'Alerts',
    icon: notifications.length > 0 ? 'notification_important' : 'notifications',
    isActive: () => notifications.length > 0,
    handler,
  }];
  return (
    <ContextProvider getMenuOptions={getMenuOptions}>
      {children}
    </ContextProvider>
  );
};


export default (props: any) => (
  <Page {...props}>
    <Layout>
      <h1 className="text-3xl font-bold">Notifications</h1>
      <NotificationProvider>
        <NotificationButtonProvider>
          <DefaultActiveMenuOptions>
            <ChildWithNotifications />
            <NotificationViewer />
          </DefaultActiveMenuOptions>
        </NotificationButtonProvider>
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
