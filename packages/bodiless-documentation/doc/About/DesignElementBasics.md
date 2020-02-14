# Design Element Basics

In this guide, we will continue to the tutorial of the gallery and apply the some designs & best practices of site building.

## 1. Create a Site
[Create a new site](https://johnsonandjohnson.github.io/Bodiless-JS/#/About/GettingStarted?id=creating-a-new-site) and launch the editor interface.

## 2. Copy Gallery example to Site & Use Site's Simple Editor
This step we are just copying overy the tutorial that was created in previous guide to your site and having it use the site's predefined editors that are provided by starter kit. There is no need to use simple editor defined at page level in the initial tutorial and its best practice to define editors a site uses at component level.

1. Copy over the [gallery-final folder & contents](https://github.com/johnsonandjohnson/Bodiless-JS/tree/master/examples/test-site/src/data/pages/gallery-final) and place in site at `src/data/pages/gallery`  Note: rename the folder from gallery-final to gallery.

1. Lets replace the SimpleEditor with Site's Basic editor as there is no need to use specific editor at page level. 
   * Replace `import withSimpleEditor from './withSimpleEditor';`  
     with `import { asEditorBasic } from '../../../components/Editors';`
   * Replace `const Body = withSimpleEditor('body', 'Body')(Fragment);`
     with `const Body = asEditorBasic('body', 'Body')(Fragment);`
   * Repeat above steps in `CaptionedImage.tsx`
   * Delete the file `withSimpleEditor.tsx`
1. Run your site and visit the gallery page (http://localhost:8000/gallery) and it should run exactly like it did in example site. 

## 3. Create the Gallery as reusable component to be used within site.
If you are going to have component reusable for a page or template, its best to have them placed in `src/components` so they can be reused by any page/template.  While you could import them from another page, it's not best practice and makes future finding and maintaining hard finding components within a page.

1. Create a folder call Gallery in `src/components`
1. Move the Gallery.tsx & CaptionedImage.tsx to the `/src/components/Gallery` folder
1. Rename Gallery.tsx -> index.tsx 
1. Change the import on the page to import Gallery & GalleryTile from `../../../components/Gallery`
1. Run your site and visit the gallery page (http://localhost:8000/gallery) and it should run exactly like it did in example site. 

## 4. Create a reuseable Primary Header for the site 
Within `data/pages/gallery/index.jsx` & `data/pages/index.jsx` (homepage) you can see we use the similar primary header & header image here.  Let's move the primary header h1 to be shared. This way if we change the style of h1 primary header it will apply throughout sites instead of having to fix each page. 

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
1. In `src/componets/Elements.token.ts` add a tailwind to class to asBold. i.e. `const asBold = addClasses('font-bold');
1. Visit the homepage & gallery page (http://localhost:8000/gallery) and both H1 titles should be bold.

## 5.  Create a reuseable Primary Header Image for the site 
Let's go ahead and create a component that we can reuse and apply the design api to make some variations.

The header on the homepage is simple full width image.  The header on the gallery page is linkable image. 

1. Create HeaderImage folder
Let's create a HeaderImage folder in `/src/components` and create two files within this folder `index.tsx` & `token.tsx`.

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
1. Let's setup that every individual component is stylable and then define what that component is.  This will allow us to replacy or modify the individual components within this component. 
   * The HeaderImageComponets define each individual component as Styleable. 
   * The headerImageStart:HeaderImageComponents defines what each are. 
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
    type Props = DesignableComponentsProps<ToutComponents> & { };
    ```
1. Next, lets generate how the component will render:
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
1. Next, lets combine the individual elements we have with the designable interface so they can take the Design prop.  
    ```
    const HeaderImageClean = flow(
      designable(headerImageStart),
      withNode,
    )(HeaderImageBase);

    const asEditableHeaderImage = flow(
      withDesign({
        Image: asBodilessImage('headerimage'),
        ImageLink: asBodilessLink('imagelink'),
      }),
    );
    ```
1.  Lastly, lets combine these together and export. 
    ```
    const HeaderImage = asEditableHeaderImage(HeaderImageClean);

    export default HeaderImage;
    ```
    
1. Turning our focus to the token.tsx, this is where we will define what the component will look like and abstract the design here.

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


We start with the imports and then export to 2 different designs styles with 
* asHeaderImageDefaultStyle being a full width image, with rounded corners
* AsHeaderImageNotLinkable simply removes the Linkable image.


1. We also need a new token of rounded corners that would be useful to a token, so place this `Elements.token.ts` file:
`const asImageRounded = addClasses('rounded-lg');`
and remember to export it.



## 6. Let's use that Header Image Component both on the front page and gallery page.

On the homepage, import in the HeaderImage and styled Headers:
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

On the gallery, import in the HeaderImage and styled Headers:
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
with
```<GalleryHeaderImage />```

1. Visit the homepage & gallery page (http://localhost:8000 & http://localhost:8000/gallery) and homepage should be full width image and gallery should be linkable image.

While this is simple component, image that a request came in that all images headers on all pages, should not have rounded corners.  You delete one element token out of asHeaderImageDefaultStyle and it takes effect on any Header Image using this style and not going through each page.

For more information, read about [FClasses](https://johnsonandjohnson.github.io/Bodiless-JS/#/Development/Architecture/FClasses) you will also find you can removeClasses, replace Components with another Component (replaceWith) allowing great flexibility is using other components or varying existing components.
