import * as React from 'react';
import { Card, Elevation } from "@blueprintjs/core";

import SellButtonWithDialog from './SellButtonWithDialog'

type AssetDataProp = {
  title: string,
  description: string,
  type: string
}

const AssetBox: React.FC<AssetDataProp> = (data: AssetDataProp) => {
  return (
    <Card elevation={Elevation.TWO}>
      <h5><a href="">{data.title}</a></h5>
      <p><b>Type: </b>{data.type}</p>
      <SellButtonWithDialog bundleId={data.title} onSell={() => console.log('sell')} buttonText="Add To Bundle" title={data.title} />
    </Card>
  )
}

export default AssetBox