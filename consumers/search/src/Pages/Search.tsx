import * as React from 'react';
import {useState} from 'react'
import { Container, Row, Col } from 'react-grid-system';
import { InputGroup, Icon, Button } from '@blueprintjs/core'
import { get_products } from '../_aqua/node';
import ListedProductBox from '../Components/ListedProductBox';
import { ethers } from 'ethers'
import AssetWrapperAbi from "../artifacts/AssetWrapper.json"
export  interface AssetModel {
  address: string
  id: string
  title: string
  price: number
}

const Search = () => {

  const [search, setSearchText] = useState('')
  const [products, setProducts] = useState<AssetModel[]>([])

  const onSearchChanged =(event: any) => setSearchText(event.target.value)

  const onHandleSearch = async () => {
    let res: AssetModel[] = await get_products("12D3KooWL1sFtSPFxpQefntrmxQqkFc2NPBjeWZwR1PTX5xbkotF")
    setProducts(res)
  }

  const onHandlePurchase = async (asset: AssetModel) => {
    if(!(window as any).ethereum) { return }

    const provider = new ethers.providers.Web3Provider((window as any).ethereum, "any");
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ASSET_WRAPPER as string, AssetWrapperAbi.abi, signer)
      await contract.buy(
        parseInt(asset.id)
      )
  }

  return (
    <Container fluid>
      <Row style={{ height: '80px' }} align="center">&nbsp;</Row>
      <Row align="center">
        <Col sm={3}>&nbsp;</Col>
        <Col sm={5}>
          <InputGroup
              large={true}
              leftElement={<Icon icon="user" />}
              onChange={onSearchChanged}
              value={search.toString()}
          />
        </Col>
        <Col sm={4}>
          <Button large={true} intent="success" text="Search" onClick={onHandleSearch}/>
        </Col>
      </Row>
      <Row style={{ height: '40px' }} align="center">
        <Col sm={1}>&nbsp;</Col>
        {products.map((asset) => {
          return (
            <Col sm={2} key={asset.id} className="mt-xl">
              <ListedProductBox
                title={asset.title as string}
                description={`Bundle #${asset.id}`}
                onClick={() => onHandlePurchase(asset)} />
            </Col>
          )
        })}
        <Col sm={1}>&nbsp;</Col>
      </Row>

    </Container>
  )
}

export default Search