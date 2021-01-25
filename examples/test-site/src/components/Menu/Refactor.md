# Navigation and Breadcrumbs refactor

## Goal
Improved DX and reduced LOE for activating navigation.

## High Level
- create new @bodiless/navigation package
  - possibly also create new @canvasx/navigation package, if necessary.
- deprecate SimpleMenu/MegaMenu.  Export a single menu which can be extended
  with different submenu types.
- clearly separate schema from styling
- include breadcrumb source logic by default in core menu hocs (it is needed
  for active trails even on sites without breadcrumbs).
- remove react-burger-menu library and replace with custom implementation.

## Example API (brand level)

Note - in the docs below, methods which are defined at brand level have a `$` prefix

### Create the base schema
```js
const $withBrandMenuSchema = flow(
  // First apply a basic token from @bodiess/navigation to make a <ul> into a menu:
  asMenu, 
  // Now add submenus.  Each of these takes optional HOC(s) to apply to the title
  withListSubMenu(
    // Specifying title is optional - this is the default.
    // Brands should export these tokens if customized `$asBrandMenuLink = asMenuLink(...)`
    asMenuLink(
      // Note asMenuLInk will need to be refactored to accept both editors.
      // Or maybe use a withDesign pattern? Create a designable, editable link
      asEditable('text', 'Menu Item'),
      withBodilessLinkToggle(asBodilessLink, Div)('link'),
    )
  ),
  // Only add additional submenu types if needed
  withToutSubMenu(
    // Again, specifying the title explicitly is optional
    asMenuTout(
      // Specifying the editors is also optionsl.  We should have a bodiless
      // or canvasx default "withToutEditors".
      $withToutEditors,
    )
  ),
  withColumnSubMenu(
    // Again, editors are optional.  If supplied, they apply
    // to both column headers and column items.
    asMenuLink($withTextEditor, $withLinkEditor),
  ),
);
```

## Apply styling

### First a token to apply generic top nav styles exported from @bodiless/navigation

```js
const $asTopNav = flow(
  asTopNav,
  // withSubMenuDesign is new helper which lets you target submenus directly
  withSubMenuDesign({
    List: asTopNavList,
    Touts: asTopNavTouts,
    ..
  }),
});
```
> Note: These styles should be revisited - I think there are things currently
> done at site level which should be moved to these tokens. In particular, I
> noticed that without additional styling, the drop-downs have incorrect
> z-index.

Maybe even sweeten this further to reduce boilerplate: export an `asTopNav' as
we do now, but pass it the predefined sublist types // for which to add stles

```js
asTopNav('List', 'Touts');
```

### Then, site level styles:

```js


const $asBrandTopNav = flow(
  asTopNav('List', 'Columns'),
  $withTopNavMainStyles,
  withSubMenuDesign({
    List: $withTopNavListStyles,
    Columns: $withTopNaveColumnStyles,
    ...,
  }),
);
```

In the above, each of the `$with...Styles` hocs applies a simple list design, thouhgh
the one for colukmn lists also has to design its sublist, eg.
```js
const $asColumnMenuWrapper = withDesign({
  // We need to document clearly that the "Wrapper" of a sublist has 2 parts,
  // The <li> which is the outer wrapper and the <ul> which is the List.
  WrapperItem: withSublistPadding,
  List: withBullets,
}),

const $withTopNavColumnStyles = withDesign({
  Wrapper: $asColumnMenuWrapper;
  Item: withDesign({
    Wrapper: $asColumnSubMenuWrapper,
    Item: ...,
    Title: ...,
  })
});
```
> Note, when creating a compound design token like this, it makes sense to export
> tokens for each key. This allows re-composition downstream.

#### Applying tokens to all lists.

In some cases, we may want to apply the same designs to all lists (eg, for active trails, eg

```js
// Note we create and use element token.
const $asActiveTitle = addClassesIf(useIsActiveTrail)('text-yellow underline');

const $withActiveTitleStyles = flow(
  withDesign({
    Title: $asActiveTitle,
  })
  withSubMenuDesign({
    List: withDesign({
      Title: $asActiveTitle,
    }),
    Columns: flow(
      withDesign({
        Title: $asActiveTitle,
      }),
      withdesign({
        Item: withDesign({
          Title: $asActiveTitle,
        }),
      }),
    ),
    Touts: ...
  }),
);
```

That's a lot of boilerplate, so let's consider a shorthand similar to what
was suggested above for the default top nav styles:
```js
const $withActiveTrailStyles = withMenuDesign('List', 'Columns')(withDesign({
  Title: $asActiveTitle,
});
```

### Same pattern for burger menu styling

```js
const $withBurgerMenuStyles = flow(
  // Same shorthand as `asTopNav` above.
  asBurgerMenu('List', 'Touts'),
  $withBurgerMenuMainStyles,
  withSubMenuDesign({
    List: $withBurgerMenuListStyles,
    Touts: $withBurgerMenuToutStyles,
  }),
  withMenuDesign('List', 'Touts')($withBurgerMenuCommonStyles),
);
```

But, for Burger menus, we need to wrap the actual menu in the burger chrome. In order
to keep the api for burger and main menu as similar as possible, let's create an
HOC to do the wrapping, like

```js
const withBurgerMenuWrapper = (Component) => (props) => flow(
  replaceWith(BurgerMenuClean),
  withDesign({
    Menu: replaceWith(Component),
  })
);
```
Maybe we can even put this inside `asBurgerMenu` so we'd have:
```js
const $withBurgerMenuStyles = flow(
  $withBurgerMenuMainStyles,
  withSubMenuDesign(
    List: $withBurgerMenuListStyles,
    ...
  ),
  ...,
);

cosnt $asBrandBurgerMenu = flow(
  $withBurgerMenuStyles,
  asBurgerMenu('List', ...),
  // The design below applies to elements of the burger menu envelope.
  withDesign({
    ...
  }),
);
```
The only issue here is that, if you want to target the menu later, you need to use
one additional level of indirection:

```js
const $$withExtendedBurgerMenuStyles = withDesign({
  Menu: withSubMenuDesign(...),
});
```
> Note - in the current custom burger menu wrapper as implemented in the pilot
> we have 'Menu' and 'Body" design keys, which refer the the `<nav>` wrapper
> component and the actual menu respectively. We should rename these
to `Nav` (for the `<nav>` wrapper) and `Menu` (for the actual menu).

### Responsive variants

After creating `$asBrandBurgerMenu` and `$asBrandTopNav` above, we're left
with the following, which is probably fine.
```js
cosnt $withBrandMenuVariants = flow(
  withResponsiveVariants({
    _default: $asBrandBurgerMenu,
    lg: $asBrandTopNav,
  }),
  // Note - the css visibility applied below could be bundled into
  // the $asSiteBurgerMenu and $asSiteTopNav,
  withDesign({
    _default: $asMobileOnly,
    lg: $asDesktopOnly,
  }),
);

const $asNavigation = flow(
  $withMenuSchema,
  $withMenuVariants,
);
```

THis token can then be applied directly to the 'Navigation' key in the layout (the
default component for that key would probalby be `Ul`):
```js
const $asSiteLayout = withDesign({
  Navigation: $asSiteNavigation,
});
```

### Customizing

Some examples of how local customizations could be achieved. Tokens defined locally
are prefixed with double `$$`.

#### Swapping out a title editor

```js
// Define o custom editor
const $$MyEditor = withNodeKey('text')($$MyEditorBase);

const $$withMyEditor = flow(
  withMenuDesign('List', 'Columns')({
    Title: withDesign({
      // Depends on the designable child API
      Child: replaceWith(MyEditor),
    }),
  }),
);
const $$withMyMenuCustomization = withDesign({
  _default: withDesign({
    Menu: $$withMyEditor,
  }),
  lg: $$withMyEditor,
});

const $$asMyLayout = withDesign({
  Menu: $$withMyMenuCustomization,
});

```
or, maybe it's clearer to recompose at a lower level:

```js
const $$asMyNavigation = flow(
  $withMenuSchema,
  $$withMyEditor,
  $withMenuVariants,
);
const $$asMyLayout = withDesign({
  Menu: flow(
    replaceWith(Ul),  // Or have a `reset` hoc in fclasses which removes all previous designs.
    $$asMyNavigation,
  ),
});
```

### Changing the style of a menu tout

```js
// Define our custom tout styling
const $$withSiteMenuToutStyles = flow(
  asToutVertical,
  $withToutDefaultStyle,
);

// create a submenu design which replaces default tout with custom one.
const $$withSiteCustomMenuTout = withSubMenUDesign({
  Touts: withDesign({
    Title: flow(
      reset, // Or `replaceWith(ToutClean)`
      $withBrandMenuToutSchema, // We have to re-apply the schema bc of the reset above.
      $$withSiteMenuToutStyles,
    ),
  }),
}),

// Inject this into the layout
const $$asSiteLayout = withDesign({
  Menu: withDesign({
    lg: $$withSiteCustomMenuTout,
  }),
});
```

## Breadcrumbs

### Breadcrumb source

The current [asBreadcrumbSource](https://github.com/johnsonandjohnson/Bodiless-JS/blob/master/packages/bodiless-components/src/Breadcrumbs/asBreadcrumb.tsx#L113-L136) should be folded into the
basic `asMenu` hoc which is exported by @bodiless/navigation. This means it may need to be
decomposed so that the application of `asBreadcrumb` to submenu items happens as part of the new `with...SubMenu` hoc's (so as to allow building up a menu with different submenu types).

The
[Breadcrumb Store Provider](https://github.com/johnsonandjohnson/Bodiless-JS/blob/master/examples/test-site/src/components/Layout/index.tsx#L46)
should be dealt with in scope of creating a designable Layout component

### Breadcrumb component 

Here, the primary consideration is to separate schema from styling.

- Remove
  [the pre-connected `Breadcrumbs` component](https://github.com/johnsonandjohnson/Bodiless-JS/blob/master/packages/bodiless-components/src/Breadcrumbs/Breadcrumbs.tsx#L312-L315)
  and instead export an `asMenuBreadcrumbs` which is basically just
  ```
  flow(
    withBreadcrumbItemsFromStore,
    observer,
  );
  ```
- 

## Suggested Bodiless Refactors

```js
const asMenu = (nodeKeys?: WithNodeKeyProps) => flow(
  asBodilessList(nodeKeys, undefined, () => ({ groupLabel: 'Menu Item' })),
  asStylableList,
  withDesign({
    Item: asChameleonSubList(() => ({ formTitle: 'Sub-Menu Type' })),
  }),
  withMenuContext,
  asBreadcrumbSource, // Version which only applies asBreadcrumb to top level items.
);

const withSubMenuDesign = design => withDesign({
  Item: withDesign(design),
});

const withMenuDesign = keys => design => flow(
  withDesign(design),
  ...keys.map(key => withSubMenuDesign({
    [key]: design,
  })),
);

const asMenuSubList = flow(asMenuSublistOld, withDesign({ Item: asBreadcrumb }));

const withListSubMenu = withSubMenuDesign({
  List: asMenuSubList
});

const withToutSubMenu = withSubMenuDesign({
  Touts: asMenuSubList,
});

const withColumnSubMenu = withSubMenuDesign({
  Columns: flow(
    asMenuSubList,
    withDesign({
      Item: asMenuSubList,
    }),
  ),
});
```

## Minimal Implementation

Below is a minimal implementation for a brand which uses only column menus and list submenus
with the default schema:git l