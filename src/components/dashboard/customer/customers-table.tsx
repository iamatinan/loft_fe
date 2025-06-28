import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box, Button, Card, Popover } from '@mui/material';
import { metaCustomerData } from '@/app/dashboard/customers/page';
import { Field, Form, Formik, FormikProps } from 'formik';
import { MainModal } from '@/components/modal/Main';
import * as Yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers';
import { ConnectLineWithContact } from '@/components/modal/connectLineWithContact';
import { Link, LinkOff } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import api from '@/utils/api';

export interface IinitialValuesAppointmentDate {
  appointmentDate: Dayjs | null;
}

export interface IinitialValuesAppointmentFollowUp {
  appointmentFollowUpDate: Dayjs | null;
}

interface CustomersTableProps {
  customer?: metaCustomerData;
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  refetch: () => void;
}

const CustomersTable: React.FC<CustomersTableProps> = ({
  customer,
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
  refetch,
}) => {
  const [modalConnectLineOpen, setModalConectLineOpen] = React.useState(false);
  const [modalAppointmentOpen, setModalAppointmentOpen] = React.useState(false);
  const [modalAppointmentFollowUpOpen, setModalAppointmentFollowUpOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [contactId, setContactId] = React.useState<string | null>(null);

  const handleOpenConnectLineModal = (id: string) => {
    setContactId(id);
    setModalConectLineOpen(true);
  };
  const handleOpenAppointment = () => setModalAppointmentOpen(true);
  const handleOpenAppointmentFollowUp = () => setModalAppointmentFollowUpOpen(true);
  const handleCloseConnectLine = async () => {
    setModalConectLineOpen(false)
    setTimeout(() => {
      refetch();
    }, 200);
  };
  const handleClosePopover = () => setAnchorEl(null);
  const handleCloseAppointment = async () => {
    setModalAppointmentOpen(false);
    await refetch();
  };
  const handleCloseAppointmentFollowUp = async () => {
    setModalAppointmentFollowUpOpen(false);
    await refetch();
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget as HTMLButtonElement | null);
  };
  const updateAppointment = async (data: any, callback: any) => {
    try {
      // สมมติว่า api.patch ถูก import จาก utils/api
      await api.patch(`/contact/add-appointment/${contactId}`, data);
      if (callback) callback();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  const updateAppointmentFollowUp = async (data: any, callback: any) => {
    try {
      console.log('data', data);
      // สมมติว่า api.patch ถูก import จาก utils/api
      await api.patch(`/contact/add-followUp/${contactId}`, data);
      if (callback) callback();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
  };


  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  return (
    <Card>
      <Popover
        id={anchorEl ? 'simple-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Button color="info" variant='outlined' onClick={handleOpenAppointment}>
          กรอกวันที่นัดหมาย
        </Button>
        <Button color="info" variant='outlined' onClick={handleOpenAppointmentFollowUp}>
          กรอกวันที่นัดหมายครบตามกำหนด
        </Button>
        <Button color="info" variant='outlined' onClick={() => handleOpenConnectLineModal(contactId as string)}>
          บันทึกข้อมูลการเชื่อมต่อ Line
        </Button>
      </Popover>
      <MainModal open={modalAppointmentOpen} handleClose={handleCloseAppointment} contactId={contactId} >
        <Formik<IinitialValuesAppointmentDate>
          initialValues={{ appointmentDate: null }}
          validationSchema={Yup.object({
            appointmentDate: Yup.mixed().nullable().required('กรุณาเลือกวันที่นัดหมาย'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            const valuesToSubmit = {
              appointmentDate: values.appointmentDate && typeof values.appointmentDate === 'object' && 'toDate' in values.appointmentDate
                ? values.appointmentDate.toDate()
                : null,
            };
            await sleep(20);
            updateAppointment(valuesToSubmit, () => {
              handleCloseAppointment();
              setSubmitting(false);
            });
          }}
        >
          {({ isSubmitting, setFieldValue, values }: FormikProps<IinitialValuesAppointmentDate>) => (
            <Form>
              <Box mb={2}>
                <Field name="appointmentDate">
                  {({ meta }: any) => (
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

      <MainModal open={modalAppointmentFollowUpOpen} handleClose={handleCloseAppointmentFollowUp} contactId={contactId} >
        <Formik<IinitialValuesAppointmentFollowUp>
          initialValues={{ appointmentFollowUpDate: null }}
          validationSchema={Yup.object({
            appointmentFollowUpDate: Yup.mixed().nullable().required('กรุณาเลือกวันที่นัดหมาย'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            console.log('xxx', values);
            const valuesToSubmit = {
              appointmentFollowUpDate: values.appointmentFollowUpDate && typeof values.appointmentFollowUpDate === 'object' && 'toDate' in values.appointmentFollowUpDate
                ? values.appointmentFollowUpDate.toDate()
                : null,
            };
            await sleep(20);
            updateAppointmentFollowUp(valuesToSubmit, () => {
              handleCloseAppointmentFollowUp();
              setSubmitting(false);
            });
          }}
        >
          {({ isSubmitting, setFieldValue, values }: FormikProps<IinitialValuesAppointmentFollowUp>) => (
            <Form>
              <Box mb={2}>
                <Field name="appointmentFollowUp">
                  {({ meta }: any) => (
                    <DatePicker
                      label="วันที่นัดหมาย"
                      value={values.appointmentFollowUpDate}
                      onChange={(newValue) => {
                        setFieldValue('appointmentFollowUpDate', newValue);
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
      <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Hn Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Line ID</TableCell>
                <TableCell>วันที่นัดหมาย</TableCell>
                <TableCell>วันที่นัดหมายติดตาม</TableCell>
                <TableCell>เชื่อมต่อ line</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customer?.data?.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}
                  onClick={(event: React.MouseEvent<HTMLTableRowElement>) => {
                    handleClick(event);
                    setContactId(row._id);
                  }}>
                  <TableCell>{row.hnNumber}</TableCell>
                  <TableCell>{row.firstName + ' ' + row.lastName}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.lineId}</TableCell>
                  <TableCell>
                    {row.appointmentDate
                      ? new Date(row.appointmentDate).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {row.appointmentFollowUp
                      ? new Date(row.appointmentFollowUp).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{row.isConnectLine ? (<Link />) : (<LinkOff />)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </Paper>
    </Card>
  );
};

export default CustomersTable;
