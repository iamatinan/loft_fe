/* eslint-disable unicorn/filename-case -- a */
/* eslint-disable no-unused-vars -- a */
/* eslint-disable import/no-unresolved -- a*/
/* eslint-disable unicorn/filename-case -- a */
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
'use client';
import api from "@/utils/api";
import { Box, Button, Card, CardActions, CardContent, Modal, Typography } from "@mui/material";
import React from "react";
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


export function ConnectLineWithContact({ open, handleClose, contactId }: any): React.JSX.Element {
  const [contactData, setContactData] = React.useState<any>(null);
  const [lineProfile, setLineProfile] = React.useState<any[]>([]);
  const connectLineWithContact = async (contactIds: string, lineProfileId: string) => {
    try {
      const response = await api.patch(`/contact/connect-line/${contactIds}`, { lineProfileId });
      if (response.status === 200) {
        // sendDataToParent(true)
        // You can add additional logic here, like updating the UI or showing a success message
      } else {
        console.error('Failed to connect line with contact:', response.data);
      }
    } catch (error) {
      console.error('Error connecting line with contact:', error);
    }
  }

  const getContact = async () => {
    try {
      const resLineProfile = await api.get(`line`);
      const response = await api.get(`/contact/${contactId}`);
      if (!response.data) {
        throw new Error('Network response was not ok');
      }
      setLineProfile(resLineProfile.data);

      setContactData(response.data);

    } catch (error) {
      console.error('Error fetching contact data:', error);
      // Handle the error appropriately, e.g., show a notification or alert
    }
  }
  React.useEffect(() => {
    if (contactId) {
      getContact();
    }
  }, [contactId]);
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {"xxxxx"}
          {contactId}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {/* {children} */}
          {
            lineProfile.length > 0 ? (
              <>
                {lineProfile.map((item: any, index) => (
                  // <Card key={item._id} sx={{ mb: 2, p: 2 }}>
                  //   <Typography variant="body1">Line ID: {item.userId}</Typography>
                  //   <Typography variant="body2">Display Name: {item.displayName}</Typography>
                  //   <Typography variant="body2">Status Message: {item.statusMessage}</Typography>
                  //   <Typography variant="body2">Picture URL: {item.picPath}</Typography>
                  //   <img src={item.picPath} alt="Profile" style={{ width: '100px', height: '100px' }} />

                  // </Card>


                  <Card sx={{ maxWidth: 345 }}
                    key={item._id}>
                    {/* <CardMedia
                      sx={{ height: 140 }}
                      image={item.picPath}
                      title={item.displayName}
                    /> */}
                    <img src={item.picPath} alt="Profile" style={{ width: '100px', height: '100px' }} />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.displayName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {item.statusMessage}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={
                        () => {
                          connectLineWithContact(contactId, item._id);
                          handleClose();
                        }
                      }>เชื่อมต่อ</Button>
                    </CardActions>
                  </Card>
                ))}
              </>
            ) : null
          }
        </Typography>
        <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}