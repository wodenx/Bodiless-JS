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

import {
  useContext, useRef, EventHandler, useCallback,
  useEffect,
} from 'react';
import { v1 } from 'uuid';
import PageEditContext from './PageEditContext';

export const useEditContext = () => useContext(PageEditContext.context);

export const useUUID = () => useRef(v1()).current;

/**
 * Utility hook to extend an existing handler.
 * Only applies the extension when in edit mode.
 *
 * @param event The name of the event whose handler is to be extended
 * @param extender Function to extend the existing handler. Will be called second.
 * @param props The props of the component which may contain an original handler.
 *
 * @return An object of the form { event: extendedHandler }.
 */
export const useExtendHandler = (
  event: string,
  extender: EventHandler<any>,
  props: any,
) => {
  const { [event]: handler } = props;
  const context = useEditContext();

  const handler$1 = useCallback((e: React.SyntheticEvent<any>) => {
    // Run the original handler, if it exists.
    if (handler) handler(e);
    extender(e);
  }, [handler, extender]);

  // Don't extend the handler when not in edit mode.
  return {
    [event]: context.isEdit ? handler$1 : handler,
  };
};

export const useContextActivator = (
  event = 'onClick',
  handler?: EventHandler<any>,
) => {
  const context = useEditContext();

  const extender = useCallback((e: React.SyntheticEvent<any>) => {
    // Prevent default behavior (maybe move this to asBodilessLink)
    const preventDefault = e && e.preventDefault
      && e.currentTarget && e.currentTarget.getAttribute('bl-prevent') !== 'false';
    if (preventDefault) e.preventDefault();
    // Do not activate the context if it is already innermost.
    if (context.isInnermost) return;
    // Do not activate if this event already activated an inner context.
    if (e.target) {
      const activatingElement = (e.target as HTMLElement).closest('[data-bl-activator=true]');
      const thisElement = e.currentTarget;
      if (thisElement !== activatingElement) return;
    }
    context.activate();
  }, [context, context.isEdit]);

  return {
    ...useExtendHandler(event, extender, { [event]: handler }),
    'data-bl-activator': true,
  };
};

/**
 * @private
 *
 * Utility hook to properly memoize a getter function so that the function itself is invariant,
 * but the return value can change. Useful when you want to prevent re-render of components
 * which use the getter every time the return value changes.
 *
 * @param value The current value to be returned by the getter.
 *
 * @return A memoized getter function which will return the current value
 */
export const useGetter = <P extends any>(value: P): () => P => {
  const ref = useRef<P>();
  const getter = useCallback(() => ref.current as P, []);
  ref.current = value;
  return getter;
};

/**
 *
 * Utility hook to detect click outside of the `ref` element and execute the callback.
 *
 * Usage:
 *
 * ```js
 * useClickOutside(ref, () => {
 *   alert('Clicked outside');
 * });
 * ```
 *
 * @param ref `ref` from React.useRef() or React.createRef
 * @param callback A callback to execute when click outside is detected
 *
 */
export const useClickOutside = (ref: React.MutableRefObject<any>, callback: () => void) => {
  const escapeListener = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      callback();
    }
  }, []);

  const clickListener = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', clickListener);
    document.addEventListener('keyup', escapeListener);

    return () => {
      document.removeEventListener('click', clickListener);
      document.removeEventListener('keyup', escapeListener);
    };
  });
};
