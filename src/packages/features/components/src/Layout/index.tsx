import React, { useContext, useEffect, useState } from "react";
import { Flex, GlobalStyle, Navbar } from "@origyn/origyn-art-ui";
import { Icons, theme, themeLight } from "@origyn/origyn-art-ui";
import "react-toastify/dist/ReactToastify.css";
import { useTokensContext } from "@dapp/features-tokens-provider";
import { ThemeProvider } from "styled-components";
import "./connect2ic.css";
import { AuthContext } from "@dapp/features-authentication";
import { PerpetualOSContext } from "@dapp/features-context-provider";
import { getNftCollectionMeta, OrigynClient } from "@origyn/mintjs";

// TODO: get APPS from NFT data
const initialMenuItems: MenuItem[] = [
  {
    href: "vault.html",
    title: "Home",
    icon: Icons.Home,
  },
  {
    href: "vault.html",
    title: "Vault",
    icon: Icons.Wallet,
  },
  {
    href: "nft-data.html",
    title: "Certificates Data",
    icon: Icons.DataBrowse,
  },
  {
    href: "library.html",
    title: "Certificates library",
    icon: Icons.Libraries,
  },
  {
    href: "ledger.html",
    title: "Ledger",
    icon: Icons.TransactionIcon,
  },
  {
    href: "marketplace.html",
    title: "Marketplace",
    icon: Icons.Marketplace,
  },
];

export const Layout = ({ children }: LayoutProps) => {
  const context = useContext(PerpetualOSContext);

  const { refreshAllBalances } = useTokensContext();
  const { principal, loggedIn, actor } = useContext(AuthContext);
  const [darkTheme, setDarkTheme] = useState(false);
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  useEffect(() => {
    if (loggedIn && refreshAllBalances && principal) {
      refreshAllBalances(principal);
    }
  }, [loggedIn]);

  useEffect(() => {
    const run = async () => {
      await OrigynClient.getInstance().init(
        !context.isLocal,
        context.canisterId,
        { actor }
      );
      getNftCollectionMeta().then((r: any) => {
        if (!("err" in r)) {
          const data = r.ok.metadata[0].Class.find(
            ({ name }) => name === "library"
          ).value.Array.reduce(
            (arr, val) => [
              ...arr,
              val.Class.find(({ name }) => name === "library_id.html").value.Text,
            ],
            []
          );
          setMenuItems(
            initialMenuItems.filter((item) => data.includes(item.href))
          );
        }
      });
    };
    run();
  }, [context.isLocal, context.canisterId, actor]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme !== null) {
      setDarkTheme(savedTheme === "true");
    }
  }, []);

  const handleThemeChange = () => {
    const newTheme: any = !darkTheme;
    setDarkTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };
  return (
    <>
      <ThemeProvider theme={darkTheme ? theme : themeLight}>
        <GlobalStyle />
        <Flex fullWidth mdFlexFlow="column">
          <Navbar
            navItems={menuItems}
            onChangeTheme={handleThemeChange}
            dAppsVersion="0.2.1"
            darkMode={darkTheme}
          />
          <Flex fullWidth>{children}</Flex>
        </Flex>
      </ThemeProvider>
    </>
  );
};
export default Layout;

export type MenuItem = {
  href: string;
  title: string;
  icon: any;
};

export type LayoutProps = {
  children: JSX.Element;
  menuItems?: MenuItem[];
};
