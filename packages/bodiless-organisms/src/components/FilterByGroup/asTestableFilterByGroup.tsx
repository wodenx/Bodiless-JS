import {
  withDesign,
  addProps,
} from '@bodiless/fclasses';

const asTestableFilterByGroup = withDesign({
  Wrapper: addProps({ 'data-filter-by-group': 'wrapper' }),
  FilterWrapper: addProps({ 'data-filter-by-group': 'filter-wrapper' }),
  ContentWrapper: addProps({ 'data-filter-by-group': 'content-wrapper' }),
  ResetButton: addProps({ 'data-filter-by-group': 'reset-button' }),
  Filter: addProps({ 'data-filter-by-group': 'filter' }),
  FilterCategory: addProps({ 'data-filter-by-group': 'filter-category' }),
  FilterGroupItem: addProps({ 'data-filter-by-group': 'filter-group-item' }),
  FilterGroupWrapper: addProps({ 'data-filter-by-group': 'filter-group-wrapper' }),
  FilterInputWrapper: addProps({ 'data-filter-by-group': 'filter-input-wrapper' }),
});

export default asTestableFilterByGroup;
