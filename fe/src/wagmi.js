//wagmi.js
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { mainnet, sepolia, localhost } from 'wagmi/chains';

const projectId = '6b9fe85c9c4ba366a50c64f6537f7358';

const metadata = {
  name: 'FlightGuard',
  description: 'FlightGuard App',
  url: 'http://localhost:5173',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

const chains = [mainnet, sepolia, localhost];
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains,
  auth: {
    socials: [],
    email: false,
  },
});