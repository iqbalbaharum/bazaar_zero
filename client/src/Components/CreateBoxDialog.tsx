import * as React from 'react';
import { useState } from 'react'
import { Card, Dialog, Classes, Button, Elevation, Icon, IconSize, Spinner, SpinnerSize } from "@blueprintjs/core";

import AssetWrapperAbi from "../artifacts/AssetWrapper.json"
import { generate_proof } from '../_aqua/node'

import {ethers} from 'ethers'
import web3 from 'web3'
import useSequence from '../Hook/useSequence';


type Prop = {
  isOpen?: boolean,
  handleClose: any
}

interface MintingState {
  process: 'START' | 'PROCESS' | 'END', 
  verified: Boolean,
  minting: Boolean,
  approving: Boolean,
  errorText?: string,
  proof?: string
}

const CreateBoxDialog: React.FC<Prop> = (prop: Prop) => {

  const [state, setState] = useState<MintingState>({
    process: 'START',
    verified: false,
    minting: false,
    approving: false,
    proof: ''
  })

  const sequenceWallet = useSequence()

  const mint = async () => {

    setState(e => ({
      ...e,
      process: 'PROCESS',
      errorText: ''
    }))

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)

      const subscriptionName = ethers.utils.formatBytes32String("bazaar zero")
      const groupId = BigInt(ethers.utils.solidityKeccak256(['bytes32'], [subscriptionName])) >> BigInt(8)
      
      let account = await signer.getAddress()
      const proof = await generate_proof(account)

      setState(e => ({
        ...e,
        verified: true,
        proof: proof.byteSignal.toString()
      }))

      const gasPrice = await provider.getGasPrice()
      const gas_price = Math.round(gasPrice.toNumber() * 1.2)

      const initBundle = await contract
                            .initializeBundle(
                              sequenceWallet.account, 
                              groupId,
                              'Bundle 1',
                              'Bundle 1',
                              proof.byteSignal,
                              proof.fullProof.publicSignals.nullifierHash,
                              proof.solidityProof
                            )

      // var gas_estimate = await initBundle.estimateGas({ from: account })
      // gas_estimate = Math.round(gas_estimate * 1.2); 
        
      // console.log({gas_price, gas_estimate})
      
      setState(e => ({
        ...e,
        minting: true
      }))

      await handleApproval()

      setState(e => ({
        ...e,
        approving: true,
        process: 'END'
      }))

    } catch (e) {
      console.log(e)
      setState({
        process: 'START',
        verified: false,
        minting: false,
        approving: false,
        errorText: (e as any).toString()
      })

      console.log(state)
    }
  }

  const handleApproval = async () => {
    const signer = sequenceWallet.wallet?.getSigner()
    const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)
    await contract.setApprovalForAll(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER, true)
  }

  const handleClose = () => {
    setState({
      process: 'START',
      verified: false,
      minting: false,
      approving: false
    })

    prop.handleClose()
  }

  const SpinnerCompletion = (prop : any) => {
    return (
      prop.flag ? (
        <Icon icon="tick-circle" size={IconSize.LARGE} color='green' />
      ) : (
        <Spinner
          size={15}
          intent="success"
        />
      )
    )
  }

  return (
    <Dialog isOpen={prop.isOpen} onClose={prop.handleClose}>
      <div className={Classes.DIALOG_BODY}>
        <Card elevation={Elevation.TWO} className='table-list' >
          Verify (Generate proof)
          <span className='icon-right'>
            {state.process === 'PROCESS' && <SpinnerCompletion flag={state.verified} />}
          </span>
        </Card>
        <Card elevation={Elevation.TWO}className='table-list' >
          Minting
          <span className='icon-right'>
          {state.process === 'PROCESS' && <SpinnerCompletion flag={state.minting} />}
          </span>
        </Card>
        <Card elevation={Elevation.TWO}className='table-list' >
          Approving {process.env.REACT_APP_CONTRACT_ASSET_WRAPPER}
          <span className='icon-right'>
          {state.process === 'PROCESS' && <SpinnerCompletion flag={state.approving} />}
          </span>
        </Card>
      </div>
      <DialogFooter handleClose={handleClose} />
    </Dialog>
  )

  function DialogFooter(props: { handleClose: (e: React.MouseEvent) => void }) {
    return (
        <div className={Classes.DIALOG_FOOTER}>
            <div className="bp4-text-small bp4-monospace-text bp4-text-overflow-ellipsis">{state.proof ? state.proof : '' }</div>
            {state.errorText && <span style={{ color: 'red' }}>{state.errorText}</span>}
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              {(state.process === 'START' || state.process === 'PROCESS') && <Button intent="success" onClick={mint} loading={state.process === 'PROCESS'}>Mint NFT</Button>}
              <Button onClick={props.handleClose} disabled={state.process === 'PROCESS'}>Close</Button>
            </div>
        </div>
    );
  }
}

export default CreateBoxDialog