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

import React, { FC, ComponentType, PropsWithChildren } from 'react';
import { flow } from 'lodash';
import {
  Fragment, A, DesignableComponentsProps, designable,
} from '@bodiless/fclasses';

import { useBurgerMenuContext } from './BurgerMenuContext';
import withBurgerMenuTogglerStyles from './token';

type TogglerComponents = {
  Wrapper: ComponentType<any>,
  Button: ComponentType<any>,
};

type TogglerProps = DesignableComponentsProps<TogglerComponents>;

const TogglerComponents: TogglerComponents = {
  Wrapper: Fragment,
  Button: A,
};

const TogglerBase: FC<TogglerProps> = ({ components, ...rest }) => {
  const { Wrapper, Button } = components;
  const { isVisible } = useBurgerMenuContext();

  return (
    <Wrapper>
      <Button {...rest}>
        {isVisible ? 'close' : 'menu' }
      </Button>
    </Wrapper>
  );
};

const BurgerMenuTogglerClean = designable(TogglerComponents, 'BurgerMenuToggler')(TogglerBase);

const asBurgerMenuToggler = <P extends object>(Component: ComponentType<P>) => (
  props: P & { onClick?: () => any },
) => {
  const { isVisible, toggle } = useBurgerMenuContext();
  const { onClick } = props;

  const extendOnClick = () => {
    if (onClick && typeof onClick === 'function') onClick();
    toggle(!isVisible);
  };

  return <Component {...props} onClick={extendOnClick} />;
};

const withBurgerMenuToggler = (
  Toggler: ComponentType<any>,
) => (Component: ComponentType<any>) => ({ children, ...rest }: PropsWithChildren<any>) => (
  <Component {...rest}>
    { children }
    <Toggler />
  </Component>
);

const BurgerMenuDefaultToggler = flow(
  asBurgerMenuToggler,
  withBurgerMenuTogglerStyles,
)(BurgerMenuTogglerClean);

export default BurgerMenuDefaultToggler;
export {
  withBurgerMenuToggler,
  asBurgerMenuToggler,
};
