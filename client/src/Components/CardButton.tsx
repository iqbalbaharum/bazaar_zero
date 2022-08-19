import * as React from 'react';
import { Card, Elevation, Icon, IconSize } from "@blueprintjs/core";

type Prop = {
  onclick?: any
}

const CardButton: React.FC<Prop> = (data: Prop) => {
  return (
    <Card elevation={Elevation.FOUR} className="z-box" interactive={true} style={{textAlign:"center",backgroundColor: "black", color: "white"}}>
      <div className="z-box-inner">
        <Icon icon="plus" size={IconSize.LARGE} />
        <p>Create Box</p>
      </div>
    </Card>
  )
}

export default CardButton