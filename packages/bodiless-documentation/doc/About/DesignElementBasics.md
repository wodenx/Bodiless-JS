# Design Element Basics

In this guide, we will continue to the tutorial of the gallery and apply the some designs & best practices of site building.

## Prerequisites:
* Complete the [Site Build Basics](About/SiteBuildBasics) and launch the site's editor interface.
* Alternative, if you want to fast-forward to this tutorial.  Copy over the [gallery-final folder & contents](https://github.com/johnsonandjohnson/Bodiless-JS/tree/master/examples/test-site/src/data/pages/gallery-final) and place in a [new site](About/GettingStarted?id=creating-a-new-site) at `src/data/pages/gallery` and launch the site's editor interface.  Note: remember to rename the folder from gallery-final to gallery.

## 1. Covert the Gallery to use Site's Simple Editor
In this step we are going to refactor the gallery page to use the predefined rich text editors that are provided by starter kit. There is no need to use simple editor defined at page level in the initial tutorial, and it is best practice to define the rich text editors a site uses at the site-wide, component level. There is no need to use simple editor defined at page level in the initial tutorial and its best practice to define rich text editors a site uses at component level.

1. Lets replace the SimpleEditor with Site's Basic editor as there is no need for a specific editor at page level. 
   * Replace `import withSimpleEditor from './withSimpleEditor';`  
     with `import { asEditorBasic } from '../../../components/Editors';`
   * Replace `const Body = withSimpleEditor('body', 'Body')(Fragment);`
     with `const Body = asEditorBasic('body', 'Body')(Fragment);`
   * Repeat above steps in `CaptionedImage.tsx`
   * Delete the file `withSimpleEditor.tsx`
1. Run your site and visit the gallery page (http://localhost:8000/gallery) and it should run exactly like it did in examples/test site with slightly different choices for the Rich Text Editor in the body of the gallery page. 

## 2. Create the Gallery as reusable component to be used within site.
If you have components which may appear on more than one page in your site, its best practice to place them in `src/components` so they can be reused by any page/template.  While you could theoretically import them from another page, keeping reusable components organized in one place makes a site much easier to maintain.

1. Create a folder call Gallery in `src/components`
1. Move the Gallery.tsx & CaptionedImage.tsx to the `/src/components/Gallery` folder
1. Rename Gallery.tsx -> index.tsx 
1. Change the import on the page to import Gallery & GalleryTile from `../../../components/Gallery`
1. Run your site and visit the gallery page (http://localhost:8000/gallery) and it should run exactly like it did in examples/test site. 

## 3. Create a reuseable Primary Header for the site 
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

1. Run your site and visit the homepage & gallery page (http://localhost:8000/gallery) and it should run exactly like it did prior, except the gallery title is not bold. 

1. In `src/componets/Elements.token.ts` add a tailwind to class to asBold. 
    ```
    const asBold = addClasses('font-bold');
    ```
1. Visit the homepage & gallery page (http://localhost:8000/gallery) and both H1 titles should be bold.

The Element tokens add a design (utility classes) to a single HTML element via simplistic HOC.  This will allow it:
* to be easily reused throughout the site.
* ensure consistency.
* easily extendable and modifiable.
* and even publish in future as a package to share within a brand.

**TIP**: By convention all Element Tokens start with `as`.

## 4. Modify Captioned Image to use Design Interface
The 'CaptionedImage' is small component that is has wrapper around Image & Body text. Let's go ahead and apply the [design api](Design/DesignSystem) to make it more flexible and reusable.

1. Within `CaptionedImage.tsx`, the first step is to define all the  individual sub-components of our `CaptionedImage` and ensure that they are stylable (unless for some reason they shouldn't be.)  While this isn't required, we recommend using the [FClasses](Development/Architecture/FClasses) functionality so that in future it will allow us to easily replace or modify the individual components with either new/modified function or design.

   * The CaptionedImageComponents define each individual component as Styleable Props.  
       * StylableProps is defining that you will be passing FClasses to this component. 

    ```
    export type CaptionedImageComponents = {
      Wrapper: ComponentType<StylableProps>,
      Image: ComponentType<StylableProps>,
      Body: ComponentType<StylableProps>,
    };
    ```
    
   * The captionedImageStart:CaptionedImageComponents defines what each component is. 
    ```
    const captionedImageStart:CaptionedImageComponents = {
      Wrapper: Section,
      Image: Img,
      Body: Div,
    };

    type Props = DesignableComponentsProps<CaptionedImageComponents> & { };
    ```

1. Next, let's define what the component will render--this is really the base template for our component.  By combining what is defined above with this layout, it will render an image & div in a section as the wrapper.
    ```
    const CaptionedImageBase: FC<Props> = ({ components }) => {
      const {
        Wrapper,
        Image,
        Body,
      } = components;

      return (
        <Wrapper>
          <Image />
          <Body />
        </Wrapper>
      );
    };
    ```
    
    Note: that the actual sub-components here are *injected*; that is, they are passed into the component via a `components` prop.  We defined the defaults for these components above (`captionedImageStart`), but we will actually render whatever we are passed. 
    
1. However, the usual pattern is not to pass these components directly.  Instead, let's wrap our component with `designable` to allow consumers  to provide styling through *higher order components* (HOC's) which will be applied to the defaults. (Note, you should already be familiar with the use if `withNode` to provide your component with a place to store its data).
 
    ```
    const CaptionedImageClean = flow(
      designable(captionedImageStart),
      withNode,
    )(CaptionedImageBase);
    ```
    
   Next, lets pass in some HOC's via withDesign to make our component editable.
   
    ```
    const asCaptionedImage = flow(
      withDesign({
        Image: asBodilessImage('image'),
        Body: asEditorBasic(
          'body',
          'Caption',
        ),
      }),
    );
    ```
    
    withDesign takes an object whose keys are the names of the subcomponents which belong to our CaptionedImage, and whose values are higher-order components which should be applied to each. As you'll see below, these HOC's often carry elements of styling, and correspond to the "tokens" of a design system. Here, they apply functionality, but the pattern is the same.

    Note, that these HOC's (or tokens) are defined at the site level. For now, they are just pass-through's to the core Bodiless utilities - but in many cases you will want to customize these at the site level (for example, to provide a different image selector, or a link with an editable target attribute.)

1.  Lastly, lets combine these together and export. 
    ```
    const CaptionedImage = asCaptionedImage(CaptionedImageClean);
    export default CaptionedImage;
    export {
      CaptionedImage,
      CaptionedImageClean,
      asCaptionedImage,
    };
    ```

1. Final step in this file, is make sure the imports are correct. This is pretty self explanatory. If you forget one you will be warned and it won't work!
    ```
    import React, { FC } from 'react';
    import { asBodilessImage } from '@bodiless/components';
    import { withNode } from '@bodiless/core';
    import {
      withDesign,
      designable,
      DesignableComponentsProps,
      Div,
      Section,
      Img,
      StylableProps,
    } from '@bodiless/fclasses';
    import { flow } from 'lodash';
    import { asEditorBasic } from '../Editors';
    ```
    
1. The redesigned `ImageCaptioned.tsx` contains the template defining how your component functions, but has no design or styling of the component. Let's create a `token.tsx` and put in a few design elements to define some variations on what the component could use.

    ```
    import {
      withDesign,
      addClasses,
    } from '@bodiless/fclasses';

    const asImageTile = withDesign({
      Wrapper: addClasses('mx-2 border-8'),
      Image: addClasses('w-full'),
    });
    
    export {
      asImageTile,
    }
    ```
    
    These Component Tokens are really no different than Element tokens except they apply to multiple subcomponents. In the `asImageTile`, you can see we added margin, border to the wrapper and made sure the image shows full-width.
    
    Note that these HOC's themselves can be considered "tokens" which describe design elements which can be applied to our `CaptionedImage` as a whole.
    
    **TIP**: By convention all Component Tokens start with `as`.
    

## 5. Let's use that CaptionedImage & PrimaryHeader on the homepage.

Let's take the two components we have and updated and show the flexibility. The `CaptionedImage` caption could be replaced with Header H1 component.

1. On the homepage, import in the `CaptionedImage` and define this new variation.

    ```
    import { asCaptionedImage, CaptionedImage } from '../../components/Gallery-Design/CaptionedImage';
    
    const PageHeader = flow(
      asCaptionedImage,
      withDesign({
        Body: replaceWith(PrimaryHeader),
      }),
    )(CaptionedImage);
    ```

    You can see we modified the HOC's `withDesign` and replaced the body (previously defined `asBasicEditor` rendering as div) to the basic editable rendering as H1.
    
    Within the homepage remove the combination of HeaderImage & PrimaryHeader and add the PageHeader as it renders an editable image as well as the H1.

    ```
      <div className="flex my-3 w-full">
        <HeaderImage />
      </div>
      <PrimaryHeader />
    ```
    
    and replace with 
    
    ```
      <PageHeader />
    ```
    
    Reload the homepage and make sure it renders as expected!

1. Visit the homepage & gallery page (http://localhost:8000 & http://localhost:8000/gallery) and homepage should be full width image and gallery should be linkable image.

While these are simple token and components we are wrapping in the design, proceeding in this manner as the components grow in either functionality or complexity gives us a few benefits: 

* Separation of concern:  the design is separated from what the component is defined as.
* Simplified Styling: this simplyifies styling of components and eliminates the normal css cascade that builds and grows over time.
* Isolation: it keeps the styling isolated to the specific item minimizing the risk of affecting other non-related items. 

These benefits apply during the build and future changes benefit as well.  For example, if there is a request to change a rendered H1 to H2 for SEO purposes, the styling or look won't be affected.

For more information, read about [FClasses](Development/Architecture/FClasses) you will also find you can removeClasses, replace Components with another Component (replaceWith) allowing great flexibility is using other components or varying existing components.
