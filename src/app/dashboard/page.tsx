import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';
import type { Metadata } from 'next';
import * as React from 'react';

import type { Patient } from '@/components/dashboard/overview/patients-by-tag';
import { TodayMessages } from '@/components/dashboard/overview/today-messages';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { config } from '@/config';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

// Mock patient data
const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'สมชาย ใจดี',
    tag: 'รายได้ดีมาก',
    lastVisit: dayjs().subtract(2, 'day').toDate(),
    phoneNumber: '081-234-5678',
  },
  {
    id: 'P002',
    name: 'สมหญิง รักสุข',
    tag: 'รายได้ดีมาก',
    lastVisit: dayjs().subtract(1, 'day').toDate(),
    phoneNumber: '082-345-6789',
  },
  {
    id: 'P003',
    name: 'วิชัย สมบูรณ์',
    tag: 'รายได้ดี',
    lastVisit: dayjs().subtract(3, 'day').toDate(),
    phoneNumber: '083-456-7890',
  },
  {
    id: 'P004',
    name: 'สุดา แสงจันทร์',
    tag: 'รายได้ดี',
    lastVisit: dayjs().subtract(5, 'day').toDate(),
    phoneNumber: '084-567-8901',
  },
  {
    id: 'P005',
    name: 'ประเสริฐ วงศ์ใหญ่',
    tag: 'รายได้ดี',
    lastVisit: dayjs().subtract(4, 'day').toDate(),
    phoneNumber: '085-678-9012',
  },
  {
    id: 'P006',
    name: 'มาลี ดอกบัว',
    tag: 'รายได้พอใช้',
    lastVisit: dayjs().subtract(7, 'day').toDate(),
    phoneNumber: '086-789-0123',
  },
  {
    id: 'P007',
    name: 'สมศักดิ์ เจริญสุข',
    tag: 'รายได้พอใช้',
    lastVisit: dayjs().subtract(6, 'day').toDate(),
    phoneNumber: '087-890-1234',
  },
  {
    id: 'P008',
    name: 'นิภา สวยงาม',
    tag: 'รายได้ดีมาก',
    lastVisit: dayjs().toDate(),
    phoneNumber: '088-901-2345',
  },
];

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      {/* <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid> */}
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={10} trend="up" sx={{ height: '100%' }} value="1.6k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TodayMessages sx={{ height: '100%' }} value="342" subtitle="ส่งออกแล้ว 342 ข้อความ" />
      </Grid>
      {/* <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid> */}

      {/* Patient statistics by tag */}
      <Grid lg={12} xs={12}>
        {/* <PatientsByTag patients={mockPatients} sx={{ height: '100%' }} /> */}
      </Grid>

      {/* <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid> */}
      {/* <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid> */}
      {/* <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          products={[
            {
              id: 'PRD-005',
              name: 'Soja & Co. Eucalyptus',
              image: '/assets/product-5.png',
              updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
            },
            {
              id: 'PRD-004',
              name: 'Necessaire Body Lotion',
              image: '/assets/product-4.png',
              updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-003',
              name: 'Ritual of Sakura',
              image: '/assets/product-3.png',
              updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-002',
              name: 'Lancome Rouge',
              image: '/assets/product-2.png',
              updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),
            },
            {
              id: 'PRD-001',
              name: 'Erbology Aloe Vera',
              image: '/assets/product-1.png',
              updatedAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders
          orders={[
            {
              id: 'ORD-007',
              customer: { name: 'Ekaterina Tankova' },
              amount: 30.5,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-006',
              customer: { name: 'Cao Yu' },
              amount: 25.1,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-004',
              customer: { name: 'Alexa Richardson' },
              amount: 10.99,
              status: 'refunded',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-003',
              customer: { name: 'Anje Keizer' },
              amount: 96.43,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-002',
              customer: { name: 'Clarke Gillebert' },
              amount: 32.54,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-001',
              customer: { name: 'Adam Denisov' },
              amount: 16.76,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid> */}
    </Grid>
  );
}
