import React, { FC, HTMLProps } from 'react';
import { observer } from 'mobx-react-lite';
import { useNode, withNode } from '@bodiless/core';
import { flow } from 'lodash';

import { addClasses, H3 as H3$ } from '@bodiless/fclasses';
import { asHeader3 } from '../../../components/Elements.token';

const H3 = flow(addClasses('pt-5'), asHeader3)(H3$);

const DataPrinter = ({ nodeKey, value }: { nodeKey: string; value: object; }) => (
  <div>
    {nodeKey}
    <pre className="pl-5">{JSON.stringify(value)}</pre>
  </div>
);

type NodeTreePrinterProps = { title: string } & HTMLProps<HTMLDivElement>;
const NodeTreePrinter$: FC<NodeTreePrinterProps> = ({ title, ...rest }) => {
  const { node } = useNode();
  const path = node.path.join('$');
  const keys = node.keys.filter(k => k.startsWith(path));
  const chilluns = keys.map(key => (
    <DataPrinter
      key={key}
      nodeKey={key.split('$').slice(1).join('$')}
      value={node.peer(key).data}
    />
  ));
  return (
    <div {...rest}>
      <H3>
        {title}
        :
        {' '}
        {node.path.join('$')}
      </H3>
      <div>{chilluns}</div>
    </div>
  );
};
export const NodeTreePrinter = observer(withNode((NodeTreePrinter$)));

type DefaultContentPrinterProps = {
  title: string;
  content: { [key: string]: object };
} & HTMLProps<HTMLDivElement>;
export const DefaultContentPrinter: FC<DefaultContentPrinterProps> = props => {
  const { title, content, ...rest } = props;
  const chilluns = Object.keys(content).map(key => (
    <DataPrinter
      key={key}
      nodeKey={key}
      value={content[key]}
    />
  ));
  return (
    <div {...rest}>
      <H3>
        {title}
      </H3>
      <div>{chilluns}</div>
    </div>
  );
};
