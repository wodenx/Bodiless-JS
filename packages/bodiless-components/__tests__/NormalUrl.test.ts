import NormalHref from '../src/Link/NormalHref';

describe('NormalUrl', () => {
  it('treats any url with explicit host as external', () => {
    const normal = new NormalHref('https://foo.com/foo/bar');
    expect(normal.isExternal).toBeTruthy();
  });

  it('treats urls without explicit host as internal', () => {
    const normal = new NormalHref('/foo/bar');
    expect(normal.isExternal).toBeFalsy();
  });

  it('Adds a trailing slash to internal urls by default', () => {
    const normal = new NormalHref('/foo/bar');
    expect(normal.toString()).toEqual('/foo/bar/');
  });

  it('Strips the trailing slash from internal urls when requested', () => {
    const normal = new NormalHref('/foo/bar/', { trailingSlash: false });
    expect(normal.toString()).toEqual('/foo/bar');
  });

  it('Does not alter trailing slash external links', () => {
    const normal = new NormalHref('https://foo.com/foo/bar/', { trailingSlash: false });
    expect(normal.toString()).toEqual('https://foo.com/foo/bar/');
    const normal1 = new NormalHref('https://foo.com/foo/bar');
    expect(normal1.toString()).toEqual('https://foo.com/foo/bar');
  });

  it('prepends a slash for relative internal links', () => {
    const normal = new NormalHref('foo/bar');
    expect(normal.toString()).toEqual('/foo/bar/');
  });

  it('Does not prepend a slash for explicitly relative links', () => {
    const normal = new NormalHref('./foo/bar');
    expect(normal.toString()).toEqual('./foo/bar/');
  });

  it('Handles fragments on the same page correctly', () => {
    const normal = new NormalHref('#foo');
    expect(normal.toString()).toEqual('./#foo');
  });

  it('Treats empty url as relative fragment', () => {
    const normal = new NormalHref(' ');
    expect(normal.toString()).toEqual('./#');
    const normal1 = new NormalHref();
    expect(normal1.toString()).toEqual('./#');

  })

  it('Handles relative fragments and queries correctly', () => {
    const normal = new NormalHref('./?foo=bar#baz');
    expect(normal.toString()).toEqual('./?foo=bar#baz');
  });

  it('Handles absolute fragments and queries correctly', () => {
    const normal = new NormalHref('/bing?foo=bar#baz');
    expect(normal.toString()).toEqual('/bing/?foo=bar#baz');
    const normal1 = new NormalHref('/bing/?foo=bar#baz', { trailingSlash: false });
    expect(normal1.toString()).toEqual('/bing?foo=bar#baz');
  });

  it('does not append a slash for files', () => {
    const normal = new NormalHref('/foo/bar.txt');
    expect(normal.toString()).toBe('/foo/bar.txt');
  });

  it('does not match internal and external links', () => {
    const a = new NormalHref('http://foo.com/bar/baz');
    const b = new NormalHref('/bar/baz');
    expect(a.isSamePage(b)).toBeFalsy();
  });

  it('matches various slash permutations correctly', () => {
    const a = new NormalHref('/foo/bar');
    expect(a.isSamePage('/foo/bar')).toBeTruthy();
    expect(a.isSamePage('/foo/bar/')).toBeTruthy();
    expect(a.isSamePage('foo/bar')).toBeTruthy();
    expect(a.isSamePage('foo/bar/')).toBeTruthy();
  });

  it('matches various hash and query combinations correct', () => {
    const a = new NormalHref('/foo/bar?baz=bang#bop');
    expect(a.isSamePage('/foo/bar')).toBeTruthy();
    expect(a.isSamePage('/foo/bar#blap')).toBeTruthy();
    expect(a.isSamePage('/foo/bar?piz=poz')).toBeTruthy();
  });

  it('does not match relative URLs', () => {
    const a = new NormalHref('./foo');
    expect(a.isSamePage('./foo')).toBeFalsy();
    expect(a.isSamePage('foo')).toBeFalsy();
    expect(a.isSamePage('/foo')).toBeFalsy();
  });

  it('Propery returns a parent', () => {
    const normal = new NormalHref('foo/bar');
    expect(normal.parentPage?.pathname).toBe('/foo/');
  });

  it('returns undefined for parent of root page', () => {
    const normal = new NormalHref('/');
    expect(normal.parentPage).toBeUndefined();
  });

  it('handles homepage correctly', () => {
    let home = new NormalHref('/');
    expect(home.pathname).toBe('/');
    home = new NormalHref('/', { trailingSlash: false });
    expect(home.pathname).toBe('/');
  });

  it('correctly identifies child pages', () => {
    const child = new NormalHref('foo/bar/baz');
    expect(child.isChildPageOf('/')).toBeTruthy();
    expect(child.isChildPageOf('foo')).toBeTruthy();
    expect(child.isChildPageOf('./foo')).toBeFalsy();
    expect(child.isChildPageOf('/foo')).toBeTruthy();
    expect(child.isChildPageOf('/foo/')).toBeTruthy();
    expect(child.isChildPageOf('/foo/bar')).toBeTruthy();
    expect(child.isChildPageOf('bar')).toBeFalsy();
  });
});
