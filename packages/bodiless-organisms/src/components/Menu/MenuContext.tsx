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
  FC, createContext, useContext, useState, ComponentType, useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { PageContextProvider, useEditContext, useUUID } from '@bodiless/core';

type MenuContextType = {
  isSubmenuOpen: boolean,
  setSubmenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
};

const MenuContext = createContext<MenuContextType>({
  isSubmenuOpen: false,
  setSubmenuOpen: () => null,
});

const useMenuContext = () => useContext(MenuContext);

// Used for conditional fClasses.
const isMenuOpen = () => {
  const { isEdit } = useEditContext();
  const { isSubmenuOpen } = useMenuContext();

  return isEdit ? isSubmenuOpen : false;
};

const MenuProvider: FC = observer(({ children }) => {
  const { isActive } = useEditContext();
  const [isSubmenuOpen, setSubmenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setSubmenuOpen(isActive);
  }, [isActive]);

  return (
    <MenuContext.Provider value={{ isSubmenuOpen, setSubmenuOpen }}>
      { children }
    </MenuContext.Provider>
  );
});

const withMenuContext = <P extends Object>(
  Component: ComponentType<P> | string,
) => (props: P) => (
  <PageContextProvider name={`menu-${useUUID()}`} id={`menu-${useUUID()}`}>
    <MenuProvider>
      <Component {...props} />
    </MenuProvider>
  </PageContextProvider>
  );

export default withMenuContext;
export {
  MenuProvider,
  useMenuContext,
  isMenuOpen,
};
