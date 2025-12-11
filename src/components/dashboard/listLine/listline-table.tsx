import { LineProfileInterface, MetaLineProfileData } from '@/app/interface/interface';
import api from '@/utils/api';
import { Link, LinkOff } from '@mui/icons-material';
import { Box, Button, Card, Popover, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { Field, Form, Formik, FormikProps } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';

import { ConnectLineWithContact } from '@/components/modal/connectLineWithContact';
import { MainModal } from '@/components/modal/Main';
import { ConnectCustomerWithLine } from '@/components/modal/connectCustomerWithLine';

export interface IinitialValuesAppointmentDate {
  appointmentDate: Dayjs | null;
}

interface CustomersTableProps {
  lineData?: MetaLineProfileData;
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
  const [lineProfileId, setLineProfileId] = React.useState<string | null>(null);

  const handleOpenConnectLineModal = (id: string) => {
    setLineProfileId(id);
    setModalConectLineOpen(true);
  };
  const handleOpenAppointment = () => setModalAppointmentOpen(true);
  const handleCloseConnectLine = async () => {
    setModalConectLineOpen(false);
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
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              mt: 1,
              minWidth: 280,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            },
          },
        }}
      >
        <Stack spacing={1.5}>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            onClick={handleOpenAppointment}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              py: 1.5,
              px: 2,
            }}
          >
            📅 กรอกวันที่นัดหมาย
          </Button>
          <Button
            fullWidth
            color="info"
            variant="contained"
            onClick={() => handleOpenConnectLineModal(lineProfileId as string)}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              py: 1.5,
              px: 2,
            }}
          >
            🔗 เชื่อมต่อ Line กับลูกค้า
          </Button>
        </Stack>
      </Popover>
      <MainModal open={modalAppointmentOpen} handleClose={handleCloseAppointment} contactId={contactId}>
        <Formik<IinitialValuesAppointmentDate>
          initialValues={{ appointmentDate: null }}
          validationSchema={Yup.object({
            appointmentDate: Yup.mixed().nullable().required('กรุณาเลือกวันที่นัดหมาย'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            const valuesToSubmit = {
              appointmentDate:
                values.appointmentDate &&
                typeof values.appointmentDate === 'object' &&
                'toDate' in values.appointmentDate
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
      <ConnectCustomerWithLine open={modalConnectLineOpen} handleClose={handleCloseConnectLine} lineProfileId={lineProfileId as string} />
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
              {lineData?.data && lineData.data.length > 0 ? (
                lineData.data.map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row._id}
                    onClick={(event: React.MouseEvent<HTMLTableRowElement>) => {
                      handleClick(event);
                      setLineProfileId(row._id);
                      setContactId(row.contactId?._id || null);
                    }}
                  >
                    <TableCell>{row.displayName}</TableCell>
                    <TableCell>
                      {row.contactId?.firstName} {row.contactId?.lastName}
                    </TableCell>
                    <TableCell>
                      {row.connectLineAt ? dayjs(row.connectLineAt).format('DD/MM/YYYY') : 'ยังไม่ระบุ'}
                    </TableCell>
                    <TableCell>{row.contactId ? <Link /> : <LinkOff />}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
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
