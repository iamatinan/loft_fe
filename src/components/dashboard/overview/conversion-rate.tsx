import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChartBar as ChartBarIcon } from '@phosphor-icons/react/dist/ssr/ChartBar';
import type { SxProps } from '@mui/material/styles';

export interface ConversionRateProps {
  sx?: SxProps;
  percent: number;
  totalAppointments: number;
  totalReply: number;
  totalConfirmed: number;
  totalNoConfirmed: number;
  loading?: boolean;
}

export function ConversionRate({
  sx,
  percent,
  totalAppointments,
  totalReply,
  totalConfirmed,
  totalNoConfirmed,
  loading
}: ConversionRateProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                อัตราการตอบรับ (Conversion Rate)
              </Typography>
              <Typography variant="h4">
                {loading ? '...' : `${percent}%`}
              </Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-warning-main)', height: '56px', width: '56px' }}>
              <ChartBarIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
          
          <Stack spacing={1} direction="row" justifyContent="space-between" sx={{ pt: 2, borderTop: '1px solid var(--mui-palette-divider)' }}>
             <Stack spacing={0.5} alignItems="center">
                <Typography variant="caption" color="text.secondary">ทั้งหมด</Typography>
                <Typography variant="body2">{loading ? '-' : totalAppointments}</Typography>
             </Stack>
             <Stack spacing={0.5} alignItems="center">
                <Typography variant="caption" color="text.secondary">ตอบกลับ</Typography>
                <Typography variant="body2">{loading ? '-' : totalReply}</Typography>
             </Stack>
             <Stack spacing={0.5} alignItems="center">
                <Typography variant="caption" color="text.secondary">ยืนยัน</Typography>
                <Typography variant="body2">{loading ? '-' : totalConfirmed}</Typography>
             </Stack>
             <Stack spacing={0.5} alignItems="center">
                <Typography variant="caption" color="text.secondary">ไม่ยืนยัน</Typography>
                <Typography variant="body2">{loading ? '-' : totalNoConfirmed}</Typography>
             </Stack>
          </Stack>

        </Stack>
      </CardContent>
    </Card>
  );
}
