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
  FC,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { v1 } from 'uuid';
import { observable, action } from 'mobx';
import { useNode } from './NodeProvider';

type Notification = {
  id: string,
  message: string,
};

type NotificationProviderItem = Notification & {
  owner: string,
};

class NotificationStore {
  @observable
  notifications: NotificationProviderItem[] = [];

  @action
  notify(owner: string, newNotifications: Notification[]) {
    this.notifications = this.notifications
      .filter(n => n.owner !== owner)
      .concat(
        newNotifications.map(n => ({ ...n, owner })),
      );
  }
}

type ContextType = {
  getNotifications: () => Notification[],
  notify: (owner: string, newNotifications: Notification[]) => void,
};

const defaultContext: ContextType = {
  getNotifications: () => [],
  notify: () => undefined,
};

const NotificationContext = React.createContext(defaultContext);

/**
 * A component used to provide notifications.
 *
 * @param children
 * @constructor
 */
const NotificationProvider: FC = ({ children }) => {
  const store = useRef(new NotificationStore()).current;
  const value = {
    getNotifications: () => store.notifications,
    notify: store.notify.bind(store),
  };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

type Data = {
  notifications: Notification[],
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
 * @param notifications An array of Notification objects which should be displayed.
 */
const useNotify = (notifications: Notification[]) => {
  const owner = useRef(v1()).current;
  const { notify } = useContext(NotificationContext);
  useEffect(
    () => {
      notify(owner, notifications || []);
      return () => notify(owner, []);
    },
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

export {
  NotificationProvider,
  NotificationProviderItem,
  useNotify,
  useNotifyFromNode,
  NotificationContext,
};
