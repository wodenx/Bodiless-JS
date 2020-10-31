import {
  withMenuOptions, withSidecarNodes, useNode, withNode,
  withNodeKey, withContextActivator, withLocalContextMenu,
} from '@bodiless/core';
import { useMemo } from 'react';
import { flow } from 'lodash';

type Data = {
  url: string,
};

const useMenuOptions = () => {
  const { node } = useNode<Data>();
  console.log(node.path);
  return useMemo(() => [{
    name: 'edit-in-drupal',
    icon: 'edit',
    label: 'Drupal',
    local: true,
    global: false,
    handler: () => {
      if (typeof window !== 'undefined') {
        window.open(node.data.url || 'https://foo.com', '_blank');
      }
    },

  }], []);
};

const withEditLink = flow(
  withContextActivator('onClick'),
  withLocalContextMenu,
  withSidecarNodes(
    withNodeKey('edit-url'),
    withNode,
    withMenuOptions({ useMenuOptions, name: 'Drupal' }),
  ),
);

export default withEditLink;
