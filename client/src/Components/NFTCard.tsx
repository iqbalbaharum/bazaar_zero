import * as React from 'react';
import { Card, Elevation, FormGroup, NumericInput } from "@blueprintjs/core";
import { Col, Row } from 'react-grid-system';
import { AssetModel } from './WalletItemDrawer';
import { BigNumber, ethers } from 'ethers'

type Prop = {
  asset: AssetModel,
  onClick: any,
  setAmount: any,
  selected: boolean,
  amount: any
}

const NFTCard: React.FC<Prop> = (prop: Prop) => {
  return (
    <>
      <Card elevation={Elevation.TWO} className='table-list' onClick={prop.onClick} interactive={true}>
        <Row>
          <Col sm={2}>
            <img src="https://via.placeholder.com/60" alt={prop.asset.name as string} />
          </Col>
          <Col>
            <div>{prop.asset.name as string}</div>
            <div className='bp4-text-small bp4-text-muted'>{prop.asset.contractType as string}</div>
            {(prop.asset.contractType === 'ERC20' || prop.asset.contractType === 'ERC1155') && 
            <div className='bp4-text-small bp4-text-muted'>Balance: {prop.asset.contractType === 'ERC20' ? ethers.utils.formatEther(ethers.BigNumber.from(prop.asset.balance)) : prop.asset.balance}</div>
            }
          </Col>
        </Row>
      </Card>
      {(prop.asset?.contractType === 'ERC20' || prop.asset?.contractType === 'ERC1155') && prop.selected && 
        <FormGroup
            label="Amount"
            labelFor="text-input"
            labelInfo="(required)"
        >
          <NumericInput value={prop.amount[String(prop.asset.contractAddress)]} onValueChange={val => prop.setAmount(prop.asset.contractAddress,val)}/>
        </FormGroup>}
    </>
  )
}

export default NFTCard