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
import { CustomersFilters } from "../dashboard/customer/customers-filters";
import { LineFilters } from "./lineFilter/lineFilter";
import { metaLineProfileData } from "@/app/interface/interface";
const style = {
  position: 'relative',
  top: '0%',
  left: '50%',
  transform: 'translate(-50%, 0%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};
const listContainerStyle = {
  // maxHeight: 400, // หรือกำหนดตามต้องการ
  overflowY: 'auto',
  // mt: 50,
};



function useLine(page: number, rowsPerPage: number, keyword: string) {
  const [lineProfile, setLineProfile] = React.useState<metaLineProfileData>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCustomers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resLineProfile = await api.get(`/line`, {
        params: {
          limit: rowsPerPage,
          page: page + 1,
          showDataAll: false,
          ...(keyword ? { keyword } : {})
        }
      });
      console.log('xxxxxxxx', resLineProfile);
      setLineProfile(resLineProfile.data);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, keyword]);

  React.useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return { lineProfile, loading, error, refetch: fetchCustomers };
}


export function ConnectLineWithContact({ open, handleClose, contactId }: any): React.JSX.Element {
  const [contactData, setContactData] = React.useState<any>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [keyword, setKeyword] = React.useState('');
  console.log('keyword', keyword);
  const { lineProfile, loading, error, refetch } = useLine(page, rowsPerPage, keyword);

  const connectLineWithContactz = async (contactIds: string, lineProfileId: string) => {
    try {
      const response = await api.patch(`/contact/connect-line/${contactIds}`, { lineProfileId });
      if (response.status === 200) {
        refetch();
        // sendDataToParent(true)
        // You can add additional logic here, like updating the UI or showing a success message
      } else {
        console.error('Failed to connect line with contact:', response.data);
      }
    } catch (error) {
      console.error('Error connecting line with contact:', error);
    }
  }

  const handleCancelConnect = async (contactIds: string, lineProfileId: string) => {
    try {
      console.log('handelCancelConnect', contactIds, lineProfileId);
      const response = await api.patch(`/contact/cancel-connect-line/${contactIds}`, { lineProfileId });
      refetch();
      if (response.status === 200) {
        // sendDataToParent(true)
        // You can add additional logic here, like updating the UI or showing a success message
      } else {
        console.error('Failed to cancel connect line with contact:', response.data);
      }
    } catch (error) {
      console.error('Error canceling connect line with contact:', error);
    }
  }

  const getContactById = async () => {
    try {
      // const resLineProfile = await api.get(`line`);
      const response = await api.get(`/contact/${contactId}`);
      if (!response.data) {
        throw new Error('Network response was not ok');
      }
      setContactData(response.data.data);

    } catch (error) {
      console.error('Error fetching contact data:', error);
      // Handle the error appropriately, e.g., show a notification or alert
    }
  }

  React.useEffect(() => {
    if (open && contactId) {
      getContactById();
      refetch();
    }
  }, [open, contactId]);
  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(0);
  };

  console.log('contactDataxx', contactData);
  return (
    <Modal sx={listContainerStyle} open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {"กำลังเชื่อมต่อ Line กับผู้ติดต่อ"}
          {contactData ? `${contactData.name}` : 'Loading...'}


        </Typography>
        <>กำลังเชื่อมกับ {contactData?.lineProfileId?.displayName}</>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {/* {children} */}
          <LineFilters
            keyword={keyword}
            onKeywordChange={handleKeywordChange}
          />
          {
            (lineProfile?.data?.length ?? 0) > 0 ? (
              <>
                {lineProfile?.data.map((item: any, index) => (
                  <Card sx={{ maxWidth: 345 }}
                    key={item._id}>
                    <img src={item.picPath} alt="Profile" style={{ width: '100px', height: '100px' }} />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.displayName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        สถานะ: {item.statusMessage}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        เชื่อมต่อกับผู้ติดต่อ: {item.contactId ? item.contactId?.name : 'ยังไม่ระบุ'}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {item.contactId ? (<><Button disabled={true} size="small" onClick={
                        () => {
                          connectLineWithContactz(contactId, item._id);
                          handleClose();
                        }
                      }>เชื่อมต่อ</Button>
                        <Button size="small" onClick={
                          () => {
                            handleCancelConnect(contactId, item._id);
                            handleClose();
                          }
                        }>ยกเลิกการเชื่อมต่อ</Button></>) : (<Button size="small" onClick={
                          () => {
                            connectLineWithContactz(contactId, item._id);
                            handleClose();
                          }
                        }>เชื่อมต่อ</Button>)}

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