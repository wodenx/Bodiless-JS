## Chameleon

A "chameleon" is a component which renders differently depending on a state
saved as bodiless content. For example, you might use a chameleon to allow a
content editor to switch between different stylings for a component, or to
toggle a components visibility. The Chameleon API is the basis for several other
components in this package, including lists (with toggled sublists) and link
toggles.

The Chameleon API builds on [the Design API](..).  A component wrapped in
`asBodilessChamelion()` will accept a variable design (similar to the
[Flow Container](..)). It also provides a context menu button which allows
the user to choose among the designs which were provided.  Here is a 
simple example (using the [FClasses API](..) for styling):

```
const asBox = addClasses('border-8 py-5 w-1/6 text-center');
const BaseComponent = props => (
  <div {...props}><A>Click me</A></div>
);

const chameleonDesign = {
  Red: addClasses('border-red-500 text-red-500'),
  Blue: addClasses('border-blue-500 text-blue-500'),
  Green: addClasses('border-green-500 text-green-500'),
};

const Chameleon = flowRight(
  withNode,
  withDesign(boxDesign),
  asBodilessChameleon('basic-chameleon'), // , {}, useOverrides),
  asBox,
  stylable,
)(BaseComponent);
```
