import React, { ComponentType, FC } from 'react';
import { applyChamelionDesign } from './withChamelionContext';
import { useChamelionContext } from '.';
import { ChamelionProps } from './types';

/**
 * Applies the appropriate design to the wrapped component depending on the
 * chamelion state.  Must be called within a context defined by `withChamelionContext`.
 *
 * Use this function when you want to separate the form controlling the chamelion
 * state from the component on which the chamelion acts (for example, if you want
 * to add controls to a component edit form, but actually act on the component
 * to which the edit form was added), eg:
 *
 * ```
 * flowRight(
 *   withDesign({
 *     Disabled: flow(replaceWith('span'), withoutProps('href'), withTitle('Disabled'))
 *   }),
 *   withChamelionContext('link-chamelion'),
 *   withChamelionComponenFormConrols,
 *   asBodilessLink('link')
 *   applyChamelion,
 * )('a');
 * ```
 *
 * Note the use of `withTitle` here.  Only design elements with title metadata will be considered
 * valid chamelion states.
 *
 * @return The wrapped component enhanced by the appropriate HOC's from the design.
 */
const applyChamelion = <P extends object>(Component: ComponentType<P>|string) => {
  const Chamelion: FC<P & ChamelionProps> = props => {
    const { activeComponent } = useChamelionContext();
    const { components, ...rest } = props;
    const ActiveComponent = components[activeComponent];
    return <ActiveComponent {...rest as P} />;
  };
  return applyChamelionDesign(Component)(Chamelion);
};

export default applyChamelion;
