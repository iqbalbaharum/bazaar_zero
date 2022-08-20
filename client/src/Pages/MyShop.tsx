import * as React from 'react';
import { useState, useEffect } from 'react'

import { Container, Row, Col } from 'react-grid-system';
import { Button } from '@blueprintjs/core';
import ListedProductBox from '../Components/ListedProductBox';
import CreateBoxButton from '../Components/CreateBoxButton';
import WalletItemDrawer from '../Components/WalletItemDrawer';
import CreateBoxDialog from '../Components/CreateBoxDialog';
import SellButtonWithDialog from '../Components/SellButtonWithDialog'
import { sequence } from '0xsequence';
import { ethers } from 'ethers';
import useSequence from '../Hook/useSequence';
import AssetWrapperAbi from "../artifacts/AssetWrapper.json"

import logo from '../assets/zero-1.png';

const MyShop = () => {

  const [open, isOpen] = useState(false)
  const [createDialogOpen, isCreateDialogOpened] = useState(false)
  const [nfts, setNFTs] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const [selectedBundleId, setSelectedBundleId] = useState('')

  const sequenceWallet = useSequence()

  useEffect(() => {
    
    (async () => {
      if(loaded) return

      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)

      const indexer = new sequence.indexer.SequenceIndexerClient(sequence.indexer.SequenceIndexerServices.POLYGON_MUMBAI)
      if(sequenceWallet.account) {
        const wrappedNFTs = await indexer.getTokenBalances({
          accountAddress: sequenceWallet.account,
          includeMetadata: true,
          contractAddress: process.env.REACT_APP_CONTRACT_ASSET_WRAPPER
        })
        console.log({wrappedNFTs})

        const arrAssets: any = []
        for (let asset of wrappedNFTs.balances) {
          const bundles = await contract.getBundles(asset.tokenID)

          console.log({bundles})
          arrAssets.push({...asset, bundles: {
            price: ethers.utils.formatEther(bundles.price),
            bundleERC20: bundles.bundleERC20.map(m => {
              return {
                amount: ethers.utils.formatEther(m.amount),
                tokenAddress: m.tokenAddress,
                title: m.title
              }
            }),
            bundleERC721: bundles.bundleERC721.map(m => {
              return {
                tokenId: m.tokenId.toString(),
                tokenAddress: m.tokenAddress,
                title: m.title
              }
            }),
            bundleERC1155: bundles.bundleERC1155.map(m => {
              return {
                tokenId: m.tokenId.toString(),
                tokenAddress: m.tokenAddress,
                title: m.title,
                amount: m.amount.toString()
              }
            })
          }})
        }
        setNFTs(arrAssets)
        console.log({arrAssets})
        setLoaded(true)
      }

    }) ()

  }, [sequenceWallet, loaded])

  const handleClose = () => {
    isOpen(false)
  }

  const toggleDrawer = (bundleId: string) => {
    if(!open) {
      console.log(bundleId)
      setSelectedBundleId(bundleId)
    }

    isOpen(!open)
  }

  const toggleCreateDialog = () => {
    isCreateDialogOpened(!createDialogOpen)
  }

  const onSell = async (bundleId, price) => {
    console.log("sell: " + price)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const gasPrice = await provider.getGasPrice()
      const gas_price = Math.round(gasPrice.toNumber() * 1.2)
      console.log({ gas_price })

      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)
      const estimate = await contract.estimateGas.sell(bundleId, ethers.utils.parseUnits(price, 'ether'), sequenceWallet.account)
      // console.log({estimate: BigInt(estimate)})
      await contract.sell(bundleId, ethers.utils.parseUnits(price, 'ether'), sequenceWallet.account, {
        gasPrice: gas_price,
        gasLimit: Math.round(estimate.toNumber() * 2)
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div style={{height: '100%'}}>
      <img style={{display: 'flex', position: 'absolute', bottom: 0, zIndex: -999, opacity: 0.1, width: '100%', maxWidth: '100%', maxHeight: '100%'}} src={logo} alt="Bazaar Zero"/>
      <Container>
      <Row className="mt-xl">
        <Col sm={3}>
          <CreateBoxButton onClick={toggleCreateDialog} />
        </Col>
        
        {nfts.map((nft) => 
          (
            <Col sm={3} key={nft.tokenID}>
            <ListedProductBox
              asset={nft}
              title={nft.tokenMetadata?.name as string}
              description={`Bundle #${nft.tokenID}`}
              onClick={() => toggleDrawer(nft.tokenID)} />
              <br />
              <SellButtonWithDialog bundleId={nft.tokenID} onSell={(bundleId, price) => onSell(bundleId, price)} buttonText='Sell' />
            </Col>
          )
        )}

        <CreateBoxDialog isOpen={createDialogOpen} handleClose={toggleCreateDialog} />
        <WalletItemDrawer handleClose={handleClose} isOpen={open} selectedBundleId={selectedBundleId} />
      </Row>
    </Container>
  </div>
  )
}

export default MyShop