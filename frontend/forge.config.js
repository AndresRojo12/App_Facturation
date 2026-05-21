const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require("path");

const isWindows = process.platform === "win32";

module.exports = {
packagerConfig: {
asar: true,
executableName: "market-pro",

extraResource: [
  ...(isWindows
    ? [path.join(__dirname, "..", "facturation", "dist", "facturation-api.exe")]
    : [path.join(__dirname, "..", "facturation", "dist", "facturation-api")]),

  path.join(__dirname, "..", "facturation", ".env.production")
]


},

rebuildConfig: {},

makers: [
{
name: '@electron-forge/maker-squirrel',
config: {
name: 'market_pro',
},
},


{
  name: '@electron-forge/maker-zip',
  platforms: ['linux', 'win32'],
},

{
  name: '@electron-forge/maker-deb',
  config: {},
},

{
  name: '@electron-forge/maker-rpm',
  config: {},
},


],

plugins: [
{
name: '@electron-forge/plugin-auto-unpack-natives',
config: {},
},


new FusesPlugin({
  version: FuseVersion.V1,

  [FuseV1Options.RunAsNode]: false,
  [FuseV1Options.EnableCookieEncryption]: true,
  [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
  [FuseV1Options.EnableNodeCliInspectArguments]: false,
  [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
  [FuseV1Options.OnlyLoadAppFromAsar]: false,
}),


],
};
