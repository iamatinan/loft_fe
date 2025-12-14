'use client';

import * as React from 'react';
import api from '@/utils/api';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import dayjs, { type Dayjs } from 'dayjs';

/*
 * Expected JSON format from backend API:
 *
 * GET /reports/customer-appointment?page=1&limit=10&showDataAll=false&startDate=2025-12-13T16%3A19%3A05.377Z&endDate=2025-12-20T16%3A19%3A05.377Z
 *
 * Response example:
 * {
 *   "meta": {
 *     "code": 200,
 *     "status": true,
 *     "message": "Success",
 *     "reqId": "693d9327986e0c27cf949c89",
 *     "count": 1,
 *     "page": 1,
 *     "limit": 10,
 *     "pageCount": 1,
 *     "hasPreviousPage": false,
 *     "hasNextPage": false,
 *     "orderBy": {
 *       "isActive": -1,
 *       "updatedAt": -1
 *     }
 *   },
 *   "data": [
 *     {
 *       "_id": "693d5e0796f77c7c50b874e8",
 *       "customerId": "693d5a95cc5a7db98105809c",
 *       "clinicId": "69231ea00c4992fd4d342ba3",
 *       "branchId": "69231f170c4992fd4d342ba9",
 *       "appointmentDate": "2025-12-15T03:00:00.000Z",
 *       "appointmentType": "treatment",
 *       "status": "scheduled",
 *       "isConfirmed": false,
 *       "duration": 30,
 *       "notes": "ปย",
 *       "createdBy": "693d5e0796f77c7c50b874e7",
 *       "deleted": false,
 *       "createdAt": "2025-12-13T12:37:27.400Z",
 *       "updatedAt": "2025-12-13T12:56:15.221Z",
 *       "__v": 0,
 *       "reminderSent": true,
 *       "reminderSentAt": "2025-12-13T12:49:33.890Z"
 *     }
 *   ]
 * }
 */

interface CustomerAppointment {
  _id: string;
  customerId: {
    firstName: string;
    lastName: string;
  };
  clinicId: string;
  branchId: string;
  appointmentDate: string;
  appointmentType: 'treatment' | 'consultation' | 'check-up' | 'follow-up';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  isConfirmed: boolean;
  duration: number;
  notes: string;
  createdBy: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  reminderSent: boolean;
  reminderSentAt?: string;
}

interface AppointmentReportData {
  data: CustomerAppointment[];
  meta: {
    code: number;
    status: boolean;
    message: string;
    reqId: string;
    count: number;
    page: number;
    limit: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    orderBy: {
      isActive: number;
      updatedAt: number;
    };
  };
}

export default function CustomerAppointmentReportPage(): React.JSX.Element {
  const [appointments, setAppointments] = React.useState<CustomerAppointment[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());

  const fetchAppointments = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<any>('/reports/customer-appointment', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          showDataAll: false,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        },
      });

      // Handle the response data structure
      console.log('response', response);
      const responseData = response.data;
      console.log('resPonex,,, ', responseData);
      const yyy = response.data as any;
      const xxx = yyy?.meta?.count || 0;
      const appointmentsData = responseData || [];
      const totalCountData = xxx;
      console.log('app', appointmentsData);
      console.log('to', totalCountData);
      setAppointments(appointmentsData);
      setTotalCount(totalCountData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, startDate, endDate]);

  React.useEffect(() => {
    void fetchAppointments();
  }, [fetchAppointments]);

  const handleChangePage = (_event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (): void => {
    setPage(0);
    void fetchAppointments();
  };

  const handleExport = async (): Promise<void> => {
    try {
      const response = await api.get('/reports/customer-appointment/export', {
        params: {
          showDataAll: false,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `appointment-report-${dayjs().format('YYYY-MM-DD')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'no-show':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'scheduled':
        return 'นัดแล้ว';
      case 'completed':
        return 'สำเร็จ';
      case 'cancelled':
        return 'ยกเลิก';
      case 'no-show':
        return 'ไม่มาตามนัด';
      default:
        return status;
    }
  };

  const getAppointmentTypeLabel = (type: string): string => {
    switch (type) {
      case 'treatment':
        return 'รักษา';
      case 'consultation':
        return 'ปรึกษา';
      case 'check-up':
        return 'ตรวจสุขภาพ';
      case 'follow-up':
        return 'ติดตามผล';
      default:
        return type;
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4">รายงานการนัดหมายลูกค้า</Typography>
        <Button
          startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={handleExport}
        >
          ส่งออกรายงาน
        </Button>
      </Stack>

      <Card>
        <Stack spacing={2} sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <DatePicker
              label="วันที่เริ่มต้น"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
              slotProps={{ textField: { size: 'small' } }}
            />
            <DatePicker
              label="วันที่สิ้นสุด"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
              slotProps={{ textField: { size: 'small' } }}
            />
            <Button variant="contained" onClick={handleSearch}>
              ค้นหา
            </Button>
          </Stack>
        </Stack>
        <Divider />
        <Box sx={{ overflowX: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>วันนัดหมาย</TableCell>
                  <TableCell>ชื่อ นามสกุล</TableCell>
                  <TableCell>เวลา</TableCell>
                  <TableCell>ประเภท</TableCell>
                  <TableCell>สถานะ</TableCell>
                  <TableCell>ยืนยัน</TableCell>
                  <TableCell>หมายเหตุ</TableCell>
                  <TableCell>การส่งแจ้งเตือน</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        ไม่พบข้อมูล
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((appointment) => (
                    <TableRow key={appointment._id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {dayjs(appointment.appointmentDate).format('DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {appointment.customerId.firstName} {appointment.customerId.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{dayjs(appointment.appointmentDate).format('HH:mm')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{getAppointmentTypeLabel(appointment.appointmentType)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(appointment.status)}
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.isConfirmed ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน'}
                          color={appointment.isConfirmed ? 'success' : 'warning'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {appointment.notes || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={appointment.reminderSent ? 'ส่งแล้ว' : 'ยังไม่ส่ง'}
                          color={appointment.reminderSent ? 'success' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Box>
        <Divider />
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="แถวต่อหน้า:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} จาก ${count}`}
        />
      </Card>

      <Card sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          สรุปข้อมูล
        </Typography>
        <Stack direction="row" spacing={4}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              นัดหมายทั้งหมด
            </Typography>
            <Typography variant="h5">{totalCount.toLocaleString()}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              ช่วงเวลา
            </Typography>
            <Typography variant="body1">
              {startDate?.format('DD/MM/YYYY')} - {endDate?.format('DD/MM/YYYY')}
            </Typography>
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
}
