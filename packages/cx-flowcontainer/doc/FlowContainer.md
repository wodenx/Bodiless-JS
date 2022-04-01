# Vital FlowContainer Tokens

The Vital flowcontainer is just a pass-thru and uses [Bodiless Flowcontainer](@jones link to bodiless #/Components/FlowContainer/).  The vital flowcontainer package does provides some useful tokens that can be used to quick constrainments on flowcontainer.  It also provides token that provides ability to do a ContentRegion aka. nested flowcontainer.

## Content Editor Details

The interaction with Vital Flow Container is same as Bodiless so refer to https://edit.pramne6ybu-jvaff4bu65vgm.us-2.platformsh.site/___docs/#/Components/FlowContainer/?id=content-editor-details

## Site Builder Details

Available Tokens:
* WithFullWidthConstraint - components with this flowcontainer will always be full width at any viewport.
* WithTabletOneThirdConstraint - components will default to 1/3 upon additon on tablet/desktop viewports.  But can changed at either viewport if not desired. This token is useful to apply if you expect that region to always use 1/3 width components to make content entry faster and not resize each new component when added.
* ContentRegion & WithContentRegionVariations -- provides tokens to nest flow contianers
**  `ContentRegion` is a flow container designed to be nested inside another flow container.
** `WithContentRegionVariations` is token to apply to nest the ContentRegion.

````js
const Default = asFluidToken(
  {
    ...Base,
    Spacing: {
      Wrapper: cxSpacing.GutterOffset,
      ComponentWrapper: cxSpacing.Gutter,
    },
  },
  WithComponentsVariations, // a token that would define list of components available for this flowcontainer
  WithContentRegionVariations,
);
````

## Architectural Details

none applicable. @jones say that better.
