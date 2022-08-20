import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Alignment, Classes, Navbar, NavbarGroup, NavbarDivider, Button, NavbarHeading, Icon } from '@blueprintjs/core'
import useSequence from '../Hook/useSequence';
import { useEthers } from '@usedapp/core';

import { Fluence } from '@fluencelabs/fluence';
import { krasnodar } from '@fluencelabs/fluence-network-environment';
import FluenceService from './FluenceService';

import { registerProvider, resolveProviders } from '../_aqua/export';

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
      <strong style={{color:"green"}}>
        {Fluence.getStatus().peerId} <Icon icon="tick-circle" color="green" /> 
      </strong>
    )
  }

  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <Button className={Classes.MINIMAL} text="My Shop" onClick={() => navigate('/my')} />
        <Button className={Classes.MINIMAL} text="Wrapper" onClick={() => navigate('/wrapping')}/>
        <NavbarDivider />
        Sequence: <br />{account ? account : <Button intent="success" text="Login" onClick={() => navigate('/login')} /> }
        <NavbarDivider />
        Polygon: <br />{ethers.account ? ethers.account : <Button large={true} intent="success" text="Connect Metamask" onClick={() => ethers.activateBrowserWallet()} /> }
        <NavbarDivider />
        <NavbarHeading>{!isFluenceConnected ? <ConnectingText /> : <ConnectedText />}</NavbarHeading>
      </NavbarGroup>
      {isFluenceConnected && <FluenceService />}
    </Navbar>
  )
}

export default Navigation