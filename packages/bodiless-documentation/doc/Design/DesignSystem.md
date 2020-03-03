# Bodiless Design System

The Bodiless Design System is an opinionated set of tools and patterns for
implementing a reusable and extensible *Design System* in React. Inspired by
principles of Atomic Design, Functional CSS and other functional programming
paradigms, it utilizes React's higher-order components (HOC) to encapsulate
component styling or behavior as reusable *Design Tokens* which can be applied
consistently across a site. All tokens can be independently extended to meet
specific design requirements without changing the overall design system, and
without altering the internal structure of complex components.

## Design Tokens

The building blocks of a Bodiless Design System are *Design Tokens*. These are
very well defined in the
[Salesforce Lightning Design System](https://www.lightningdesignsystem.com/design-tokens/):

> Design tokens are the visual design atoms of the design system — specifically,
they are named entities that store visual design attributes.

In BodilessJS, we construct design tokens in three layers:

### Utility Classes

The lowest level of the system consists of CSS "Utility Classes", usually
produced by a functional CSS library like [Tailwind](https://tailwindcss.com/).
These represent the smallest units of design: things like color pallette, border
curvature, typography, etc. They represent the primitive *options* available in your
design system. These classes should be as unambiguous as possible, and should
always have the same effect wherever they are applied.

The BodilessJS starter-kit uses the *Tailwind* defaults to generate
this layer. This should be customized for any new site using values from the site's
styleguide. For example, here are the colors defined for the Bodiless admin UI:
```js
      colors: {
        primary: '#0070c8',

        transparent: 'transparent',
        initial: 'initial',
        inherit: 'inherit',

        black: '#22292f',
        white: '#ffffff',

        'grey-100': '#f7fafc',
        'grey-200': '#edf2f7',
        'grey-400': '#cbd5e0',
        grey: '#a0aec0',
        'grey-600': '#718096',
        'grey-800': '#2d3748',
        'grey-900': '#1a202c',

        red: '#e3342f',
        green: '#309795',
      },
```

### Element Tokens

In BodilessJS "elements" are single HTML elements, roughly corresponding to
"atoms" in the parlance of Atomic Design. *Element Tokens* are HOC that apply
discrete design attributes to a single element, usually by applying one or more
utility classes.

Element Tokens represent *decisions* about how the options defined by your
utility classes should be applied in particular contexts. (I have borrowed this
distinction between *options* and *decisions* from
[Nathan Curtis' excellent article on Design Tokens](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421).
Often, an Element Token will apply a single utiltiy class, eg.
```js
const asErrorText = addClasses('text-red-300');
```
Or, sometimes they will apply more than one class to completely describe a
particular context, eg
```js
const asPrimaryHeader = addClasses('font-bold text-3xl');
```

Element tokens can be combined to produce styles for more specific contexts:
```js
const asErrorPageHeader = flow(asErrorText, asPrimaryHeader);
```

Or they can be extended to implement local variations of a design system:
```js
import { asPrimaryHeader as asPrimaryHeaderBase } from 'some-design-system';
const asPrimaryHeader = flow(
  asPrimaryHeaderBase,
  removeClasses('font-bold'),
  addClasses('font-semibold'),
);
```

### Component Tokens

BodilessJS extends the notion of design tokens to components which are larger
than simple elements ("molecules", "organisms", "templates" and even "pages" in
atomic design lingo, though we don't draw much of a distinction among them). A
"Component Token" is usually a colletion of element tokens which should be applied
to the constituent elements of a complex component.  For example, imagine a `Tout`
component which has a title, an image, body text and a call-to-action link. We can
then define the follwing HOC to apply tokens to the title and link:

``` js
const asToutPink = withDesign({
  Title: addClasses('text-base text-pink font-bold'),
  Link: addClasses('bg-pink').removeClasses('bg-blue-dark'),
});
```

In effect, this is creating a sort of macro-token which defines one of the ways
a tout can be styled--or, really, one of the axes of variation in tout styling.
This can be combined with other tokens to create a specific variant, eg:
```js
const asPinkHorizontalToutNoBody = flow(
  asToutPink,
  asToutHorizontal,
  asToutNoBody,
);
```

Just like element tokens, component tokens can be extended or customized to meet local design
requirements:
```js
import { asToutPink as asToutPinkBase } from 'some-design-system';
const asToutPink = flow(
  asToutPinkBase,
  withDesign({
    Title: removeClasses('text-base').addClasses('text-lg'),
  }),
);
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
