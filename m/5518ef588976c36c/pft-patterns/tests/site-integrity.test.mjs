import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const getLocalReferences = (html) => {
  const refs = [];
  const pattern = /\b(?:src|href)="([^"]+)"/g;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const value = match[1];
    if (
      value.startsWith('#') ||
      value.startsWith('../') ||
      value.startsWith('/') ||
      value.startsWith('mailto:') ||
      value.startsWith('tel:')
    ) {
      continue;
    }
    refs.push(value.split(/[?#]/, 1)[0]);
  }
  return refs;
};

test('index is unlisted and every local asset reference resolves', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');

  assert.match(html, /name="robots" content="[^"]*noindex[^"]*nofollow/i);
  assert.match(html, /name="googlebot" content="[^"]*noindex[^"]*nofollow/i);
  assert.doesNotMatch(html, /(?:src|href)="https?:\/\//i);

  const refs = getLocalReferences(html);
  assert.deepEqual(refs.sort(), ['app.js', 'favicon.svg', 'styles.css']);

  for (const ref of refs) {
    const info = await stat(path.join(root, ref));
    assert.equal(info.isFile(), true, `${ref} must be a file`);
  }
});

test('site uses local ES modules and includes the explanation dialog', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  const app = await readFile(path.join(root, 'app.js'), 'utf8');

  assert.match(html, /<script type="module" src="app\.js"><\/script>/);
  assert.match(html, /id="explanation-dialog"/);
  assert.match(html, /id="dialog-explanation"/);
  assert.match(app, /data-action="explain-cell"/);
});
