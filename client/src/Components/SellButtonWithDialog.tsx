import * as React from 'react';
import {useState, useCallback} from 'react'
import {DialogProps, Dialog, Button, Classes, InputGroup, Icon} from '@blueprintjs/core'

const SellButtonWithDialog: React.FC<Omit<DialogProps, "isOpen"> & { buttonText: string, onSell: any, bundleId: any }> = ({ ...props }: Omit<DialogProps, "isOpen"> & { buttonText: string, onSell: any, bundleId: any }) => {
  
  const [isOpen, setIsOpen] = useState(false)
  const [price, setPrice] = useState(0)
  
  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])
  const handleButtonClick = useCallback(() => {
    setPrice(0)
    setIsOpen(true)
  }, [])

  const onPriceChanged =(event: any) => {
    setPrice(event.target.value)
  }

  const handleListing = () => {
    props.onSell(props.bundleId, price)
    setIsOpen(false)
  }

  return (
    <>
      <Button intent="danger" onClick={handleButtonClick} text={props.buttonText} />
      <Dialog {...props} isOpen={isOpen} onClose={handleClose}>
        <div className={Classes.DIALOG_BODY}>
          <InputGroup
              large={true}
              placeholder="0.0"
              leftElement={<Icon icon="tag" />}
              onChange={onPriceChanged}
              value={price.toString()}
          />
        </div>
        <DialogFooter handleClose={handleClose} handleListing={handleListing}  />
      </Dialog>
    </>
  )
}

function DialogFooter(props: { handleClose: (e: React.MouseEvent) => void, handleListing: (e: React.MouseEvent) => void }) {
  return (
      <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button intent="success" onClick={props.handleListing}>Start Listing</Button>
            <Button onClick={props.handleClose}>Cancel</Button>
          </div>
      </div>
  );
}

export default SellButtonWithDialog