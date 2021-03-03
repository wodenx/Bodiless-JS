import { identity, flow } from 'lodash';
import { withDesign, HOC } from '@bodiless/fclasses';

type Path = string[];
type Schema = {
  keySpace: Path,
  maxDepth: number,
  hasNode: (path: Path) => boolean,
};

// Returns the options available at a given depth
const subKeysForPath = (schema: Schema) => (path: Path) => schema.keySpace
  .filter(key => schema.hasNode([...path, key]));

// Translates a canonical list path to an actual list design path (inserts the
// 'Item' key where necessary), based on the list schema.
const realPath = (schema: Schema) => (pathIn: Path): Path => pathIn.reduce(
  (acc, key, depth) => {
    const parent = pathIn.slice(0, depth);
    const prefix = depth === 0 ? [] : ['Item'];
    const key$ = subKeysForPath(schema)(parent).length === 0 ? [] : [key];
    return [...acc, ...prefix, ...key$];
  }, [] as Path,
);

// Gives you all possible canonical paths for a given schema
const allCanonicalPaths = (schema: Schema, prefix: Path = []): Path[] => {
  const keys = subKeysForPath(schema)(prefix);
  return keys.reduce(
    (acc, key) => [
      ...acc,
      [...prefix, key],
      ...allCanonicalPaths(schema, [...prefix, key]),
    ],
    [] as Path[],
  );
};

const withDesignAtSingle = (path:Path) => (hoc:HOC): HOC => {
  const [next, ...rest] = path;
  if (rest.length > 0) {
    return withDesign({
      [next]: withDesignAtSingle(rest)(hoc),
    }) as HOC;
  }
  if (next) {
    return withDesign({
      [next]: hoc,
    }) as HOC;
  }
  return identity as HOC;
};

const withDesignAt = (...paths:Path[]) => flow(...paths.map(withDesignAtSingle));

const withListDesignAt = (schema: Schema) => (
  (pathTest: (p: Path) => boolean) => withDesignAt(
    ...allCanonicalPaths(schema)
      .filter(pathTest)
      .map(realPath(schema)),
  )
);

// ************************ EXAMPLES *********************************

// Example schema for our default canvasx list
const canvasxSchema: Schema = {
  keySpace: ['Bullets', 'Numbers', 'SubList'],
  maxDepth: 3,
  hasNode: path => path.reduce<boolean>(
    (result, key, depth) => (
      depth === 0
        ? (result && ['Bullets', 'Numbers', '_default'].includes(key))
        : (result && ['Sublist', '_default'].includes(key))
    ),
    true,
  ),
};

// canvasx path test to give us all numberted lists
export const allNumbered = (path: Path) => path[0] === 'Numbered';
// canvasx path test to give us all lists at depth 2
export const allDepth2 = (path: Path) => path.length === 2;

export const withCanvasXListDesign = (
  keys: string|string[] = ['_default', 'Bullets', 'Numbers'],
  depths: number|number[] = [0, 1, 2],
) => {
  const keys$ = Array.isArray(keys) ? keys : [keys];
  const depths$ = Array.isArray(depths) ? depths : [depths];
  const test = (path: Path) => keys$.includes(path[0]) && depths$.includes(path.length);
  return withListDesignAt(canvasxSchema)(test);
};

// Example schema for megamenu
const menuSchema: Schema = {
  keySpace: ['Columns', 'List', 'Touts', 'SubColumn'],
  maxDepth: 3,
  hasNode: path => {
    if (path[0] !== '_default') return false;
    if (path.length === 1) return true;
    if (path[1] === 'SubColumns') return false;
    if (path.length === 2) return true;
    if (path[1] !== 'Columns') return false;
    if (!['SubColumns', '_default'].includes(path[2])) return false;
    return true;
  },
};

export const withCanvasXMenuDesign = (
  keys: string|string[] = ['_default', 'List', 'Column', 'Tout'],
  depths: number|number[] = [0, 1, 2],
) => {
  const keys$ = Array.isArray(keys) ? keys : [keys];
  const depths$ = Array.isArray(depths) ? depths : [depths];
  const test = (path: Path) => {
    if (!depths$.includes(path.length)) return false;
    if (path.length === 0) return keys$.includes(path[0]);
    return keys$.includes(path[1]);
  };
  return withListDesignAt(menuSchema)(test);
};
