# The Bodiless Admin UI

## Overview

The Bodiless Admin UI consists of a menu system along with associated forms. It
is *contextual*. In other words, the menu options that appear at any given point
in time are defined by the component with which the user is currently
interacting. This component defines what we call the "active context", which is
usually activated by a click or focus event. Contexts and associated menu
options for all parent components are also considered active. This allows a user
to perform operations on a nested tree of components, even if they are
co-extensive in space -- for example, in a list of images, operations pertaining
to the list (add/remove items) will be available along with those pertaining to
the image (upload).

Bodiless uses the [React Context API](https://reactjs.org/docs/context.html) to
provide a
["page edit context"](https://github.com/johnsonandjohnson/Bodiless-JS/blob/master/packages/bodiless-core/src/PageEditContext/index.tsx)
components on the page. This is an interface which allows a component to
contribute contextual elements to the page edit UI (currently limited to toolbar
menu items). For example, an image component might contribute a menu item which
allows a user to upload an image.

The page edit context also provides an interface to a global store which defines
the UI state, including:

- which edit context is "active" (ie, which component has the current focus),
  and what related menu options should be available.
- whether edit mode is active (ie, whether components should expose their edit
  interfaces)
- in future, anything else which might affect all components on the page (eg
  whether the current changes have been pushed, whether there are upstream
  changes to be pulled, etc).


## Working with the Page Edit Context

There are several ways in which a component can provide or consume the edit context.

### Providing a new context

To provide a new context value (usually to add menu options which should appear
when a component has focus), you may use the supplied `PageContextProvider`

```javascript
const getExampleMenuOptions = () => {
  // this should return an array of menu options, see below ...
}

const Example: React.FC = ({ children }) => (
  <PageContextProvider getMenuOptions={getExampleMenuOptions} name="Example">
    {children}
  </PageContextProvider}
```
Here we provide a menu options callback as a prop to the `ContextProvider` component.
This will be invoked when this context or any descendant is activated.  It should return any menu
options this component wishes to provide (see [Context Menu Options](#context-menu-options)
below for more information).

Note that it is unusual to invoke the provider directly in this manner.  Instead, use the
`withMenuOptions` hoc to attach options to your component. First you define a custom hook
which will create your `getMenuOptions()` callback. This hook will be invoked when the
component is rendered, and will receive its props as an argument:

```
const useGetMenuOptions = (props) => {
  const { propUsedInOption } = props;
  const contextValueUsedInOption = React.useContext(SomeContext);
  return React.useCallback(
    () => (
      // This should return an array of menu options. It can use
      // any of the props received by the original component, as well
      // as any other react hook.
    ),
    [propUsedInOption, contextValueUsedInOption],
  );
};
```

Then, pass that along with a unique name to `withMenuOptions` to create an HOC which will
add the options to your component.

```
const ComponentWithMyOptions = withMenuOptions({
  useGetMenuOptions,
  name: 'my-component'
})(AnyComponent);
...
<ComponentWithMyOptions propUsedInOption="foo" />
```

Note that the menu options you are defining here will only be available when
your component (or one of its children) declares itself as "active". To do so,
it will need to use a method on the current context.

### Consuming the context with hooks

To access the current page edit context, simply use the `useEditContext()`
and/or `useContextActivator()` hooks.

```javascript
import { observer } from 'mobx-react-lite';
const Example = observer(props => {
  const { isActive, isEdit } = useEditContext();
  const { onClick } = useContextActivator();
  return (
    <React.Fragment>
      <div>{isActive ? 'Active' : 'Not Active'}</div>
      {isEdit ?
        <button onClick={onClick} />
        : <span>Not editing!</span>
      }
    </React.Fragment>
  );
});
```

Note that `useContextActivator()` can be used to provide a handler for other
events besides `onClick`, and can invoke another handler passed in as a prop:

```
const TextareaActivator = ({ onFocus: onFocus$1, ...rest }) => {
  const { onFocus } = useContextActivator('onFocus', onFocus$1);
  return <textarea onFocus={onFocus} {...rest} />
}
```
In the above example, the `textarea` will activate the context on focus, and
will then invoke any 'onFocus' handler passed to it.

Note that we are using the `isActive` property of the context to render
differently if the current context is active, and using the `isEdit` property to
determine if we are in edit mode. Note also that we wrap our component in a
[mobx observer](https://mobx-react.js.org/observer-hoc) to ensure that it
updates properly if the active context or edit mode changes.

> Important! For functional components using hooks, we must use the version of
> `observer` from mobx-react-lite.

It is also possible to use the `withContextActivator` HOC to provide an activation
event to a pre-existing component:
```
const ComponentWithMenuOption = flowRight(
  withMenuOptions({ ... }), // See abo ve
  withContextActivator('onClick'),
)(AnyComponent)
```

Now, when you click on `AnyComponent` it will activate the provided context, and
the associated menu options will be displayed.

Note - the above will only work if `AnyComponent` can accept an `onClick` prop.
If not, you will want to wrap it in an element which can, for example a `div`:
```
const ComponentWithMenuOption = flowRight(
  withMenuOptions({ ... }), // See above
  withContextActivator('onClick'),
  withActivatorWrapper('div'),
)(AnyComponent)
```

Finally, you will want to be sure that none of the above HOC's are applied when not in edit mode.
For this, `ifEditable` comes in handy:
```
const ComponentWithMenuOption = ifEditable(
  withMenuOptions({ ... }), // See above
  withContextActivator('onClick'),
  withActivatorWrapper('div'),
)(AnyComponent)
```
Note that the order of these HOC's is important.

### Peer Contexts

Generally, using `withMenuOptions()` or `PageContextProvider` creates a new
context which is a child of the current one. For most use cases this is what we
want, but sometimes you may want peer components to contribute menu options to
the same context. A good example is page level menu options, which should all
appear when the root context is active. To meet this need, *BodilessJS* allows
you to add a context and menu options as a *peer* of the current context. This
can be done with either the `useRegisterMenuOptions()` hook:
```
const MainMenuOptions = withMenuOptions({...})(Fragment);
const Button1 = () => {
  useRegisterMenuOptions({...});
  return <></>;
}
...
<MainMenuOptions>
  <Button1 />
  ...
</MainMenuOptions>
```
or by providing the `peer` flag to `withMenuOptions`;
```
const withMainMenuOptions = flowRight(
  withMenuOptions({...}),
  withMenuOptions({..., peer: true}), // Button 1 options
  ...,
);

This technique can be seen in use by most of the page-level menu options defined
in
[`Page.tsx` from `gatsby-theme-bodiless`](https://github.com/johnsonandjohnson/Bodiless-JS/blob/master/packages/gatsby-theme-bodiless/src/dist/Page.tsx)



## Context Menu Options

The Global Context Menu aggregates menu options provided by all contexts within
the [active context trail](#context-trail). It is a wrapper around the generic
`ContextMenu` (../packages/bodiless-core/src/components/ContextMenu.tsx)
component, which provides a mechanism for displaying a set of menu options
provided in an "options" prop. Each item is an object with the following
members:
- name: a unique machine name for this item.
- icon: the name of a [material design icon](https://material.io/tools/icons/?style=baseline)
  to display for this item.
- label: A human readable label to display beneath the icon.
- isActive; a callback to determine if the option is currently "active" (usually used
  to indicate that formatting associated with the button is applied to the current
  selection).
- isDisabled; a callback to determine if the option is currently "disabled" (ie.
  visible but not clickable).
- handler: a callback to invoke when the item is selected

 A simple context menu implementation with a single option might look like this:
 ```javascript
const isUp = false;

const options = [
{
  name: 'say_yes',
  icon: 'thumb_up',
  label: 'Yes!',
  isActive: () => isUp,
  handler: () => {
    if (!isUp) {
        alert('Yes!');
    }
    isUp = !isUp;
  },
];

const MyContextMenu = props => (
  <ContextMenu options={options} />
);
```

### Global and Local Context Menu

By default, Bodiless provides two `ContextMenu` instances to display menu options
provided by edit contexts. 

The `GlobalContextMenu` is a part of the `PageEditor` and is intended to provide
a single, top-level menu for the page.

The `LocalContextMenu` component may be used to add a tooltip version of the
context menu to any component, as

```
<ContextProvider getMenuOptions={myComponentMenuOptionGetter} name="My Component">
  <LocalContextMenu>
    <MyComponent>
    ...
    </MyComponent>
  </LocalContextMenu>
</ContextProvider>
```

This will provide a tooltip for `MyComponent` which displays a local version of the context menu.

When defining a menu option, there are two flags you can use to control whether
it should appear on the global context menu, the local context menu or both:

```javascript
const myMenuOption = {
  ...,
  global: true // Show on global context menu
  local: false // Hide on local context menu
}
```

### Context menu forms

The handler function for a menu option can, optionally, return a render
function. If it does, when the menu item is selected, this will be invoked to
render the contents of a fly-out panel (usually a form). This allows menu
options to trigger display of a configuration form to collect additional user
input. For example, an image component might provide a menu option to configure
its content. This might then display a form for uploading the image, entering
alt-text, etc.

### Edit Buttons

This use-case (providing a menu button which renders a form to edit content)
is very common, and we provide a `withEditButton()` HOC to make it easier:
```
const MyComponent = ({ componentData }) => <span>{componentData.myField}</span>;
const EditableMyComponent = withEditButton({
  icon: 'some_material_icon',
  name: 'edit-my-component',
  label: "Edit',
  global: false, // Do not show on the global menu
  local: true, // Show on the local context menu
  renderForm: () => {
    const { ComponentFormLabel, ComponentFormText } = useFormUI();
    return (
      <ComponentFormLabel>Edit my component</ComponentFormLabel>
      <ComponentFormText field="myField" />
    )
  },
})(MyComponent);
```

#### Notes

- These options are almost the same as those provided to `withMenuOptions`. The
  main difference is that the `handler` option has been replaced by a
  `renderForm` option, which is responsible for rendering the contents of the
  edit form.
- The `renderForm` callback is only responsible for the *body* of the form.
  The form itself, along with its submit and close buttons, is generated
  automatically.
- `withEditButton` also manages the initial values and submit handler for the
  form. It expects to receive two props: `componentData` and `setComponentData`,
  and maps these to the form handlers. These props can be provided automatically
  by wrapping the component in *BodilessJS* data handlers. See
  [Data](../data.md) and the guide to
  [Creating Bodiless Components](../../Guides/CreatingBodilessComponents.md) for
  more information.
- The field name of the input element corresponds to the key in the `componentData`
  object (in this case `myField`).
- We obtain themed versions of the edit form controls via the `useFormUI()`
  hook. Read more about this below under
  [Theming the Admin UI](#theming-the-admin-ui)



## Compound Forms

We have seen how to create buttons on the main or local context menu, and how to
have those buttons render forms, which can be used (among other things) to edit
a component's data. But so far, the complete form must be defined by the menu
button handler. The compound form API allows you to create a button with an
extensible form--that is, a form to which child components can add their own
form fields and submit handlers. This technique is employed by
@bodiless/components to create
[a single form for managing meta-tag content](https://github.com/johnsonandjohnson/Bodiless-JS/tree/master/packages/bodiless-components/src/Meta)

### 1. Create the Menu Button

The first step in creating a compound form is to define the menu button.
This is accomplished through the [`withCompoundForm` HOC factory](...). This
accepts an `Options` object with the same keys as `withMenuOptions`.
However, the menu options getter created by `useGetMenuOptions` should
return only a single menu option (to define the icon, name and label).
The handler for this menu option will be created by `withCompoundForm`.

```
const useGetMenuOptions = () => () => [{
  name: 'my-form',
  icon: 'some_material_icon',
  label: 'My Compound Form',
}];

const ComponentWithCompoundForm = withCompoundForm({
  useGetMenuOptions,
  name: 'my-menu',
})(BaseComponent);
```

### 2. Define your form snippet

Now you can add "snippets" to the compound form.  These are collections of form
fields (or any other elements) you want to add to the compound form. Each
snippet consists of at least a render function, along with optional
submit handler and initial values. For example:

```
const mySnippet = {
  render: () => {
    const { ComponentFormText, ComponentFormLabel } = useFormUI();
    return (
      <ComponentFormLabel>My Label</ComponentFormLabel>
      <ComponentFormText field="myField" />
    );
  },
  initialValues: {
    myField: "The initial value for this field",
  },
  submitValues: values => {
    doSomethingWith(values.myField);
  },
}
```

#### Notes

- Here again we call `useFormUI()` to retrieve the themed components to
  render in the form.
- You need not specify `initialValues` or `submitValues` if you only want to
  render static content to the form (eg. to add form title, instructions or
  even buttons with their own handlers).
- Your `submitValues` handler will receive only the form values from fields
  whose names exist as keys in your `initialValues` object.  You will
  not be able to process submissions owned by other snippets.
- The field names for all components added to a compound form must be
  unique.

### 3. Register your snippet.

To add your snippet to the compound form, use the `useRegisterSnippet`
hook in a child of the component enhanced via `withCompoundForm`. For
example:
```
const ParentForm = withCompoundForm(...)(Fragment);
const Child = () => {
  useRegisterSnippet(...);
  return <></>
}
...
<ParentForm>
  <Child />
</ParentForm>
```

### Edit Form Snippets

In many cases, you will simply want to add form fields which save data for a
component using standard *BodilessJS* data flow. For this use case, we provide a
helper HOC: `withEditFormSnippet()`. This is very similar to `withEditButton()`
([described above](#edit-buttons)) but instead of providing a menu button with
an associated form, it simply adds fields to an existing compound form. Refactoring
the example above, we have:

```
const MyComponent = ({ componentData }) => <span>{componentData.myField}</span>;
const EditableMyComponent = withEditFormSnippet({
  render: () => {
    const { ComponentFormLabel, ComponentFormText } = useFormUI();
    return (
      <ComponentFormLabel>Edit my component</ComponentFormLabel>
      <ComponentFormText field="myField" />
    )
  },
})(MyComponent);

<ParentForm>
  <EditableMyComponent />
</ParentForm>
```

### Data Handlers

Remember that *the field names for all components added to a compound form must
be unique*. This means, for example, that the following would not work:
```
<ParentForm>
  <EditableMyComponent />
  <EditableMyComponent />
</ParentForm>
```
because both children use the same field name (`myField`). To handle this
situation, and others in which you may need to transform a component's data
before passing it to or from the form, `withEditFormSnippet` allows you to
provide data handlers:

```
const asEditableMyComponent = key => withEditFormSnippet({
  submitValueHandler: values => ({ myField: values[key] });
  initialValueHandler: values => ({ [key]: values.myField });
  render: ...,
});
...
const EditableMyComponent1 = asEditableMyComponent('foo')(MyComponent);
const EditableMyComponent2 = asEditableMyComponent('bar')(MyComponent);
...
<ParentForm>
  <EditableMyComponent1 />
  <EditableMyComponent2 />
</ParentForm>
```

## Activate Context API

The activate Context API allow one component to store the id of another
component that should activate its context on creation.

This is a three step process.

### Step 1 Ensure there is a Activate Context in place

One can wrap there components in a `<ActivateContextProvider>` component or one
can use the withActivateContext() HOC that will wrap a component in the Provider

### Step 2 set the Id

Then one needs to set the id of the component to be activated by pulling `setId` from `useActivateContext`.

``` tsx
const { setId } from useActivateContext();
setId(id);
```

### Step 3  Add useActivateOnEffect hook

Finally, the component needs to have the `useActivateOnEffect` hook so that it will activate if the id match the one stored

``` tsx
useActivateOnEffect(id);
```

An full example of using the Activate Context API can be found in the
[`FlowContainer` from `@bodiless/layouts`](https://github.com/johnsonandjohnson/Bodiless-JS/blob/master/packages/bodiless-layouts/src/FlowContainer/useGetMenuOptions.tsx#L32),
where it is used to activate the context of a new component when added to the
container.

## Theming the Admin UI

This library includes components which render visible, interactive pieces of the
edit UI. These include:

- ContextMenu
- PageEditor
- LocalContextMenu
- ContextWrapper

These components allow injection of UI elements via a `ui` prop. This prop is a
javascript object enumerating the UI elements which the component will use. For example,
the UI specification for a ContextMenu is:

```javascript
export type UI = {
  Icon?: ComponentType<HTMLProps<HTMLSpanElement>>;
  Toolbar?: ComponentType<HTMLProps<HTMLDivElement>>;
  ToolbarButton?: ComponentType<ButtonVariantProps>;
  FormWrapper?: ComponentType<HTMLProps<HTMLDivElement>>;
  ToolbarDivider?: ComponentType<HTMLProps<HTMLHRElement>>;
};
```

The `ui` prop fo `ContextMenu` accepts low-level UI elements which are composed
to render the menu. In contrast, that for `LocalContextMenu` and `PageEditor`
simply lists the menu component which should be used to render the currently
selected options:

```
type UI = {
  LocalContextMenu?: ComponentType<ContextMenuProps>;
};
```

This allows us to create customized versions of the context menu, as is done in
the
[@bodiless/core-ui package](https://github.com/johnsonandjohnson/Bodiless-JS/tree/master/packages/bodiless-core-ui/src).

## Page Edit Context Flow

The following diagram illustrates the flow of data for page edit contexts:

![context](assets/context.jpeg)

1. The `PageEditor`(../packages/bodiless-core/src/components/PageEditor.tsx) (the
   top-level component of an editable page) defines a base edit context,
   contributing menu options which apply to the page as a whole (e.g. whether
   edit mode should be enabled). This is set as the default value of a React
   context type named "PageEditContext". Provider and Consumer components for
   this context are available as static properties of the PageEditContext class
   (`PageEditContext.Provider` and `PageEditContext.Consumer`).
2. Any item on the page which wishes to define a more specific context can do so
   using the `spawn()` method of the `PageEditContext` instance. This will
   create a new instance with the current instance as its parent. This can then
   be set as the new context value using `PageEditContext.Provider`. For
   convenience, a `ContextProvider`(../packages/bodiless-core/src/PageContextProvider.tsx)
   component is provided which creates a new context and injects it into its
   children (provided as a render prop).
3. A component which does not want to create a new context can either consume
   the current context (either via `PageEditContext.Consumer` or via the
   `useEditContext()` hook), or simply ignore it, if it doesn't care about the
   current context or UI state.
4. The `PageEditContext` instance exposes an `activate()` method which can be
   used by a component to declare that its context is active (usually when the
   user focuses there).  This sets the active context in the store. If the active
   context has parents, then these are also considered active, and the set of
   all active contexts is referred to as the <a id="context-trail"></a>
   _*context trail*_. For convenience a `useContextActivator()` hook is provided.
5. This, in turn triggers any observer component to re-render (for example to
   highlight the fact that it is active).
6. The "global context menu"(../packages/bodiless-core/src/components/PageEditor.tsx)
   is one such observer component, and re-renders itself with all menu options
   contributed by the newly activated context and all its parents. Thus, for
   example, when you activate the context of an image within a grid, the menu
   options of the image (eg set source) are added to those of the grid (eg
   insert/delete items), which in turn are added to the page level items (eg
   toggle edit on/off).
7. Similarly, the
   "local context menu"(../packages/bodiless-core/src/components/LocalContextMenu.tsx)
   is another observer which renders a subset of context menu options as a tooltip
   near the component providing current innermost active context.