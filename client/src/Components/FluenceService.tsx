import { sequence } from '0xsequence';
import * as React from 'react';
import { useEffect } from 'react'
import useSequence from '../Hook/useSequence';
import { registerShopService } from '../_aqua/node';
import { Fluence } from '@fluencelabs/fluence';
import { ethers } from 'ethers';
import AssetWrapperAbi from "../artifacts/AssetWrapper.json"
interface ProductItem {
  address: string
  id: string
  price: number
  title: string
  peerId: string,
  bundleERC20: any[],
  bundleERC721: any[],
  bundleERC1155: any[]
}

const FluenceService = () => {
  
  const sequenceWallet = useSequence()

  useEffect(() => {

    const getItems = async() => {

      if(!Fluence.getStatus().isConnected) { return }

      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)

      const indexer = new sequence.indexer.SequenceIndexerClient(sequence.indexer.SequenceIndexerServices.POLYGON_MUMBAI)

      const arrAssets: ProductItem[] = []

      if(sequenceWallet.account) {
        const wrappedNFTs = await indexer.getTokenBalances({
          accountAddress: sequenceWallet.account,
          includeMetadata: true,
          contractAddress: process.env.REACT_APP_CONTRACT_ASSET_WRAPPER
        })

        for (let asset of wrappedNFTs.balances) {

          const bundles = await contract.getBundles(asset.tokenID)
          
          const price = ethers.utils.formatEther(bundles.price)
          
          if(parseFloat(price) > 0) {
            
            arrAssets.push({
              address: asset.contractAddress,
              id: asset.tokenID,
              title: `Bundle #${asset.tokenID}`,
              price: parseFloat(price),
              peerId: Fluence.getStatus().peerId as string,
              bundleERC20: bundles.bundleERC20.map(m => {
                return {
                  amount: ethers.utils.formatEther(m.amount),
                  tokenAddress: m.tokenAddress,
                  title: m.title,
                }
              }),
              bundleERC721: bundles.bundleERC721.map(m => {
                return {
                  tokenId: m.tokenId.toString(),
                  tokenAddress: m.tokenAddress,
                  title: m.title,
                  amount: 1
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
            })
          }
        }

        console.log(arrAssets)

        return arrAssets
        
      } else {
        return []
      }
    }

    try {
      registerShopService({
        list: async () => {
          const items = await getItems()
          return items as ProductItem[]
        },
        list_by_keyword: async (search: string) => {
          const items = await getItems()
          return items as ProductItem[]
        }
      })

    } catch(e) {
      console.log(e)
    }
    
  }, [sequenceWallet])

  return (<div></div>)
}

export default FluenceService