import * as React from 'react';
import {useState} from 'react'
import { Container, Row, Col } from 'react-grid-system';
import { InputGroup, Icon, Button } from '@blueprintjs/core'
import { get_products } from '../_aqua/node';

const Search = () => {

  const [search, setSearchText] = useState('')
  const [products, setProducts] = useState<[]>([])

  const onSearchChanged =(event: any) => setSearchText(event.target.value)

  const onHandleSearch = async () => {
    console.log('hello')
    let res = await get_products("12D3KooWLAH8YNvtwxgfETy65Xm2RHZ9rPBGUfstBXHkfgk8dwvA")
    console.log(res)
  }

  return (
    <Container fluid>
      <Row style={{ height: '80px' }} align="center">&nbsp;</Row>
      <Row align="center">
        <Col sm={3}>&nbsp;</Col>
        <Col sm={5}>
          <InputGroup
              large={true}
              leftElement={<Icon icon="user" />}
              onChange={onSearchChanged}
              value={search.toString()}
          />
        </Col>
        <Col sm={4}>
          <Button large={true} intent="success" text="Search" onClick={onHandleSearch}/>
        </Col>
      </Row>
      <Row style={{ height: '40px' }} align="center">
      </Row>

    </Container>
  )
}

export default Search