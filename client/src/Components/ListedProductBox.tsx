import * as React from 'react';
import { useState, useEffect } from 'react'
import { Card, Elevation, Button, Tag } from "@blueprintjs/core";
import { ethers } from 'ethers'
import SellButtonWithDialog from './SellButtonWithDialog'
import useSequence from '../Hook/useSequence';
import AssetWrapperAbi from "../artifacts/AssetWrapper.json"
import WithdrawButtonWithDialog from './WithdrawButtonWithDialog';
import BundleDrawer from './BundleDrawer';

type AssetDataProp = {
  title: string,
  description: string
  onClick: any,
  asset: any,
  bundleId: string
}

interface State {
  isSellable: boolean,
  priceInEther: number
}

const ListedProductBox: React.FC<AssetDataProp> = (prop: AssetDataProp) => {
  
  const sequenceWallet = useSequence()

  const [state, setState] = useState<State>({
    isSellable: false,
    priceInEther: 0
  })

  const [isAssetOpen, setIsAssetOpen] = useState(false)
  
  const toggleAssetDialog = (bundle: any) => {
    setIsAssetOpen(!isAssetOpen)
  }

  useEffect(() => {
    const getBundleData = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)
      const tx = await contract.getBundles(parseInt(prop.bundleId))
      
      const price = ethers.utils.formatEther(ethers.BigNumber.from(tx.price))
      
      setState({
        ...state,
        priceInEther: parseFloat(price)
      })
    }

    getBundleData()
  }, [])

  console.log(prop.asset.bundles)

  const onSell = async (bundleId, price) => {
    try {
      const signer = sequenceWallet.wallet?.getSigner()
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)
      // const estimate = await contract.estimateGas.sell(bundleId, ethers.utils.parseUnits(price, 'ether'), sequenceWallet.account)
      // console.log({estimate: BigInt(estimate)})
      // console.log(bundleId)

      await contract.sell(bundleId, ethers.utils.parseUnits(price, 'ether'), sequenceWallet.account)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="z-box">
      <div className="z-box-inner">
        <div className='z-box-header' style={{ padding: '5px 10px', backgroundColor: state.priceInEther > 0 ? '#72CA9B' : '#8ABBFF', display: 'flex', justifyContent: 'center' }}>
          <span>{prop.title}</span>
          {state.priceInEther > 0 && <Tag intent="success" round={true} >Selling</Tag>}
        </div>
        <div className='z-box-content'>
          <ul>
            {<li>ERC20: {prop.asset.bundles?.bundleERC20.length}</li>}
            {<li>ERC721: {prop.asset.bundles?.bundleERC721.length}</li>}
            {<li>ERC1155: {prop.asset.bundles?.bundleERC1155.length}</li>}
          </ul>
        </div>
        <div className="z-box-footer">
          <Button text="Assets" onClick={toggleAssetDialog} />
          {state.priceInEther <= 0 && <Button text="Deposit" intent="primary" onClick={prop.onClick} />}
          {state.priceInEther <= 0 && <SellButtonWithDialog bundleId={prop.bundleId} onSell={(bundleId, price) => onSell(bundleId, price)} buttonText='Sell' />}
          <br />
          <WithdrawButtonWithDialog bundleId={prop.bundleId} />
        </div>
      </div>

      <BundleDrawer isOpen={isAssetOpen} asset={prop.asset} handleClose={toggleAssetDialog} />
    </div>
  )
}

export default ListedProductBox