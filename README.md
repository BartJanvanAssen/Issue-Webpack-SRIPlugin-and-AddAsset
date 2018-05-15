# Issue-Webpack-SRIPlugin-and-AddAsset
Discribes the issue we're having on SRIPlugin ICW AddAssetPlugin of the Webpack build flow


When toggling the SRIPlugin or the AddAssetHtmlPlugin, the build will break. 
- We need the SRI for adding the Integrity key on our script
- We need the AddAssetHtmlPlugin for adding our vendor file to the scripts.

The comibination will cause an error in the SRI plugin stating it cannot grab "publicPath of undefined", undefined is caused by the argument is an unfinished Promise, over here:

```javascript
  SubresourceIntegrityPlugin.beforeHtmlGeneration
  [webpack-test]/[webpack-subresource-integrity]/index.js:271:44
```

Steps to reproduce:
1.  ```npm install```
2.  ```npm run build```
3. error will be visible

4. change node_modules/webpack-subresource-integrity/index.js [line: 268-281] with:

```javascript
*  Add jsIntegrity and cssIntegrity properties to pluginArgs, to
 *  go along with js and css properties.  These are later
 *  accessible on `htmlWebpackPlugin.files`.
 */
SubresourceIntegrityPlugin.prototype.beforeHtmlGeneration =
  function beforeHtmlGeneration(compilation, pluginArgs, callback) {
    var self = this;
    // !!! ADD THIS CONSOLE LOG !!!
    console.log('PluginArgs', pluginArgs)
    // !!! ADD THIS CONSOLE LOG !!!
    this.hwpPublicPath = pluginArgs.assets.publicPath;
    ['js', 'css'].forEach(function addIntegrity(fileType) {
      // eslint-disable-next-line no-param-reassign
      pluginArgs.assets[fileType + 'Integrity'] =
        pluginArgs.assets[fileType].map(function assetIntegrity(filePath) {
          return util.getIntegrityChecksumForAsset(compilation.assets, self.hwpAssetPath(filePath));
        });
    });
    callback(null, pluginArgs);
  };

```

5. run ```npm run build``` again
6. **[ERROR]** watch the console stating the following: ```PluginArgs Promise { <pending> }```

**NOTE:** When disabling the webpack.config.js 's add asset or the SRI plugin the excecution is normal, however you ofcource miss functionality
