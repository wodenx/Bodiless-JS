# Vital Generic Page Template

## Overview

The generic template is barebones templates that provides four sections on page.

* Top is full width viewport section.  This will be limited to a select group of comopnents that work well for full width and its intention from design perspective is it will be the "hero".
* Breadcrumb which is reserved slot for site's breadcrumb if its used on that page.
* Content section, which also is a constrain section where primary content lives.
* Bottom section, which also is a constrain section where items such as related content or advertisements could live.

## Usage

## Content Editor

There is no content editor's interaction with the template itself but with the components available that are provided in the sections.

## Site Builder

This generic template is setup in Vital design system to be the default template provided to users.

What template are provided with tokens can updateing the Page component such as this which will set the _default page to use the GenericTemplateClean comonent and apply the default tokens to it.

````js
const Default = asFluidToken({
  ...cxPage.Default,
  Components: {
    _default: on(GenericTemplateClean)(cxGenericTemplate.Default),
  },
});
```

### Overriding 

#### Via Shadowing (*Preferred Method)

Provide the Shadowing function as defined in [Shadow](../CX_Elements/CX_Shadow).

File to shadow:
[`cxGenericTemplate`](https://github.com/johnsonandjohnson/Bodiless-JS/blob/main/packages/cx-templates/src/components/GenericTemplate/tokens/cxGenericTemplate.ts)

## Architecture

Generic Templates provides a top, breadcrumb, content, bottom slots with wrappers. To see how these
elements are structured, please see:
[`GenericTemplateClean.tsx`](https://github.com/johnsonandjohnson/Bodiless-JS/blob/main/packages/cx-templates/src/components/GenericTemplate/GenericTemplateClean.ts)