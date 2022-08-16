import * as React from 'react';
import {useState} from 'react'
import { Container, Row, Col } from 'react-grid-system';
import { Link } from "react-router-dom";
import { InputGroup, Card, Icon, Button } from '@blueprintjs/core'

const NodeAccount = () => {

  const [peerId, setPeerId] = useState('')


  const onPeerIdChanged =(event: any) => setPeerId(event.target.value)

  return (
    <Container fluid>
      <Row style={{ height: '80px' }} align="center">&nbsp;</Row>
      <Row align="center">
        <Col sm={3}>&nbsp;</Col>
        <Col sm={5}>
          <InputGroup
              large={true}
              leftElement={<Icon icon="user" />}
              onChange={onPeerIdChanged}
              value={peerId.toString()}
          />
        </Col>
        <Col sm={4}>
          <Button large={true} intent="success" text="Connect" />
        </Col>
      </Row>
      <Row style={{ height: '40px' }} align="center">
        <Col sm={3}>&nbsp;</Col>
        <Col sm={4}>
          No shop peer Id? <Link to="/">Register new node</Link>
        </Col>
      </Row>

    </Container>
  )
}

export default NodeAccount