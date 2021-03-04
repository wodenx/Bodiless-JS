import { identity, flow, set, isEqual } from 'lodash';
import { withDesign, HOC } from '@bodiless/fclasses';

export type ListPath = string[];
export type ListSchemaDef = {
  keySpace: ListPath,
  maxDepth: number,
  hasNode: (path: ListPath) => boolean,
};

// Returns the options available at a given depth
export const subKeysForPath = (schema: ListSchema) => (path: ListPath) => (
);



// Translates a canonical list path to an actual list design path (inserts the
// 'Item' key where necessary), based on the list schema.
export const realPath = (schema: ListSchema) => (pathIn: ListPath): ListPath => pathIn.reduce(
  (acc, key, depth) => {
    const parent = pathIn.slice(0, depth);
    const prefix = depth === 0 ? [] : ['Item'];
    const key$ = subKeysForPath(schema)(parent).length === 0 ? [] : [key];
    return [...acc, ...prefix, ...key$];
  }, [] as ListPath,
);

// Gives you all possible canonical paths for a given schema
// @todo i think this does not properly limit to max-depth.

// Creates an object representing list structure from a schema definition.
export const buildTree = (schema: ListSchema): any => {
  const paths = buildSchema(schema);
  const setPath = (path: ListPath) => (tree: any) => set(tree, path, true);
  return flow(
    paths
      .sort((a, b) => a.length - b.length)
      .map(path => setPath(path)),
  )({});
};

const withDesignAtSingle = (path:ListPath) => (hoc:HOC): HOC => {
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

const withDesignAt = (...paths:ListPath[]) => flow(...paths.map(withDesignAtSingle));

const withListDesignAt = (schema: ListSchema) => (
  (pathTest: (p: ListPath) => boolean) => withDesignAt(
    ...buildSchema(schema)
      .filter(pathTest)
      .map(realPath(schema)),
  )
);

// ************************ EXAMPLES *********************************

// Example schema for our default canvasx list
const canvasxSchema: ListSchema = {
  keySpace: ['Bullets', 'Numbers', 'SubList'],
  maxDepth: 3,
  hasNode: path => path.reduce<boolean>(
    (result, key, depth) => result && (
      depth === 0
        ? ['Bullets', 'Numbers', '_default'].includes(key)
        : ['Sublist', '_default'].includes(key)
    ),
    true,
  ),
};

// canvasx path test to give us all numberted lists
export const allNumbered = (path: ListPath) => path[0] === 'Numbered';
// canvasx path test to give us all lists at depth 2
export const allDepth2 = (path: ListPath) => path.length === 2;

export const withCanvasXListDesign = (
  keys: string|string[] = ['_default', 'Bullets', 'Numbers'],
  depths: number|number[] = [0, 1, 2],
) => {
  const keys$ = Array.isArray(keys) ? keys : [keys];
  const depths$ = Array.isArray(depths) ? depths : [depths];
  const test = (path: ListPath) => keys$.includes(path[0]) && depths$.includes(path.length);
  return withListDesignAt(canvasxSchema)(test);
};

// Example schema for megamenu
const menuSchema: ListSchema = {
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
  const test = (path: ListPath) => {
    if (!depths$.includes(path.length)) return false;
    if (path.length === 0) return keys$.includes(path[0]);
    return keys$.includes(path[1]);
  };
  return withListDesignAt(menuSchema)(test);
};


type ListSchema = {
  allPaths: ListPath[],
  hasPath: (path: ListPath) => boolean,
  subPaths: (path: ListPath) => ListPath[],
}

class BasicListSchema implements ListSchema {
  protected paths: ListPath[];

  constructor(paths: ListPath[]) {
    this.paths = paths;
  }

  get allPaths() {
    return this.paths;
  }

  hasPath(path: ListPath) {
    return this.paths.filter(p => isEqual(p, path)).length > 0;
  }

  subPaths(path: ListPath) {
    const { length } = path;
    return this.paths
      .filter(p => isEqual(p.slice(0, length), path))
      .filter(p => p.length > length)
      .map(p => p.slice(length));
  }

  realPath(path: ListPath): ListPath {
    return path.reduce(
      (acc, key, depth) => {
        const parent = path.slice(0, depth);
        const prefix = depth === 0 ? [] : ['Item'];
        const key$ = this.subPaths(parent).length === 0 ? [] : [key];
        return [...acc, ...prefix, ...key$];
      }, [] as ListPath,
    );
  }
}


export const listAllPaths = (def: ListSchemaDef, prefix: ListPath = []): ListPath[] => {
  const keys = prefix.length >= def.maxDepth
    // @todo Maybe we should always return at least _default for top level.
    ? [] : [...['_default', ...def.keySpace].filter(key => def.hasNode([...def, key]))]
  return keys.reduce(
    (acc, key) => [
      ...acc,
      [...prefix, key],
      ...listAllPaths(def, [...prefix, key]),
    ],
    [] as ListPath[],
  );
};
