/*
import React, { ComponentType  } from 'react';
import { ifToggledOn, ifToggledOff } from '../Toggle';
import { ItemProps } from './types';
import { flowIf } from '@bodiless/fclasses';

type CT<P> = ComponentType<P>|string;

type SublistProps = {
  title: JSX.Element,
};

const asBasicSublist = (Wrapper: CT<any> = 'li') => <P extends object>(Sublist: CT<P>) => {
  const AsBasicSublist = ({ title, ...rest }: P & SublistProps) => (
    <Wrapper>
      {title}
      <Sublist {...rest as P} />
    </Wrapper>
  );
  return AsBasicSublist;
};

const withSublistToggle = (Sublist) => (asTitle) => flow(
  ifToggledOff(
    asTitle,
  ),
  ifToggledOn(


  )

  )
)


}
    Item: flow(V
      ifToggledOff(
        asTitle,
      ),
      ifToggledOn(
        asBodilessSublist(asTitle),
      ),


const asItemWithSublist = <P extends object>(Sublist: ComponentType<P & SublistProps>) => (
  (Item: ComponentType<ItemProps>) => {
    const ItemWithSublist =  ({ onAdd, onDelete, canDelete, ...rest }: P & ItemProps) => {
      const itemProps = { onAdd, onDelete, canDelete };
      return <Sublist {...rest as P} title={<Item {...itemProps} />} />
    }
    return ItemWithSublist;
  }
);

const asBodilessSublist = <P extends object>(Component: ComponentType<P>) => {
  const AsBodilessSublist = (P & SublistProps) => (
    <Component

  )
}
)
const withSublistToggle = (Sublist) => {
    const
    flow(
  ifToggledOff(
    asBodilessListItem,
  ),
  ifToggledOn(
    withDesign({
      Title:
    })
    addProp('title')
  )
)

const BodilessSublist
const asBodilerssSublist = (Component) => ({ title, ...rest }
*/