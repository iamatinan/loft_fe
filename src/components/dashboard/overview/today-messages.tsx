import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ChatCircle as ChatCircleIcon } from '@phosphor-icons/react/dist/ssr/ChatCircle';

export interface TodayMessagesProps {
  sx?: SxProps;
  value: string;
  subtitle?: string;
}

export function TodayMessages({ sx, value, subtitle }: TodayMessagesProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                ข้อความวันนี้
              </Typography>
              <Typography variant="h4">{value}</Typography>
              {subtitle ? (
                <Typography color="text.secondary" variant="caption">
                  {subtitle}
                </Typography>
              ) : null}
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-info-main)', height: '56px', width: '56px' }}>
              <ChatCircleIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
