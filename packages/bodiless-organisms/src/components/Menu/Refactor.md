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

> The specifications below are predicated on some lower level refactoring in
  in the [design api](https://github.com/wodenx/Bodiless-JS/blob/doc/post-pilot/packages/fclasses/doc/Refactor.md#tokens-httpsgithubcomjohnsonandjohnsonbodiless-jsissues826)
  
## Example API (brand level)

> In the docs below, tokens which are defined at brand level have a `$` prefix.
  Tokens defined at the site level have a $$ prefix.  All other methods are
  exported by @bodiless/navigation.

### Create the base schema

First we define the schema for menu titles. This is only required if you don't want to
use the default editors.

```js
export const $asEditableMenuTitle = asToken(
  asSchema,
  // Replace the link editor with a cusgtom one
  withDesign({
    Link: asToken(resetSchema, asMenuLink($asToggledLink)),
  }),
  // Extend the default text editor
  withDesign({
    Title: $asAutoSuperscript,
  }),
);
```

Note the use of `asMenuLink` above. It provides the node key structure. There is
an equivalent for the title (not used here bc we are just extending the default
editor).

Note also the use of `asSchema` and `resetSchema`.  These are "metatokens" -- objects
which attach or filter by token metadata.  This allows tokens which match certain
criteria to be selectively reset, so (as in this example) you can alter the
schema of a design key without altering its styling.  Both of these metatokens
would be defined at core library level, eg:


For megamenu, we can do the same for menu touts, if necessary...

```js
export const $asEditableMenuTout = asToken(
  asSchema,
  $withBrandToutEditors,
  $asEditableMenuTitle; // This replaces tout editors for title and link
);
```

The above would only be necessary if the brand had customized any of the default tout
editors.

Finally we define the menu schema itself:

```js
const $withBrandMenuSchema = asToken(
  asSchema,
  asBodilessMenu('MainMenu'),
  withListSubMenu($asEditableMenuTitle),
  withColumnSubMenu($asEditableMenuTitle),
  withToutSubMenu(withDesign($asEditableMenuTout),
  // It would be great to put this inside asBodilessMenu somehow, but we need
  // to know which submenus are applied 
  asBreadcrumbSource('List', 'Column', 'Tout'),
);
```

A few things to note here:
- `asBodilessMenu` is an extendsion `asBodilessList` which will turn a 'ul'
  into an editable menu.  It also defining the menu as a breadcrumb
  source (including wrapping top level menu items in `asBreadcrumb`).
- `with...SuBMenu` are helpers exported from @bodiless/navigation which add a
  submenu option to the menu. Each takes an optional token which will be applied
  to the sublist title. So, for example

  ```js
  withListSubMenu($asEditableMenuTitle)
  ```
  is equivalent to

  ```js
  asToken(
    asSchema,
    withListSubMenu(),
    withDesign({
      Item: withDesign({
        List: withDesign({
          Title: $asEditableMenuTitle,
        }),
      }),
    }),
  );
  ```
- `with...SubMenu` also takes care of wrapping each submenu item in `asBreadcrumb`.
- `withColumnSubmenu` manages the column sublists - so the title is applied to both.

  > Note: we want to make column submenus *optional* - so the items will have toggled sublists.


### Apply brand styling

```js
const $asBrandTopNav = asToken(
  asDesign, // A metatoken, like `asSchema`
  asTopNav('List', 'Columns'),
  $withBrandTopNavMainStyles,
  withSubMenuToken('List')($withBrandTopNavListStyles),
  withSubMenuToken('Columns')($withBrandTopNavColumnStyles),
  ...,
);
```

Note here:
- `asTopNav` is a refactor of the existing `asMegaMenuTopNav` to allow
  specifying which submenu types should have styling added. So
  ```js
  asTopNav('List')
  ```
  would be the same as our existing `asSimpleMenuTopNav`.
- `withSubMenuDesign` is a helper which makes it easier to target a particular
  type of submenu. The first parameter is a list of the submenu key(s) to which
  the token provided as a second argument should be applied. It also accepts the
  special key 'Main' to apply the design to the top level menu. So, for example,
  if you had common menu styles to apply to the top menu and all submenus, you
  could write:

  ```js
  withSubMenuToken('Main', 'List', 'Columns')($withCommonMenuStyles);
  ```


- Each of the `$withBrandTopNav...Styles` hocs should apply a simple list
  design, though the one for colukmn lists also has to design its sublist, eg.

```js
const $withTopNavColumnSubMenuStyles = asToken(
  asDesign,
  withDesign({
    Wrapper: withDesign({
      // We need to document clearly that the "Wrapper" of a sublist has 2 parts,
      // The <li> which is the outer wrapper and the <ul> which is the List.
      WrapperItem: $withSublistPadding,
      List: $withBullets,
    }),
    Item: ...,
    Title: ...,
  }),
  withSubMenuToken('List')(
    asDesign,
    withDesign({
      Wrapper: ...,
      Item: ...,
      Title: ...
    }),
  ),
);
```

### Same pattern for burger menu styling

```js
const $withBurgerMenuStyles = asToken(
  asDesign,
  // Same shorthand as `asTopNav` above.
  asBurgerMenu('List', 'Touts'),
  $withBurgerMenuMainStyles,
  withSubMenuToken('List')($withBurgerMenuListStyles),
  withSubMenuToken('Touts')($withBurgerMenuToutStyles),
  ...,
);
```

But, for Burger menus, we need to wrap the actual menu in the burger chrome. In order
to keep the api for burger and main menu as similar as possible, let's create an
HOC to do the wrapping, like

```js
const withBurgerMenuWrapper = (Component) => (props) => asToken(
  replaceWith(BurgerMenuClean),
  withDesign({
    // Note - in the current implementation this design key is 'Body' but we
    // should change it to 'Menu' (see note below).
    Menu: replaceWith(Component),
  })
);
```
Maybe we can even put this inside `asBurgerMenu` so we'd have:

```js
const $withBurgerMenuStyles = asToken(
  asDesign,
  $withBurgerMenuMainStyles,
  withSubMenuToken('List')($withBurgerMenuListStyles),
  ...,
);

cosnt $asBrandBurgerMenu = flow(
  asBurgerMenu('List', ...),
  // The design below applies to elements of the burger menu envelope.
  withDesign({
    Menu: $withBurgerMenuStyles,
    ...
  }),
);
```

> Note - in the current custom burger menu wrapper as implemented in the pilot
> we have 'Menu' and 'Body" design keys, which refer the the `<nav>` wrapper
> component and the actual menu respectively. We should rename these
to `Nav` (for the `<nav>` wrapper) and `Menu` (for the actual menu).

### Additional Burger Menu Considerations
- Refactor the way the overview link is added along
  [these lines](https://github.com/wodenx/Bodiless-JS/commit/26806e75bff973a2f8d231a458760cee1f33c676).
- Replace the existing burger menu implementation based on react-burger-menu
  with the one developed in scope of the pilots.
- We need a way to add additional menus/lists to the burger menu. Probably
  this can be done by embedding the main menu in another list, eg:

  ```js
  const asCustomBurgerMenu = (Menu) => (props) => {
    <ul>
      <li><Menu /></li>
      <li>{...extraMenus}</li>
    </ul>
  };
  ```

  Alternatively we could inject our custom menus into the main menu using the
  [same pattern as the overview link]((https://github.com/wodenx/Bodiless-JS/commit/26806e75bff973a2f8d231a458760cee1f33c676).

  ```js
  const asCustomBurgerMenu = (Menu) => (props) => {
    <Menu>
      {...extraMenus}
    </Menu>
  }
  ```

### Responsive variants

After creating `$asBrandBurgerMenu` and `$asBrandTopNav` above, we're left
with the following, which is probably fine.

```js
cosnt $withBrandMenuVariants = asToken(
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

const $asBrandNavigation = asToken(
  $withBrandMenuSchema,
  $withBrandMenuVariants,
);
```

THis token can then be applied directly to the 'Navigation' key in the layout (the
default component for that key would probalby be `Ul`):
```js
const $asSiteLayout = withDesign({
  Navigation: $asBrandNavigation,
});
```

We can also create a helper at brand or global level to simplify applying the same
token to both menus:
```js
const $withMenuToken = (...tokenDef: TokenDef[]) = withDesign({
  _default: asToken(...tokenDef),
  lg: withDesign({
    Menu: asToken(...tokenDef),
  })
});
```


### Customizing

Some examples of how local customizations could be achieved. Tokens defined locally
are prefixed with double `$$`.

#### Swapping out a title editor

```js
// First create a token which applies to the main menu and all submenus. 
const $$withSiteMenuEditor = withSubMenuToken('Main', 'List', 'Columns')(
  withDesign({
    Title: withDesign({
      Title: asToken(resetSchema, $$withCustomEditor)
    }),
  }),
};

const $$asSiteLayout = asToken(
  $asBrandLayout,
  withDesign({
    Navigation: $withMenuToken($$withSiteMenuEditor)
  });
);
```

### Changing the style of a menu tout

```js
// Define our custom tout styling
const $$withSiteMenuToutStyles = flow(
  asToutVertical,
  $withToutDefaultStyle,
  ...,
);

// create a submenu design which replaces default tout with custom one.
const $$withSiteCustomMenuTout = withSubMenToken('Touts')(
  withDesign({
    Title: asToken(
      $resetAllButSchema, // or resetDesign if we have more than 2 domains?
      $$withSiteMenuToutStyles,
    ),
  }),
);

// Inject this into the layout
const $$asSiteLayout = withDesign({
  Navigation: withDesign({
    // We only want to apply this to desktop...
    lg: $$withSiteCustomMenuTout,
  }),
});
```

## Breadcrumbs

The primary goals here are:
- Clearly separate schema from styling
- Provide defaults so that the most common use-cases require minimal configuration
- Populate the breadcrumb store by default for all menus.

### Breadcrumb source and store.

The current `asBreadcrumbSource` hoc  should be decomposed and bundled into the menu hocs,
as described above.

The [Breadcrumb Store Provider](https://github.com/johnsonandjohnson/Bodiless-JS/blob/master/examples/test-site/src/components/Layout/index.tsx#L46)
should be dealt with in scope of creating a designable Layout component

### Breadcrumb component 

Here, the primary consideration is to separate schema from styling, and to provide
defaults so that the most common use-cases require minimal configuration. 
which are currently site-level to the package.

> Note: we need to preseve all existing design keys in the current breadcrumb
> component

- Remove
  [the pre-connected `Breadcrumbs` component](https://github.com/johnsonandjohnson/Bodiless-JS/blob/master/packages/bodiless-components/src/Breadcrumbs/Breadcrumbs.tsx#L312-L315)
  and instead export an `asMenuBreadcrumbs` which is basically just
  ```js
  const asMenuBreadcrumbs = flow(
    withBreadcrumbItemsFromStore,
    observer,
  );
  ```
- Package withEditableStartingTrail, withEditableFinalTrail and
  withBreadcrubmSchema with default editors similar to what we do with the menu
  items.
- Make it possible to apply the same `$asEditableMenuTitle` token to breadcrumbs
  as is applied for menu titles, so that if a site builder needs to change the
  schema, she can do it in one place.
- Make it possible to style all breadcrumb items with a single token, something
  like
  ```
  const withBreadcrumbItemToken = (...tokenDefs: TokenDef[]) => withDesign({
    StartingTrail: asToken(...tokenDefs),
    EndingTrail: asToken(...tokenDefs),
    BreadcrumbLink: asToken(...tokenDefs),
  });
  ```
  All three of these should have access to a node with the same schema, so that
  active trail effects can be applied, or other styling choices made based on
  the link data.

## Suggested Bodiless Refactors/New Functions

### Metatokens

These metatokens should probably be defined at a bodiless core level (or in a
core design system library).

```js
export const asSchema: MetaToken<any> = {
  meta: {
    categories: {
      Domain: 'Schema',
    }
  }
};
export const resetSchema: MetaToken<any> = {
  ...asSchema,
  filter: (h: Token<any>) => !h.meta?.categories?.Domain?.includes('Schema'),
}
```

### Menu Titles

```js
const MenuTitleBase = ({ components: C, ...rest }) => (
  <C.Link {...rest}><C.Title /><C.Link>
);
export const MenuTitle = designable({ Link: A, Title: Fragment }, 'MenuTitle')(MenuTitleBase);

export const asMenuLInk = (asEditableLink) => asToken(
  asSchema,
  withSidecarNodes(
    asEditableLink('link', undefined, () => ({ groupLabel: 'Menu Item' })
  ),
);
export const asMenuTitle = (asEditable) => asToken(
  asSchema,
  asEditable('title', 'Menu Item'),
);
export const asEditableMenuTitle = asToken(
  asSchema,
  withDesign({
    Link: asMenuLink(asBodilessLinkToggle(asBodilessLink, Div))()),
    Title: asMenuTitle(asEditable(undefined, 'Menu Item')),
  }),
  withNode,
  withNodeKey('title'),
);
```

## asBodilessMenu

```js
export const asBodilessMenu = (nodeKeys?: WithNodeKeyProps, defaultData, useOverrides) => asToken(
  asSchema,
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
  withDesign({
    Title: startWith(MenuTitleClean);
  }),
  // Maybe abstract the following into `withEditableMenuTitle` which takes nodeKeys?
  withDesign({
    Title: asEditableMenuTitle,
    Item: asBreadcrumb({
      // Note we hardcode these node keys. They are also hardcoded in asEditableMenuTitle.
      linkNodeKey: 'title$link',
      titleNodeKey: 'title$title',
    }),
  }),
);
```

### Design helpers

```js
const withSubMenuToken = (...keys: string[]) => (...tokenDefs: TokenDef[]) => {
  const design = keys.reduce((acc, next) => ({
    ...acc,
    [key]: asToken(tokenDefs),
  }));
  const withSubMenuDesign = withDesign({
    Item: withDesign(omit(design, 'Main')),
  });
  if (design['Main']) return asToken(
    design['Main'],
    withSubMenuDesign,
  );
  return withSubMenuDesign;
}
```

## Scratchpad

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
