# Pin Tickets + Easy Timer Management
## Chrome extension for Freshdesk, built for use within Workato

![Workato Freshdesk Chrome Extension](http://g.recordit.co/ALamLrAj1M.gif)

## How to upload to Chrome webstore
Chrome's extension admin dashboard accepts the entire directory, zipped into one file.

## Important files

### Configuration
```
manifest.json      <-- Chrome uses this to build the extension
package.json       <-- Node.js config
webpack.config.js  <-- Webpack config
```

### JS
```
js/api.js       <-- helper functions to interact with Freshdesk
js/scripts.js   <-- entry script for webpack. Becomes scripts.min.js
js/components/  <-- JSX components
```

### CSS
```
css/main.scss <-- entry CSS for SASS. Becomes main.css
```

### img
```
img/*.png <-- Images for Chrome extension
```

### HTML
```
html/popup.html <-- Popup page for Chrome extension
```
