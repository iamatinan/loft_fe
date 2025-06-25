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
import { metaLineProfileData } from '@/app/interface/interface';

export interface IinitialValuesAppointmentDate {
  appointmentDate: Dayjs | null;
}

interface CustomersTableProps {
  lineData?: metaLineProfileData;
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  refetch: () => void;
}

const ListLineTable: React.FC<CustomersTableProps> = ({
  lineData,
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
  refetch,
}) => {
  const [modalConnectLineOpen, setModalConectLineOpen] = React.useState(false);
  const [modalAppointmentOpen, setModalAppointmentOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [contactId, setContactId] = React.useState<string | null>(null);

  const handleOpenConnectLineModal = (id: string) => {
    setContactId(id);
    setModalConectLineOpen(true);
  };
  const handleOpenAppointment = () => setModalAppointmentOpen(true);
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
      <ConnectLineWithContact open={modalConnectLineOpen} handleClose={handleCloseConnectLine} contactId={contactId} />
      <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>ชื่อไลน์โปรไฟล์</TableCell>
                <TableCell>ชื่อที่เชื่อมต่อ</TableCell>
                <TableCell>วันที่เชื่อมต่อ</TableCell>
                <TableCell>เชื่อมต่อ line</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lineData?.data?.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}
                  onClick={(event: React.MouseEvent<HTMLTableRowElement>) => {
                    handleClick(event);
                    setContactId(row._id);
                  }}>
                  <TableCell>{row.displayName}</TableCell>
                  <TableCell>{row.contactId?.name} {row.contactId?.lastName}</TableCell>
                  <TableCell>
                    {row.connectLineAt ? dayjs(row.connectLineAt).format('DD/MM/YYYY') : 'ยังไม่ระบุ'}
                  </TableCell>
                  <TableCell>{row.contactId ? (<Link />) : (<LinkOff />)}</TableCell>




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

export default ListLineTable;
