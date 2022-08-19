import * as React from 'react';
import Web3 from "web3";
import {H1, Button} from '@blueprintjs/core'
import { Container, Row, Col } from 'react-grid-system';

import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'

import { useState, useEffect } from 'react';

import AssetBox from '../Components/AssetBox'

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
    const web3 = new Web3(provider);
    const userAddress = await web3.eth.getAccounts()
    setAddress(userAddress[0])
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
      {address && <Row>
        <Col sm={4}>
          <AssetBox title='Hello' description='World' type="ERC721" />
        </Col>
        <Col sm={4}>
          <AssetBox title='Hello' description='World2' type="ERC20" />
        </Col>
      </Row>}
    </Container>
  )
}

export default Wrapping