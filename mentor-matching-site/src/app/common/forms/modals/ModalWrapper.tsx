import { Box, Button, Modal } from "@mui/material";
import { ReactElement } from "react";

interface ModalWrapperProps {
    children: ReactElement[] | ReactElement;
    open: boolean;
    setIsOpen: (open: boolean) => void;
}

function ModalWrapper({ children, open, setIsOpen }: ModalWrapperProps) {
    return (
        <Modal
            open={open}
            onClose={() => setIsOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    backgroundColor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    borderRadius: '8px',
                    position: 'relative',
                }}
            >
                {children}
                <Button
                    onClick={() => setIsOpen(false)}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'grey.600',
                        fontSize: '1.5rem',
                        '&:hover': {
                            color: 'grey.800',
                            backgroundColor: 'transparent',
                        }
                    }}
                >
                    X
                </Button>
            </Box>
        </Modal>
    );
}

export default ModalWrapper;