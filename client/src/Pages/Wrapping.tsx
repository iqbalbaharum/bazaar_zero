import * as React from 'react';
import { providers } from 'ethers'
import {H1, Button} from '@blueprintjs/core'
import { Container, Row, Col } from 'react-grid-system';

import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

import { useState, useEffect } from 'react';

import CreateBoxButton from '../Components/CreateBoxButton'

const Wrapping = () => {

  const [web3Modal, setWeb3Modal] = useState<any>(null)
  const [address, setAddress] = useState("")

  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            137: "https://rpc-mainnet.maticvigil.com/",
          },
          network: "matic",
        },
      },
    };

    const newWeb3Modal = new Web3Modal({
      cacheProvider: true, // very important
      network: "mainnet",
      providerOptions,
    });

    setWeb3Modal(newWeb3Modal)
  }, [])

  async function connectWallet() {
    const provider = await web3Modal.connect();

    const web3Provider = new provider.Web3Provider(provider)
    const userAddress = await web3Provider.listAccounts()
    setAddress(userAddress[0])
    console.log(window.ethereum)
  }


  return (
    <Container>
      <Row style={{ height: '80px' }} align="center"><H1>My Assets</H1></Row>
      <Row style={{ height: '50px' }} align="center" justify="center">
        <p>
          {!address 
            ? <Button text="Connect Metamask" onClick={() => connectWallet()} /> : `Wallet: ${address}`
          }
        </p>
      </Row>
      {address && <div>
        <Row>
          <CreateBoxButton />
        </Row>
      </div>}
    </Container>
  )
}

export default Wrapping