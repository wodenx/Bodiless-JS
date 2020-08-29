import React, {
  ComponentType as CT,
} from 'react';
import { v1 } from 'uuid';
import { EditButtonProps } from './Types/EditButtonTypes';
import { useEditFormProps } from './withEditButton';
import type { FormBodyRenderer as Renderer } from './Types/EditButtonTypes';
import { useRegisterSnippet } from './withCompoundForm';
import type { Snippet } from './withCompoundForm';

type Options<P, D> = {
  renderForm: Renderer<P, D>,
  submitValueHandler?: (values: D) => any,
  initialValueHandler?: (values: any) => D,
};

const withEditFormSnippet = <P extends object, D extends object>(options: Options<P, D>) => (
  (Component: CT<P>) => {
    const id = v1();
    const { renderForm, initialValueHandler, submitValueHandler } = options;
    const WithEditFormSnippet = (props: P & EditButtonProps<D>) => {
      const { renderForm: render, ...rest } = useEditFormProps({
        ...props,
        renderForm,
        initialValueHandler,
        submitValueHandler,
      });
      const snippet: Snippet<D> = {
        id,
        ...rest,
        render: render || (() => <></>),
      };
      useRegisterSnippet(snippet);
      return <Component {...props} />;
    };
    return WithEditFormSnippet;
  }
);

export default withEditFormSnippet;
