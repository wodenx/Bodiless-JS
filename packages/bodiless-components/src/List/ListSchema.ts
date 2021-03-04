import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';


type ListPath = string[];

type ListSchemaInterface = {
  allPaths: ListPath[],
  hasPath: (path: ListPath) => boolean,
  subPaths: (path: ListPath) => ListPath[],
};

class ListSchema implements ListSchemaInterface {
  protected paths: ListPath[];

  static DefaultKey = '_default';

  constructor(...paths: ListPath[]) {
    this.paths = paths.filter(p => isEqual(p, [ListSchema.DefaultKey])).length === 0
      ? [[ListSchema.DefaultKey], ...paths]
      : [...paths];
  }

  get allPaths() {
    return [...this.paths];
  }

  hasPath(path: ListPath) {
    return this.allPaths.filter(p => isEqual(p, path)).length > 0;
  }

  subPaths(path: ListPath) {
    const { length } = path;
    return this.paths
      .filter(p => isEqual(p.slice(0, length), path))
      .filter(p => p.length > length)
      .map(p => p.slice(length));
  }

  subKeys(path: ListPath): string[] {
    return uniq(this.subPaths(path).map(p => p[0]));
  }

  realPath(...path: ListPath): ListPath|undefined {
    if (!this.hasPath(path)) return undefined;
    return path.reduce(
      (acc, key, depth) => {
        const parent = path.slice(0, depth);
        const subKeys = this.subKeys(parent);
        if (depth === 0) {
          const key$ = subKeys.length === 1 ? [] : [key];
          return [...acc, ...key$];
        }
        // If there is a single named key, and it is not the default key,
        // then this is a chameleon sublist and we need to add the key to the path.
        const key$ = subKeys.length === 1 && key === ListSchema.DefaultKey ? [] : [key];
        return [...acc, 'Item', ...key$];
      }, [] as ListPath,
    );
  }
}

export default ListSchema;
