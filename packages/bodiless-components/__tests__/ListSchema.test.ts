import ListSchema from '../src/List/ListSchema';
import List from '../src/List/List';
const { DefaultKey } = ListSchema;

describe('ListSchema', () => {
  it.only('Rejects paths that dont exist', () => {
    const schema = new ListSchema(
      ['Foo'],
      ['Foo', 'Bar'],
      ['Foo', 'Bar', DefaultKey],
    );
    expect(schema.realPath(DefaultKey, 'Bar')).toBeUndefined();
    expect(schema.realPath('Foo', DefaultKey)).toBeUndefined();
    expect(schema.realPath(DefaultKey)).toEqual([DefaultKey]);
  });

  it('finds the correct path for a sublist', () => {
    const schema = new ListSchema(
      [DefaultKey, 'Foo'],
    );
    const path = schema.realPath(DefaultKey, 'Foo');
    expect(path).toEqual(['Item', 'Foo']);
  });

  it('finds the correct path for a default sublist', () => {
    const schema = new ListSchema(
      [DefaultKey, DefaultKey],
    );
    const path = schema.realPath(DefaultKey, DefaultKey);
    expect(path).toEqual(['Item']);
  });

  it('finds the correct path for a sublist when there is only one top level list', () => {
    const schema = new ListSchema(
      [DefaultKey, 'Foo'],
      [DefaultKey, 'Bar'],
    );
    const path = schema.realPath('_default', 'Foo');
    expect(path).toEqual(['Item', 'Foo']);
  });

});
