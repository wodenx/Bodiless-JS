#!/usr/bin/env node
/**
 * Copyright © 2019 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-console */
import path from 'path';
import { flow } from 'lodash';
import fs from 'fs-extra';
// import cleanSymlinks from './cleanSymlinks';
import locateFiles from './locateFiles';
import { withTreeFromFile } from './tree';
import writeSymlinksFromTree from './writeSymlinksFromTree';
import { writeSideBars, writeNavBar } from './createBar';
import defaultToc from './defaultToc';

const blDocsBuild = async () => {
  const docPath = './doc';
  let toc;
  try {
    const tocPath = path.resolve('./bodiless.docs.toc.js');
    // eslint-disable-next-line global-require
    toc = require(tocPath).default(); // eslint-disable-line import/no-dynamic-require
  } catch (e) {
    console.warn('No local TOC. Falling back on bodiless default.');
    toc = defaultToc();
  }
  // const tocPath = './bodiless.docs.toc.json';
  // const toc = fs.existsSync(tocPath) ? fs.readJSONSync(tocPath) : {};
  // We start by using locateFiles and withTreeFromFile to build up an array of TreeHO and
  // at the same time we clean up the symlinks
  const results = await Promise.all([
    locateFiles({
      filePattern: /docs.json$/,
      startingRoot: './',
      action: withTreeFromFile,
    }),
    fs.emptyDir(docPath),
    // Then we use the TreeOH (in updates) to create a Tree,
    // which we use to write the symlinks and make the nav and side bars.
  ]);
  const updates = results[0];
  const paths = flow(updates)(toc);
  console.log('Writing symlinks');
  try {
    await writeSymlinksFromTree({
      paths,
      loc: docPath,
    });
  } catch (error) {
    console.log(error, 'writing symlinks');
  }
  console.log('Writing sidebars');
  try {
    await writeSideBars(docPath, paths);
  } catch (error) {
    console.log(error, 'writing sidebars');
  }
  console.log('Writing navbar');
  try {
    await writeNavBar(docPath, paths);
  } catch (error) {
    console.log(error, 'writing navbar');
  }
  console.log('Done');
};
export default blDocsBuild;
