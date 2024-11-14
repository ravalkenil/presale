import React, { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/home";
// import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
// import { Web3Modal } from '@web3modal/react'
// import { configureChains, createConfig, WagmiConfig } from 'wagmi'
// import { arbitrum, mainnet, polygon ,holesky,cronos} from 'wagmi/chains'
import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter   } from '@reown/appkit-adapter-ethers'
import { mainnet, cronos,holesky} from '@reown/appkit/networks'
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import Success from './pages/Success';
import Cancel from './pages/Cancel';

const chains = [mainnet,cronos,holesky]
const projectId = 'a28c7bc7b556786d322dbdedeb8a4153'

// const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors: w3mConnectors({ projectId, chains }),
//   publicClient
// })

// 2. Create a metadata object - optional
// for localnet
// const metadata = {
//   name: 'Crotch presale',
//   description: 'Crotch presale',
//   url: 'http://localhost:3000/', // origin must match your domain & subdomain
//   icons: ['']
// }

// for producation
const metadata = {
  name: 'Crotch presale',
  description: 'Crotch presale',
  url: 'https://crotch-presale.vercel.app/', // origin must match your domain & subdomain
  icons: ['https://crimson-obvious-anteater-98.mypinata.cloud/ipfs/QmbAeaPKQi7vCRyhG6VnXsc8UGmf9Yhm2h9rqyjmWdR2Ht']
}

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks: [mainnet,cronos,holesky],
  metadata: metadata,
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

function App() {
 
  return(
    <>
    {/* <WagmiConfig config={wagmiConfig}> */}
      <Router>
        <Routes >
          <Route path="/"  element={<Home/>} />
          <Route path="/success" element={<Success/>} />
          <Route path="/cancel" element={<Cancel/>} />
        </Routes >
      </Router>
    {/* </WagmiConfig> */}
    </>
  );

}

export default App;

// 28000000000
// 1000
// 100000
// 1000000

// 777600 for 9 days