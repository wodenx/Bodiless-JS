import path from 'path';

export type NormalHrefOptions = {
  trailingSlash?: boolean;
};

const DEFAULT_BASE = 'http://host';
const defaultOptions: Required<NormalHrefOptions> = {
  trailingSlash: true,
};
/**
 * Normalizer for link hrefs.
 * - Treats links with explicit hosts as external and doesn't touch them. For internal
 * - Appends or strips trailing slashes per option (but never appends for file links).
 * - Prepends slash for links which are not explicitly relative (begin with # or .).
 */
class NormalHref {
  protected options: NormalHrefOptions;

  protected url: URL;

  protected urlString: string;

  constructor(urlString: string = '#', options: NormalHrefOptions = {}) {
    this.options = { ...defaultOptions, ...options };
    this.url = new URL(urlString, DEFAULT_BASE);
    this.urlString = urlString;
  }

  get isExternal(): boolean {
    const base = new URL('', DEFAULT_BASE);
    return this.url.host !== base.host;
  }

  get isRelative(): boolean {
    return /^\./.test(this.urlString);
  }

  protected get relativePrefix() {
    // Ensure url which starts with hash is treated as relative
    const urlString = this.urlString.charAt(0) === '#' ? `./${this.urlString}` : this.urlString;
    const rel = urlString.match(/^\.[./]+/g);
    if (!rel) return '';
    return rel[0].replace(/\/+$/g, '');
  }

  get pathname(): string {
    if (this.isExternal) return this.url.pathname;
    const basePathname = `${this.relativePrefix}${this.url.pathname}`;
    const stripped = basePathname.replace(/\/+$/g, '');
    // Append trailing slash if requested and not a file link, and always for homepage.
    return stripped.length === 0 || (this.options.trailingSlash && !path.extname(stripped))
      ? `${stripped}/` : stripped;
  }

  toString(): string {
    if (this.isExternal) return this.url.toString();
    return `${this.pathname}${this.url.search}${this.url.hash}`;
  }

  protected canCompare(that: NormalHref) {
    // We don't handle external urls at all.
    if (this.isExternal || that.isExternal) return false;
    // Never match relative URLs bc we don't know the page they come from.
    if (this.isRelative || that.isRelative) return false;
    return true;
  }

  isSamePage(that: NormalHref | string) {
    const that$ = typeof that === 'string' ? new NormalHref(that) : that;
    if (!this.canCompare(that$)) return false;
    return this.pathname === that$.pathname;
  }

  get parentPage() {
    if (this.pathname === '/') return undefined;
    const parent = new NormalHref(this.toString());
    parent.url.pathname = path.dirname(this.pathname);
    return parent;
  }

  isChildPageOf(that: NormalHref | string) {
    const that$ = typeof that === 'string' ? new NormalHref(that) : that;
    if (!this.canCompare(that$)) return false;
    for (let p: NormalHref | undefined = this; p; p = p.parentPage) {
      if (p.isSamePage(that$)) return true;
    }
    return false;
  }
}

export default NormalHref;
