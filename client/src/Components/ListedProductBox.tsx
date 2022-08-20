import * as React from 'react';
import { Card, Elevation } from "@blueprintjs/core";

type AssetDataProp = {
  title: string,
  description: string
  onClick: any,
  asset: any
}

const ListedProductBox: React.FC<AssetDataProp> = (prop: AssetDataProp) => {
  return (
    <Card elevation={Elevation.FOUR} className="z-box" interactive={true} onClick={prop.onClick}>
      <div className='z-box-content'>
        {prop.description}
        <ul>
          {prop.asset?.bundles?.bundleERC20.length && <li>ERC20: {prop.asset.bundles?.bundleERC20.length}</li>}
          {prop.asset?.bundles?.bundleERC721.length && <li>ERC721: {prop.asset.bundles?.bundleERC721.length}</li>}
          {prop.asset?.bundles?.bundleERC1155.length && <li>ERC1155: {prop.asset.bundles?.bundleERC1155.length}</li>}
        </ul>
      </div>
      <div className="z-box-footer">
        {prop.title}
      </div>
    </Card>
  )
}

export default ListedProductBox