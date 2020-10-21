import { useStaticQuery, graphql } from 'gatsby';
import { withNodeKey, withDefaultContent } from '@bodiless/core';
import { flow } from 'lodash';
import { CTacoNode, translateItems } from './TacoList';
import { FlowContainerDefault } from '../../../components/FlowContainer';

const baseProductItem = {
  wrapperProps: {
    className: 'lg:w-1/2',
  },
  type: 'ToutVerticalWithTitleBodyWithCTA',
};

const useProductTacoListData = () => {
  const data = useStaticQuery(graphql`
    query ProducgtTacoQuery {
      allProductTacos {
        edges {
          node {
            image {
              src
            }
            title
            summary
            link {
              href
              title
            }
          }
        }
      }
    }
  `);
  const normalizedData = data.allProductTacos.edges.map((item: CTacoNode) => item.node);
  return translateItems(normalizedData, 'tacos-2', baseProductItem);
};

const ProductTacoContainer = flow(
  withNodeKey('tacos-2'),
  withDefaultContent(useProductTacoListData),
)(FlowContainerDefault);

export default ProductTacoContainer;
