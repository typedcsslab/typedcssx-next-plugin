# typedcssx-next-plugin

## Documentation

https://typedcssx.vercel.app  
Optimize redundant class names in CSSModule and completely remove by method style objects.

## Installation

```sh
npm install --save-dev typedcssx-next-plugin
```

Add the under to your `next.config.js`

```js
const { TypedCSSXNextPlugin, configCSSModule } = require('typedcssx-next-plugin');
const nextConfig = {
  webpack: config => {
    config.plugins.push(new TypedCSSXNextPlugin());
    return configCSSModule(config);
  },
};

module.exports = nextConfig;
```
