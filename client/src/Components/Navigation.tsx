import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Alignment, Classes, Navbar, NavbarGroup, NavbarDivider, Button, NavbarHeading, Icon } from '@blueprintjs/core'
import useSequence from '../Hook/useSequence';
import { ETHAuth } from '@0xsequence/ethauth'
import { sequence } from '0xsequence'
import { useEthers } from '@usedapp/core';

import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import FluenceService from './FluenceService';

import { registerProvider, resolveProviders } from '../_aqua/export';
import logo from '../assets/bazaar-zer0-logo.png';

const Navigation = () => {

  const navigate = useNavigate() 

  const { account } = useSequence()
  const ethers = useEthers()

  const [isFluenceConnected, setIsFluenceConnected] = useState(false)

  useEffect(() => {

    let id: any
    
    const registerDiscovery = async () => {
      const [success, error] = await registerProvider(
        "DOSASeller12D3KooWEY2Q7TmhSciBtrjhNyDTC3dKfmC4FSETYCZ5K1G27SN3",
        "Seller",
        "shopservice");
        
      console.log(success, error)
    }

    if(!isFluenceConnected) {
      id = setInterval(() => {

        Fluence.start({ 
          connectTo: krasnodar[0],
          defaultTtlMs: 30000
        })
          .then(() => {
            clearInterval(id);
            setIsFluenceConnected(true)

            registerDiscovery()
          })
      }, 10000)  
    }
    
    return () => {
      if(id) 
        clearInterval(id);
    }

  }, [isFluenceConnected, setIsFluenceConnected])

  const ConnectingText = () => {
    return (
      <strong style={{color:"orange"}}>Connecting...</strong>
    )
  }

  const ConnectedText = () => {
    return (
      <strong style={{color:"green"}} className="bp4-text-small">
        {Fluence.getStatus().peerId} <Icon icon="tick-circle" color="green" /> 
      </strong>
    )
  }

  const onHandleSequenceWallet = async () => {
    const wallet = sequence.getWallet()
    const connectDetails = await wallet.connect({
      app: 'Bazaar Zero',
      authorize: true,
      settings: {
        theme: 'indigoDark',
        bannerUrl: ``,
        includedPaymentProviders: ['moonpay'],
        defaultFundingCurrency: 'matic',
        defaultPurchaseAmount: 111
      }
    })

    const ethAuth = new ETHAuth()

    if (connectDetails.proof) {
      const decodedProof = await ethAuth.decodeProof(connectDetails.proof.proofString, true)

      const isValid = await wallet.utils.isValidTypedDataSignature(
        await wallet.getAddress(),
        connectDetails.proof.typedData,
        decodedProof.signature,
        await wallet.getAuthChainId()
      )

      if (!isValid) throw new Error('sig invalid')
    }
  }

  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <img height={40} src={logo} alt="Bazaar Zero" onClick={() => navigate('/my')}/>
        {/* <Button className={Classes.MINIMAL} text="Wrapper" onClick={() => navigate('/wrapping')}/> */}
        <NavbarDivider />
        Sequence <br /> {account ? account : <Button intent="primary" text="Login" onClick={onHandleSequenceWallet} /> }
        <NavbarDivider />
        Polygon <br /> {ethers.account ? ethers.account : <Button intent="primary" text="Connect Metamask" onClick={() => ethers.activateBrowserWallet()} /> }
        <NavbarDivider />
        {!isFluenceConnected ? <ConnectingText /> : <ConnectedText />}
      </NavbarGroup>
      {isFluenceConnected && <FluenceService />}
    </Navbar>
  )
}

export default Navigation