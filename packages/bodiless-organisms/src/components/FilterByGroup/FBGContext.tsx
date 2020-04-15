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
  useRef,
  // forwardRef,
  useContext,
  createContext,
  FC,
} from 'react';
import { TagType } from '@bodiless/core';

export type BVLoaderData = {
  isLoaded: boolean;
};

type FBGContextType = {
  getSuggestions: () => TagType[],
  registerSuggestions: (tags: any) => any,
}

const FBGContext = createContext<FBGContextType>({
  getSuggestions: () => [],
  registerSuggestions: () => {},
});

const useFBGContext = () => useContext(FBGContext);

const FBGProvider: FC = ({
  children,
}) => {
  const refs = useRef<TagType[]>([]);
  const getSuggestions = () => (
    refs.current.reduce((acc, ref) => [...acc, ...ref.current ], [] as TagType[])
  );
  const registerSuggestions = (tags: any) => refs.current = tags;

  const newValue = {
    getSuggestions,
    registerSuggestions,
  }

  return (
    <FBGContext.Provider value={newValue}>
      {children}
    </FBGContext.Provider>
  );
};

export default FBGContext;
export {
  FBGContext,
  useFBGContext,
};
