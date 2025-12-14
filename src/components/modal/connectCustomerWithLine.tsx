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

import React from 'react';
import api from '@/utils/api';
import { useSnackbar } from '@/contexts/snackbar-context';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Modal, TextField, Typography } from '@mui/material';

const style = {
  position: 'relative',
  top: '0%',
  left: '50%',
  transform: 'translate(-50%, 0%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const listContainerStyle = {
  overflowY: 'auto',
};

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  lineProfileId?: {
    _id: string;
    displayName: string;
    picPath: string;
  };
}

interface MetaCustomerData {
  data: Customer[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

function useCustomers(page: number, rowsPerPage: number, keyword: string) {
  const [customers, setCustomers] = React.useState<MetaCustomerData>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCustomers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resCustomers: MetaCustomerData = await api.get(`/contact`, {
        params: {
          limit: rowsPerPage,
          page: page + 1,
          ...(keyword ? { keyword } : {}),
        },
      });
      setCustomers(resCustomers);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, keyword]);

  React.useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return { customers, loading, error, refetch: fetchCustomers };
}

interface ConnectCustomerWithLineProps {
  open: boolean;
  handleClose: () => void;
  lineProfileId: string;
}

export function ConnectCustomerWithLine({
  open,
  handleClose,
  lineProfileId,
}: ConnectCustomerWithLineProps): React.JSX.Element {
  const [lineData, setLineData] = React.useState<any>(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [keyword, setKeyword] = React.useState('');
  const { showSnackbar } = useSnackbar();

  const { customers, loading, error, refetch } = useCustomers(page, rowsPerPage, keyword);

  const connectLineWithContact = async (contactId: string, lineId: string) => {
    try {
      const response = await api.patch(`/contact/connect-line/${contactId}`, { lineProfileId: lineId });
      if (response.status === 200) {
        refetch();
        showSnackbar('เชื่อมต่อสำเร็จ', 'success');
        // sendDataToParent(true)
      } else {
        console.error('Failed to connect line with contact:', response.data);
      }
    } catch (error: any) {
      console.error('Error connecting line with contact:', error);
      const errorMessage = error?.response?.data?.meta?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleCancelConnect = async (contactId: string, lineId: string) => {
    try {
      console.log('handelCancelConnect', contactId, lineId);
      const response = await api.patch(`/contact/cancel-connect-line/${contactId}`, { lineProfileId: lineId });
      refetch();
      if (response.status === 200) {
        showSnackbar('ยกเลิกการเชื่อมต่อสำเร็จ', 'success');
        // sendDataToParent(true)
      } else {
        console.error('Failed to cancel connect line with contact:', response.data);
      }
    } catch (error: any) {
      console.error('Error canceling connect line with contact:', error);
      const errorMessage = error?.response?.data?.meta?.message || 'เกิดข้อผิดพลาดในการยกเลิกการเชื่อมต่อ';
      showSnackbar(errorMessage, 'error');
    }
  };

  const getLineById = async () => {
    try {
      const response = await api.get(`/line/${lineProfileId}`);
      if (!response.data) {
        throw new Error('Network response was not ok');
      }
      setLineData(response);
    } catch (error) {
      console.error('Error fetching line data:', error);
    }
  };

  React.useEffect(() => {
    if (open && lineProfileId) {
      getLineById();
      refetch();
    }
  }, [open, lineProfileId]);

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
    setPage(0);
  };


  return (
    <Modal
      sx={listContainerStyle}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {'กำลังเชื่อมต่อ Line: '}
          {lineData?.data ? `${lineData.data.displayName}` : 'Loading...'}
        </Typography>

        {lineData?.contactId && (
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            กำลังเชื่อมกับลูกค้า: {lineData.contactId?.name}
          </Typography>
        )}

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="ค้นหาด้วยชื่อหรือเบอร์โทร"
            variant="outlined"
            value={keyword}
            onChange={handleKeywordChange}
            sx={{ mb: 2 }}
            placeholder="กรอกชื่อหรือเบอร์โทรศัพท์"
          />

          {loading && <Typography>กำลังโหลด...</Typography>}
          {error && <Typography color="error">{error}</Typography>}

          {(customers?.data.length ?? 0) > 0 ? (
            <>
              {customers?.data.map((customer: Customer) => (
                <Card sx={{ maxWidth: 345, mb: 2 }} key={customer._id}>
                  {customer.lineProfileId?.picPath && (
                    <CardMedia
                      component="img"
                      height="80"
                      image={customer.lineProfileId.picPath}
                      alt={customer.lineProfileId.displayName}
                      sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
                    />
                  )}
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {customer.firstName} {customer.lastName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      เบอร์โทร: {customer.phone || 'ไม่ระบุ'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      อีเมล: {customer.email || 'ไม่ระบุ'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      เชื่อมต่อกับ Line: {customer.lineProfileId ? customer.lineProfileId.displayName : 'ยังไม่ระบุ'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {customer.lineProfileId ? (
                      <>
                        <Button disabled={true} size="small">
                          เชื่อมต่อ
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            handleCancelConnect(customer._id, lineProfileId);
                            handleClose();
                          }}
                        >
                          ยกเลิกการเชื่อมต่อ
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="small"
                        onClick={() => {
                          connectLineWithContact(customer._id, lineProfileId);
                          handleClose();
                        }}
                      >
                        เชื่อมต่อ
                      </Button>
                    )}
                  </CardActions>
                </Card>
              ))}
            </>
          ) : (
            !loading && <Typography>ไม่พบข้อมูลลูกค้า</Typography>
          )}
        </Typography>

        <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}
