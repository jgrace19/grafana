'use strict';

/**
 * Wraps a whole stylesheet in `@layer <name> { … }` so it ranks below StyleX and all unlayered CSS.
 * `@charset` and `@import` must stay at the top level.
 *
 * @param {string} layer
 */
module.exports = (layer) => ({
  postcssPlugin: 'grafana-wrap-in-layer',
  Once(root, { AtRule }) {
    const wrapper = new AtRule({ name: 'layer', params: layer });
    const nodes = root.nodes.filter(
      (node) => !(node.type === 'atrule' && (node.name === 'charset' || node.name === 'import'))
    );
    wrapper.append(nodes);
    root.append(wrapper);
  },
});
module.exports.postcss = true;
