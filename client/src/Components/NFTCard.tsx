import * as React from 'react';
import { Card, Elevation } from "@blueprintjs/core";
import { Col, Row } from 'react-grid-system';
import { AssetModel } from './WalletItemDrawer';

type Prop = {
  asset: AssetModel,
  onClick: any
}

const NFTCard: React.FC<Prop> = (prop: Prop) => {
  return (
    <Card elevation={Elevation.TWO} className='table-list' onClick={prop.onClick} interactive={true}>
      <Row>
        <Col sm={2}>
          <img src="https://via.placeholder.com/60" alt={prop.asset.name as string} />
        </Col>
        <Col>
          <div>{prop.asset.name as string}</div>
          <div className='bp4-text-small bp4-text-muted'>{prop.asset.contractType as string}</div>
        </Col>
      </Row>
    </Card>
  )
}

export default NFTCard