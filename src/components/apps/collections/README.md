# IC Collections dApp

**IC Collections dApp** is a decentralized application built to manage, trade, and interact with NFTs and governance on the Internet Computer. This dApp is part of a larger monorepo powered by Astro. It features three main sections:

## Sections

### 1. Collections

- **Buy NFTs**: Explore and purchase NFTs available for sale.
- **Open a Sale**: List your NFTs for sale within the marketplace.

### 2. Library

- Integrated with **ICPSwap** and **Ledger App**, allowing easy access to data from tokens across the dApp.

### 3. Governance

- **Cast a Vote**: Participate in decentralized governance by casting votes.
- **Make a Proposal**: Submit proposals for consideration within the governance framework.

## Technical Stack

This dApp is built with the following technologies:

- **IdentityKit** for authentication.
- **React Query** to manage asynchronous data fetching.
- **Vite** as the primary framework for development and builds.
- **Tailwind CSS** for responsive and flexible styling.

## NFT Pricing and Filtering

NFTs within the application display prices in **USD**, pulled from ICPSwap. The dApp accepts all tokens adhering to the **ICRC1** and **ICRC2** standards, based on ICPSwap integrations.

### Token Filtering

A crucial aspect of this dApp is token validation and filtering:

- **Fake or duplicate tokens** are automatically filtered out using the canister IDs from the [ICPTokens API](https://web2.icptokens.net/api/tokens).
- We prioritize the most **popular tokens**, as defined by the internal `currencies` file.
- **Tokens with a 7-day volume below 10000 USD** are excluded from the dApp to ensure a clean and accurate token selection process.

**Important**: This filtering logic is **variable** and can be modified (e.g., filtering tokens based on 1-day volume) or removed entirely depending on future needs.

Feel free to contribute or suggest improvements!
