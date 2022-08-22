import * as React from 'react';
import { Button, Card, Elevation } from "@blueprintjs/core";

type AssetDataProp = {
  title: string,
  description: string
  onClick: any
  asset: any
}

const ListedProductBox: React.FC<AssetDataProp> = (prop: AssetDataProp) => {
  return (
    <div className="z-box">
      <div className="z-box-inner">
        <div className='z-box-header'>
          {prop.description}
        </div>

        <div className="z-box-content">
          <ul>
                {<li>ERC20: {prop.asset.bundleERC20.length}</li>}
                {<li>ERC721: {prop.asset.bundleERC721.length}</li>}
                {<li>ERC1155: {prop.asset.bundleERC1155.length}</li>}
              </ul>
        </div>
        <div className="z-box-footer">
          <Button intent="primary" text={`BUY ${prop.asset.price} MATIC`} onClick={prop.onClick} />
        </div>
      </div>
    </div>
  )
}

export default ListedProductBox