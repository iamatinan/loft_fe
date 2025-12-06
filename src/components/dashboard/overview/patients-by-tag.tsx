'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

export interface Patient {
  id: string;
  name: string;
  tag: 'รายได้พอใช้' | 'รายได้ดี' | 'รายได้ดีมาก';
  lastVisit: Date;
  phoneNumber: string;
}

export interface PatientsByTagProps {
  patients: Patient[];
  sx?: SxProps;
}

const tagColors: Record<Patient['tag'], string> = {
  'รายได้พอใช้': '#9E9E9E',
  'รายได้ดี': '#2196F3',
  'รายได้ดีมาก': '#4CAF50',
};

export function PatientsByTag({ patients, sx }: PatientsByTagProps): React.JSX.Element {
  const theme = useTheme();

  // Group patients by tag and count
  const patientsByTag = patients.reduce<Record<string, number>>((acc, patient) => {
    if (!acc[patient.tag]) {
      acc[patient.tag] = 0;
    }
    acc[patient.tag] += 1;
    return acc;
  }, {});

  const tagOrder: Patient['tag'][] = ['รายได้ดีมาก', 'รายได้ดี', 'รายได้พอใช้'];
  
  const chartSeries = tagOrder.map((tag) => patientsByTag[tag] || 0);
  const colors = tagOrder.map((tag) => tagColors[tag]);

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
    },
    colors,
    dataLabels: { enabled: true },
    legend: { show: false },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '50%',
        horizontal: false,
      },
    },
    theme: { mode: theme.palette.mode },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} คน`,
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      categories: tagOrder,
      labels: {
        style: {
          colors: [theme.palette.text.secondary, theme.palette.text.secondary, theme.palette.text.secondary],
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => {
          if (typeof value === 'number') {
            return Math.floor(value).toString();
          }
          return '';
        },
        style: {
          colors: [theme.palette.text.secondary],
        },
      },
      title: {
        text: 'จำนวนคนไข้',
        style: {
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  const totalPatients = chartSeries.reduce((sum, count) => sum + count, 0);

  return (
    <Card sx={sx}>
      <CardHeader 
        title="รายการคนไข้แบ่งตาม Tag" 
        subheader={`รวมทั้งหมด ${totalPatients} คน`}
      />
      <CardContent>
        <Chart height={350} options={chartOptions} series={[{ name: 'จำนวนคนไข้', data: chartSeries }]} type="bar" />
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'center', mt: 2 }}>
          {tagOrder.map((tag) => {
            const count = patientsByTag[tag] || 0;
            const percentage = totalPatients > 0 ? ((count / totalPatients) * 100).toFixed(1) : 0;

            return (
              <Stack key={tag} spacing={0.5} sx={{ alignItems: 'center' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: tagColors[tag],
                    }}
                  />
                  <Typography variant="body2">{tag}</Typography>
                </Stack>
                <Typography variant="h6">{count}</Typography>
                <Typography color="text.secondary" variant="caption">
                  {percentage}%
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
