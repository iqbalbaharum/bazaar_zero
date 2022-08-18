import * as React from 'react';
import {useState, useCallback} from 'react'
import {DialogProps, Dialog, Button, Classes} from '@blueprintjs/core'

const UnlistingWithDialog: React.FC<Omit<DialogProps, "isOpen"> & { buttonText: string }> = ({ ...props }: Omit<DialogProps, "isOpen"> & { buttonText: string }) => {
  
  const [isOpen, setIsOpen] = useState(false)
  
  const handleClose = useCallback(() => setIsOpen(false), [])
  const handleButtonClick = useCallback(() => {
    setIsOpen(true)
  }, [])

  return (
    <div>
      <Button intent="warning" rightIcon="delete" onClick={handleButtonClick} text={props.buttonText} />
      <Dialog {...props} isOpen={isOpen} onClose={handleClose}>
        <div className={Classes.DIALOG_BODY}>
          Unlisted this product?
        </div>
        <DialogFooter handleClose={handleClose} />
      </Dialog>
    </div>
  )
}

function DialogFooter(props: { handleClose: (e: React.MouseEvent) => void }) {
  return (
      <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button intent="success" onClick={props.handleClose}>Yes</Button>
            <Button onClick={props.handleClose}>No</Button>
          </div>
      </div>
  );
}

export default UnlistingWithDialog