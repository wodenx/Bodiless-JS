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

import React, { ComponentType, FC } from 'react';
import {
  union, difference, capitalize, flow,
} from 'lodash';

type Classes = string | string[];

type FClasses = {
  operation?: 'add' | 'remove',
  classes?: Classes,
  parentFClasses?: FClasses,
};

export type StylableProps = {
  fClasses?: FClasses;
};

type Classable = {
  className?: string,
};

export type HOC = <P extends object>(C: ComponentType<P> | string) => ComponentType<P>;

const modifyClasses = (operation: 'add' | 'remove') => (classes?: Classes) => {
  const hoc = <P extends StylableProps>(Component: ComponentType<P> | string) => {
    const ModifyClasses: FC<P> = ({ fClasses, ...rest }) => {
      const newFClasses = {
        parentFClasses: fClasses,
        operation,
        classes,
      };
      return (
        <Component fClasses={newFClasses} {...rest as P} />
      );
    };
    ModifyClasses.displayName = `${capitalize(operation)}Classes`;
    return ModifyClasses;
  };
  hoc.addClasses = (classes$1?: Classes) => flow(hoc as HOC, modifyClasses('add')(classes$1) as HOC);
  hoc.removeClasses = (classes$1?: Classes) => flow(modifyClasses('remove')(classes$1) as HOC, hoc as HOC);
  hoc.flow = hoc as HOC;
  return hoc;
};

/**
 * HOC which specifies that a list of classes should be added to the wrapped component's className.
 *
 * @param classes A string or array of classes to add.
 */
const addClasses = modifyClasses('add');

/**
 * HOC which specifies that a list of classes should be removed from the wrapped component's
 * className.
 *
 * @param classes A string or array of classes to remove. If not specified, then *all* classes will
 * be removed.
 */
const removeClasses = modifyClasses('remove');

const asArray = (classes: Classes = []) => (Array.isArray(classes) ? classes : classes.split(' '));
const asClassName = (classes: Classes) => {
  const asString = (Array.isArray(classes) ? classes.join(' ') : classes);
  return asString || undefined;
};
const asFClasses = (classes: Classes): FClasses => ({
  operation: 'add',
  classes,
});

const apply = (
  { operation, classes, parentFClasses }: FClasses = {},
  className: Classes = [],
): Classes => {
  let newClasses;
  switch (operation) {
    case 'add': newClasses = union(asArray(classes), asArray(className)); break;
    case 'remove': newClasses = classes ? difference(asArray(className), asArray(classes)) : []; break;
    default: newClasses = className;
  }
  return parentFClasses ? apply(parentFClasses, newClasses) : newClasses;
};

/**
 * Makes any component or intrinsic element stylable using FClasses. When the component is
 * wrapped by `addClasses()` or `removeClasses()`, the specified operations will be applied
 * in reverse order up the component tree, so that the outermost operations take precedence.
 *
 * @param Component The component to be made stylable.
 */
const stylable = <P extends Classable>(Component: ComponentType<P> | string) => {
  const Stylable = (props: P & StylableProps) => {
    const { fClasses, className, ...rest } = props;
    const classes = apply(fClasses);
    const newClassName = asClassName(className ? apply(asFClasses(className), classes) : classes);
    return <Component {...rest as unknown as P} className={newClassName} />;
  };
  Stylable.displayName = 'Stylable';
  return Stylable;
};

export {
  addClasses,
  removeClasses,
  stylable,
};
