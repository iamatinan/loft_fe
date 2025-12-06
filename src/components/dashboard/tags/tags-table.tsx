import * as React from 'react';
import api from '@/utils/api';
import { Box, Button, Chip } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

interface Tag {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TagsTableProps {
  tags?: Tag[];
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  refetch: () => void;
}

export function TagsTable({
  tags,
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
  refetch,
}: TagsTableProps): React.JSX.Element {
  const handleDelete = async (id: string): Promise<void> => {
    // eslint-disable-next-line no-alert -- Allow confirm for delete action
    if (confirm('คุณต้องการลบ Tag นี้หรือไม่?')) {
      try {
        await api.delete(`/tag/${id}`);
        refetch();
      } catch (error) {
        // eslint-disable-next-line no-alert -- Allow alert for error notification
        alert('เกิดข้อผิดพลาดในการลบ Tag');
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean): Promise<void> => {
    try {
      await api.patch(`/tag/${id}`, { isActive: !currentStatus });
      refetch();
    } catch (error) {
      // eslint-disable-next-line no-alert -- Allow alert for error notification
      alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ Tag');
    }
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ชื่อ Tag</TableCell>
              <TableCell>คำอธิบาย</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>วันที่สร้าง</TableCell>
              <TableCell align="right">จัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags?.map((tag) => (
              <TableRow key={tag._id} hover>
                <TableCell>
                  <Chip label={tag.name} size="small" />
                </TableCell>
                <TableCell>{tag.description ?? '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    color={tag.isActive ? 'success' : 'error'}
                    onClick={() => {
                      void handleToggleStatus(tag._id, tag.isActive);
                    }}
                  >
                    {tag.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                  </Button>
                </TableCell>
                <TableCell>{new Date(tag.createdAt).toLocaleDateString('th-TH')}</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<TrashIcon />}
                      color="error"
                      onClick={() => {
                        void handleDelete(tag._id);
                      }}
                    >
                      ลบ
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {!tags || tags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  ไม่มีข้อมูล
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
}
