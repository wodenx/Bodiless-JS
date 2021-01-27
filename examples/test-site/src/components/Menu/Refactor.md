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

Define the schema for menu titles. This is only required if you don't want to
use the default editors. Note that we do not add node keys here. They will be
added automatically.

```js
export const $withMenuTitleSchema = flow(
  withDesign({
    // Replace the link editor with a cusgtom one
    Link: flow(reset, withBodilessLinkToggle(asBodilessLink, Div)()),
    // Extend the text editor
    Text: asAutoSuperscript,
  }),
);
```

Define the menu schema:

```js
const $withBrandMenuSchema = flow(
  // Make a menu with default title schema
  asMenu('MainMenu'),
  // Add submenus.  Each has default title schema
  withListSubMenu,
  withColumnSubMenu,
  // The
  withToutSubMenu(withToutEditors),
  withDesign({
    Title: $withMenuTitleSchema,
  })
  withDesign({
    Item: withExtendedDesign()
  })
  // See below for 
  withMenuDesign()({
    Title: $withMenuTitleSchema,
  }),
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
}),

const $withTopNavColumnStyles = withDesign({
  Wrapper: withDesign({
    // We need to document clearly that the "Wrapper" of a sublist has 2 parts,
    // The <li> which is the outer wrapper and the <ul> which is the List.
    WrapperItem: withSublistPadding,
    List: withBullets,
  }),
  Item: withDesign({
    Wrapper: ...
    Item: ...,
    Title: ...,
  }),
  ...
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
const $withActiveTrailStyles = withMenuDesign('List', 'Columns')({
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

The primary goals here are:
- Clearly separate schema from styling
- Provide defaults so that the most common use-cases require minimal configuration
- Populate the breadcrumb store by default for all menus.

### Breadcrumb source

The current [asBreadcrumbSource](https://github.com/johnsonandjohnson/Bodiless-JS/blob/master/packages/bodiless-components/src/Breadcrumbs/asBreadcrumb.tsx#L113-L136) should be folded into the
basic `asMenu` hoc which is exported by @bodiless/navigation. This means it may need to be
decomposed so that the application of `asBreadcrumb` to submenu items happens as part of the new `with...SubMenu` hoc's (so as to allow building up a menu with different submenu types).

We also want to avoid having to replicate the schema for breadcrumbs and menu items
In order to avoid having to specify the schema for breadcrumbs and menu items separately, let's give the
asMenuLink and asMenuTout hoc's signatures like:

```js
type MenuTitleSchema = {
  nodeKeys?: {
    title?: string,
    link?: string,
    text?: string,
  },
  asEditableLink?,
};
```




The
[Breadcrumb Store Provider](https://github.com/johnsonandjohnson/Bodiless-JS/blob/master/examples/test-site/src/components/Layout/index.tsx#L46)
should be dealt with in scope of creating a designable Layout component

### Breadcrumb component 

Here, the primary consideration is to separate schema from styling, and to provide
defaults so that the most common use-cases require minimal configuration. 
which are currently site-level to the package.

- Remove
  [the pre-connected `Breadcrumbs` component](https://github.com/johnsonandjohnson/Bodiless-JS/blob/master/packages/bodiless-components/src/Breadcrumbs/Breadcrumbs.tsx#L312-L315)
  and instead export an `asMenuBreadcrumbs` which is basically just
  ```js
  const asMenuBreadcrumbs = flow(
    withBreadcrumbItemsFromStore,
    observer,
  );
  ```
- 

## Suggested Bodiless Refactors

```js
const withMenuTitleEditors = design => {
  

}
const asMenuTout = ({ linkNodeKey = 'link', textNodeKey = 'text' }) => {
  // We apply the node keys ourselves
  const transformDesign = design => {
    const Link = flow(
      replaceable,
      withSidecarNodes(
        design.Link || withBodilessLinkToggle(asBodilessLink, Div)(),
        withNodeKey(linkNodeKey),
      ),
    );
    const Title = flow(
      replaceable,
      design.Text || asEditable(undefined, 'Menu Item'),
      withNodeKey(textNodeKey),
    );
    return { ...design, Link, Title };
  };
  const ToutClean
  return startWith(flow(
    replaceable
    startWith(({ design, ...rest}) => <ToutClean design={transformDesign(design)} {...rest} />);
    withNode,
    withNodekey('title'),
  )(ToutClean));
}

const MenuLinkBase = ({ components:C, ...rest }) => <C.Link {...rest}><C.Text /></C.Link>;
const MenuLink = ({ linkNodeKey = 'link', textNodeKey = 'text' }) => {
  const applyDesign = design => {
    const Link = flow(
      replaceable,
      withSidecarNodes(
        design.Link || withBodilessLinkToggle(asBodilessLink, Div)(),
        withNodeKey(linkNodeKey),
      ),
    )(A);
    const Title = flow(
      replaceable,
      design.Title || asEditable(undefined, 'Menu Item'),
      withNodeKey(textNodeKey),
    )(Fragment);
    return { Link, Text };
  };
  return startWith(flow(
    designable(applyDesign, 'MenuLink'),
    stylable,
    withNode,
    withNodeKey('title'),
  )(MenuLinkBase));
};
const asMenu = (nodeKeys?: WithNodeKeyProps, defaultData, useOverrides) => flow(
  asBodilessList(
    nodeKeys,
    defaultData,
    (props) => ({ groupLabel: 'Menu Item', ...useOverrides(props) })
  ),
  asStylableList,
  withDesign({
    Item: asChameleonSubList(() => ({ formTitle: 'Sub-Menu Type' })),
  }),
  withMenuContext,
  asBreadcrumbSource, // Version which only handles the wrapper
  withDesign({
    Title: flow(
      as
    )
  })
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

// In fclasses?
type SlotComponents = {
  Component: ComponentType<any>,
};
type SlotProps = {
  components: SlotComponents,
};
const Slot = ({ components: C, ...rest}: SlotProps) => <C.Component {...rest} />;

type MenuLinkComponents = {
  Link: CT<any>,
  Text: CT<any>,
};

const $withItemSchema = withDesign({
  Title: flow(
    asMenuLink,
    withDesign({})
  )
})


// This is inside asMenu, withLinkSubMenu, etc...
const withDefaultItem = withDesign({
  Title: flow(
    asMenuLink,
    withDesign({
      LinkEditor: asBodilessLinkToggle(asBodilessLink)(),
      TextEditor: asEditable(undefined, 'Menu Item'),
    }),
  ),
  Item: asBreadcrumb({ linkNodeKey: 'title$link', titleNodeKey: 'title$text' })
});

const $withBrandMenuEditors = withDesign({
  Title: withDesign({
    // Here we extend the default editor
    TextEditor: asAutoSuperscript,
    // Here we replace the default editor
    // Note - we don't provide a nodeKey - that will be provided
    // by the default 
    LinkEditor: flow(reset, asCustomEditableLink())
  })
});

const $withMenuSchema = flow(
  // Provide the nodeKey for the whole menu.
  asMenu('MainMenu'),
  // Add menu editors if necessary.
  $withBrandMenuEditors,
  // This runs 
  withListSubMenu,
  withToutSubMenu,
  withSubMenuDesign({
    List
  })
  $withExtendedTitleEditor,
  $withReplaceLinkEditor
)

flow(
  asMenu(),
  withDefaultItem,

  // Or
  withDesign({
    Title: withDesign({
      Link: reset(asSpecialEditable()),
      Text: reset(asSpecialEditableLink()),
    }),
  })
)

const asMenuTout = (withToutEditors, nodeKeys)

const asMenuLink = (nodeKeys = _.keyBy('link', 'text')) => {
  const applyDesign = design => {
    const Component flow(
      withSidecarNodes(flow(
        design.Link,
        withNodeKey(nodeKeys.link),
      ),
      stylable,
      design.Text,
      withNodeKey(nodeKeys.text),
      withNode,
      withNodeKey('title'),
    )(A),
    return { Component };
  };
  return designable<MenuLinkComponents>(applyDesign)(Slot);
}
```

## Minimal Implementation

Below is a minimal implementation for a brand which uses only column menus and list submenus
with the default schema:git l

```js
flow(
  withDesign({ Title: addClasses('foo') }),
  withSchema({ Title: asEditableA }),
  withDesign({ Title: addClasses('bar' )},
  resetSchema({ Title: asEditableB }),
)
is the same as
flow(
  withDesign({ Title: asEditableB }),
  withDesign({ Title: addClasses('foo') }),
  withDesign({ Title: addClasses('bar' )},
)
but
flow(
  withDesign({ Title: addClasses('foo') }),
  withSchema({ Title: asEditableA }),
  withDesign({ Title: addClasses('bar' )},
  withSchema({ Title: withDefaultTitleContent }),
)
is the same as
flow(
  withDesign({ Title: asEditableA }),
  withDesign({ Title: withDefaultTitleContent }),
  withDesign({ Title: addClasses('foo') }),
  withDesign({ Title: addClasses('bar' )},
)

)
````