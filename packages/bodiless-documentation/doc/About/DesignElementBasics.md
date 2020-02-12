# Design Element Basics

In this guide, we will continue to the tutorial of the gallery and apply the design system to the Gallery component and use within pages on your site.

## 1. Create a Site
[Create a new site](https://johnsonandjohnson.github.io/Bodiless-JS/#/About/GettingStarted?id=creating-a-new-site) and launch the editor interface.

## 2. Copy Gallery example to Site & Use Site's Simple Editor
This step we are just copying overy the tutorial that was created in previous guide to your site and having it use the site's predefined editors that are provided by starter kit. 

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
Within `data/pages/gallery/index.jsx` & `data/pages/index.jsx` (homepage) you can see we use the similar primary header & header image here.  Let's move these to be shared. This way if we change the style of h1 primary header it will apply across all sites instead of having to fix each page. 

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



