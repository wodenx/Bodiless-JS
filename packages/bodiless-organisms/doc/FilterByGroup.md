# Filter By Group

 - Purpose
   - Add a control which allows to filter content by group/tag with an ability to create a custom filter.
- Properties
  - `suggestions` - a list of default suggestions (tags) - `[{id: '1', name: 'name'}, ...]`
- Editable Areas
  - Filter component ( Filter Categories and Tags )

## Usage
```js
import { FilterByGroupClean } from '@bodiless/organisms';

const suggestions = [
  {id: '1', name: 'Tag 1'},
  {id: '2', name: 'Tag 2'},
  {id: '2', name: 'Tag 2'},
];
// A clean, not styled version
<FilterByGroup suggestions={suggestions}>
  // <FilterableComponentOne>
  // <FilterableComponentTwo>
  // ...
</FilterByGroup>
```

## Styling
```js
import { flow } from 'lodash';
import { FilterByGroupClean } from '@bodiless/organisms';
import { withDesign, addClasses } from '@bodiless/fclasses';
import { asTextColorPrimary } from '../Elements.token';

const asFilterByGroupStyled = flow(
  withDesign({
    Wrapper: addClasses('flex'),
    FilterWrapper: addClasses('p-2 mr-5 w-1/4 bg-gray-400 flex flex-col'),
    ContentWrapper: addClasses('p-2 w-3/4'),
    ResetButton: flow(
      addClasses('my-2 underline self-end'),
      asTextColorPrimary,
    ),
    Filter: flow(
      withDesign({
        FilterCategory: addClasses('font-bold'),
        FilterGroupItemInput: addClasses('mr-3'),
        FilterGroupItemLabel: addClasses(''),
        FilterGroupItemPlaceholder: addClasses('text-gray-600'),
        FilterInputWrapper: addClasses('flex pb-2 items-center'),
        FilterGroupWrapper: addClasses('m-2 pl-2'),
      }),
      addClasses('p-4'),
    ),
  }),
);

const FilterByGroup = asFilterByGroupStyled(FilterByGroupClean);

export default FilterByGroup;
```

## Context
Every component places inside of FilterByGroup will have an access to FilterByGroupContext:
```js
import { useFilterByGroupContext } from '@bodiless/organisms';

const InsideFilterByGroup = (props) => {
  const context = useFilterByGroupContext();
  const { allTags, selectedTag } = context;

  const addTag = tag => context.addTag(tag);
  const setSelected = tag => context.setSelectedTag(tag);
  const resetSelected = () => context.setSelectedTag();
}
```
