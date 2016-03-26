'use strict';
const path = require('path');
const hyd = require('hydrolysis');
const fs = require('fs');
const fsensure = require('fsensure');

var ArcAnalyzer = {
  /**
   * Path to the elements.html file.
   * @return {String}
   */
  get elementsFile() {
    if (this._elementsFile) {
      return this._elementsFile;
    }
    this._elementsFile = path.join('app', 'elements', 'elements.html');
    return this._elementsFile;
  },
  /**
   * Path to destination build folder.
   * @return {String}
   */
  get destDir() {
    return path.join('temp', 'build');
  },
  /**
   * A list of folder names that must be excluded from copy.
   * If the name of the directory exists in the path it will be omnited.
   * @return {Array.<string>}
   */
  get excludedDirectories() {
    return ['demo', 'test', 'tasks'];
  },
  /**
   * A list of file names that must be excluded from copy.
   * If the name of the file exists in the path it will be omnited.
   * @return {Array.<string>}
   */
  get excludedFiles() {
    return ['bower.json', '.bower.json', '.DS_Store', 'CONTRIBUTING.md', 'LICENSE', 'LICENSE.txt',
    'README.md', '.bowerrc', '.gitignore', '.jscsrc', '.jshintrc', 'gulpfile.js', 'package.json',
    'build.log', '.travis.yml', 'hero.svg', 'index.html'];
  },
  /**
   * Analyse ARC's dependencies tree.
   */
  analyseDependencies: () => {
    return hyd.Analyzer.analyze(ArcAnalyzer.elementsFile)
    .then(function(analyzer) {
      return analyzer._getDependencies(ArcAnalyzer.elementsFile);
    })
    .then((r) => {
      let paths = [];
      r.forEach((dependency) => {
        let folder = path.dirname(dependency);
        if (paths.indexOf(folder) === -1) {
          paths.push(folder);
        }
      });
      return paths;
    })
    .catch((e) => console.error(e));
  },
  /**
   * Copy all dependencies to dist location.
   */
  copyDependencies: () => {
    return ArcAnalyzer.analyseDependencies()
    .then(ArcAnalyzer._copy);
  },
  _copy: (paths) => {
    var promises = [];
    paths.forEach((path) => {
      promises.push(ArcAnalyzer._copyElement(path));
    });
    return Promise.all(promises);
  },
  _copyElement: (elementPath) => {
    let parts = elementPath.split(path.sep);
    parts.shift(); //remove ./app
    let destElementPath = parts.join(path.sep);
    return ArcAnalyzer.__copy(elementPath,
      path.join(ArcAnalyzer.destDir, destElementPath));
  },

  __copy: (src, dest) => {
    // console.log('__copy', src, dest);
    var exists = fs.existsSync(src);
    if (!exists) {
      console.warn(`File ${src} does not exists.`);
      return Promise.resolve();
    }
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    var isFile = exists && stats.isFile();
    if (isDirectory) {
      let parts = src.split(path.sep);
      let folderName = parts.pop();
      if (ArcAnalyzer.excludedDirectories.indexOf(folderName) !== -1) {
        // we don't want it here.
        console.info(`Omniting folder ${src} due to folder restrictions.`);
        return Promise.resolve();
      }
      return ArcAnalyzer.__ensureDir(dest)
      .then(() => {
        let list = fs.readdirSync(src);
        let promises = [];
        list.forEach((item) => {
          let p = ArcAnalyzer.__copy(
            path.join(src, item),
            path.join(dest, item)
          );
          promises.push(p);
        });
        return Promise.all(promises);
      });
    } else if (isFile) {
      let file = path.basename(src);
      if (ArcAnalyzer.excludedFiles.indexOf(file) !== -1) {
        // we don't want it here.
        console.info(`Omniting file ${src} due to file restrictions.`);
        return Promise.resolve();
      }
      return ArcAnalyzer.__ensureDir(path.dirname(dest))
      .then(() => ArcAnalyzer.__copyFile(src, dest));
    } else {
      console.warn(`File ${src} can't be copied.`, stats);
      return Promise.resolve();
    }
  },
  /**
   * Copy a file to new location.
   * @param {String} source File path to copy
   * @param {String}  target Location of the new file
   * @return {Promise} Fulfilled promise on file copy.
   */
  __copyFile: (source, target) => {
    return new Promise((resolve, reject) => {
      let called = false;
      let reader = fs.createReadStream(source);
      let writer = fs.createWriteStream(target);
      let errHandler = (err) => {
        if (called) {
          return;
        }
        called = true;
        reject(err);
      };
      reader.on('error', errHandler);
      writer.on('error', errHandler);
      writer.on('close', (err) => {
        if (called) {
          return;
        }
        called = true;
        resolve();
      });
      reader.pipe(writer);
    });
  },
  /**
   * Ensure that the direcory exists for given path
   * @param {String} path Path to a directory.
   * @return {Promise} Fullfiled promise when directory structure was created or already existed.
   */
  __ensureDir: (path) => {
    return new Promise((resolve, reject) => {
      fsensure.dir.exists(path, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};

module.exports = ArcAnalyzer;
