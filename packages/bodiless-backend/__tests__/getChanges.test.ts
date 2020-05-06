import path from 'path';
import fs, { mkdirSync } from 'fs';

// eslint-disable-next-line import/no-extraneous-dependencies
const rimraf = require('rimraf');
const GitCmd = require('../src/GitCmd');
const { getChanges } = require('../src/git');

const cwd = process.cwd();

const resolveRelativeToMe = (...segments: string[]) => {
  const scriptName = path.basename(__filename);
  const scriptPath = require.resolve(`./${scriptName}`);
  return path.resolve(path.dirname(scriptPath), ...segments);
};

const setUp = (dir: string) => async () => {
  const tmp = resolveRelativeToMe('tmp');
  rimraf.sync(tmp);
  mkdirSync(tmp);
  const target = path.join(tmp, dir);
  const source = resolveRelativeToMe('fixtures', 'get-changes');
  await GitCmd.cmd().add('clone', '-b', 'upstream', '--local', source, target).exec();
  // Without the following, jest bails. It has to do with the cwd and the loader...
  fs.writeFileSync(path.resolve(target, 'package.json'), '{}');
  process.chdir(target);
};

describe('getChanges', () => {
  afterEach(() => {
    const tmp = resolveRelativeToMe('tmp');
    rimraf.sync(tmp);
    process.chdir(cwd);
  });

  beforeEach(setUp('get-changes'));

  it('properly lists no changes when none are there', async () => {
    const result = await getChanges();
    expect(result.upstream.branch).toBe('origin/upstream');
    expect(result.upstream.commits).toHaveLength(0);
    expect(result.upstream.files).toHaveLength(0);
  });

  it('lists no changes when there is no upstream branch', async () => {
    await GitCmd.cmd().add('reset', '--hard', 'origin/local').exec();
    await GitCmd.cmd().add('checkout', '-b', 'foo').exec();
    const result = await getChanges();
    expect(result.upstream.branch).toBeNull();
    expect(result.upstream.commits).toHaveLength(0);
    expect(result.upstream.files).toHaveLength(0);
  });

  it('lists upstream changes when they exist', async () => {
    await GitCmd.cmd().add('reset', '--hard', 'origin/local').exec();
    const result = await getChanges();
    expect(result).not.toBeUndefined();
    expect(result.upstream.commits).toHaveLength(2);
    expect(result.upstream.files).toHaveLength(2);
  });
});
