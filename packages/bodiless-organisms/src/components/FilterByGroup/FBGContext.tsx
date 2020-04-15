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

/* eslint-disable react/jsx-indent */
import React, {
  useRef,
  useContext,
  createContext,
  FC,
  ComponentType as CT,
} from 'react';
import { isEmpty } from 'lodash';
import { TagType } from '@bodiless/core';
import { FBGContextOptions } from './types';

type FBGContextType = {
  getSuggestions: () => TagType[],
  registerSuggestion: (tags: TagType) => any,
  setSelectedTag: (tag?: TagType) => void,
  setSelectedNode: (nodeId?: string) => void,
  selectedTag?: TagType,
  selectedNode?: string,
};

const FBGContext = createContext<FBGContextType>({
  getSuggestions: () => [],
  registerSuggestion: () => {},
  setSelectedTag: () => {},
  setSelectedNode: () => {},
});

const useFBGContext = () => useContext(FBGContext);

const FBGProvider: FC<FBGContextOptions> = ({
  children,
  suggestions,
}) => {
  const [selectedTag, setSelectedTag] = React.useState<TagType>();
  const [selectedNode, setSelectedNode] = React.useState<string>();

  const refs = useRef<any>([]);

  const getSuggestions = (): TagType[] => (
    refs.current.reduce((acc: any, ref: any) => [...acc, ref.current], [])
  );

  const registerSuggestion = (suggestion: TagType) => {
    const allSuggestions = getSuggestions();
    const ref = useRef<TagType>();

    if (suggestion.id && !allSuggestions.some(_suggestion => _suggestion.id === suggestion.id)) {
      ref.current = suggestion;
      refs.current.push(ref);
    }
  };

  if (suggestions && !isEmpty(suggestions)) {
    suggestions.forEach(registerSuggestion);
  }

  const newValue = {
    getSuggestions,
    registerSuggestion,
    selectedTag,
    selectedNode,
    setSelectedTag,
    setSelectedNode,
  };

  return (
    <FBGContext.Provider value={newValue}>
      {children}
    </FBGContext.Provider>
  );
};

const withFBGContext = <P extends object>(
  Component: CT<P> | string,
) => (props: P & FBGContextOptions) => (
    <FBGProvider suggestions={props.suggestions}>
      <Component {...props} />
    </FBGProvider>
  );

const withRegisterTags = (Component: any) => (props: any) => {
  const { registerSuggestion } = useFBGContext();

  return <Component {...props} registerSuggestion={registerSuggestion} />;
};

const withFBGSuggestions = <P extends object>({
  suggestions,
}: FBGContextOptions) => (Component: CT<P> | string) => (props: P) => (
  <Component {...props} suggestions={suggestions} />
  );


export default FBGContext;
export {
  FBGContext,
  useFBGContext,
  withFBGContext,
  withRegisterTags,
  withFBGSuggestions,
};
