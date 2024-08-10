import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,

  // LedgerWalletAdapter,
  // SlopeWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { Cluster, clusterApiUrl } from "@solana/web3.js";
import { FC, ReactNode, useCallback, useMemo } from "react";
import {
  AutoConnectProvider,
  useAutoConnect,
} from "@/contexts/AutoConnectProvider";

import {
  NetworkConfigurationProvider,
  useNetworkConfiguration,
} from "@/contexts/NetworkConfigurationProvider";
import dynamic from "next/dynamic";
import { RPC_ENDPOINT } from "@/lib/const";

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false },
);

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  const { networkConfiguration } = useNetworkConfiguration();
  const network = networkConfiguration as WalletAdapterNetwork;
  const endpoint = () => {
    if (RPC_ENDPOINT) return RPC_ENDPOINT;
    throw "RPC_ENDPOINT not set";
  };

  console.log(network);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),

      // new LedgerWalletAdapter(),
      // new SlopeWalletAdapter(),
    ],
    [network],
  );

  return (
    // TODO: updates needed for updating and referencing endpoint: wallet adapter rework
    <ConnectionProvider endpoint={endpoint()}>
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <ReactUIWalletModalProviderDynamic>
          {children}
        </ReactUIWalletModalProviderDynamic>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <NetworkConfigurationProvider>
        <AutoConnectProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </AutoConnectProvider>
      </NetworkConfigurationProvider>
    </>
  );
};
