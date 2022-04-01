# Vital Templates Overview

The Site Builder can create templates that the site pages use to render the data in a similar
layout/pattern. Using templates makes the site building and editing process more efficient.

## Template Benefits

Using templates provides the following benefits:

* A quick way to create similar style or layout of pages.
* It allows control or governance over what the Content Editor can add, edit, and remove from the
  page.
* It allows Site Builder to make future changes to all pages built off these templates, without
  editing each individual page.

## Brief Overview of Templates in the Test Site

* [Generic Template](./Generic) - A basic page with 3 slots for content + breadcrumb.
* [Product Detail Page](./ProductDetailPage) - A page oriented to showcase product and details about the specific product.
* [Product Listing Page](./ProductListingPage) - A landinage page allowing the user to interact and filter to view avaible products.

## Governance vs Flexibility of Templates

As a Site Builder, you can create templates with defined items to allow general uniformity, and with
Flow Containers within areas to allow flexibility to the Content Editor.

The default template example above offers no governance and is a very flexible page for the Site
Builder.

By contrast, the Product Detail Page above has strict enforcement and doesn't allow the Content
Editor much variation at all. It defines the product image placement, title, and product detail
headers — only allowing the Content Editor to modify the content. They have some flexibility at the
bottom, where they can add different card components in the Flow Container area, but it's still
restrictive. This allows quick product additions by Content Editor, as they only have to enter in
the specific production information.

Let's use an example of an article to create a template with some governance, but still a lot of
flexibility. A template could be created that has two columns (⅔ and ⅓), where the left side is a
Flow Container area that can take any component, and the right-⅓ sidebar may only take card
components or Rich Text Editor components. This allows all articles to have column layouts and
enforce uniformity, but what is placed into those areas is more flexible and controlled by the
editor. In the sidebar, though, you're limited to components that fit nicely into ⅓-width space.
This offers flexibility, but keeps the articles using this template in the layout of two columns
without being too restrictive.

As they design templates, Site Builders can choose the following:

* The Layout of the template.
* To add pre-placed components on the template.
* Where to place Flow Containers, allowing flexible areas in the template.
* Different variations of Flow Containers that control what components could be added to an area.

## Content Editor

When the content editor creates a new page, it will create a new page using the default template.
They can go to Page | Template and choose which template they would like to switch to.  (@jones see /styleguide section and you will get the templates button)

## Site Builder

The choice of what templates and setting templates is done within the [cxPage](https://github.com/johnsonandjohnson/Bodiless-JS/tree/main/packages/cx-templates/src/components/Page) Component.

First create a Page token defining what templates & their tokens should apply to a page option and exported as necessary.

````js
const Default = asFluidToken({
  ...cxPage.Default,
  Components: {
    _default: on(GenericTemplateClean)(cxGenericTemplate.Default),
    PDP: on(PDPClean)(cxPDP.Default),
    PLP: on(PLPClean)(cxPLP.Default),
  },
});

export default {
  ...cxPage,
  Default,
};

````

Then within the _default.jsx file in the sites/NAMEOFSITE/src/templates it will call use this token.

````js
const DefaultPage = as(__cxstarter__Page.Default)(Fragment);

export default DefaultPage;
```

@jones -- i think there is one more step to get the choice of Templates in the Template UI list seen by content editor -- need to fidn that step. :)
