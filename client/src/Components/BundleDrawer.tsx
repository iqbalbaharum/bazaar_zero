import { Card, Drawer, Elevation, H5, Position } from "@blueprintjs/core"
import { ethers } from "ethers"
import { Col, Row } from "react-grid-system"

interface Prop {
  asset: any,
  isOpen: boolean,
  handleClose: any,
}

const BundleDrawer = (prop: Prop) => {

  console.log(prop)

  return (
    <Drawer
      title={`Bundle #${prop.asset.tokenID}`}
      isOpen={prop.isOpen}
      position={Position.RIGHT}
      autoFocus={true}
      size={500}
      onClose={prop.handleClose}
    >
      <Row style={{ padding: '20px'}}>
        {prop.asset.bundles.bundleERC20.map((d, index) => {
          return (
            <Col sm={12} key={index}>
              <Card elevation={Elevation.TWO} className='table-list mt-5'>
              <H5>{`${d.title}`}</H5>
              <div className='bp4-text-small bp4-text-muted'>{d.tokenAddress as string}</div>
              <div className='bp4-text-small bp4-text-muted'>Amount: { d.amount }</div>
              </Card>
            </Col>
          )
        })}

        {prop.asset.bundles.bundleERC721.map((d, index) => {
          return (
            <Col sm={12} key={index}>
              <Card elevation={Elevation.TWO} className='table-list mt-xl'>
              <H5>{d.title}</H5>
              <div className='bp4-text-small bp4-text-muted'>{`${d.tokenAddress} (${d.tokenId})`}</div>
              <div className='bp4-text-small bp4-text-muted'>ERC721</div>
              </Card>
            </Col>
          )
        })}

        {prop.asset.bundles.bundleERC1155.map((d, index) => {
          return (
            <Col sm={12} key={index}>
              <Card elevation={Elevation.TWO} className='table-list mt-xl'>
              <H5>{d.title}</H5>
              <div className='bp4-text-small bp4-text-muted'>{`${d.tokenAddress} (${d.tokenId})`}</div>
              <div className='bp4-text-small bp4-text-muted'>ERC1155</div>
              <div className='bp4-text-small bp4-text-muted'>Amount: { d.amount }</div>
              </Card>
            </Col>
          )
        })}
      </Row>
    </Drawer>
  )
}

export default BundleDrawer