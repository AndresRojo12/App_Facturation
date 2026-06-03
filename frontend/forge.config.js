const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

const isWindows = process.platform === 'win32';

module.exports = {
  outDir: './build_electron',
  packagerConfig: {
    // 1. Mantenemos el ASAR activo para proteger tu código
    asar: {
      // 2. CORREGIDO: Empaquetar el backend de Python dentro del ASAR descompactado
      unpack: '**/facturation-api.exe'
    },
    icon: path.join(__dirname, 'assets', 'market'),
    // 3. Eliminamos el binario de Python de extraResource (deja solo el .env si lo necesitas)
    extraResource: [
      path.join(__dirname, "..", "facturation", "dist", "facturation-api.exe"),
      path.join(__dirname, "..", "facturation", ".env.production")
    ]

  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'Market_Pro',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32', 'linux'],
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
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
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
