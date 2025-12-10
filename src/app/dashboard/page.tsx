'use client';

import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';

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

export default function Page(): React.JSX.Element {
  const [dashboardData, setDashboardData] = React.useState<DashboardData>({
    totalCustomer: 0,
    totalMessageToday: 0,
    totalMessageAsk: 0,
    totalAppointmentToday: 0,
    tag: [],
  });
  const [loading, setLoading] = React.useState(true);

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

  return (
    <Grid container spacing={3}>
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
