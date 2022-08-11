import * as React from 'react';
import { Button, Card, Elevation, Classes } from "@blueprintjs/core";

type AssetDataProp = {
  title: string,
  description: string,
  type: string
}

export const AssetBox: React.FC<AssetDataProp> = (data: AssetDataProp) => {
  return (
    <Card interactive={true} elevation={Elevation.TWO}>
      <h5><a href="#">{data.title}</a></h5>
      <p><b>Type: </b>{data.type}</p>
      <Button intent="danger" rightIcon="arrow-right">Sell Asset</Button>
    </Card>
  )
}

export default AssetBox