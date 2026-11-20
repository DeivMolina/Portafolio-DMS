// Resolve imported files to the exact URLs emitted by the preceding CRA build.
const path = require('path');
module.exports = function () {
  const manifestPath = path.resolve(__dirname, '../build/asset-manifest.json');
  this.addDependency(manifestPath);
  const manifest = JSON.parse(require('fs').readFileSync(manifestPath, 'utf8'));
  const key = 'static/media/' + path.basename(this.resourcePath);
  if (!manifest.files[key]) throw new Error('Missing built asset: ' + key);
  return 'module.exports = ' + JSON.stringify(manifest.files[key]) + ';';
};
