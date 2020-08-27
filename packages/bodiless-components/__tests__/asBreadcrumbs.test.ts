import { BreadcrumbContext } from '../src/asBreadcrumbs';

describe('BreadcrumbContext', () => {
  describe('activate', () => {
    const foo = new BreadcrumbContext('foo');
    const foobar = foo.spawn('bar');
    const foobarbing = foobar.spawn('bing');
    const foobaz = foo.spawn('baz');

    it('Activates itself', () => {
      foo.activate();
      expect(foo.isActive).toBeTruthy();
    });
  
    it('Axctivates all ancestors', () => {
      foo.activate();
      foobarbing.activate();
      expect(foobarbing.isActive).toBeTruthy();
      expect(foobar.isActive).toBeTruthy();
      expect(foo.isActive).toBeTruthy();
    });

    it('does not activate non ancestors', () => {
      foobarbing.activate();
      foobaz.activate();
      expect(foobaz.isActive).toBeTruthy();
      expect(foobarbing.isActive).toBeFalsy();
      expect(foobar.isActive).toBeFalsy();
      expect(foo.isActive).toBeTruthy();
    });

    it('does not deactivate descendants', () => {
      foobar.activate();
      foo.activate();
      expect(foobar.isActive).toBeTruthy();
    });
  });

  describe('spawn', () => {
    it('creates a new instance with correct parent', () => {
      const parent = new BreadcrumbContext('/foo/bar');
      const child = parent.spawn('/baz');
      expect(child.parent).toBe(parent);
      expect(child.url.pathname).toBe('/baz');
    });
  });
  describe('isAncestorOf', () => {
    it('Returns true when page is an ancestor', () => {
      const parent = new BreadcrumbContext('/foo/bar');
      const child = new BreadcrumbContext('/baz/bing', parent);
      expect(parent.isAncestorOf(child)).toBeTruthy();
    });
    it('Returns false when page is not ancestor', () => {
      const parent = new BreadcrumbContext('/foo/bar');
      const child = new BreadcrumbContext('/baz/bing', parent);
      expect(child.isAncestorOf(parent)).toBeFalsy();
    });
  });
  describe('isSubpathOf', () => {
    it('Returns false when urls have difffeent domains', () => {
      const parent = new BreadcrumbContext('http://other.com/foo/bar');
      const child = new BreadcrumbContext('foo/bar/baz');
      expect(child.isSubpathOf(parent)).toBeFalsy();
    });
    it('Returns true when path is a subpath', () => {
      const parent = new BreadcrumbContext('foo/bar');
      const child = new BreadcrumbContext('foo/bar/baz');
      expect(child.isSubpathOf(parent)).toBeTruthy();
    });
    it('Returns true when paths are the same', () => {
      const parent = new BreadcrumbContext('foo/bar');
      const child = new BreadcrumbContext('foo/bar');
      expect(child.isSubpathOf(parent)).toBeTruthy();
    });
    it('Returns false when path is not a subpath', () => {
      const parent = new BreadcrumbContext('foo/bar');
      const child = new BreadcrumbContext('foo');
      expect(child.isSubpathOf(parent)).toBeFalsy();
    });
  });
});
