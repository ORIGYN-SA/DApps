# ORIGYN dApps Monorepo

This repository is a monorepo containing standard ORIGYN dApps for the perpetualOS

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
./packages/features/authentiction
./packages/features/components
./packages/features/debug-provider
./packages/features/sales-escrows
./pakcages/featrues/theme
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

The following script will build every dApp within the monorepo:

`$ npm run build:all`

The `dist` folder contains built html files for each dApp. A single package can be build by running its specific script, e.g: `npm run build:vault` to build the vault only.

## 🚀 Local Development

In order to connect the dApps to the local environment, you will need the following:

- [Origyn NFT Canister](https://github.com/ORIGYN-SA/origyn_nft)
- [ICP Ledger Canister (for ICP transactions)](https://internetcomputer.org/docs/current/developer-docs/integrations/ledger/ledger-local-setup/)
- OGY Ledger Canister (for OGY transactions)

The local development settings will be visible on the left menu if the web origin is localhost.
In order to make your dApp connect to local canisters, you will need to:

- Click `Local Development Settings` on the side bar
- Check `Use Local Network (http://localhost:8000)`
- (optional) Fill the canister id of the local ledger replica for each token you have in your dApp. You will need this to get balance and send transactions.

Example:

```
http://localhost:8080/-/sp3hj-caaaa-aaaaa-aaajq-cai/-/bm-1/-/vault
```

This will make [Connect2IC](https://github.com/Connect2IC/connect2ic) create an actor for the canister `sp3hj-caaaa-aaaaa-aaajq-cai`.

## ⚠️ Version Update

```
📁 package > features > components > src > layout > index.tsx
<Navbar
    navItems={menuItems}
    onChangeTheme={() => setDarkTheme(!darkTheme)}
    dAppsVersion="0.1.0"
/>
```

Update only the dAppsVersion prop.
