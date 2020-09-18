import { flow } from 'lodash';
import { asSubList, asBodilessList, withSimpleSubListDesign } from '@bodiless/components';
import { withDesign, addClasses, HOC } from '@bodiless/fclasses';
import { asStylableList } from '@bodiless/organisms';
import { withLinkTitle } from './ListDemo';
import { replaceable } from '@bodiless/fclasses/lib/Design';

const asSimpleSubList = flow(
  replaceable,
  asSubList,
  asStylableList,
);

const withSubListDesign = withSimpleSubListDesign(4);

const SimpleList = flow(
  asBodilessList(),
  asStylableList,
  withSubListDesign(asSimpleSubList as HOC),
  withSubListDesign(withLinkTitle),
  withLinkTitle,
  withSubListDesign(withDesign({ Item: addClasses('ml-5') })),
)('ul');

export default SimpleList;
