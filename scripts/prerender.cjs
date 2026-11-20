/* Build-time rendering of the real React application. No browser, server or
 * new dependencies required; Webpack/Babel are supplied by react-scripts.
 * Never serialize a live browser DOM, third-party widgets or private state.
 */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const React = require('react');
const { renderToString } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'build');
const bundle = path.join(output, '.prerender.cjs');

async function main() {
  const compiler = webpack({
    mode: 'production', target: 'node', devtool: false,
    entry: path.join(root, 'src/App.jsx'),
    output: { path: output, filename: path.basename(bundle), library: { type: 'commonjs2' } },
    resolve: { extensions: ['.js', '.jsx', '.json'] },
    externals: [({ request }, done) => {
      if (/^(react(?:$|\/)|react-dom(?:$|\/)|react-icons\/|emailjs-com$|sweetalert2$|react-google-recaptcha$)/.test(request)) done(null, 'commonjs ' + request);
      else done();
    }],
    module: { rules: [
      { test: /\.jsx?$/, include: path.join(root, 'src'), use: { loader: require.resolve('babel-loader'), options: {
        babelrc: false, configFile: false,
        presets: [[require.resolve('@babel/preset-env'), { targets: { node: 'current' } }], [require.resolve('@babel/preset-react'), { runtime: 'automatic' }]],
      } } },
      { test: /\.css$/, type: 'asset/source' },
      { test: /\.(png|jpe?g|webp|gif|svg|pdf)$/i, use: path.join(__dirname, 'prerender-asset-loader.cjs') },
    ] },
    optimization: { minimize: false },
    performance: { hints: false },
  });
  try {
    await new Promise((resolve, reject) => compiler.run((error, stats) => {
      if (error) reject(error);
      else if (stats.hasErrors()) reject(new Error(stats.toString({ all: false, errors: true })));
      else resolve();
    }));
    const App = require(bundle).default;
    const markup = renderToString(React.createElement(App));
    const file = path.join(output, 'index.html');
    const html = fs.readFileSync(file, 'utf8');
    const emptyRoot = '<div id="root"></div>';
    if (!html.includes(emptyRoot)) throw new Error('Expected a fresh CRA build with one empty root.');
    if (!markup.includes('Solicitar demo') || !markup.includes('contenido-principal')) throw new Error('Incomplete React render.');
    fs.writeFileSync(file, html.replace(emptyRoot, () => '<div id="root">' + markup + '</div>'));
    console.log('Pre-rendered the complete portfolio from React (' + Buffer.byteLength(markup) + ' bytes).');
  } finally {
    await new Promise(resolve => compiler.close(resolve));
    // Only the single, explicitly named temporary build artifact is removed.
    if (fs.existsSync(bundle)) fs.unlinkSync(bundle);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
