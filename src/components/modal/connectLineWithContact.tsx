'use client';
import api from "@/utils/api";
import { Box, Button, Card, CardActions, CardContent, CardMedia, InputAdornment, Modal, OutlinedInput, Typography } from "@mui/material";
import axios from "axios";
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
  const connectLineWithContact = async (contactId: string, lineProfileId: string) => {
    try {
      const response = await api.patch(`/contact/connect-line/${contactId}`, { lineProfileId });
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
                {lineProfile.map((item: any) => (
                  // <Card key={item._id} sx={{ mb: 2, p: 2 }}>
                  //   <Typography variant="body1">Line ID: {item.userId}</Typography>
                  //   <Typography variant="body2">Display Name: {item.displayName}</Typography>
                  //   <Typography variant="body2">Status Message: {item.statusMessage}</Typography>
                  //   <Typography variant="body2">Picture URL: {item.picPath}</Typography>
                  //   <img src={item.picPath} alt="Profile" style={{ width: '100px', height: '100px' }} />

                  // </Card>


                  <Card sx={{ maxWidth: 345 }}>
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