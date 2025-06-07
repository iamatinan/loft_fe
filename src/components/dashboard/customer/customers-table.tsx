'use client';

import { ConnectLineWithContact } from '@/components/modal/connectLineWithContact';
import { MainModal } from '@/components/modal/Main';
import api from '@/utils/api';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Button, Popover, TextField } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import dayjs from 'dayjs';
import { Field, Form, Formik } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';

function noop(): void {
  // do nothing
}

export interface Customer {
  _id: string;
  avatar: string;
  name: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  lineId?: string;
  age: number;
  isConnectLine: boolean;
  appointmentDate?: Date | null;
  createdAt: Date;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
  sendDataToParent: (data: any) => void;
}

export interface IinitialValuesAppointmentDate {
  appointmentDate: Date | null;
}

const FormikTextField = ({ field, form, ...props }: any) => {
  return (
    <TextField
      {...field}
      {...props}
      variant="standard"
      error={form.touched[field.name] && !!form.errors[field.name]}
      helperText={form.touched[field.name] && form.errors[field.name]}
      fullWidth
    />
  );
};

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  sendDataToParent
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer._id);
  }, [rows]);

  const [modalConnectLineOpen, setModalConectLineOpen] = React.useState(false);
  const [modalAppointmentOpen, setModalAppointmentOpen] = React.useState(false);

  const [contactId, setContactId] = React.useState<string | null>(null);

  const handleOpenConnectLineModal  = (id: string) => {
    setContactId(id);
    setModalConectLineOpen(true);
  };
  const handleOpenAppointment = () => {
    setModalAppointmentOpen(true);

  };

  const handleCloseConnectLine = async () => {
  setModalConectLineOpen(false);
  // รอให้ modal ปิดก่อน แล้วค่อยแจ้ง parent ให้ refresh
  setTimeout(() => {
    sendDataToParent(true);
  }, 200); // รอ 200ms เพื่อให้ modal ปิดก่อน
  };

  const handleCloseAppointment = async () => {
    await sendDataToParent(true)

    await setModalAppointmentOpen(false);

  };
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget as HTMLButtonElement | null);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const updateAppointment = async (data: any, callback: any) => {
    try {
      const response = await api.patch(`/contact/${contactId}`, data);
      // const response = await axios.patch(`http://127.0.0.1:4001/api/v1/contact/${contactId}`, data);
      if (callback) callback();
      // getContact(); // Refresh staff list after adding new item
    } catch (error) {
      console.error('Error posting staff data:', error);
    }
  };
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <MainModal open={modalAppointmentOpen} handleClose={handleCloseAppointment} contactId={contactId} >
          <Formik
            initialValues={{
              appointmentDate: null,
            }}
            validationSchema={Yup.object({
              appointmentDate: Yup.date()
                .nullable()
                .required('กรุณาเลือกวันที่นัดหมาย'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              const valuesToSubmit: IinitialValuesAppointmentDate = {
                appointmentDate: values.appointmentDate ? new Date(values.appointmentDate) : null,
              };

              await sleep(20);
              updateAppointment(valuesToSubmit, () => {
                handleCloseAppointment();
                setSubmitting(false);
              });
            }}
          >
            {({ isSubmitting, setFieldValue, values, errors, touched }) => (
              <Form>
                <Box mb={2}>
                  <Field name="appointmentDate">
                    {({ field, meta }: any) => (
                      <DatePicker
                        label="วันที่นัดหมาย"
                        value={values.appointmentDate}
                        onChange={(newValue) => {
                          setFieldValue('appointmentDate', newValue);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: Boolean(meta.touched && meta.error),
                            helperText: meta.touched && meta.error,
                          },
                        }}
                      />
                    )}
                  </Field>
                </Box>
                <Button type="submit" disabled={isSubmitting} variant="contained" color="primary">
                  บันทึก
                </Button>
              </Form>
            )}
          </Formik>
        </MainModal>

        <ConnectLineWithContact open={modalConnectLineOpen} handleClose={handleCloseConnectLine} contactId={contactId} />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {/* <Typography sx={{ p: 2 }}>The content of the Popover.</Typography> */}
          <Button color="info" variant='outlined'
            onClick={() => {
              setContactId
              handleOpenAppointment();
            }}

          // startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}
          >
            กรอกวันที่นัดหมาย
          </Button>
          <Button color="info" variant='outlined'
            onClick={() => {
              handleOpenConnectLineModal(contactId as string);
            }}
          // startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}
          >
            บันทึกข้อมูลการเชื่อมต่อ Line
          </Button>
        </Popover>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Line ID</TableCell>
              <TableCell>วันที่นัดหมาย</TableCell>
              <TableCell>เชื่อมต่อ line</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              // const isSelected = selected?.has(row.id);
              return (
                <TableRow hover key={row._id}
                  onClick={(event) => {
                    handleClick(event);
                    setContactId(row._id);
                    // handleOpen(row._id);
                  }}
                >
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography variant="subtitle2">{row.name + ' ' + row.lastName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {row.address}
                  </TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.lineId}</TableCell>
                  <TableCell>{row.appointmentDate ? dayjs(row.appointmentDate).format('MMM D, YYYY') : '-'}</TableCell>
                  <TableCell>
                    {row.isConnectLine ? (<CheckIcon />) : (<ClearIcon />)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}