import { withoutProps, ifToggledOn, ifToggledOff } from '@bodiless/core';
import { replaceWith } from '@bodiless/fclasses';
import { difference, flowRight } from 'lodash';
import useTagsAccessors from './TagButton/TagModel';

type ToggleByTagsProps = {
  selectedTags: any[];
};

/**
 * Determine which component to show based on selected tags.
 * @param selectedTags
 *  The selected tags to use.
 */
const useToggleByTags = <P extends object>({
  selectedTags,
}: P & ToggleByTagsProps) => {
  const { getTags } = useTagsAccessors();
  const itemTags = getTags();
  const tags = itemTags.map(t => t.name);
  return difference(selectedTags, tags).length === 0;
};

const ifTagsSelected = ifToggledOn(useToggleByTags);
const ifTagsNotSelected = ifToggledOff(useToggleByTags);

const withFilterByTags = flowRight(
  ifTagsNotSelected(replaceWith(() => null)),
  withoutProps(['selectedTags']),
);

export { ifTagsSelected, withFilterByTags, ifTagsNotSelected };
