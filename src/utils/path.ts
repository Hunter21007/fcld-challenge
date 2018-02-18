/**
 * Computes relative path of the source code root using process.cwd()
 * and the absolute path of the file directory and the known relative path of the file
 *
 * if __dirname is /home/user/git/project/src/data
 *    and process.cwd() is /home/user/git/project
 *    then result will be src
 *
 * @example
 *    const srcRoot = getSrcRoot(__dirname, 'data');
 *
 * @param sourceDir usually __dirname
 * @param sourceRelDir path to the directory relative to the src folder
 */
export function getSrcRoot(sourceDir: string, sourceRelDir: string) {
  const cwd = process.cwd();
  const srcRoot = sourceDir
    .replace(cwd, '')
    .replace(sourceRelDir, '')
    .replace(/\//, '');
  return srcRoot;
}
