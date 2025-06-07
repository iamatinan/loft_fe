/* eslint-disable import/newline-after-import -- a */
/* eslint-disable react/react-in-jsx-scope -- a*/
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style -- aa */
/* eslint-disable @typescript-eslint/no-confusing-void-expression -- a */
/* eslint-disable @typescript-eslint/await-thenable -- a*/
/* eslint-disable @typescript-eslint/no-unused-vars -- a*/
/* eslint-disable @typescript-eslint/no-unsafe-argument -- a*/
/* eslint-disable no-promise-executor-return  -- a*/
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- aa */
/* eslint-disable no-implicit-coercion  -- aa*/
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- Allow unsafe assignments for flexibility with third-party libraries and dynamic form handling */
/* eslint-disable no-console -- Allow console statements for debugging and error logging in development */
/* eslint-disable @typescript-eslint/no-floating-promises -- Allow floating promises for async effects and event handlers */
/* eslint-disable @typescript-eslint/no-unsafe-call -- Allow unsafe calls for flexibility with third-party libraries and dynamic form handling */
/* eslint-disable @typescript-eslint/no-explicit-any -- Allow usage of 'any' type for flexibility in form handling and third-party integrations */
import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};
export function AddInventoryModal({ open, handleClose, title, children }: any): React.JSX.Element {
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {children}
        </Typography>
        <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}