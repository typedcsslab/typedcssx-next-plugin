# typedcssx-next-plugin

## Documentation

https://typedcssx.vercel.app  
Optimize redundant class names in CSSModule. And Tree Shaking with next's webpack.

## Installation

```sh
npm install --save-dev typedcssx-next-plugin
```

Add the under to your `next.config.js`

```js
const { configCSSModule } = require("typedcssx-next-plugin");
const nextConfig = {
  webpack: (config) => {
    config.optimization.usedExports = true;
    return configCSSModule(config);
  },
};

module.exports = nextConfig;
```
