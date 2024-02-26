import { Box, Button, Modal, Typography } from "@mui/material";
import { ReactElement } from "react";

interface ModalWrapperProps {
  children?: ReactElement[] | ReactElement | any
  open: boolean
  setIsOpen: (open: boolean) => any
}

function ModalWrapper({ children, open, setIsOpen }: ModalWrapperProps) {
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
          {children}
          <Button onClick={() => setIsOpen(false)}>X</Button>
        </Box>
      </Modal>
    </>
  );
}

export default ModalWrapper;