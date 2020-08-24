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

import { useCallback } from 'react';
import { flowRight } from 'lodash';
import { withoutProps } from './hoc';
import useContextMenuForm, {
  FormBodyProps as ContextMenuFormBodyProps,
} from './contextMenuForm';
import { withMenuOptions } from './PageContextProvider';
import type { EditButtonProps, EditButtonOptions, FormBodyRenderer } from './Types/EditButtonTypes';

export const useEditFormProps = <P extends object, D extends object>(
  props: P & EditButtonProps<D> & { renderForm: FormBodyRenderer<P, D> },
) => {
  const {
    componentData: initialValues,
    setComponentData,
    onSubmit,
    dataHandler,
    renderForm: renderForm$,
  } = props;

  // Pass component props to the render function.
  const renderForm = (p: ContextMenuFormBodyProps<D>) => renderForm$({
    ...p,
    // @TODO: Avoid passing all the props.
    componentProps: props,
  });

  const initialValues$ = dataHandler && dataHandler.initialValueHandler
    ? dataHandler.initialValueHandler(initialValues) : initialValues;
  const submitValues = (values: D) => {
    setComponentData(values);
    if (onSubmit) onSubmit();
  };
  const submitValues$ = dataHandler && dataHandler.submitValueHandler
    ? flowRight(submitValues, dataHandler.submitValueHandler) : submitValues;
  return {
    submitValues: submitValues$,
    initialValues: initialValues$,
    renderForm,
  };
};

export const createMenuOptionHook = <P extends object, D extends object>(
  options: EditButtonOptions<P, D> | ((props: P) => EditButtonOptions<P, D>),
) => (
    props: P & EditButtonProps<D>,
  ) => {
    const options$ = typeof options === 'function' ? options(props) : options;
    const {
      renderForm,
      ...rest
    } = options$;
    const { isActive } = props;
    const form = useContextMenuForm(useEditFormProps({ ...props, renderForm }));
    const handler = useCallback(() => form, [...Object.values(props)]);
    const menuOptions = [{
      ...rest,
      handler,
      isActive, // Do we need this?
    }];
    return menuOptions;
  };

/**
 * Uses the provided options to create an HOC which adds an edit button provider
 * to the wrapped component.
 *
 * @param options The options defining the edit button.
 *
 * @return An HOC which will add an edit button for the wrapped component.
 */
const withEditButton = <P extends object, D extends object>(
  options: EditButtonOptions<P, D> | ((props: P) => EditButtonOptions<P, D>),
) => flowRight(
    withMenuOptions({
      useMenuOptions: createMenuOptionHook(options),
      name: options.name,
    }),
    withoutProps(['setComponentData', 'isActive']),
  );

export default withEditButton;
