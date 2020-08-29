import React, { useCallback, ComponentType, FC } from 'react';
import {
  useMenuOptionUI, useEditFormProps,
  ContextMenuForm, withNodeKey, withNode, withNodeDataHandlers,
  ifReadOnly, withoutProps, ifEditable, withMenuOptions, withContextActivator,
  withActivatorWrapper, withLocalContextMenu, withData,
} from '@bodiless/core';
import type {
  EditButtonProps, ContextMenuFormProps, WithNodeKeyProps, AsBodiless,
} from '@bodiless/core';
import { ReactMarkdownProps } from 'react-markdown';
import { flowRight } from 'lodash';

import MarkdownField from './InformedMarkdown';

type Props = ReactMarkdownProps & { readonly timestamp?: string };
type Data = Pick<Props, 'source'|'timestamp'>;
type EditProps = Props & EditButtonProps<Data>;

const useMarkdownEditFormProps = (props: EditProps) => {
  const { submitValues, ...rest } = useEditFormProps(props);
  const customSubmitValues = useCallback(
    (values: Data) => {
      const newValues = { ...values, timestamp: new Date().toString() };
      submitValues(newValues);
    },
    [submitValues],
  );
  return {
    submitValues: customSubmitValues,
    ...rest,
  };
};

const Form: FC<ContextMenuFormProps> = props => {
  const { ComponentFormLabel, ComponentFormTitle } = useMenuOptionUI();
  return (
    <ContextMenuForm {...props}>
      <ComponentFormTitle>Markdown</ComponentFormTitle>
      <ComponentFormLabel>Content</ComponentFormLabel>
      <MarkdownField field="source" />
    </ContextMenuForm>
  );
};

const useMenuOptions = (props: EditProps) => {
  const editFormProps = useMarkdownEditFormProps(props);
  const render = (formProps: ContextMenuFormProps) => (
    <Form {...formProps} {...editFormProps} />
  );
  return [{
    icon: 'edit',
    name: 'edit',
    label: 'Edit',
    global: false,
    local: true,
    handler: useCallback(() => render, [...Object.values(editFormProps)]),
  }];
};
const withTimestamp = (Component: ComponentType<Props>) => {
  const WithTimestamp = ({ timestamp, ...rest }: Props) => (
    <div>
      <Component {...rest} />
      <hr />
      Last modified:
      {timestamp}
    </div>
  );
  return WithTimestamp;
};

const asCustomBodilessMarkdown: AsBodiless<Props, Data> = (
  nodeKey?: WithNodeKeyProps,
  defaultData: Data = { source: 'InitialValue' },
) => flowRight(
  withNodeKey(nodeKey),
  withNode,
  withNodeDataHandlers(defaultData),
  ifReadOnly(
    withoutProps(['setComponentData']),
  ),
  ifEditable(
    withMenuOptions({ useMenuOptions }),
    withContextActivator('onClick'),
    withActivatorWrapper('onClick', 'div'),
    withLocalContextMenu,
  ),
  withData,
  withTimestamp,
);

export default asCustomBodilessMarkdown;
