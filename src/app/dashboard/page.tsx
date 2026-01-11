'use client';

import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import { Card, CardContent, Typography, Stack } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

import { CustomersByTag } from '@/components/dashboard/overview/customers-by-tag';
import { TodayMessages } from '@/components/dashboard/overview/today-messages';
import { TotalAppointmentsToday } from '@/components/dashboard/overview/total-appointments-today';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalMessageAsk } from '@/components/dashboard/overview/total-message-ask';
import api from '@/utils/api';

interface TagData {
  name: string;
  count: number;
}

interface DashboardData {
  totalCustomer: number;
  totalMessageToday: number;
  totalMessageAsk: number;
  totalAppointmentToday: number;
  tag: TagData[];
}

interface TimeData {
  currentTime: string;
  timezone: string;
}

export default function Page(): React.JSX.Element {
  const [dashboardData, setDashboardData] = React.useState<DashboardData>({
    totalCustomer: 0,
    totalMessageToday: 0,
    totalMessageAsk: 0,
    totalAppointmentToday: 0,
    tag: [],
  });
  const [loading, setLoading] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState<string>('');
  const [timezone, setTimezone] = React.useState<string>('');

  React.useEffect(() => {
    const fetchDashboardData = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await api.get<DashboardData>('/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        // Error fetching dashboard data
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboardData();
  }, []);

  // Fetch time from API
  React.useEffect(() => {
    const fetchTime = async (): Promise<void> => {
      try {
        const response = await api.get<string>('/dashboard/time');
        // Response is a datetime string like "2026-01-11 20:56:06"
        setCurrentTime(response.data);
        setTimezone('utc');
      } catch (error) {
        // If API fails, use local time
        setCurrentTime(new Date().toISOString());
        setTimezone('utc');
      }
    };

    void fetchTime();

    // Set interval to fetch time every 1 minute (60000 ms)
    const intervalId = setInterval(() => {
      void fetchTime();
    }, 60000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Configure dayjs to use Thai locale
  dayjs.locale('th');

  const formattedTime = currentTime

  return (
    <Grid container spacing={3}>
      {/* Date and Time Display */}
      <Grid xs={12}>
        <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <div>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  {formattedTime || 'กำลังโหลด...'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
                  {timezone}
                </Typography>
              </div>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers 
          diff={10} 
          trend="up" 
          sx={{ height: '100%' }} 
          value={loading ? '...' : dashboardData.totalCustomer.toLocaleString()} 
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TodayMessages 
          sx={{ height: '100%' }} 
          value={loading ? '...' : dashboardData.totalMessageToday.toLocaleString()} 
          subtitle={loading ? '' : `ส่งออกแล้ว ${dashboardData.totalMessageToday} ข้อความ`} 
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalMessageAsk 
          sx={{ height: '100%' }} 
          value={loading ? '...' : dashboardData.totalMessageAsk.toLocaleString()} 
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalAppointmentsToday 
          sx={{ height: '100%' }} 
          value={loading ? '...' : dashboardData.totalAppointmentToday.toLocaleString()} 
        />
      </Grid>

      {/* Customer statistics by tag */}
      <Grid lg={12} xs={12}>
        <CustomersByTag tags={dashboardData.tag} sx={{ height: '100%' }} />
      </Grid>

   
   
    </Grid>
  );
}
