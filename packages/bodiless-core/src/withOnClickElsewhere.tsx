import React, {
  useRef, useCallback, useEffect,
} from 'react';

export type OnClickElsewhereProps = {
  onClickElsewhere?: Function,
};

/**
 * Utility HOC which adds an 'onClickElsewhere' prop to an HTML element.
 *
 * @param Tag The HTML tag to be enhanced.
 *
 * @return A component which accepts the onClickElsewhere prop.
 */
const withOnClickElsewhere = <P extends JSX.IntrinsicAttributes>(Tag: string) => {
  const WithOnClickElsewhere = (props: P & OnClickElsewhereProps) => {
    const { onClickElsewhere, ...rest } = props;
    const ref = useRef<HTMLElement>();
    const handler = useCallback((e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current && onClickElsewhere && !ref.current.contains(target)) {
        onClickElsewhere(e);
      }
    }, []);
    useEffect(() => {
      document.addEventListener('click', handler);
      return () => {
        document.removeEventListener('click', handler);
      };
    }, []);
    return <Tag {...rest as P} ref={ref} />;
  };
  return WithOnClickElsewhere;
};

export default withOnClickElsewhere;
