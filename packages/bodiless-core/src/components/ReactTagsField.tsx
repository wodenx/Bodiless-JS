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

import React, { useState } from 'react';
import { useFormApi, Text } from 'informed';
import ReactTags, { ReactTagsProps, Tag } from 'react-tag-autocomplete';

export type TagType = {
  id: string,
  name: string,
} | Tag;

export type ReactTagsFieldProps = {
  allowMultipleTags?: boolean,
} & Omit<ReactTagsProps, 'handleDelete' | 'handleAddition'>;

const ReactTagsField = (props: ReactTagsFieldProps) => {
  const formApi = useFormApi();
  const { allowMultipleTags, ...rest } = props;
  const [tags, updateTags] = useState<TagType[]>([]);

  const handleAddition = (tag: TagType) => {
    const newTags = allowMultipleTags ? [...tags, tag] : [tag];
    formApi.setValue('tags', newTags);
    updateTags(newTags);
  };

  const handleDelete = (i: number) => {
    const newTags = tags.slice(0);
    newTags.splice(i, 1);
    formApi.setValue('tags', newTags);
    updateTags(newTags);
  };

  return (
    <React.Fragment>
      <Text type="hidden" field="tags" />
      <ReactTags
        tags={tags}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        {...rest}
      />
    </React.Fragment>
  );
};

export default ReactTagsField;
