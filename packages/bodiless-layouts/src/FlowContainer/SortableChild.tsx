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

import React, { useState, useEffect, useCallback } from 'react';
import throttle from 'lodash/throttle';
import { ResizeCallback } from 're-resizable';
import { observer } from 'mobx-react-lite';
import SlateSortableResizable, { getUI } from '../SlateSortableResizable';
import { defaultSnapData } from './utils/appendTailwindWidthClass';
import { SortableChildProps } from './types';

const RESIZE_THROTTLE_INTERVAL: number = 100;
// const createThrottledOnResizeStop = (onResizeStop: ResizeCallback) => (
//   throttle(onResizeStop, RESIZE_THROTTLE_INTERVAL)
// );
const FALLBACK_SNAP_CLASSNAME = 'w-full';

const SortableChild = (props: SortableChildProps) => {
  const {
    flowContainerItem,
    onResizeStop: onResizeStopProp = () => undefined,
    snapData = defaultSnapData,
    getDefaultWidth = () => FALLBACK_SNAP_CLASSNAME,
    className: classNameProp = '',
    ui,
    children,
    ...restProps
  } = props;
  const [snapWidth, setSnapWidth] = useState<number|undefined>(undefined);
  const resizing = snapWidth !== undefined;
  const snapClassName = flowContainerItem.wrapperProps?.className || getDefaultWidth(snapData);
  // We need the starting width so we can set defaultSize on re-resizeable.  This ensures
  // that we get back % during resize (otherwise we get pixels).
  const { width: startingWidth } = snapData({ className: snapClassName });

  // Track the snap width during resize so we can display it.
  const onResize: ResizeCallback = useCallback((e, dir, ref) => {
    const { width } = snapData({
      className: snapClassName,
      width: ref.style.width ? parseInt(ref.style.width, 10) : startingWidth,
    });
    setSnapWidth(width);
  }, [snapClassName, startingWidth]);

  const onResizeStop: ResizeCallback = useCallback((e, dir, ref) => {
    setSnapWidth(undefined);
    const { className } = snapData({
      className: snapClassName,
      width: ref.style.width ? parseInt(ref.style.width, 10) : startingWidth,
    });
    if (onResizeStopProp) onResizeStopProp({ className });
  }, [snapClassName, startingWidth, onResizeStopProp]);

  // we have to remove the style width when we are done resizing so that our responsive
  // classes will control width, otherwise the width will be fixed at all breakpoints.
  useEffect(() => {
    if (resizing) return;
    const elm: HTMLElement | null = document.querySelector(`[uuid='${flowContainerItem.uuid}']`);
    if (elm) {
      elm.style.height = '';
      elm.style.width = '';
    }
  }, [resizing]);

  const { width: minWidth } = snapData({ width: 0, className: '' });
  const className = [...snapClassName.split(' '), ...(classNameProp).split(' ')].join(' ');
  const { SnapIndicator } = getUI(ui);
  return (
    <SlateSortableResizable
      uuid={flowContainerItem.uuid}
      onResize={onResize}
      // onResizeStop={createThrottledOnResizeStop(onResizeStop)}
      onResizeStop={throttle(onResizeStop, RESIZE_THROTTLE_INTERVAL)}
      minWidth={`${minWidth * 0.99}%`}
      style={{ position: 'relative' }}
      defaultSize={{
        width: `${startingWidth}%`,
        height: 'auto',
      }}
      className={className}
      ui={ui}
      {...restProps}
    >
      {resizing && (
        <SnapIndicator style={{ position: 'absolute', right: '0px', zIndex: 100 }}>
          {`${Math.round(snapWidth!)}%`}
        </SnapIndicator>
      )}
      {children}
    </SlateSortableResizable>
  );
};

SortableChild.displayName = 'SortableChild';

SortableChild.defaultProps = {
  onResizeStop: () => {},
};

export default observer(SortableChild);
