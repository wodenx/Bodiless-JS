/*
import React, { ReactNode, FC } from 'react';
import Tooltip from 'rc-tooltip';

type TitledItemProps = { title: ReactNode };

export const ItemGroup: FC<TitledItemProps> = props => {
  const { title, ...rest } = props;
  return (
    <li>
      {title}
      <ul {...rest} />
    </li>
  );
};

export const Item: FC<any> = props => <li {...props} />;

export const SubMenu: FC<TitledItemProps> = props => {
  const { title, ...rest } = props;
  return (
    <Tooltip
      overlay={<ul {...rest} />}
      overlayClassName="bl-menu-tooltip"
      placement="bottomLeft"
    >
      <li>{title}</li>
    </Tooltip>
  );
};

const Menu: FC<any> = props => <ul {...props} />;

export default Menu;
*/
