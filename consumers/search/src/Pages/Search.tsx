import * as React from 'react';
import {useState} from 'react'
import { Container, Row, Col } from 'react-grid-system';
import { InputGroup, Icon, Button } from '@blueprintjs/core'
import { retrieve_products_by_keyword_from_network, retrieve_products_from_network } from '../_aqua/node';
import ListedProductBox from '../Components/ListedProductBox';
import { ethers } from 'ethers'
import AssetWrapperAbi from "../artifacts/AssetWrapper.json"
import { Fluence } from '@fluencelabs/fluence';
export  interface AssetModel {
  address: string
  id: string
  title: string
  price: number,
  peerId: string
}

const Search = () => {

  const [search, setSearchText] = useState('')
  const [products, setProducts] = useState<AssetModel[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const onSearchChanged =(event: any) => setSearchText(event.target.value)

  const onHandleSearch = async () => {

    if(!Fluence.getStatus().isConnected) { return }

    setProducts([])
    
    setIsLoading(true)
    let res = await retrieve_products_by_keyword_from_network(
      "DosaSeller12D3KooWD5BRx2Ly9Gfw9hsYoZGcwAN4QpEND8SXVd5GSejZmZ65",
      search
    )
    console.log(res)
    setProducts(res as AssetModel[])
    setIsLoading(false)
  }

  const onHandlePurchase = async (asset: AssetModel) => {
    if(!(window as any).ethereum) { return }

    try {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)
      
      console.log('contract')

      const estimate = await contract.estimateGas.buy(
        parseInt(asset.id),
        { value: ethers.utils.parseEther("1")  }
      )

      console.log('contract')

      console.log('estimate', estimate)
      
      const gasPrice = await provider.getGasPrice()
      const gas_price = Math.round(gasPrice.toNumber() * 1.2)

      await contract.buy(
        parseInt(asset.id),
        {
          gasPrice: gas_price,
          gasLimit: Math.round(estimate.toNumber() * 2),
          value: ethers.utils.parseEther("1") 
        }
      )
    } catch(e) {
      console.log(e)
    }
    
  }

  return (
    <Container fluid>
      <Row align="center" justify="center">&nbsp;</Row>
      <Row style={{ height: '80px' }} align="center" justify="center">
        <Col sm={3}>&nbsp;</Col>
        <Col sm={5}>
          <InputGroup
              large={true}
              leftElement={<Icon icon="user" />}
              onChange={onSearchChanged}
              value={search.toString()}
              disabled={isLoading}
          />
        </Col>
        <Col sm={4}>
          <Button large={true} intent="success" text="Search" onClick={onHandleSearch} loading={isLoading}/>
        </Col>
      </Row>
      <Row style={{ height: '40px' }} align="center">
        {products.map((asset) => {
          return (
            <Col sm={2} key={`${asset.peerId}${asset.id}`} className="mt-xl">
              <ListedProductBox
                title={asset.title as string}
                description={`Bundle #${asset.id}`}
                onClick={() => onHandlePurchase(asset)}
                asset={asset}
              />
            </Col>
          )
        })}
        <Col sm={1}>&nbsp;</Col>
      </Row>

    </Container>
  )
}

export default Search