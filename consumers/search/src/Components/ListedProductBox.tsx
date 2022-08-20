import * as React from 'react';
import { Button, Card, Elevation } from "@blueprintjs/core";

type AssetDataProp = {
  title: string,
  description: string
  onClick: any
}

const ListedProductBox: React.FC<AssetDataProp> = (prop: AssetDataProp) => {
  return (
    <Card elevation={Elevation.FOUR} className="z-box" interactive={true} onClick={prop.onClick}>
      <div className='z-box-content'>
        {prop.description}
      </div>
      <div className="z-box-footer">
        <Button intent="primary" text="Buy" onClick={prop.onClick} />
      </div>
    </Card>
  )
}

export default ListedProductBox