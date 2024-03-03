import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";
import FormGroupCols from "../layout/FormGroupCols";
import FormGroupRows from "../layout/FormGroupRows";

interface PopupMessageProps {
  message: string
  open: boolean
  setIsOpen: (open: boolean) => any
  actionButton?: () => any
  actionMessage?: string
  hideX?: boolean
}

function PopupMessage({ message, open, setIsOpen, actionButton, actionMessage, hideX = false }: PopupMessageProps) {
  return (
    <>
      <Modal
        open={open}
        sx={{
          justifySelf: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Box sx={{
          justifySelf: 'center',
          backgroundColor: 'white',
          padding: '15px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <FormGroupCols>
            {!hideX &&
              <div style={{ paddingLeft: '200px' }}>
                <Button onClick={() => setIsOpen(false)}>X</Button>
              </div>
            }
            <Typography sx={{ marginRight: '10px', fontSize: '1.25rem' }}>{message}</Typography>
            {actionButton !== undefined && actionMessage !== undefined &&
              <Button onClick={actionButton}>{actionMessage}</Button>
            }
          </FormGroupCols>

        </Box>
      </Modal>
    </>
  );
}

export default PopupMessage;