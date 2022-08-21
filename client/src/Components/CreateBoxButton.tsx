import * as React from 'react';
import { Card, Elevation, Icon, IconSize } from "@blueprintjs/core";

type Prop = {
  onClick?: any
}

const CreateBoxButton: React.FC<Prop> = (prop: Prop) => {

  return (
    <Card 
      elevation={Elevation.FOUR} 
      className="z-box" 
      interactive={true} 
      style={{textAlign:"center",backgroundColor: "black", color: "white"}}
      onClick={prop.onClick}
      >
      <div className="z-box-inner-central">
        <Icon icon="plus" size={IconSize.LARGE} />
        <p>Create Box</p>
      </div>
    </Card>
  )
}

export default CreateBoxButton