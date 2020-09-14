import { flow } from 'lodash';
import { asHorizontalSubMenu, asHorizontalMenu, asToutHorizontal } from '@bodiless/organisms';
import { withDesign, addProps, addClasses } from '@bodiless/fclasses';
import { withMenuSublistStyles, withMenuListStyles } from '../Menus/token';
import { asExceptMobile } from '../Elements.token';
import './megamenu.css';
import { asToutWithPaddings, asToutDefaultStyle } from '../Tout/token';

const withMegaMenuStyles = withDesign({
  // @TODO: We add the class here to style rc-menu. Maybe can use design API if we ditch rc-menu.
  Wrapper: addProps({ popupClassName: 'container bl-mega-menu' }),
  // @TODO: What's the best starting width? They will shrink to fit if there are more.
  Item: addClasses('w-1/3'),
});

const withColumnStyles = flow(
  withMenuSublistStyles,
);

const withBasicSubMenuStyles = flow(
  asHorizontalSubMenu,
  withMenuSublistStyles,
);

const withToutSubMenuStyles = flow(
  withBasicSubMenuStyles,
  withMegaMenuStyles,
);

const withColumnSubMenuStyles = flow(
  withDesign({
    Item: withColumnStyles,
  }),
  withBasicSubMenuStyles,
  withMegaMenuStyles,
);

const withChamelionSubMenuStyles = withDesign({
  Basic: withBasicSubMenuStyles,
  Touts: withToutSubMenuStyles,
  Columns: withColumnSubMenuStyles,
});

const withMenuStyles = flow(
  withDesign({
    Item: withChamelionSubMenuStyles,
  }),
  asHorizontalMenu,
  withMenuListStyles,
  asExceptMobile,
);

const withSimpleSubMenuStyles = withDesign({
  Basic: withBasicSubMenuStyles,
});

export const withSimpleMenuStyles = flow(
  withDesign({
    Item: withSimpleSubMenuStyles,
  }),
  asHorizontalMenu,
  withMenuListStyles,
  asExceptMobile,
);

export const withMenuToutStyles = flow(
  asToutWithPaddings,
  asToutDefaultStyle,
  asToutHorizontal,
);

export default withMenuStyles;
