import * as React from 'react';
import { useState, useEffect } from 'react'
import { Drawer, Button, Position, Tabs, H4, Tab, FormGroup } from "@blueprintjs/core";
import { addressEqual, ERC20, useEthers } from '@usedapp/core';
import NFTCard from './NFTCard';
import useSequence from '../Hook/useSequence';
import AssetWrapperAbi from "../artifacts/AssetWrapper.json"
import { sequence } from '0xsequence';
import { ethers } from 'ethers';

import erc721abi from "../artifacts/erc721.json"
import erc20abi from "../artifacts/erc20.json"
import erc1155abi from "../artifacts/erc1155.json"
import TabERC20 from './Tabs/TabERC20';
import TabNFT from './Tabs/TabNFT';

type Prop = {
  isOpen?: boolean,
  handleClose: any,
  selectedBundleId: string
}

export  interface AssetModel {
  contractAddress: String,
  contractType: String,
  tokenId: String,
  balance: String,
  name?: String,
  symbol?: String,
  chain: {
    id: number,
    name: string
  }
}

export interface ERC20Amount {
  [address: string]: number
}

const WalletItemDrawer: React.FC<Prop> = (prop: Prop) => {

  const ether = useEthers()
  const [assets, setAssets] = useState<AssetModel[]>([])
  const [selectedAssets, setSelectedAssets] = useState<AssetModel[]>([])
  const [asset, setAsset] = useState<AssetModel>()
  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState<ERC20Amount>({})

  const sequenceWallet = useSequence()
  let indexer: any

  useEffect(() => {
    
    (async () => {
      if(loaded) return

      indexer = new sequence.indexer.SequenceIndexerClient(sequence.indexer.SequenceIndexerServices.POLYGON_MUMBAI)
      if(ether.account) {
        // console.log('account: ', ether.account)
        const tokens = await indexer.getTokenBalances({
          accountAddress: ether.account,
          includeMetadata: true
        })
  
        setAssets(tokens.balances.map((asset: any) => {
          return {
            contractAddress: asset.contractAddress,
            contractType: asset.contractType,
            tokenId: asset.tokenID,
            balance: asset.balance,
            name: asset.contractInfo?.name,
            symbol: asset.contractInfo?.symbol,
            chain: {
              id: asset.chainId,
              name: 'mumbai'
            }
          } as AssetModel
        }))

        setLoaded(true)
      }

    }) ()

  }, [sequenceWallet, loaded, ether])

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
        <strong>{`Bundle #${prop.selectedBundleId}`}</strong>
      </div>
    )
  }

  const onHandleAssetSelected = (asset: AssetModel) => {
    console.log({asset, bundleId: prop.selectedBundleId})
    setAsset(asset)
    setSelectedAssets([...selectedAssets, asset])
    setAssets(assets.filter(i => i !== asset))
  }

  const onHandleAssetUnselected = (asset: AssetModel) => {
    setSelectedAssets(selectedAssets.filter((i) => i !== asset))
    setAssets([asset, ...assets])
  }

  const SelectedAssets = () => {
    return (
      <div className='z-drawer-add-item'>
        <H4>Selected items</H4>
        <div>
        {selectedAssets.map((asset) => {
          return (
            <NFTCard amount={amount} selected={true} setAmount={(address: string, amount: number) => setAmount({[address]: amount})} key={asset.tokenId as string} asset={asset} onClick={() => onHandleAssetUnselected(asset)} />
          )
        })}
        </div>
      </div>
    )
  }

  // const onDeposit = async () => {
  //   console.log({asset, amount})

  //   try {
  //     setIsLoading(true)

  //     const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  //     await provider.send("eth_requestAccounts", []);
  //     const signer = provider.getSigner();

  //     const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)

  //     let account = await signer.getAddress()

  //     const gasPrice = await provider.getGasPrice()
  //     const gas_price = Math.round(gasPrice.toNumber() * 1.2)
  //     console.log({ gas_price })

  //     // let deposit: any
  //     let abiERC20 = erc20abi
  //     let abiERC721 = erc721abi
  //     let abiERC1155 = erc1155abi

  //     let parseAmt: any, appContract: any, estimate: any
      
  //     for (let ass of selectedAssets) {
  //       switch (ass?.contractType) {
  //         case "ERC20":
  //           parseAmt = ethers.utils.parseUnits(`${amount[String(ass.contractAddress)]}`, 'ether');
  //           appContract = new ethers.Contract(ass.contractAddress as string, abiERC20, signer)
  //           await appContract.approve(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER, parseAmt)
  //           estimate = await contract.estimateGas.depositERC20(ass.contractAddress, parseAmt, prop.selectedBundleId, ass.name)
  //           console.log({estimate: BigInt(estimate)})
  //           await contract.depositERC20(ass.contractAddress, parseAmt, prop.selectedBundleId, ass.name, {
  //             gasPrice: gas_price,
  //             gasLimit: Math.round(estimate.toNumber() * 2)
  //           })
  //           break;
  //         case "ERC721":
  //           appContract = new ethers.Contract(ass.contractAddress as string, abiERC721, signer)

  //           const is721Allowed = await appContract.isApprovedForAll(account, process.env.REACT_APP_CONTRACT_ASSET_WRAPPER)
  //           if(!is721Allowed) {
  //             await appContract.setApprovalForAll(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER, true)
  //           }
            
  //           estimate = await contract.estimateGas.depositERC721(ass.contractAddress, ass.tokenId, prop.selectedBundleId, ass.name)

  //           await contract.depositERC721(
  //             ass.contractAddress, 
  //             ass.tokenId,
  //             prop.selectedBundleId,
  //             ass.name)

  //           break;
  //         case "ERC1155":
  //           parseAmt = amount[String(ass.contractAddress)]
  //           // parseAmt = ethers.utils.parseUnits(`${amount[String(ass.contractAddress)]}`, 'ether');
  //           appContract = new ethers.Contract(ass.contractAddress as string, abiERC1155, signer)
  //           let is1155Allowed = appContract.isApprovedForAll(account, process.env.REACT_APP_CONTRACT_ASSET_WRAPPER)
  //           if(!is1155Allowed) {
  //             await appContract.setApprovalForAll(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER, true)
  //           }
            
  //           estimate = await contract.estimateGas.depositERC1155(ass.contractAddress, ass.tokenId, parseAmt, prop.selectedBundleId, "ERC1155")
            
  //           await contract.depositERC1155(ass.contractAddress, ass.tokenId, parseAmt, prop.selectedBundleId, "ERC1155", {
  //             gasPrice: gas_price,
  //             gasLimit: Math.round(estimate.toNumber() * 2)
  //           })
  //           break;   
  //       }
  //     }
  //     // var gas_estimate = await deposit.estimateGas({ from: account })
  //     // gas_estimate = Math.round(gas_estimate * 1.2); 

  //     // console.log({account, gas_price, gas_estimate})

  //     // deposit.se


  //   } catch (e) {
  //     console.log(e)
  //   } finally {
  //     setTimeout(async () => {
  //       indexer = new sequence.indexer.SequenceIndexerClient(sequence.indexer.SequenceIndexerServices.POLYGON_MUMBAI)
  //       const tokens = await indexer.getTokenBalances({
  //         accountAddress: ether.account,
  //         includeMetadata: true
  //       })
  //       setAssets(tokens.balances.map((asset: any) => {
  //         return {
  //           contractAddress: asset.contractAddress,
  //           contractType: asset.contractType,
  //           tokenId: asset.tokenID,
  //           balance: asset.balance,
  //           name: asset.contractInfo?.name,
  //           symbol: asset.contractInfo?.symbol,
  //           chain: {
  //             id: asset.chainId,
  //             name: 'mumbai'
  //           }
  //         } as AssetModel
  //       }))
  //       setIsLoading(false)
  //     }, 5000)
  //   }
  // }

  return (
    <Drawer
      onClose={prop.handleClose}
      title={ether.account ? <WalletConnected /> : <WalletNotConnected />}
      isOpen={prop.isOpen}
      position={Position.RIGHT}
      autoFocus={true}
      canOutsideClickClose={false}
      size={500}
    >
      <div className='z-drawer scroll'>

      <Tabs
          animate={true}
          key={"horizontal"}
          renderActiveTabPanelOnly={true}
          vertical={false}
      >
          <Tab id="rx" title="ERC20" panel={<TabERC20 selectedBundleId={prop.selectedBundleId} />} />
          <Tab title="NFTs" panel={<TabNFT selectedBundleId={prop.selectedBundleId} />} />
      </Tabs>
      
        {/* <SelectedAssets />
        <Button loading={isLoading} large={true} className="w-100 mb-5" text='Deposit' intent='primary' onClick={() => onDeposit()} />
        <div>
        {assets.map((asset) => {
          return (
            <NFTCard amount={amount} selected={false} setAmount={(address: string, amount: number) => setAmount({[address]: amount})} key={asset.tokenId as string} asset={asset} onClick={() => onHandleAssetSelected(asset)} />
          )
        })}
        </div> */}
      </div>
    </Drawer>
  )
}

export default WalletItemDrawer