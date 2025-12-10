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

export interface TagData {
  name: string;
  count: number;
}

export interface CustomersByTagProps {
  tags: TagData[];
  sx?: SxProps;
}

const tagColors: Record<string, string> = {
  'vip': '#FFD700',
  'new': '#2196F3',
  'member': '#4CAF50',
};

const getTagColor = (tagName: string): string => {
  const lowerTag = tagName.toLowerCase();
  return tagColors[lowerTag] || '#9E9E9E';
};

export function CustomersByTag({ tags, sx }: CustomersByTagProps): React.JSX.Element {
  const theme = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle empty tags
  const hasData = tags && tags.length > 0;
  const chartSeries = hasData ? tags.map((tag) => tag.count) : [0];
  const categories = hasData ? tags.map((tag) => tag.name) : ['No Data'];
  const colors = hasData ? tags.map((tag) => getTagColor(tag.name)) : ['#9E9E9E'];

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: { show: false },
      width: '100%',
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
      categories,
      labels: {
        style: {
          colors: categories.map(() => theme.palette.text.secondary),
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => {
          if (typeof value === 'number' && !isNaN(value)) {
            return Math.floor(value).toString();
          }
          return '0';
        },
        style: {
          colors: [theme.palette.text.secondary],
        },
      },
      title: {
        text: 'จำนวนลูกค้า',
        style: {
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  const totalCustomers = chartSeries.reduce((sum, count) => sum + count, 0);

  return (
    <Card sx={sx}>
      <CardHeader 
        title="ลูกค้าแบ่งตาม Tag" 
        subheader={hasData ? `รวมทั้งหมด ${totalCustomers.toLocaleString()} คน` : 'ไม่มีข้อมูล'}
      />
      <CardContent>
        {hasData && mounted ? (
          <>
            <Chart height={350} options={chartOptions} series={[{ name: 'จำนวนลูกค้า', data: chartSeries }]} type="bar" width="100%" />
            <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
              {tags.map((tag) => {
                const percentage = totalCustomers > 0 ? ((tag.count / totalCustomers) * 100).toFixed(1) : 0;

                return (
                  <Stack key={tag.name} spacing={0.5} sx={{ alignItems: 'center', minWidth: 100 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: getTagColor(tag.name),
                        }}
                      />
                      <Typography variant="body2">{tag.name}</Typography>
                    </Stack>
                    <Typography variant="h6">{tag.count.toLocaleString()}</Typography>
                    <Typography color="text.secondary" variant="caption">
                      {percentage}%
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </>
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            กำลังโหลดข้อมูล...
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
