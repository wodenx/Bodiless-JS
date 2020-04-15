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
import { flow } from 'lodash';
// import { observer } from 'mobx-react-lite';
import {
  Div, Button, addClasses,
} from '@bodiless/fclasses';
import {
  useFBGContext,
  withRegisterTags,
} from '@bodiless/organisms';
import { BodilessTag, TagType } from '@bodiless/core';

const AddButton = addClasses('px-2 mb-2 border border-gray-600')(Button);
const TagComponent = addClasses('px-3 my-2 mr-2 mb-2 border border-gray-600 inline-block')(Div);

type Props = {
  registerSuggestion: (tags: TagType) => any,
};

const ContextLoggerBase: FC<Props> = ({ registerSuggestion }) => {
  const { getSuggestions, selectedTag } = useFBGContext();
  const allSuggestions = getSuggestions();

  const tagElements = allSuggestions.map(tag => (
    <TagComponent key={tag.id}>{ tag.name || ' - ' }</TagComponent>
  ));

  /* eslint-disable no-bitwise, max-len */
  /*
   * TODO: Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
   * This happenes in both cases: when we pass registerSuggestion as a prop
   * and if we get it from useFBGContext()
   */
  const addRandomTag = () => (
    registerSuggestion(new BodilessTag(`#${(Math.random() * 0xFFFFFF << 0).toString(16)}`))
  );

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
          {JSON.stringify(allSuggestions, null, 2)}
        </pre>
      </Div>

    </Div>
  );
};

const ContextLogger = flow(
  // observer,
  withRegisterTags,
)(ContextLoggerBase);

export default ContextLogger;
export {
  ContextLogger,
};
