import * as React from 'react';
import { Button, Card, Elevation, Classes } from "@blueprintjs/core";

import SellButtonWithDialog from './SellButtonWithDialog'

type AssetDataProp = {
  title: string,
  description: string,
  type: string
}

const AssetBox: React.FC<AssetDataProp> = (data: AssetDataProp) => {
  return (
    <Card interactive={true} elevation={Elevation.TWO}>
      <h5><a href="#">{data.title}</a></h5>
      <p><b>Type: </b>{data.type}</p>
      <SellButtonWithDialog buttonText="Sell" title={data.title} />
    </Card>
  )
}

export default AssetBox