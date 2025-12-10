import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Calendar as CalendarIcon } from '@phosphor-icons/react/dist/ssr/Calendar';

export interface TotalAppointmentsTodayProps {
  sx?: SxProps;
  value: string;
}

export function TotalAppointmentsToday({ sx, value }: TotalAppointmentsTodayProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                นัดหมายวันนี้
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
              <CalendarIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
