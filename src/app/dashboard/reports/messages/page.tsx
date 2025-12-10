'use client';

import * as React from 'react';
import {
  Box,
  Button,
  Card,
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
  Chip,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import dayjs, { type Dayjs } from 'dayjs';
import api from '@/utils/api';

/*
 * Expected JSON format from backend API:
 * 
 * GET /reports/messages?page=1&limit=10&keyword=&startDate=2024-12-03&endDate=2024-12-10
 * 
 * Response example:
 * {
 *   "data": [
 *     {
 *       "_id": "674d8f9e12345abc67890def",
 *       "customerId": {
 *         "_id": "674d8f9e12345abc67890abc",
 *         "firstName": "สมชาย",
 *         "lastName": "ใจดี",
 *         "hnNumber": "HN001234",
 *         "phone": "0812345678"
 *       },
 *       "message": "เรียนคุณสมชาย ใจดี นัดพบแพทย์วันที่ 15 ธ.ค. 2567 เวลา 14:00 น.",
 *       "deliveredAt": "2024-12-10T08:30:00.000Z",
 *       "status": "delivered",
 *       "messageType": "appointment_reminder",
 *       "createdAt": "2024-12-10T08:30:00.000Z"
 *     }
 *   ],
 *   "meta": {
 *     "count": 150,
 *     "page": 1,
 *     "limit": 10,
 *     "pageCount": 15,
 *     "hasPreviousPage": false,
 *     "hasNextPage": true
 *   }
 * }
 */

interface MessageLog {
  _id: string;
  customerId: {
    _id: string;
    firstName: string;
    lastName: string;
    hnNumber: string;
    phone: string;
  } | null;
  message: string;
  deliveredAt: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  messageType: string;
  createdAt: string;
}

interface MessageReportData {
  data: MessageLog[];
  meta: {
    count: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}

export default function MessagesReportPage(): React.JSX.Element {
  const [messages, setMessages] = React.useState<MessageLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());

  const fetchMessages = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<MessageReportData>('/reports/messages', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          keyword: searchKeyword,
          startDate: startDate?.format('YYYY-MM-DD'),
          endDate: endDate?.format('YYYY-MM-DD'),
        },
      });
      setMessages(response.data.data);
      setTotalCount(response.data.meta.count);
    } catch (error) {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchKeyword, startDate, endDate]);

  React.useEffect(() => {
    void fetchMessages();
  }, [fetchMessages]);

  const handleChangePage = (_event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (): void => {
    setPage(0);
    void fetchMessages();
  };

  const handleExport = async (): Promise<void> => {
    try {
      const response = await api.get('/reports/messages/export', {
        params: {
          keyword: searchKeyword,
          startDate: startDate?.format('YYYY-MM-DD'),
          endDate: endDate?.format('YYYY-MM-DD'),
        },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `message-report-${dayjs().format('YYYY-MM-DD')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      // Error exporting report
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'sent':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4">รายงานข้อความส่งถึงลูกค้า</Typography>
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
              onChange={(newValue) => { setStartDate(newValue); }}
              slotProps={{ textField: { size: 'small' } }}
            />
            <DatePicker
              label="วันที่สิ้นสุด"
              value={endDate}
              onChange={(newValue) => { setEndDate(newValue); }}
              slotProps={{ textField: { size: 'small' } }}
            />
            <TextField
              label="ค้นหา (ชื่อ, HN, เบอร์โทร)"
              size="small"
              value={searchKeyword}
              onChange={(e) => { setSearchKeyword(e.target.value); }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              sx={{ minWidth: 250 }}
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
                  <TableCell>วันที่-เวลาส่ง</TableCell>
                  <TableCell>HN</TableCell>
                  <TableCell>ชื่อลูกค้า</TableCell>
                  <TableCell>เบอร์โทร</TableCell>
                  <TableCell>ข้อความ</TableCell>
                  <TableCell>ประเภท</TableCell>
                  <TableCell>สถานะ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        ไม่พบข้อมูล
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((message) => (
                    <TableRow key={message._id} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {dayjs(message.deliveredAt || message.createdAt).format('DD/MM/YYYY HH:mm')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {message.customerId?.hnNumber || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {message.customerId
                            ? `${message.customerId.firstName} ${message.customerId.lastName}`
                            : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{message.customerId?.phone || '-'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {message.message}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{message.messageType || 'ทั่วไป'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={message.status === 'delivered' ? 'ส่งสำเร็จ' : message.status}
                          color={getStatusColor(message.status)}
                          size="small"
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
              ข้อความทั้งหมด
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
