/* eslint-disable @typescript-eslint/no-explicit-any -- Allow usage of 'any' type for flexibility in form handling and third-party integrations */
import React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface AddTagModalProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function AddTagModal({ open, handleClose, title, children }: AddTagModalProps): React.JSX.Element {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Box id="modal-modal-description" sx={{ mt: 2 }}>
          {children}
        </Box>
      </Box>
    </Modal>
  );
}
