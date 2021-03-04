import { identity } from 'lodash';
import { Token, TokenMeta, asToken } from './Tokens';
import { Design, withDesign, DesignableComponents } from './Design';

type DesignPath = string[];

const withDesignAtSingle = <C extends DesignableComponents = DesignableComponents>(
  path: DesignPath,
  designOrToken: Design<C>|Token,
): Token => {
  const token: Token = typeof designOrToken === 'function'
    ? designOrToken : withDesign(designOrToken as Design<C>) as Token;
  const [next, ...rest] = path;
  if (rest.length > 0) {
    return withDesign({
      [next]: withDesignAtSingle(rest, designOrToken),
    }) as Token;
  }
  if (next) {
    return withDesign({
      [next]: token,
    }) as Token;
  }
  return token;
};

const withDesignAt = <C extends DesignableComponents = DesignableComponents>(
  ...paths: DesignPath[]
) => (
    designOrToken: Design<C>|Token,
    ...meta: TokenMeta[]
  ): Token => asToken(
    ...meta,
    ...(paths || [[]]).map(p => withDesignAtSingle(p, designOrToken)),
  );

export default withDesignAt;
