# Design Element Concepts

In this guide, we will continue the [Intro to Bodiless Concepts](./IntroToBodilessConcepts) tutorial
to learn how to use Bodiless Design API tooling to build a design system package. You can [read more
about it here](../../Design/DesignSystem), but, at a high level, it is a set of tools and patterns
for applying a _Design System_ to a React site. It encourages defining the building blocks of the
system (tokens, elements, components) at the package level, and then applying them consistently
across your site — or even multiple sites — extending and adapting it as needed.

Upon completion of this tutorial, you will end up with code similar to the following:

- [Site code](https://github.com/johnsonandjohnson/Bodiless-JS/tree/main/sites/minimal-demo/src/data/pages/gallerywithdesign/ ':target=_blank')
- [Package code](https://github.com/johnsonandjohnson/Bodiless-JS/tree/main/packages/minimal-demo/ ':target=_blank')

As you go through the tutorial, feel free to reference this code as needed.

## 0. Prerequisites

- Complete the [Intro to Bodiless Concepts](./IntroToBodilessConcepts) tutorial.
  - Alternatively, if you already have a fair understanding of BodilessJS fundamentals and want to
    fast-forward to this tutorial, [create a new site](/About/GettingStarted#creating-a-new-site)
    and copy over the [gallery folder (and its
    contents)](https://github.com/johnsonandjohnson/Bodiless-JS/tree/main/sites/minimal-demo/src/data/pages/gallery)
    from the main Bodiless repository and place it in a
    `sites/{your-site-name}/src/data/pages/gallery` directory.
- Read through the high-level introduction to the [Bodiless Design System](/Design/DesignSystem).
  Even if you don't follow everything, it will give essential insight into the "why" of what you
  will do in this tutorial.
- Acquire a basic understanding of utility-first CSS (aka "Atomic" or "Functional" CSS) and the
  [Tailwind](https://tailwindcss.com/ ':target=_blank') library. There are many excellent articles
  on the web on this topic. While you can use the Bodiless design system with other CSS-in-JS
  paradigms, this is the one we recommend.

## 1. Typography

In this step, we are going to move typography token definitions from the page level to a package, to
ensure consistency across the site.

It would be possible to create our design system entirely at site level, for example, in a
`/sites/{mysite}/src/components` directory. However, we consider it a best practice to place all
code (components and tokens) into a design system package. This has several advantages:

- It is easy to publish this package so the design system can be used by other sites;
- It is easy to reorganize the internal structure of the package without changing imports in
  site-level files;
- It is possible to use [Bodiless Token
  Shadowing](../../VitalDesignSystem/Components/VitalElements/Shadow) to override token collections
  from upstream packages;
- There are performance penalties due to incomplete tree-shaking if you use TypeScript and import
  core Bodiless packages directly from your Gatsby site.

To facilitate creating a design system package, most Bodiless sites are structured as a _monorepo_,
and this is what is created by the `@bodiless/cli new` command you used to create a new site in the
first tutorial. Your new site should already contain a stub design system package at
`/packages/{your-site-name}`, and that is where we'll be implementing our design system.

?> **Note:** In the examples below, we assume you have created a new site called `mysite` using the
`__minimal__` template. If you used a different name, then alter file and variable names
accordingly.

### 1a. Create an Element Component Within the Package

01. Create a file called `mysiteElement.ts` inside your design system package at
    `/packages/mysite/src/components/Element/tokens`, and put the following lines there:

    ```ts
    import { asTokenSpec } from '@bodiless/fclasses';

    const Bold = asTokenSpec()('font-bold');
    const Underline = asTokenSpec()('underline');
    const Italic = asTokenSpec()('italic');
    const SuperScript = asTokenSpec()('align-baseline');
    const Link = asTokenSpec()('text-blue-400', Underline);
    const H1 = asTokenSpec()('text-3xl', Bold);
    const H2 = asTokenSpec()('text-2xl', Bold);
    const H3 = asTokenSpec()('text-xl');

    export default {
      Bold,
      Underline,
      Italic,
      Link,
      SuperScript,
      H1,
      H2,
      H3,
    };
    ```

01. Now export these tokens from your package by creating the following files:

    01. `/packages/mysite/src/components/Element/tokens/index.ts`:

        ```ts
        import mysiteElement from './mysiteElement';

        export default mysiteElement;
        ```

    01. `/packages/mysite/src/components/Element/index.ts`:

        ```ts
        import mysiteElement from './tokens';

        export { mysiteElement };
        ```

    01. `/packages/mysite/src/index.ts`:

        ```ts
        export * from './components/Element';
        ```

    ?> **Note:** There are many ways to organize exports from component packages. Choosing a
    standard pattern such as the one described above will help keep your code organized and make it
    easier to maintain. Following this pattern will also allow you to take advantage of some
    BodilessJS tools for extending and optimizing your design system, like [Token
    Shadowing](/VitalDesignSystem/Components/VitalElements/Shadow) and [Static
    Replacement](/VitalDesignSystem/Components/VitalElements/StaticReplacement).

### 1b. Update Your Site to Use the New Package and Element Component

01. Add your package as a dependency in `/sites/mysite/package.json`:

    ```json
    "dependencies:" {
      ...,
      "mysite": "^0.0.0",
    }
    ```

01. Run `npm run setup` from the root of your repository to build your package and link it to your
    site.

01. Now let's use these tokens in our Gallery page. Add the following import to
    `/sites/mysite/src/data/pages/gallery/index.tsx`:

    ```ts
    import { mysiteElement } from 'mysite';
    ```

    And replace the definition of the `PrimaryHeader` component:

    ```ts
    const PrimaryHeader = as(
      asEditable('title', 'Title'),
      mysiteElement.H1,
    )(H1);
    ```

01. Finally, remove the corresponding typography tokens (`asBold`, etc.) from
    `/sites/mysite/src/data/pages/gallery/withSimpleEditor.tsx`, and refactor the `simpleDesign` to
    use the tokens we have just created:

    ```ts
    const simpleDesign = {
      Bold: mysiteElement.Bold,
      Italic: mysiteElement.Italic,
      Underline: mysiteElement.Underline,
      Link: as(mysiteElement.Link, asBodilessLink()),
    };
    ```

    Be sure to import `mysiteElement`, as before.

In the code above, we have created a collection of _element tokens_ which apply classes to basic
HTML elements, exported this collection as an object (`mysiteElement`), and used the tokens to apply
typography styling to our text editor and primary header. These _element tokens_ correspond roughly
to _atoms_ in the parlance of atomic design. They are usually simple HOCs which add classes or props
to the element (though they may also add behaviors).

<!-- Inlining HTML to add multi-line info block with code blocks. -->
<div class="warn">
  <strong>Note:</strong> Note the use of <code>asTokenSpec</code> to define our tokens. Bodiless
  tokens are normally expressed as React higher-order components (HOCs). However, Bodiless provides
  an extended format for describing tokens known as a <em>Token Specification</em>. The
  <code>asTokenSpec()('font-bold')</code> utility produces a token in this format:

  ```ts
  {
    Core: {
      _: 'font-bold',
    },
  };
  ```

  This can be converted to a simple HOC via the Bodiless `as` utility—

  ```ts
  const BoldSpan = as(mysiteElement.Bold)(Span);
  ```

  —which is identical to:

  ```ts
  const BoldSpan = addClasses('font-bold')(Span);
  ```

  We will go into the uses of token specifications in more detail in a later section. For now, you
  can think of `asTokenSpec` as a utility for creating tokens.

</div>

### 1c. Provide a Site-Wide Rich Text Editor

To complete the standardization of our site's typography, let's add to the design system package a
rich text editor which uses the standard typography tokens.

01. Create `/packages/mysite/src/components/RichText/tokens/mysiteRichText.ts`:

    ```ts
    import { asTokenSpec, as, stylable } from '@bodiless/fclasses';
    import { asBodilessLink } from '@bodiless/components-ui';
    import { withPlaceholder } from '@bodiless/components';
    import { mysiteElement } from '../../Element';

    const Simple = asTokenSpec<any>()({
      Core: {
        _: as(stylable, withPlaceholder('Rich text...')),
        Bold: mysiteElement.Bold,
        Italic: mysiteElement.Italic,
        Underline: mysiteElement.Underline,
        Link: as(mysiteElement.Link, asBodilessLink()),
      },
    });

    export default {
      Simple,
    };
    ```

01. Export the tokens from the package as you did before for `mysiteElement`:

    01. `/packages/mysite/src/components/RichText/tokens/index.ts`:

        ```ts
        import mysiteRichText from './mysiteRichText';

        export default mysiteRichText;
        ```

    01. `/packages/mysite/src/components/RichText/index.ts`:

        ```ts
        import mysiteRichText from './tokens';

        export { mysiteRichText };
        ```

    01. `/packages/mysite/src/index.ts`:

        ```ts
        export * from './components/RichText';
        ```

01. Rebuild your package (execute `npm run build` from the package directory or `npm run
    build:packages` from outside it), and use these tokens in the Gallery.

    01. In `/sites/mysite/src/data/pages/gallery/index.tsx`, add these imports:

        ```ts
        import { withNodeKey } from '@bodiless/core';
        import { RichText } from '@bodiless/richtext-ui';
        import { withPlaceholder } from '@bodiless/components';
        import { mysiteElement, mysiteRichText } from 'mysite';
        ```

        Then change:

        ```ts
        const Body = withSimpleEditor('body', 'Body')(Div);
        ```

        to:

        ```ts
        const Body = as(
          mysiteRichText.Simple,
          withPlaceholder('Body'),
          withNodeKey('body'),
        )(RichText);
        ```

    01. Similarly, in `/sites/mysite/src/data/pages/Gallery/CaptionedImage.tsx`, add the imports and
        change:

        ```ts
        const Body = as(
          addClasses('text-white bg-black flex-grow p-2'),
          withSimpleEditor('caption', 'Caption')
        )(Div);
        ```

        to:

        ```ts
        const Body = as(
          mysiteRichText.Simple,
          withPlaceholder('Caption'),
          withNodeKey('caption'),
          addClasses('text-white bg-black flex-grow p-2'),
        )(RichText);
        ```

First, let's look at the `mysiteRichText` token collection. It contains a single token, `Simple`,
expressed as a _token specification_. A token described in this notation is a 2-level nested object.
The inner keys of this object are simply the design keys of the component to which the token
applies, and their values are higher-order components which should be applied to each element. The
top-level keys represent "domains" — pieces of the token which might be selectively reused,
extended, or overridden by a downstream consumer. Here we are using just a single domain, `Core`.
We'll show later on how to define and use multiple domains to facilitate extension and
customization.

In this case, the design keys represent the components which are available in the editor to render
different text formats, as described in [the first
tutorial](./IntroToBodilessConcepts#_6-configuring-the-rich-text-editor). We apply our typography
tokens to each, thus ensuring that any changes will propagate to all simple rich text editors on the
site.

Note the special design key `_`. Tokens supplied in this key apply to the editor as a whole. Here we
make the editor `stylable` — that is, capable of receiving classes via the FClasses API. We also
supply a placeholder to be used as a default; though, this will usually be overridden where the
editor is used. This is because the placeholder — like the node key — is usually defined by the
context in which the token is placed, and, therefore, not reusable.

Applying our token with `as(mysiteRichText.Simple)` is equivalent to the following:

```ts
as(
  withPlaceholder('Rich text...'),
  withDesign({
    Bold: mysiteElement.Bold,
    Italic: mysiteElement.Italic,
    Underline: mysiteElement.Underline,
    Link: as(mysiteElement.Link, asBodilessLink()),
  }),
);
```

At this point, feel free to delete `src/data/pages/gallery/withSimpleEditor.tsx`, as we have
successfully moved this to the package level.

## 2. Make the Gallery Reusable

If you have components which may appear on more than one page in your site (or be reused across
multiple sites), you can export them from your design system package, and make them "designable" so
that they can be easily customized to implement different variations.

In a Bodiless design system, _components_ are usually bare templates which do little or nothing in
themselves until one or more _tokens_ are applied to them. They are often referred to as "clean"
components.

A clean component is always "designable" via the [Bodiless Design
API](../Architecture/FClasses#the-design-api). That is, it exposes an api which allows tokens to be
applied to constituent elements within the component. This is very similar to the basic [slots
pattern](https://daveceddia.com/pluggable-slots-in-react-components/ ':target=_blank') in React. The
key difference is that, with the Design API, we don't inject the actual React nodes which should be
rendered in a particular slot; instead, we provide a higher-order component (a "token") which will
be applied to the component in that slot. This allows us to _layer_ styling or behavior for
individual elements.

### 2a. Create a "Clean" Component

Let's create "clean" versions of our `CaptionedImage` and `Gallery` components. In
`/packages/mysite/src/components/CaptionedImage`, create `CaptionedImageClean.tsx`:

```tsx
import React from 'react';
import type { FC, HTMLProps } from 'react';
import {
  ComponentOrTag, DesignableComponentsProps, Img, Section, designable, asTokenSpec, Div,
} from '@bodiless/fclasses';
import { RichText } from '@bodiless/richtext-ui';

// Design: set of base components which will be used in the component itself
type CaptionedImageComponents = {
  Wrapper: ComponentOrTag<any>,
  Image: ComponentOrTag<any>,
  BodyWrapper: ComponentOrTag<any>,
  Body: ComponentOrTag<any>,
};

type CaptionedImageProps =
  HTMLProps<HTMLElement> & DesignableComponentsProps<CaptionedImageComponents>;

// JSX: Bare Template usually with minimal styling/functionality
const CaptionedImageBase: FC<CaptionedImageProps> = ({ components: C, ...rest }) => (
  <C.Wrapper {...rest}>
    <C.Image />
    <C.BodyWrapper>
      <C.Body />
    </C.BodyWrapper>
  </C.Wrapper>
);

// Designable: Define the starting sub-components of the design
const captionedImageComponents: CaptionedImageComponents = {
  Wrapper: Section,
  Image: Img,
  Body: RichText,
  BodyWrapper: Div,
};

const CaptionedImageClean = designable(captionedImageComponents, 'CaptionedImage')(CaptionedImageBase);

const asCaptionedImageToken = asTokenSpec<CaptionedImageComponents>();

export default CaptionedImageClean;
export { asCaptionedImageToken };
```

This exemplifies the 3-step process involved in creating a clean component:

01. **Define the "design" of the component.** This is a set of base components which will be used in
    the component itself, and which can be targeted by the bodiless `withDesign` function (or as
    inner keys in a token specification). In the `CaptionedImage` component, we define a design
    consisting of four components:

    ```ts
    type CaptionedImageComponents = {
      Wrapper: ComponentOrTag<any>,
      Image: ComponentOrTag<any>,
      Body: ComponentOrTag<any>,
      BodyWrapper: ComponentOrTag<any>,
    };
    ```

    Each is typed as `ComponentOrTag<any>`, indicating that a React component or HTML tag with any
    prop signature can be used in the slot.

01. **Write the JSX code for the component itself.** Usually, this has no styling and very little
    functionality. It is just a bare template on which styles and behaviors can be hung:

    ```tsx
    type CaptionedImageProps =
      HTMLProps<HTMLElement> & DesignableComponentsProps<CaptionedImageComponents>;
    const CaptionedImageBase: FC<CaptionedImageProps> = ({ components: C, ...rest }) => (
      <C.Wrapper {...rest}>
        <C.Image />
        <C.Body />
      </C.Wrapper>
    );
    ```

    We use the Bodiless generic type `DesignableComponentsProps` to help define the props of our
    component, which will now include a `components` prop captaining the fully-styled constituent
    components which make up the clean component.

01. **Make the component "designable":**

    ```ts
    const captionedImageComponents: CaptionedImageComponents = {
      Wrapper: Section,
      Image: Img,
      Body: RichText,
      BodyWrapper: Div,
    };

    const CaptionedImageClean = designable(captionedImageComponents, 'CaptionedImage')(CaptionedImageBase);
    ```

    In this step, we first define the starting sub-components in our design. These are the base
    components to which any HOCs provided by `withDesign` will be applied. Here, we use stylable
    HTML elements exported by `@bodiless/fclasses`. Such stylable elements are capable of having
    their `className` prop modified by the [FClasses API](../Architecture/FClasses).

    Then, we pass this set of starting components to the Bodiless `designable` HOC. A component so
    wrapped can receive a `design` prop (usually provided by `withDesign` or `as`) containing the
    HOCs which should be applied to each constituent. So, for example:

    ```ts
    withDesign({
      Image: 'border',
    });
    ```

    or

    ```ts
    as(
      asTokenSpec<CaptionedImageComponents>)()({
        Core: {
          Image: 'border'
        },
     }),
    );
    ```

    would both apply the `border` class to the `Image` element.

    The second parameter to `designable` is a string which can be used to identify the element in
    the rendered markup.

    ?> **Note:** You will notice there is a new addition of a `BodyWrapper` which will render as a
    simple `div` around the body. We found this was good practice to make a wrapper slot for
    components you expect to have as editors. It allows the theme to be applied to the wrapper `div`
    and keep separation of theme from component. If you replace the body with a different type of
    editor, it will maintain the same styles you apply to the `BodyWrapper` `div`.

### 2b. Add Styling and Functionality with Tokens

As you can see, our clean component has no styling or behavior. Let's create a token collection to
provide those.

As usual, create `mysiteCaptionedImage.ts` in
`/packages/mysite/src/components/CaptionedImage/tokens`:

```ts
import { as } from '@bodiless/fclasses';
import { asBodilessImage } from '@bodiless/components-ui';
import { withNodeKey } from '@bodiless/core';
import { withPlaceholder } from '@bodiless/components';
import { mysiteRichText } from '../../RichText';
import { asCaptionedImageToken } from '../CaptionedImageClean';

const Base = asCaptionedImageToken({
  Core: {
    Wrapper: 'mx-2 h-full flex flex-col',
    Image: as(
      asBodilessImage(),
      'w-full',
      withNodeKey('image'),
    ),
    Body: as(
      mysiteRichText.Simple,
      withPlaceholder('Caption'),
      withNodeKey('caption'),
    ),
    BodyWrapper: 'text-white bg-black p-2 flex-grow',
  },
});

const WithBlueBorder = asCaptionedImageToken({
  Core: {
    Wrapper: 'border-8 rounded-t-lg border-blue-400',
  },
  Meta: {
    categories: {
      Border: ['Blue'],
    },
  },
});

const WithTealBorder = asCaptionedImageToken({
  Core: {
    Wrapper: 'border-8 rounded-t-lg border-teal-400',
  },
  Meta: {
    categories: {
      Border: ['Teal'],
    },
  },
});

const WithOrangeBorder = asCaptionedImageToken({
  Core: {
    Wrapper: 'border-8 rounded-t-lg border-orange-400',
  },
  Meta: {
    categories: {
      Border: ['Orange'],
    },
  },
});

export default {
  Base,
  WithBlueBorder,
  WithOrangeBorder,
  WithTealBorder,
};
```

By now, this should look very familiar. A few things to note:

- We use `asCaptionedImageToken` to define the token specifications. This is a utility we exported
  from our clean component, and it provides both type safety and autocompletion of the design keys
  in our token specification.
- We create a set of tokens to produce different color variations, and attach necessary metadata
  (for the Flow Container component selector) via the reserved `Meta` domain. These tokens are not
  intended to be used alone, but rather _composed_ with the `Base` token to produce the actual
  variations (by convention, such tokens are often prefixed by `With...` or `As...`).

### 2c. Export All the Components and Tokens

To finish up, export the clean component from your package as before:

01. `/packages/mysite/src/components/CaptionedImage/tokens/index.ts`:

    ```ts
    import mysiteCaptionedImage from './mysiteCaptionedImage';

    export default mysiteCaptionedImage;
    ```

01. `/packages/mysite/src/components/CaptionedImage/index.ts`:

    ```ts
    import CaptionedImageClean, { asCaptionedImageToken } from './CaptionedImageClean';
    import mysiteCaptionedImage from './tokens';

    export { CaptionedImageClean, mysiteCaptionedImage, asCaptionedImageToken };
    ```

01. `/packages/mysite/src/index.ts`:

    ```ts
    ...
    export * from './components/CaptionedImage';
    ```

?> **REMINDER:** Rebuild your `mysite` package.

### 2d. Use the `CaptionedImage` Token Within Your Site

Now use your `CaptionedImage` token in the gallery page: `src/data/pages/gallery/Gallery.tsx`.

Import the new components and tokens, as well as `on` from `@bodiless/fclasses`—

```ts
// Add `on`; remove `replaceWith` and `withMeta`.
import {
  H2, Section, addClasses, as, stylable, withDesign, on,
} from '@bodiless/fclasses';
import { CaptionedImageClean, mysiteCaptionedImage } from 'mysite';
```

—and remove the tokens which apply to the captioned image (`with...Border`), and replace the
`design` with:

```ts
const design = {
  BlueImageTile: on(CaptionedImageClean)(
    mysiteCaptionedImage.Base,
    mysiteCaptionedImage.WithBlueBorder,
  ),
  TealImageTile: on(CaptionedImageClean)(
    mysiteCaptionedImage.Base,
    mysiteCaptionedImage.WithTealBorder,
  ),
  OrangeImageTile: on(CaptionedImageClean)(
    mysiteCaptionedImage.Base,
    mysiteCaptionedImage.WithOrangeBorder,
  ),
};
```

Reload the gallery page. It should look and function exactly as before.

At this point, it is safe to delete the file `src/data/pages/gallery/CaptionedImage.tsx`, as you
have successfully moved it to the package.

?> **Extra Credit:** Refactor and move the Gallery component itself (`Gallery.tsx`) using the same
patterns.

## 3. Extend Tokens using Token Domains

Let's look again at our `Base` captioned image token:

```ts
const Base = asCaptionedImageToken({
  Core: {
    Wrapper: 'mx-2 h-full flex flex-col',
    Image: as(
      asBodilessImage(),
      'w-full',
      withNodeKey('image'),
    ),
    Body: as(
      mysiteRichText.Simple,
      withPlaceholder('Caption'),
      withNodeKey('caption'),
    ),
    BodyWrapper: 'text-white bg-black p-2 flex-grow',
  },
});
```

### 3a. Composition Token: Inverted Caption

What if we wanted to reuse this token to create a differently styled gallery page, say, one without
the inverted colors in the caption. As it stands, all the styling and behavior of our component is
mixed together into a single token. This makes it difficult to customize one aspect of the styling
without recomposing the whole token. To simplify the process, Bodiless token specifications
introduce the notion of token "domains."

As mentioned previously, domains serve to divide a token into pieces which can be selectively
extended or overridden. Let's rewrite the token above to separate behavior (our editors), layout,
and theme:

```ts
const Base = asCaptionedImageToken({
  Editors: {
    Image: as(
      asBodilessImage(),
      withNodeKey('image')
    ),
    Body: as(
      mysiteRichText.Simple,
      withPlaceholder('Caption'),
      withNodeKey('caption'),
    ),
  },
  Layout: {
    Wrapper: 'mx-2 h-full flex flex-col',
    Image: 'w-full',
    BodyWrapper: 'p-2 flex-grow',
  },
  Theme: {
    BodyWrapper: 'text-white bg-black',
  },
  Meta: {
    categories: {
      Caption: ['Dark'],
      Source: ['Local'],
      Border: ['None'],
    },
  },
});
```

In the above example, we defined four custom domains. In general, this choice will be based on an
understanding of how the token would likely be reused or extended by downstream consumers. In this
case, we separate "editors" (the way the component behaves to content editors), "layout" (how the
individual parts of the component are laid out within the outer container), "theme" (the look and
feel of the component, which is most likely to be overridden), and "meta" (the categories used in
the component picker for filtering). The "core" domain wasn't used.

Notice that if you try to compile `mysiteCaptionedImage.ts` now, you'll get a TypeScript error. This
is because the set of allowed domains is constrained. By default, Bodiless only allows a single
`Core` domain — but, usually, a design system will define its own set of domains once, and reuse
them in all their tokens. For the sake of demonstration, we will create a system that allows six.
Also, the categories were added to define the base behavior.

### 3b. Create Custom `asTokenSpec`

Create `/packages/mysite/src/asTokenSpec.ts` with the following contents:

```ts
import { DesignableComponents, asTokenSpec as asTokenSpecBase } from '@bodiless/fclasses';

const domains = {
  Core: {},
  Schema: {},
  Layout: {},
  Theme: {},
  Meta: {},
  Editors: {},
};

type D = typeof domains;

const asTokenSpec = <C extends DesignableComponents>() => asTokenSpecBase<C, D>(domains);

export { asTokenSpec };
```

Ensure this is exported from your package by adding the following to
`/packages/mysite/src/index.ts`:

```ts
export { asTokenSpec } from './asTokenSpec';
```

Now, modify the import of `asTokenSpec` in every file in your package which uses it, so that your
custom version is imported instead of the default. This should include:

- `/packages/mysite/src/components/CaptionedImage/CaptionedImageClean.tsx`
- `/packages/mysite/src/components/Element/tokens/mysiteElement.ts`
- `/packages/mysite/src/components/Gallery/GalleryClean.tsx`
- `/packages/mysite/src/components/RichText/tokens/mysiteRichText.ts`

Now, if we want, we can create a variation on the captioned image without the inverted caption. This
example (in `mysiteCaptionedImage.ts`) will use the `Base` token and omit anything from the `Theme`
domain:

```ts
import omit from 'lodash/omit';
//...
const LightCaption = asCaptionedImageToken(
  omit(Base, 'Theme'),
  {
    Meta: {
      categories: {
        Caption: ['Light'],
      },
    },
  }
);
```

Export `LightCaption` from the token collection at the end of file.

Everything else about the token will remain the same, so we don't have to worry about recreating the
layout or plugging in the editors.

?> **REMINDER:** Rebuild your `mysite` package.

The token can now be used in `src/data/pages/gallery/Gallery.tsx` to create three additional
variations in your `design{}`:

```ts
  BlueImageLightCaptionTile: on(CaptionedImageClean)(
    mysiteCaptionedImage.LightCaption,
    mysiteCaptionedImage.WithBlueBorder,
  ),
  TealImageLightCaptionTile: on(CaptionedImageClean)(
    mysiteCaptionedImage.LightCaption,
    mysiteCaptionedImage.WithTealBorder,
  ),
  OrangeImageLightCaptionTile: on(CaptionedImageClean)(
    mysiteCaptionedImage.LightCaption,
    mysiteCaptionedImage.WithOrangeBorder,
  ),
```

Visit the gallery page, and, in the gallery section, click on a component, click **Add**, and you
will see you have additional categories with Light and Dark captions that can be chosen.

### 3c. Extension Token: Content Sourced from a CMS

We can now use our design system in a context where content comes from another source, like an
external CMS:

01. Replace the `Body` with `Div`, which, by default, was the `RichText` Component.
01. Then replace the content with an alternative source.
01. Lastly, we set the meta category: source to CMS.

```ts
// Fetch content (e.g., using Gatsby's `useStaticQuery()`); using dummy content
// for example.
const useContentFromCMS = () => ({
  caption: 'CMS_TITLE',
  imgSrc: 'https://via.placeholder.com/600?text=CMS_IMAGE',
  imgAlt: 'CMS_IMAGE_ALT',
});

const WithContentFromCMS = asCaptionedImageToken({
  Core: {
    // Replace the default `RichText` starting component.
    Body: startWith(Div),
  },
  Editors: {
    Body: addProps(() => ({
      children: useContentFromCMS().caption,
    })),
    Image: addProps({
      src: useContentFromCMS().imgSrc,
      alt: useContentFromCMS().imgAlt,
    }),
  },
  Meta: {
    categories: {
      Source: ['CMS'],
    },
  },
});
```

The above example has some limitations. The image and caption both need to know where to get their
own data, so the token cannot be used to fetch data dynamically. We could perhaps enhance the
example using React context, but there is an easier way — we can simply rewrite the _clean_
component:

```tsx
const CMSCaptionedImageClean = (props: CaptionedImageProps & { contentId: string }) => {
  const { contentId, components: C, ...rest } = props;
  const content = useContentFromCMS(contentId);
  return (
    <C.Wrapper {...rest}>
      <C.Image src={content.src} alt={content.alt} />
      <C.Body>
        {content.caption}
      </C.Body>
    </C.Wrapper>
  );
};
```

Because our new clean component uses the same design as the original, the tokens we created for the
original will apply seamlessly to this one as well. This makes it possible to extend a component in
ways which are not so easy via tokens alone, and still leverage existing design system
implementations.

### 3d. Naming Convention for Extension and Composition

The difference between _extension_ and _composition_ is subtle, and deciding which to use is not an
exact science. As a rule of thumb:

- Use _composition_ when you are adding styling or behavior which creates a variation of the
  original component which downstream consumers may choose to add, remove, customize, or combine
  with other variations. In general, export the tokens which produce these variations using the
  `With...` prefix. The `WithContentFromCMS` token above is a good example of when this pattern
  should be used.
- Use _extension_ when you are customizing an existing token at the brand or site level, and
  especially when you want to completely override one or more domains from the original token, as
  this is not possible with composition. In general, do not export tokens which are meant to extend
  other tokens; export the fully extended token instead. The `LightCaption` customization described
  earlier in this article is a good example of when this pattern should be used.

This will help when you start composing your tokens into multiple variations. You will usually only
want one _extension_, and you can have multiple _compositions_.

## 4. Use Custom Tailwind Classes

The lowest level of a Bodiless design system is usually a library of utility classes which can be
applied via the [Bodiless FClasses API](../Architecture/FClasses) to produce tokens. Bodiless
includes built-in support for the [Tailwind](https://tailwindcss.com/ ':target=_blank') library to
create such classes. Up until now, we have composed all our styling using standard, out-of-the-box
Tailwind classes. These are often more than adequate for things like spacing and layout, but a
design system will often require custom classes. Let's modify our color scheme to use some custom
colors.

A detailed explanation of how to create custom Tailwind classes is out of scope for this tutorial.
We recommend reading found in [Using Tailwind System with
Bodiless](./BuildingSites/Typography/TailwindGuide). The good news is that much of the initial
configuration is handled out of the box by Bodiless; all you need to do is create a
`tailwind.config.js` file which defines your classes.

Normally, this is created at the site level. However, since our design system is being created in a
package, it makes more sense to define our custom classes at the package level.

### 4a. Update the Package's `tailwind.config.js`

Modify `/packages/mysite/tailwind.config.js`, adding the `theme` key to the `twConfig` definition.
We also suggest to extend the colors. If you were to leave off `extend`, you would overwrite colors
and not get default Tailwind colors. If default Tailwind colors are not used in the site, they will
be purged and not bloat the CSS/package.

```js
import { getPackageTailwindConfig } from '@bodiless/fclasses';

const resolver = (pkgName) => require.resolve(pkgName);

const twConfig = {
  content: [
    './lib/**/!(*.d).{ts,js,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'mysite-teal': '#45818e',
        'mysite-blue': '#455c8e',
        'mysite-orange': '#8e5245',
      },
    },
  },
};

module.exports = getPackageTailwindConfig({
  twConfig,
  resolver,
});
```

### 4b. Use the Custom Colors

Replace the colors in the `CaptionedImage` component borders — `WithBlueBorder`, `WithTealBorder`,
and `WithOrangeBorder` — with the custom colors of `border-mysite-blue`, `border-mysite-teal`, and
`border-mysite-orange`.

!> **IMPORTANT:** If you modify the Tailwind config, you must rebuild and restart the site to have
the Tailwind CSS properly rebuild. The Tailwind config creation is part of the build and isn't
updated on watch.

## 5. Extra Credit: Make the Footer a Component at the Package Level

Apply your learnings and create a reuseable Footer in the package by adding a clean footer component
and tokens, applying some styling in those tokens, and using it in the gallery page.

## 6. Create Extensible Page Templates

Templates in Bodiless are just large components, and are styled and extended the same way as any
other component. This makes it easy to keep parts of the page consistent while varying others. Here,
we'll convert the existing gallery page into a template that all pages can use.

### 6a. Add the Clean Component

Let's add the `PageClean` component, and, by now, this should be a similar exercise to all the rest
of the components you have built.

Create `/packages/mysite/src/components/Page/PageClean.tsx`:

```tsx
import React from 'react';
import type { FC, HTMLProps } from 'react';
import { Page } from '@bodiless/gatsby-theme-bodiless';
import {
  ComponentOrTag, DesignableComponentsProps, Img, designable, Div, H1, A,
} from '@bodiless/fclasses';
import { RichText } from '@bodiless/richtext-ui';
import { asTokenSpec } from '../../asTokenSpec';
import { GalleryClean } from '../Gallery';
import { FooterClean } from '../Footer';

// Design: Set of base components which will be used in the component itself
type PageComponents = {
  Page: ComponentOrTag<any>,
  Container: ComponentOrTag<any>,
  HeroLink: ComponentOrTag<any>,
  HeroImage: ComponentOrTag<any>,
  PrimaryHeader: ComponentOrTag<any>,
  BodyWrapper: ComponentOrTag<any>,
  Body: ComponentOrTag<any>,
  Gallery: ComponentOrTag<any>,
  Footer: ComponentOrTag<any>,
};

type PageProps =
  HTMLProps<HTMLElement> & DesignableComponentsProps<PageComponents>;

// JSX: Bare Template, usually with minimal styling/functionality
const PageBase: FC<PageProps> = ({ components: C, ...rest }) => (
  <C.Page {...rest}>
    <C.Container>
      <C.HeroLink>
        <C.HeroImage />
      </C.HeroLink>
      <C.PrimaryHeader />
      <C.BodyWrapper>
        <C.Body />
      </C.BodyWrapper>
      <C.Gallery />
      <C.Footer />
    </C.Container>
  </C.Page>
);

// Designable: Define the starting sub-components of the design
const pageComponents: PageComponents = {
  Page,
  Container: Div,
  HeroLink: A,
  HeroImage: Img,
  PrimaryHeader: H1,
  BodyWrapper: Div,
  Body: RichText,
  Gallery: GalleryClean,
  Footer: FooterClean,
};

const PageClean = designable(pageComponents, 'Page')(PageBase);

const asPageToken = asTokenSpec<PageComponents>();

export default PageClean;
export { asPageToken };
```

You can see all the components that were in `src/data/pages/gallery/index.tsx` are transferred into
the page component. A slight difference is that we renamed the top slots for `Image` and `Link` to
`HeroLink` and `HeroImage` to be more precise in their usage. This is good practice, as just having
`Link` and `Image` are very generic names and not clear of purpose. In addition, we wrapped the
`Body` with `BodyWrapper` (`Div`) for styling. In the designable section, you will see that we
transferred the starting sub-components.

### 6b. Add the Tokens

Now, let's proceed with copying the styling and functionality to the correct domains and slots.

Create `/packages/mysite/src/components/Page/tokens/mysitePage.ts`:

```ts
import { as } from '@bodiless/fclasses';
import { withNode, withNodeKey } from '@bodiless/core';
import {
  asBodilessImage, asBodilessLink, withPlaceholder
} from '@bodiless/components';
import { mysiteRichText } from '../../RichText';
import { mysiteGallery } from '../../Gallery';
import { mysiteElement } from '../../Element';
import { mysiteFooter } from '../../Footer';
import { asPageToken } from '../PageClean';

const Base = asPageToken({
  Editors: {
    HeroLink: asBodilessLink('hero-link'),
    HeroImage: asBodilessImage('hero-image', {
      src: 'https://via.placeholder.com/6000x1200.png?text=HERO+IMAGE',
      alt: 'Hero Image',
      title: 'Hero Image',
    }),
    Body: as(
      mysiteRichText.Simple,
      withPlaceholder('Body'),
      withNodeKey('body'),
    ),
    Gallery: as(
      mysiteGallery.Base,
      withNode,
      withNodeKey('gallery-content'),
    ),
    Footer: as(mysiteFooter.Base),
  },
  Theme: {
    Container: 'container mx-auto my-2',
    PrimaryHeader: mysiteElement.H1,
  },
});

export default {
  Base,
};
```

### 6c. Add the Index Files and Export the Components

Add the index files and import/export the appropriate named components as we have done in previous
steps.

01. Add the `/packages/mysite/src/components/Page/tokens/index.ts`.
01. Add the `/packages/mysite/src/components/Page/index.ts`.
01. Update the `/packages/mysite/src/index.ts`.

?> **REMINDER:** Rebuild your `mysite` package.

### 6d. Update the Site's Default Template to Use the Package's Page Component

Next, we want to update the site's template file, `/sites/mysite/src/templates/_default.jsx`.

It becomes a very simple job of composing the `DefaultPage` with `as(mysitePage.Base)(PageClean)`,
and exporting it.

```jsx
import { graphql } from 'gatsby';
import { PageClean, mysitePage} from 'mysite';
import { as } from '@bodiless/fclasses';

const DefaultPage = as(mysitePage.Base)(PageClean);

export default DefaultPage;

// The allSite query is extraneous and exists only to prevent
// a webpack linting error produced by default gatsby config(the $slug variable
// is used in the fragments, but the graphql doesn't pick that up and
// raises an unused parameter error).
export const query = graphql`
  query($slug: String!) {
    ...PageQuery
    ...SiteQuery
    ...DefaultContentQuery
    allSite(filter: {pathPrefix: {eq: $slug}}) {
      edges {
        node {
          buildTime
        }
      }
    }
  }
`;
```

Feel free to delete the `/sites/mysite/src/components/Page/index.tsx` file that came with your new
site, as it's no longer being used and we're now using our package-level `Page`.

### 6e. Try the New Template

In edit mode, click on **Page > New**, create a new page, and then go to that new page. This page
should have the identical look and behavior of the previous hard-coded gallery's `index.tsx` file.

If you look in the `src/data/pages/YOURPAGENAME` directory, you will see a single file
(`index.json`), and its contents (`{ "#template": "_default" }`) will say it's using the site's
`_default` template — a standard Gatsby template convention.

Feel free to add components and text to your new page.

At this point, your entire site is running from code within the package and no code is within the
page. This is site of your design system package that is easy to publish, reuse, and extend in the
future.

A future tutorial will hook the page component to a template picker that allows content editors to
pick which template they would like to use.
