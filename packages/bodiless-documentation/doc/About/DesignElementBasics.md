# Design Element Basics

In this guide, we will extend the gallery tutorial, apply some designs, and introduce some best practices of site building.

## 1. Create a Site
[Create a new site](About/GettingStarted?id=creating-a-new-site) and launch the editor interface.

## 2. Copy Gallery example to Site & Use Site's Simple Editor
In this step we are going to refactor the gallery page to use the predefined rich text editors that are provided by starter kit. There is no need to use simple editor defined at page level in the initial tutorial, and it is best practice to define the rich text editors a site uses at the site-wide, component level. There is no need to use simple editor defined at page level in the initial tutorial and its best practice to define rich text editors a site uses at component level.

1. Copy over the [gallery-final folder & contents](https://github.com/johnsonandjohnson/Bodiless-JS/tree/master/examples/test-site/src/data/pages/gallery-final) and place in site at `src/data/pages/gallery`  Note: remember to rename the folder from gallery-final to gallery.

1. Lets replace the SimpleEditor with Site's Basic editor as there is no need for a specific editor at page level. 
   * Replace `import withSimpleEditor from './withSimpleEditor';`  
     with `import { asEditorBasic } from '../../../components/Editors';`
   * Replace `const Body = withSimpleEditor('body', 'Body')(Fragment);`
     with `const Body = asEditorBasic('body', 'Body')(Fragment);`
   * Repeat above steps in `CaptionedImage.tsx`
   * Delete the file `withSimpleEditor.tsx`
1. Run your site and visit the gallery page (http://localhost:8000/gallery) and it should run exactly like it did in examples/test site with slightly different choices for the Rich Text Editor in the body of the gallery page. 

## 3. Create the Gallery as reusable component to be used within site.
If you have components which may appear on more than one page in your site, its best practice to place them in `src/components` so they can be reused by any page/template.  While you could theoretically import them from another page, keeping reusable components organized in one place makes a site much easier to maintain.

1. Create a folder call Gallery in `src/components`
1. Move the Gallery.tsx & CaptionedImage.tsx to the `/src/components/Gallery` folder
1. Rename Gallery.tsx -> index.tsx 
1. Change the import on the page to import Gallery & GalleryTile from `../../../components/Gallery`
1. Run your site and visit the gallery page (http://localhost:8000/gallery) and it should run exactly like it did in examples/test site. 

## 4. Create a reuseable Primary Header for the site 
Within `data/pages/gallery/index.jsx` (gallery page) & `data/pages/index.jsx` (homepage) you can see we use the same primary header `h1`.  Let's make this primary header a shared component. This way if we change the style of the primary header, it will apply throughout the site instead of having to be fixed on each page. 

1. In `src/componets/Elements.token.ts` lets define a new H1 Primary Header
    ```
    const PrimaryHeader = flow(
      asHeader1,
      asBold,
      asEditable('title', 'Page Title'),
    )(H1);
    ````
1. Remember to add imports needed & export this new component.
1. Change the imports on both gallery index.jsx & homepage page index.jsx and remove the current PrimaryHeader definitions.
1. Run your site and visit the homepage & gallery page (http://localhost:8000/gallery) and it should run exactly like it did in example site except the gallery title is not bold. 
1. In `src/componets/Elements.token.ts` add a tailwind to class to asBold. 
    ```
    const asBold = addClasses('font-bold');
    ```
1. Visit the homepage & gallery page (http://localhost:8000/gallery) and both H1 titles should be bold.

## 5.  Create a reuseable Primary Header Image for the site 
The header image is also a case where we could create a more flexible linkable image header.  Let's go ahead and create a component that we can reuse and apply the [design api](Design/DesignSystem) to make some variations.

* The header on the homepage is a simple full width image.
* The header on the gallery page is linkable image. 

Lets create a `HeaderImage` that is full-width, linkable image with a token that gives the option to remove the link.

1. Create HeaderImage folder
Let's create a HeaderImage folder in `/src/components` and create two files within this folder `index.tsx` & `token.tsx`.  This is a best practice to start creating components in this manner.  The index.tsx contains your definition of what your component does and token.tsx contains definitions of how your component looks.

1. Lets start work on the `index.tsx` and get the imports setup.  This is pretty self explanatory. If you forget one you will be warned and it won't work!
    ```
    import React from 'react';
    import { flow } from 'lodash';
    import {
      withDesign,
      designable,
      DesignableComponentsProps,
      Div,
      A,
      Img,
      StylableProps,
    } from '@bodiless/fclasses';
    import {
      asBodilessImage,
      asBodilessLink,
    } from '@bodiless/components';
    import { withNode } from '@bodiless/core';
    ```
1. The first step is to define all the  individual sub-components of our HeaderImage and ensure that they are stylable.  This will allow us to replace or modify the individual components within this component. 

   * The HeaderImageComponents define each individual component as Styleable Props. 
   * The headerImageStart:HeaderImageComponents defines what each component is. 
    ```
    export type HeaderImageComponents = {
      ImageWrapper: ComponentType<StylableProps>,
      ImageLink: ComponentType<StylableProps>,
      Image: ComponentType<StylableProps>,
    };

    const headerImageStart:HeaderImageComponents = {
      ImageWrapper: Div,
      ImageLink: A,
      Image: Img,
    };
    type Props = DesignableComponentsProps<HeaderImageComponents> & { };
    ```
1. Next, let's define what the component will render--this is really the base template for our component.  As you can see, It will render a linked image in a div wrapper.
    ```
    const HeaderImageBase: FC<Props> = ({ components }) => {
      const {
        ImageWrapper,
        Image,
        ImageLink,
      } = components;

      return (
        <ImageWrapper>
          <ImageLink>
            <Image />
          </ImageLink>
        </ImageWrapper>
      );
    };
    ```
    
    Note that the actual sub-components here are *injected*; that is, they are passed into the component via a `components` prop.  We defined the defaults for these components above (`headerImageStart`), but we will actually render whatever we are passed. 
    
1. However, the usual pattern is not to pass these components directly.  Instead, let's wrap our component with `designable` to allow consumers  to provide styling through *higher order components* (HOC's) which will be applied to the defaults. (Note, you should already be familiar with the use if `withNode` to provide your component with a place to store its data).
 
    ```
    const HeaderImageClean = flow(
      designable(headerImageStart),
      withNode,
    )(HeaderImageBase);
    ```
    
   Next, lets pass in some HOC's via withDesign to make our component editable.
   
    ```
    const asEditableHeaderImage = flow(
      withDesign({
        Image: asBodilessImage('headerimage'),
        ImageLink: asBodilessLink('imagelink'),
      }),
    );
    ```
    
    withDesign takes an object whose keys are the names of the subcomponents which belong to our HeaderImage, and whose values are higher-order components which should be applied to each. As you'll see below, these HOC's often carry elements of styling, and correspond to the "tokens" of a design system. Here, they apply functionality, but the pattern is the same.

    Note that these HOC's (or tokens) are defined at the site level. For now, they are just pass-through's to the core Bodiless utilities - but in many cases you will want to customize these at the site level (for example, to provide a different image selector, or a link with an editable target attribute.)

1.  Lastly, lets combine these together and export. 
    ```
    const HeaderImage = asEditableHeaderImage(HeaderImageClean);

    export default HeaderImage;
    ```
    
1. Turning our focus to the `token.tsx`, this is where we will define some variations on what the component will look like .  We start with the imports and then export two different stylings, with
    * `asHeaderImageDefaultStyle` being a full width image, with rounded corners
    * `asHeaderImageNotLinkable` simply removing the link from the image.

    Note that these HOC's themselves can be considered "tokens" which describe design elements which can be applied to our HeaderImage as a whole.


    ```
    import React from 'react';
    import { flow } from 'lodash';
    import {
      withDesign,
      addClasses,
      remove,
    } from '@bodiless/fclasses';
    import { asImageRounded } from '../Elements.token';

    export const asHeaderImageDefaultStyle = withDesign({
      ImageWrapper: addClasses('relative'),
      ImageLink: addClasses(''),
      Image: flow(
        addClasses('m-0 w-full h-auto'),
        asImageRounded,
      ),
    });

    export const asHeaderImageNotLinkable = withDesign({
      ImageLink: remove,
    });

    ```

1. Note, above we used a new token describing rounded corners (`asImageRounded`).  This would belong to the design system of the site, and should be placed in an `Elements.token.ts` file:

    ```
    const asImageRounded = addClasses('rounded-lg');
    ```
    We have already touched the `elements.token.ts` file in a previous step but you can see these tokens use the same [FClasses](Development/Architecture/FClasses) that the components are using and add styling via `addClasses`. 

## 6. Let's use that Header Image Component both on the front page and gallery page.

1. On the homepage, import in the `HeaderImage` and tokens, and remove the previous local HeaderImage definition:

    ```
    import HeaderImage from '../../components/HeaderImage';
    import { asHeaderImageDefaultStyle, asHeaderImageNoLink } from '../../components/HeaderImage/token';

    const HomePageHeaderImage = flow(asHeaderImageDefaultStyle, asHeaderImageNoLink)(HeaderImage);
    ```

    and replace

    ```
      <div className="flex my-3 w-full">
        <HeaderImage />
      </div>
    ```
    
    with ```<HomePageHeaderImage />```

1. On the gallery, import in the `HeaderImage` and tokens, and remove the previous local `HeaderImage` definition:

    ```
    import HeaderImage from '../../../components/HeaderImage';
    import { asHeaderImageDefaultStyle } from '../../../components/HeaderImage/token';

    const GalleryHeaderImage = asHeaderImageDefaultStyle(HeaderImage);
    ```

    and replace 

    ```
      <div className="flex my-3 w-full">
        <HeaderImage />
      </div>
    ```
    
    with ```<GalleryHeaderImage />```

1. Visit the homepage & gallery page (http://localhost:8000 & http://localhost:8000/gallery) and homepage should be full width image and gallery should be linkable image.

While this is simple component, proceeding in this manner gives us a few benefits: 

* Imagine that a request came in that all images headers on all pages, should not have rounded corners.  You delete one element token out of asHeaderImageDefaultStyle and it takes effect on any `HeaderImage` in use on any page using this style and doesn't require going through each page.
* Another benefit is this simplyifies your styling and eliminates the normal css cascade. 
* Future changes also eliminates the risk that unintended elements may get the change.  We can safely remove the rounded corners of the header image and leave other images used elsewhere with rounded corners.

For more information, read about [FClasses](Development/Architecture/FClasses) you will also find you can removeClasses, replace Components with another Component (replaceWith) allowing great flexibility is using other components or varying existing components.
