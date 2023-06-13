# ORIGYN dApps Monorepo

### Overview

This repository is a monorepo containing standard ORIGYN dApps for the perpetualOS

### Compatibility

Each release of Origyn dApps is compatible with a specific version of the Origyn NFT standard. The table below shows the compatibility between the two.

| Origyn dApps Version | Origyn NFT Version |
| -------------------- | ------------------ |
| 0.2.x                | 0.1.4              |
| 0.1.x                | 0.1.3              |

### Modules

./packages/apps/ledger
./packages/apps/library
./packages/apps/luxury
./packages/apps/marketplace
./packages/apps/nft-data
./packages/apps/vault
./packages/candy_editor
./packages/common/api
./packages/common/assets
./packages/common/candid
./packages/common/types
./packages/features/authentication
./packages/features/context-provider
./packages/features/debug-provider
./packages/features/components
./packages/features/sales-escrows
./packages/features/theme
./packages/features/token-provider
./packages/features/user-messages
./packages/utils

Please document what each package is above.

## 🏁 Quickstart

- Requires `node 16` in order to install all dependencies.

```
npm ci
npm run bootstrap
npm run build:all
npm run start:marketplace
```

### Running

Each dApp can be started using webpack as a local development server by running the following script from the root of the monorepo:

```
npm run start:vault
```

See package.json scripts for all options.

### Building

Ensure the variables in `.env` are pointing to the desired environment (local or mainnet).

The following script will build every dApp within the monorepo:

`$ npm run build:all`

The `dist` folder contains built html files for each dApp. A single package can be built by running its specific script, e.g: `npm run build:vault` to build the vault only.

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
