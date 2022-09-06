# ORIGYN dApps Monorepo

This repository is a monorepo containing standard ORIGYN dApps. 

### Installation

Requires `node 16` in order to install all dependencies:

In order to have a complete installation of the required packages, you will need to setup a [personal access token](https://github.com/settings/tokens) with `repo` and `read:packages` access. You will need this access token in order to use it as a password when running:

```
npm login --registry=https://npm.pkg.github.com --scope=@origyn-sa
```

Intsall the required dependencies using:
```
npm install
```

Once all required dependencies are installed, we are needed to bootstrap all packages from the monorepo:

```
npm run bootstrap
```

### Running

Each dApp can be started using webpack as a local development server by running the following script from the root of the monorepo:

```
npm run start:wallet
```

### Building

The following script will build every dApp within the monorepo:

```
npm run build:all
```

The `dist` folder contains built html files for each dApp. A single package can be build by running its specific script, e.g: `npm run build:wallet` to build the wallet only.
