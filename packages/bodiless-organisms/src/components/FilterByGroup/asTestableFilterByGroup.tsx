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
});

export default asTestableFilterByGroup;
