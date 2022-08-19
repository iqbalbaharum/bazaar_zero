import * as React from 'react';
import { Card, Elevation } from "@blueprintjs/core";

type AssetDataProp = {
  title: string,
  description: string
}

const ListedProductBox: React.FC<AssetDataProp> = (prop: AssetDataProp) => {
  return (
    <Card elevation={Elevation.FOUR} className="z-box" interactive={true}>
      <div className='z-box-content'>
        asd
      </div>
      <div className="z-box-footer">
        {prop.title}
      </div>
    </Card>
  )
}

export default ListedProductBox