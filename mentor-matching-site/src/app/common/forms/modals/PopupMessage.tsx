import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";

interface PopupMessageProps {
  message: string
  open: boolean
  setIsOpen: (open: boolean) => any
}

function PopupMessage({ message, open, setIsOpen }: PopupMessageProps) {
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
          height: '100px',
          paddingLeft: '10px',
          paddingRight: '10px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography sx={{ marginRight: '10px', fontSize: '1.25rem' }}>{message}</Typography>
          <Button onClick={() => setIsOpen(false)}>X</Button>
        </Box>
      </Modal>
    </>
  );
}

export default PopupMessage;