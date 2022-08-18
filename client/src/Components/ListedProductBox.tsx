import * as React from 'react';
import { Card, Elevation } from "@blueprintjs/core";

import UnlistingWithDialog from './UnlistingWithDialog'

type AssetDataProp = {
  title: string,
  description: string
}

const ListedProductBox: React.FC<AssetDataProp> = (data: AssetDataProp) => {
  return (
    <Card elevation={Elevation.TWO}>
      <h3>{data.title}</h3>
      <p>
        {data.description}
      </p>
      <UnlistingWithDialog buttonText="Unlist" title={data.title} />
    </Card>
  )
}

export default ListedProductBox