# Design API improvements

## Common Types

Improve our HOC typing so that it accepts a string and makes proper
use of generics.

```ts
type HOC<P = any, Q = P> = (C: ComponentType<P>|string) => ComponentType<Q>
```

## Design and WithDesign, improved typings.

Allow null keys in a design, and add a _schema key

```ts
type Design<C extends DesignableComponents = any> = {
  [Key in keyof C]?: (component: C[Key]) => C[Key]
} & {
  _final?: Omit<Design<C>, '_final'|'_schema'>,
  _schema?: Omit<Design<C>, '_final'|'_schema'>,
};
```

Prevent passing _schema or _final explicitly in withDesign:

```
type WithDesign<P extends DesignableComponentsProps<C>, C extends DesignableComponents> = (
  design: Omit<Design<C>, '_final'|'_schema'>
  => HOC<P>;
```

## 1.0 Reset

Providing a null value for any key in the design removes that key from the design.

```js
withDesign({
  Foo: null,
});
```

- For components with *fixed* designs (that is, components which have a set of starting
components specified in `designable`), this results in the designable component
being passed its original starting component in 

- For components with *flexible* designs (that is, components which allow *adding*
components by inserting new design keys), this results in the designable component not
receiving a component for that key.

- It is possible to *further* design a key which has been removed.  This will behave
as if all previously applied designs for that key had not been added.



### Examples

Given
```ts
const defaultFlexibleComponents = {
  Header: 'h1',
  Body: 'section',
};
const Flexible = designabe(flexibleComponents)(FlexibleBase);
```

#### Simple Reset:
```js
flow(
  withDesign({
    Header: withH1Styles,
    Body: withBodyStyles,
  }),
  withDesign({
    Header: null,
  }),
)(Flexible);
```
results in 

```jsx
<FlexibleBase components={{
  Header: 'h1',
  Body: withBodyStyles('section'),
}}>
```

#### Reset and Restyle

```js
flow(
  withDesign({
    Header: withH1Styles,
    Body: withBodyStyles,
  }),
  withDesign({
    Header: null,
  }),
  withDesign({
    Header: withAlternateH1Styles,
    Body: withExtendedBodyStyles,
  })
)(Flexible);
```
results in 

```jsx
<FlexibleBase components={{
  Header: withAlternateH1Styles('h1'),
  Body: flow(withBodyStyles, withExtendedBodyStyles)('section'),
}}>
```

#### Remove a component from a flexible design.

```js
  withDesign({
    NewComponent: replaceWith(MyNewComponent),
  }),
```

currently results in

```jsx
<FlexibleBase components={{
  Header: 'h1',
  Body: 'section',
  NewComponent: MyNewComponent,
}}>
```

But we can later remove the added component, as

```js
flow(
  withDesign({
    NewComponent: replaceWith(MyNewComponent),
  }),
  withDesign({
    NewComponent: null,
  }),
);
```

results in

```jsx
<FlexibleBase components={{
  Header: 'h1',
  Body: 'section',
}}>
```

### `replaceDesign`

We expect a common use-case to be replacing all tokens for an existing key.
```js
flow(
  withDesign({
    Foo: null,
  }),
  withDesign({
    Foo: withReplacedToken,
  }),
);
```
To facilitate this, let's add a `replaceDesign` function, so you could accomplsh
the above with simpy:
```js
replaceDesign({
  Foo: withReplacedToken.
});
```
`replaceDesign` would only affect keys specified.  Other keys in the existing design
would be unaltered.





## Schema

In order to promote separation of schema and styling, we introduce new
`withSchema` hoc which allows maintianing a parallel design similar
to `withFinalDesign`, but the design is applied *first* rather than *last*

```js
flow(
  withDesign({
    Header: withH1Styles,
  }),
  withSchema({
    Header: asEditable,
  }),
  withDesign({
    Header: asBlue,
  }),
  withSchema({
    Header: null,
  }),
  withSchema({
    Header: withEditorFull,
  }),
)
```

is the same as
```js
flow(
  withDesign({
    Header: withEditorFull,
  }),
  withDesign({
    Header: withH1Styles,
  }),
  withDesign({
    Header: asBlue,
  }),
);
```

and results in

```jsx
<FlexibleBase components={{
  Header: flow(withEditorFull, withH1Styles, asBlue)('h1'),
  Body: 'section',
}}>
```

The primary use-case here is to allow resetting and replacing the schema of a
designed component without altering it's styling. 

Question: what about resetting desing without resetting schema? That is
Should

```js
flow(
  withDesign({
    Header: withHeaderStyles,
  }),
  withSchema({
    Header: asEditable,
  }),
  withDesign({
    Header: null,
  }),
);
```
result in
```jsx
<FlexibleBase components={{
  Header: asEditable('h1'),
  ...,
}}>
```
or should it actually remove all design
```jsx
<FlexibleBase components={{
  Header: 'h1',
  ...,
}}>
```

## Spread Design

There are many cases where it is useful to apply the same token(s) to
multiple keys in a design.  Let's create a spreadDesign helper for this:

```js
flow(
  withDesign({
    Header: asHeader,
    Body: asBody,
    ExtraComopnent: startWith('p'),
  }),
  spreadDesign()(asEditable),
)
```
results in 

```jsx

<FlexibleBase components={{
  Header: flow(asEditable, asHeader)('h1'),
  Body: flow(asEditable, asBody)('section'),
  ExtraComponent: asEditable('p'),
  ...,
}}>
```

## Tokens (https://github.com/johnsonandjohnson/Bodiless-JS/issues/826).

We want to facilitate adding metadata when tokens are created, as well as
provide a mechanism to reset selected aspects of composed tokens (as an
alternative to recomposition).

This will have several benefits:
- make composing flow containers easier (tokens will come with necessary
  metadata for componetn picker),
- allow storybook or storybook-like UI's for browsing tokens,
- encourage design-system thinking when creating tokens.
- provide a mechanism for altering composed tokens, which (used judiciously)
  should simplify customizations.

The main thing stopping us now from adding metadata when tokens are defined is
that the metadata is not propagated when tokens are composed. So let's create
our own utility for composing tokens:

```ts
asToken(...tokenDefs: Token|MetaToken): Token
```
This will produce a Token NOC which preserves metadata associated with
the component it wraps, aggregates any metadata *added* by any of the
enclosed HOCs.

We also introduce the concept of a "metatoken".  This is an object which
can be used when composing a token to add metadata or control the way the
token behaves.

A metatoken can have two properties:
- meta: An object defining token metadata. This metadata will be attached to
  the token itself, and also to any component to which the token is applied.
- filter: A callback which will be used to filter constituents of any token(s)
  with which this token is composed.  This allows, for example, creating a token
  which removes any color tokens previously applied and adds a new one.

### Examples

Given

```js
const asBold = asToken(
  addClasses('font-bold'),
  meta.term('TextStyle')('Bold'), // Same as { meta: { categories: { Style: 'Bold' } } }
);

const asTextBlue = asToken(
  addClasses('text-blue-500'),
  meta.term('TextColor')('Blue'),
);

const asTextRed = asToken(
  addClasses('text-red-500'),
  meta.term('TextColor')('Red'),
);

const asBgYellow = asToken(
  addClasses('bg-yellow-500'),
  meta.term('BgColor')('Yellow'), 
)

const asHeader1 = asToken(
  asTextBlue,
  asBold,
  asBgYellow,
  withTerm('Header')('H1'),
);

...

const Header1 = asHeader1(H1);

<Header1 /> === <h1 className="text-blue bg-yellow-500 font-bold" />

BrandH1.categories === {
  TextColor: ['Blue'],
  BgColor: ['Yellow'],
  TextStyle: ['Bold'],
  Header: ['H1'],
};

const asRedHeader1 = asToken(
  asHeader1.meta, // We are creating a variant of asHeader1, so propagate its meta.
  asHeader1,
  // Note this filter must be applied *after* asHeader1.
  meta.category.reset('TextColor') // Same as { meta: { filter: t => !t.meta.categores.inclues('TextColor') } }
  asTextRed,
);
...
asRedHeader1.meta = {
  categories: {
    Header: 'H1',
  },
};
```

const RedHeader1 = asRedHeader1(H1);

<RedHeader1 /> === <h1 className="font-bold text-red-500 bg-yellow-500" />

ReadHeader1.categories === {
  TextColor: ['Red'],
  BgColor: ['Yellow'],
  TextStyle: ['Bold'],
  Header: ['H1'],
};
```

Note that while metadata from all constituent tokens are aggregated and attached
to the component to which a composed token is applied, the tomposed token
itself does not have the metadata of its constituents; if it did, it would be
much harder to filter. Think of the metadata attached to a Token as that portion
of the final metadata which it will contribute.

It's easy enough to get the aggregated metadata, eg:
```
const finalMeta = pick(myToken(Fragment), 'categories', 'title', ...);
```
