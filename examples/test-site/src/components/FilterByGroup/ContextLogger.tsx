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

import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Div, Button, addClasses,
} from '@bodiless/fclasses';
import {
  FilterByGroupTag,
  useFilterByGroupContext,
} from '@bodiless/organisms';
import { TagType } from '@bodiless/organisms/lib/components/FilterByGroup/types';

const AddButton = addClasses('px-2 mb-2 border border-gray-600')(Button);
const TagComponent = addClasses('px-3 my-2 mr-2 mb-2 border border-gray-600 inline-block')(Div);

const randomTags: TagType[] = [];
/* eslint-disable no-bitwise */
const addRandomTag = () => randomTags.push(new FilterByGroupTag(`#${(Math.random() * 0xFFFFFF << 0).toString(16)}`));
const getRandomTags = () => randomTags;


const ContextLoggerBase: FC = () => {
  const context = useFilterByGroupContext();
  const { allTags, selectedTag } = context;

  context.addTagGetter(getRandomTags);

  const tagElements = allTags.map(tag => (
    <TagComponent key={tag.id}>{ tag.name || ' - ' }</TagComponent>
  ));

  return (
    <Div>
      <AddButton onClick={() => addRandomTag()}>Add Random Tag</AddButton>
      <br />
      <strong>Selected Tag: </strong>
      <pre>
        {JSON.stringify(selectedTag, null, 2)}
      </pre>

      <strong>All Tags: </strong>
      <Div>
        { tagElements }
        <pre>
          {JSON.stringify(allTags, null, 2)}
        </pre>
      </Div>

    </Div>
  );
};

const ContextLogger = observer(ContextLoggerBase);

export default ContextLogger;
export {
  ContextLogger,
};
