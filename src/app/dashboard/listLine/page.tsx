'use client';

import * as React from 'react';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import type { MetaLineProfileData } from '@/app/interface/interface';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import ListLineTable from '@/components/dashboard/listLine/listline-table';
import api from '@/utils/api';




// ย้าย useLines จาก customers-table มาไว้ที่นี่
function useLines(page: number, rowsPerPage: number, keyword: string) {
  const [data, setData] = React.useState<MetaLineProfileData>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchLines = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response :MetaLineProfileData= await api.get('/line', {
        params: {
          limit: rowsPerPage,
          page: page + 1,
          showDataAll: false,
          ...(keyword ? { keyword } : {}),
        },
      });
      // console.log('response', response);
      // โครงสร้าง response จาก /line: { data: [...], meta: {...} }
      // ต่างจาก /contact ที่มี: { data: { data: [...], meta: {...} } }
      setData(response);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, keyword]);

  React.useEffect(() => {
    void fetchLines();
  }, [fetchLines]);

  return { data, loading, error, refetch: fetchLines };
}

export default function Page(): React.JSX.Element {
  

  // State สำหรับตารางลูกค้า
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [keyword, setKeyword] = React.useState('');
  const { data: lineData, loading, error, refetch } = useLines(page, rowsPerPage, keyword);

  // Handler สำหรับเปลี่ยนหน้า/จำนวนแถว
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value));
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
      {/* <CustomersFilters
        keyword={keyword}
        onKeywordChange={handleKeywordChange}
      /> */}
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