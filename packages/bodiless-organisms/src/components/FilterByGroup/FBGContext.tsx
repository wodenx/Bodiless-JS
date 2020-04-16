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
import { v1 } from 'uuid';
import { TagType } from '@bodiless/core';
import { FBGContextOptions } from './types';

type FBGContextType = {
  getSuggestions: () => TagType[],
  useRegisterSuggestions: () => (tags: TagType[]) => void,
  setSelectedTag: (tag?: TagType) => void,
  setSelectedNode: (nodeId?: string) => void,
  selectedTag?: TagType,
  selectedNode?: string,
};

type RefType = {
  id: string,
  tags: TagType[],
};

const FBGContext = createContext<FBGContextType>({
  getSuggestions: () => [],
  useRegisterSuggestions: () => () => undefined,
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

  const getSuggestions = (): TagType[] => {
    const allSuggestions = refs.current.reduce(
      (acc: any, ref: any) => [...acc, ...ref.current.tags],
      suggestions || [],
    );
    return allSuggestions;
  };


  const useRegisterSuggestions = () => {
    const newRef = useRef({
      id: v1(),
      tags: [] as TagType[],
    });
    if (!refs.current.find((ref: any) => ref.current.id === newRef.current.id)) {
      refs.current.push(newRef);
    }
    return (tags: TagType[]) => {
      newRef.current.tags = tags;
    };
  };

  const newValue = {
    getSuggestions,
    useRegisterSuggestions,
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
  const { useRegisterSuggestions } = useFBGContext();
  return <Component {...props} registerSuggestion={useRegisterSuggestions()} />;
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
