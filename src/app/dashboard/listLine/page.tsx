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
"use client";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import * as React from 'react';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
// import type { Customer } from '@/components/dashboard/customer/customers-table';
// import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { metaLineProfileData } from '@/app/interface/interface';
import ListLineTable from '@/components/dashboard/listLine/listline-table';
import api from '@/utils/api';
import { Box } from '@mui/material';




// ย้าย useLines จาก customers-table มาไว้ที่นี่
function useLines(page: number, rowsPerPage: number, keyword: string) {
  const [data, setData] = React.useState<metaLineProfileData>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchLines = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/line', {
        params: {
          limit: rowsPerPage,
          page: page + 1,
          showDataAll: false,
          ...(keyword ? { keyword } : {})
        }
      });
      console.log('response', response);
      setData(response.data);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, keyword]);

  React.useEffect(() => {
    fetchLines();
  }, [fetchLines]);

  return { data, loading, error, refetch: fetchLines };
}

export default function Page(): React.JSX.Element {
  const sleep = (ms: number) => new Promise((r) => { setTimeout(r, ms) });
  const [modalOpen, setModalOpen] = React.useState(false);
  const [line, setLine] = React.useState<metaLineProfileData>();
  const handleClose = (): void => { setModalOpen(false); };

  const getLines = async () => {
    try {
      const response = await api.get('/line');
      // setLine(response.data?.data?.data ?? []);
      setLine(response.data?.data); // set เป็น metaLineProfileData object
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };
  // State สำหรับตารางลูกค้า
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [keyword, setKeyword] = React.useState('');
  const { data: lineData, loading, error, refetch } = useLines(page, rowsPerPage, keyword);
  console.log('lineData', lineData);

  // Handler สำหรับเปลี่ยนหน้า/จำนวนแถว
  const handleChangePage = (_: unknown, newPage: number) => {
    console.log('handleChangePage', newPage);
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">รายชื่อลูกค้า</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>

      </Stack>
      {/* Loading & Error */}
      {loading && <Box display="flex" justifyContent="center" my={2}><CircularProgress /></Box>}
      {error && <Box color="error.main">{error}</Box>}
      <CustomersFilters
        keyword={keyword}
        onKeywordChange={handleKeywordChange}
      />
      <ListLineTable
        lineData={lineData}
        page={page}
        rowsPerPage={rowsPerPage}
        count={lineData?.meta?.count ?? 0}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        refetch={refetch}
      />
    </Stack >
  );
}