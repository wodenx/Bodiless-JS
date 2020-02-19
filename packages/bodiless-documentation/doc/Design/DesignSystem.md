# DesignSystem

The BodilessJS Design System is a hybrid approach of using Atomic Design and Pattern Lab model to implement a reusable design system in React. It allows us to utilize Reacts higher-order component (HOC) for reusing component logic at more granular layer. It will implement utility layer which is the core styling of the site with the element tokens that add design to single HTML element. Continuing this logic, the component tokens consists of more complex HOCs that apply design. All the element tokens & component tokens can be easily reused/extended to meet the design requirements without changing how/which components are used by the more complex/advanced HOCs.

The suggested design system is to structure your system in the following way:

## Utility Layer

Utility class produced by tailwind, they should be as unambiguous as possible.

The BodilessJS examples/test & examples/starter site uses default tailwind https://tailwindcss.com/ for this layer.

## Element Tokens

Element Tokens are HOC that add utility classes to a single HTML element. *By convention all Element Tokens start with `as`.*

``` js
const asHeader1 = addClasses('text-4xl font-bold');
```

## Component Tokens

 Are HOC that use the applyDesign to add Tokens (or replace) the base elements in a component. *By convention all Components Tokens start with `as`.*

``` js
const asToutPink = withDesign({
  Title: addClasses('text-base text-pink font-bold'),
  Link: addClasses('bg-pink').removeClasses('bg-blue-dark'),
});
```

## Component

React components that use the BodilessJS Design system and are built in way that they are easily shared/reusable.

For example, Touts can be reused as is, with some possible addition site specific styling and all use the same underlying Tout from @bodiless/organisms.

*As Convention a clean version of a component is exported along with any HOC that is applied.*

``` js  
import {
CleanTout,
} from '@bodiless/organisms';

const asTout = flow(
  withDesign({
    Image: asEditableImage('image'),
    ImageLink: asEditableLink('cta'),
    Title: asEditorSimple('title', 'Tout Title Text'),
    Link: flow(
      asEditableLink('cta'),
      asEditorSimple('ctaText', 'Tout Button Text'),
    ),
    Body: asEditorBasic('body', 'Tout Body Text'),
  }),
);
const Tout = asTout(ToutClean);

```

Then at use, the components can be combined with tokens to deliver components.

## Combining Tokens and Components

A component can be created as single component or by applying different element tokens and component tokens, many variations of that component can be created in programmatic way.

At the most basic, one needs to wrap a component in an HOC token, and create a single variant of that component.

```js

const ToutHorizontal = flow(asToutDefaultStyle, asToutHorizontal)(Tout);
const ToutHorizontalNoTitle = flow(asToutDefaultStyle, asToutHorizontal, asToutNoTitle)(Tout);
const ToutVertical = flow(asToutDefaultStyle, asToutVertical)(Tout);
const ToutVerticalNoTitle = flow(asToutDefaultStyle, asToutVertical, asToutNoTitle)(Tout);
const ToutVerticalNoTitleNoBody = flow(
  asToutDefaultStyle,
  asToutVertical,
  asToutNoBodyNoTitle,
)(Tout);

```

This combination should be done at the point of use, such as in the page file where the component is placed.  The HOC and the basic component are the shareable items not there composition.

Here is a flow diagram of creating a Horizontal Tout:
![](./ToutHorizontalDefaultFlow.svg)
