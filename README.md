# ORIGYN dApps

### Overview

This repository contains standard ORIGYN dApps for the perpetualOS

### Compatibility

Each release of Origyn dApps is compatible with a specific version of the Origyn NFT standard. The table below shows the compatibility between the two.

| Origyn dApps Version | Origyn NFT Version |
| -------------------- | ------------------ |
| 0.2.x                | 0.1.4              |
| 0.1.x                | 0.1.3              |

### Modules

./src/components/apps/packages/apps/ledger
./src/components/apps/packages/apps/library
./src/components/apps/packages/apps/luxury
./src/components/apps/packages/apps/marketplace
./src/components/apps/packages/apps/nft-data
./src/components/apps/packages/apps/vault
./src/packages/candy_editor
./src/packages/common/api
./src/packages/common/assets
./src/packages/common/candid
./src/packages/common/types
./src/packages/features/authentication
./src/packages/features/context-provider
./src/packages/features/debug-provider
./src/packages/features/components
./src/packages/features/sales-escrows
./src/packages/features/theme
./src/packages/features/token-provider
./src/packages/features/user-messages
./src/packages/utils

Please document what each package is above.

## 🏁 Quickstart

- Requires `node v18.17.1 or v20.3.0 or higher` in order to install all dependencies. (excluding any v19)

```
npm ci
npm run bootstrap
npm run dev

```

### Running

dApps can be started within Astro.js, which is using Vite as a local development server by running the following script from the root of the repo:

```
npm run dev

```

See package.json scripts for all options.

### Building

Ensure the variables in `.env` are pointing to the desired environment (local or mainnet).

The following script will build every dApp within the repo:

`$ npm run build`

If you want to preview the built dApps, you can run the following script:

`$ npm run preview`

The `dist` folder contains built html files for each dApp.

## 🚀 Local Development

See instructions in the `.env` file.

## ⚠️ Version Update

```
📁 package > features > components > src > layout > index.tsx
<Navbar
    navItems={menuItems}
    onChangeTheme={() => setDarkTheme(!darkTheme)}
    dAppsVersion="0.2.1"
/>
```

Update only the dAppsVersion prop.
