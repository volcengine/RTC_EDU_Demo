const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('../package.json');

const slardarScript = `;(function (w, d, u, b, n, pc, ga, ae, po, s, p, e, t, pp) {pc = 'precollect';ga = 'getAttribute';ae = 'addEventListener';po = 'PerformanceObserver';s = function (m) {p = [].slice.call(arguments);p.push(Date.now(), location.href);(m == pc ? s.p.a : s.q).push(p)};s.q = [];s.p = { a: [] };w[n] = s;e = document.createElement('script');e.src = u + '?bid=' + b + '&globalName=' + n;e.crossorigin = u.indexOf('sdk-web') > 0 ? 'anonymous' : 'use-credentials';d.getElementsByTagName('head')[0].appendChild(e);if (ae in w) {s.pcErr = function (e) {e = e || w.event;t = e.target || e.srcElement;if (t instanceof Element || t instanceof HTMLElement) {if (t[ga]('integrity')) {w[n](pc, 'sri', t[ga]('href') || t[ga]('src'))} else {w[n](pc, 'st', { tagName: t.tagName, url: t[ga]('href') || t[ga]('src') })}} else {w[n](pc, 'err', e.error || e.message)}};s.pcRej = function (e) {e = e || w.event;w[n](pc, 'err', e.reason || (e.detail && e.detail.reason))};w[ae]('error', s.pcErr, true);w[ae]('unhandledrejection', s.pcRej, true);};if('PerformanceLongTaskTiming' in w) {pp = s.pp = { entries: [] };pp.observer = new PerformanceObserver(function (l) {pp.entries = pp.entries.concat(l.getEntries())});pp.observer.observe({ entryTypes: ['longtask', 'largest-contentful-paint','layout-shift'] })}})(window,document,'https://lf3-short.ibytedapm.com/slardar/fe/sdk-web/browser.cn.js','vcloud_lite','SlardarVExpLite')`;

const getSlardarConfigSlardar = () => {
  const slardarConfig = {
    sampleRate: 1,
    bid: 'vcloud_lite',
    pid: pkg.name,
    env: 'production',
    release: pkg.version,
    plugins: {
      blankScreen: { autoDetect: true, threshold: 1.5, rootSelector: '#root' },
      ajax: {
        ignoreUrls: ['mcs.snssdk.com'],
      },
      fetch: {
        ignoreUrls: ['mcs.snssdk.com'],
      },
    },
  };
  return '';
};

const htmlString = ` <script>${slardarScript}</script><script>${getSlardarConfigSlardar()}</script>`;

class SlardarPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('SlardarPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'SlardarPlugin',
        (htmlPluginData, callback) => {
          const html = htmlPluginData.html;
          const ALL_SCRIPT_REGEX = /(<script[\s\S]*?>)[\s\S]*?<\/script>/i;

          const newHtml = html.replace(ALL_SCRIPT_REGEX, (match) => {
            return `${htmlString}\n${match}`;
          });

          htmlPluginData.html = newHtml;
          callback(null, htmlPluginData);
        }
      );
    });
  }
}
//导出插件
module.exports = SlardarPlugin;
