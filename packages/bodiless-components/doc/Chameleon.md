# Chameleon

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
simple example (using the [FClasses API](..) and TailwindCSS for styling):

```js
import { addClasses, withDesign, Div } from '@bodiless/fclasses';
import { asBodilessChameleon } from '@bodiless/components';

const BaseComponent = addClasses('border-8 py-5 text-center')(Div);

const basicChameleonDesign = {
  Red: addClasses('border-red-500 text-red-500'),
  Blue: addClasses('border-blue-500 text-blue-500'),
  Green: addClasses('border-green-500 text-green-500'),
};

const BasicChameleon = flow(
  asBodilessChameleon('basic-chameleon'),
  withDesign(basicChameleonDesign),
)(BaseComponent);

...

<BasicChameleon>
  <div>Chameleons!</div>
  <div>Available Now!</div>
</BasicChameleon>
```

First we create our base component (a styled 'div' element). Next, we define the
different states of the component as a design (a keyed list of higher-order
components). Finally, we compose our chameleon by wrapping the base component in
`asBodilessChameleon` and applying our design. The first parameter to
`asBodilessChameleon` is a node-key specifying where the current state of the
chameleon should be stored.

Now, when you click inside the div in edit mode, you'll see a form
which allows you to choose one of the available colors. Your choice
will be saved as content.

## Toggles

One common use-case for Chameleons is to implement *toggles*. A Toggle is really
just a Chameleon with only two possible states. Let's give a content editor the
ability to turn on and off the availability notice in the above component.

```js
import { addProps } from '@bodiless/fclasses';

const BaseAvailability = ({ isAvailable, ...rest }) => (
  <Div {...rest}>
    {isAvailable ? 'Available Now!' : 'Call for Availability'}
  </Div>
);

const toggleDesign = {
  Available: flow(
    addProps({ isAvailable: true }),
  ),
};

const AvailabilityToggle = flow(
  asBodilessChameleon('basic-toggle', { component: 'Available' }, () => ({ label: 'Avail' })),
  withDesign(toggleDesign),
)(BaseAvailability);
```

Here we first create a simple component which renders different text depending on
an `isAvailable` prop. Then we create a design with only a single state
(`Available`) which adds the prop. Finally, we wrap our component in
`asBodilessChameleon` and apply the design, exactly as before.

Observe that we have introduced two new optionsl parameters to
`asBodilessChameleon`. These follow the same pattern as any `asBodiless...` HOC:
- The second parameter defines the default state of the chameleon. It is an
  object with a single `component` key, whose value should be one of the keys in
  our design. In this case, we specify that the default state should be `Available`.
- The third parameter defines overrides to default values for the edit button
  and form. In this case, we want to give the editor a clue as to exactly what
  will be toggled, so we override the button label. Note that this parameter is
  actually a custom React hook. It will be invoked in the render context of the
  edit form, and receive the component's props as an argument.

> NOte: Because this chameleon only has a single state, it provides a toggle
> button rather than a swap button. Clicking the toggle button immediately
> toggles the state, without bringing up a form to select a state as in the
> previous example.

### Default state

The toggle above actually has two states: the one specified in the design ("Available")
and the default state. Similarly the chameleon in the first example actually has four
states.  What if you want to apply some styling to the component in its default state?
For example, what if we wanted the "Call for availability" message to be red?

To support this, a design applied to a chameleon has a special
`_default` key which allows you to apply HOC's to the component when in its
default state:

```js
const RedAvailabilityToggle = withDesign({
  _default: addClasses('border-red-500 text-red-500'),
)(AvailabilityToggle);
```

## Advanced Use cases

### Toggling Visibility

In the above examples, all states of the Chameleon are visible, so there is
always an element on the screen which an editor can click to display the menu
option.  But what if we want to toggle an element's visibility?  In this case
there would be nothing to click when the element was toggled off. To solve
this problem, we make use of a lower level Chamelion API to attach the menu
button to an enclosing component:

```jsx
import { removeClasses } from '@bodiless/fclasses';
import { applyChameleon, withChameleonButton, withChameleonContext } from '@bodiless/organisms';

const toggleVisibilityDesign = {
  Available: removeClasses('invisible'),
};

const VisibilityToggle = flow(
  addClasses('invisible'),
  applyChameleon,
  withDesign(toggleVisibilityDesign),
)(BaseAvailability);

const VisibilityTogglerapper = flow(
  withChameleonButton(() => ({ label: 'Avail' })),
  withChameleonContext('decomposed-toggle'),
  withDesign(toggleVisibilityDesign),
)(BaseComponent);

...

<VisibilityTogglerapper>
  <div>Chameleons!</div>
  <VisibilityToggle isAvailable />
</VisibilityTogglerapper>
```

Here we've decomposed `asBodilessChameleon` into three constituent parts:
- `withChameleonContext` establishes a connection to the Bodiless data system
  and makes the current state of the chameleon available to its children.
- `withChamelionButton` provides the context menu button which provides the
  Chameleon UX.
- `applyChameleon` uses the chameleon state to apply the appropriate HOC's
   to the underlying components.

We create a wrapper component which establishes the context and provides the
menu button, and an inner component which uses the data to toggle the visibility.
Note that we've had to apply the design to both components.  This is because the
component providing the button needs to know the possible states so it can properly
render the form.
