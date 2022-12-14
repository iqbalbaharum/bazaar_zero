import * as React from 'react';
import {useState, useCallback} from 'react'
import {Dialog, Button, Classes} from '@blueprintjs/core'
import { ethers } from 'ethers'
import AssetWrapperAbi from "../artifacts/AssetWrapper.json"
import useSequence from '../Hook/useSequence';

type Prop = {
  bundleId: string
}

const WithdrawButtonWithDialog: React.FC<Prop> = (prop: Prop) => {
  
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const sequenceWallet = useSequence()
  
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleButtonClick = useCallback(() => {
    setIsOpen(true)
  }, [])

  const onHandleConfirm = async () => {

    if(!sequenceWallet.wallet) { return }
    
    setIsLoading(true)
    const signer = await sequenceWallet.wallet.getSigner()
    const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)
    const estimate = await contract.estimateGas.withdraw(parseInt(prop.bundleId))

    const tx = await contract.withdraw(parseInt(prop.bundleId), {
      gasLimit: Math.round(estimate.toNumber() * 2)
    })

    await tx.wait()

    setIsLoading(false)
    setIsOpen(false)
  }

  const DialogFooter = () => {
    return (
        <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button intent="danger" onClick={onHandleConfirm} loading={isLoading}>Confirm</Button>
              <Button onClick={handleClose}>Cancel</Button>
            </div>
        </div>
    );
  }

  return (
    <div>
      <Button intent="warning" onClick={handleButtonClick} text="Unpack" />
      <Dialog isOpen={isOpen} onClose={handleClose}>
        <div className={Classes.DIALOG_BODY}>
          Unpack bundle #{prop.bundleId}
        </div>
        <DialogFooter />
      </Dialog>
    </div>
  )
}

export default WithdrawButtonWithDialog