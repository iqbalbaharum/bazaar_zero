import * as React from 'react';
import {useState} from 'react'

import { H1 } from '@blueprintjs/core'
import { Container, Row, Col } from 'react-grid-system';
import ListedProductBox from '../Components/ListedProductBox';
import CreateBoxButton from '../Components/CreateBoxButton';
import WalletItemDrawer from '../Components/WalletItemDrawer';
import CreateBoxDialog from '../Components/CreateBoxDialog';

const MyShop = () => {

  const [open, isOpen] = useState(false)
  const [createDialogOpen, isCreateDialogOpened] = useState(false)

  const handleClose = () => {
    isOpen(false)
  }

  const toggleDrawer = () => {
    isOpen(!open)
  }

  const toggleCreateDialog = () => {
    isCreateDialogOpened(!createDialogOpen)
  }

  const ProductList = () => {
    return (
      <Col sm={4}>
        <ListedProductBox 
          title='Bundle #1'
          description='Phasellus lobortis cursus urna, at blandit dui pretium eget. Nam luctus risus sed libero ullamcorper, id ornare nisi eleifend. Cras quis convallis libero, viverra semper mi. Vestibulum facilisis tortor ut turpis dapibus tincidunt. Vivamus nibh lectus, imperdiet ac arcu id, lacinia venenatis odio. Ut pulvinar velit non quam volutpat, non accumsan felis malesuada. Sed consectetur accumsan metus a volutpat. '
          onClick={toggleDrawer} />
      </Col>
    )
  }

  return (
    <Container>
      <Row style={{ height: '80px' }} align="center"><H1>My Shelves</H1></Row>
      <Row>
        <CreateBoxButton onClick={toggleCreateDialog} />
        <CreateBoxDialog isOpen={createDialogOpen} handleClose={toggleCreateDialog} />
        <ProductList />
        <WalletItemDrawer handleClose={handleClose} isOpen={open} />
      </Row>
    </Container>
  )
}

export default MyShop