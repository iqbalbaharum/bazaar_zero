import * as React from 'react';
import { Drawer, Button, Position, H2 } from "@blueprintjs/core";
import { useEthers } from '@usedapp/core';

type Prop = {
  isOpen?: boolean,
  handleClose: any
}

const WalletItemDrawer: React.FC<Prop> = (prop: Prop) => {

  const ether = useEthers()

  const WalletNotConnected = () => {
    return (
      <div className='div-center'>
        <Button large={true} intent="success" text="Connect Metamask" onClick={() => ether.activateBrowserWallet()} />
      </div>
    )
  }

  const WalletConnected = () => {
    return (
      <div>
        <strong>{ether.account}</strong>
      </div>
    )
  }

  return (
    <Drawer
      onClose={prop.handleClose}
      title="My Wallet"
      isOpen={prop.isOpen}
      position={Position.RIGHT}
      autoFocus={true}
      canOutsideClickClose={true}
    >
      <div>
        {ether.account ? <WalletConnected /> : <WalletNotConnected />}
      </div>
    </Drawer>
  )
}

export default WalletItemDrawer