import * as React from 'react';
import { useState, useEffect } from 'react'
import { Drawer, Button, Position, Divider, H4 } from "@blueprintjs/core";
import { useEthers } from '@usedapp/core';
import NFTCard from './NFTCard';
import useSequence from '../Hook/useSequence';
import { sequence } from '0xsequence';

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

const WalletItemDrawer: React.FC<Prop> = (prop: Prop) => {

  const ether = useEthers()
  const [assets, setAssets] = useState<AssetModel[]>([])
  const [selectedAssets, setSelectedAssets] = useState<AssetModel[]>([])
  const [loaded, setLoaded] = useState(false)

  const sequenceWallet = useSequence()

  useEffect(() => {
    
    (async () => {
      if(loaded) return

      const indexer = new sequence.indexer.SequenceIndexerClient(sequence.indexer.SequenceIndexerServices.MAINNET)
      if(ether.account) {
        const tokens = await indexer.getTokenBalances({
          accountAddress: '0x15f94245a4Ca9534Afbb018699c85F320c270721',
          includeMetadata: true
        })
  
        setAssets(tokens.balances.map((asset) => {
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
    setSelectedAssets([...selectedAssets, asset])
  }

  const onHandleAssetUnselected = (asset: AssetModel) => {
    setSelectedAssets(selectedAssets.filter((i) => i !== asset))
  }

  const SelectedAssets = () => {
    return (
      <div className='z-drawer-add-item'>
        <H4>Selected items</H4>
        <div>
        {selectedAssets.map((asset) => {
          return (
            <NFTCard key={asset.tokenId as string} asset={asset} onClick={() => onHandleAssetUnselected(asset)} />
          )
        })}
        </div>
      </div>
    )
  }

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

        <SelectedAssets />
        <Button large={true} className="w-100 mb-5" text='Deposit' intent='primary' />
        <div>
        {assets.map((asset) => {
          return (
            <NFTCard asset={asset} onClick={() => onHandleAssetSelected(asset)} />
          )
        })}
        </div>
      </div>
    </Drawer>
  )
}

export default WalletItemDrawer