'use client';

import * as React from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import dayjs, { type Dayjs } from 'dayjs';
import api from '@/utils/api';

interface CancelAppointmentsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CancelAppointmentsModal({
  open,
  onClose,
  onSuccess,
}: CancelAppointmentsModalProps): React.JSX.Element {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  const [selectedDates, setSelectedDates] = React.useState<string[]>([]);
  const [cancellationReason, setCancellationReason] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleAddDate = (): void => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString();
      if (!selectedDates.includes(dateString)) {
        setSelectedDates([...selectedDates, dateString]);
      }
      setSelectedDate(null);
    }
  };

  const handleRemoveDate = (dateToRemove: string): void => {
    setSelectedDates(selectedDates.filter((date) => date !== dateToRemove));
  };

  const handleSubmit = async (): Promise<void> => {
    if (selectedDates.length === 0) {
      setError('กรุณาเลือกวันนัดหมายอย่างน้อย 1 วัน');
      return;
    }

    if (!cancellationReason.trim()) {
      setError('กรุณาระบุเหตุผลในการยกเลิก');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.patch('/contact/cancel-appointments', {
        appointmentDates: selectedDates,
        cancellationReason: cancellationReason.trim(),
      });

      setSuccess(true);
      setTimeout(() => {
        handleClose();
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
    } catch (err: any) {
      console.error('Error cancelling appointments:', err);
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการยกเลิกนัดหมาย');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (): void => {
    setSelectedDate(null);
    setSelectedDates([]);
    setCancellationReason('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>ยกเลิกวันนัดหมาย</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">ยกเลิกนัดหมายสำเร็จ</Alert>}

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              เลือกวันที่ต้องการยกเลิก
            </Typography>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <DatePicker
                label="เลือกวันที่"
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                }}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
              <Button variant="contained" onClick={handleAddDate} disabled={!selectedDate || loading}>
                เพิ่ม
              </Button>
            </Stack>
          </Box>

          {selectedDates.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                วันที่เลือก ({selectedDates.length} วัน)
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {selectedDates.map((date) => (
                  <Chip
                    key={date}
                    label={dayjs(date).format('DD/MM/YYYY HH:mm')}
                    onDelete={() => {
                      handleRemoveDate(date);
                    }}
                    deleteIcon={<XIcon />}
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <TextField
            label="เหตุผลในการยกเลิก"
            multiline
            rows={4}
            value={cancellationReason}
            onChange={(e) => {
              setCancellationReason(e.target.value);
            }}
            placeholder="เช่น คลินิกปิดปรับปรุงระบบ"
            disabled={loading}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          ยกเลิก
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || selectedDates.length === 0 || !cancellationReason.trim()}
        >
          {loading ? 'กำลังยกเลิกนัดหมาย...' : 'ยืนยันการยกเลิก'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
