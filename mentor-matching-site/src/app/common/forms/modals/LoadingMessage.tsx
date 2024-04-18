import { Box, Modal, Typography } from "@mui/material";
import './LoadingMessage.css'

interface LoadingMessageProps {
  message: string
  loading: boolean
  timeoutSeconds?: number
}

function LoadingMessage({ message, loading, timeoutSeconds }: LoadingMessageProps) {
  return (
    <>
      <Modal
        open={loading}
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
          <div className="loader"></div>
        </Box>
      </Modal>
    </>
  );
}

export default LoadingMessage;