"use client";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import type { Metadata } from 'next';
import * as React from 'react';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { AddCustomerModal } from '@/components/modal/addCustomerModal';
import { config } from '@/config';
import { Box, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

// const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

// const customers = [
//   {
//     id: 'USR-010',
//     name: 'Alcides Antonio',
//     avatar: '/assets/avatar-10.png',
//     email: 'alcides.antonio@devias.io',
//     phone: '908-691-3242',
//     address: { city: 'Madrid', country: 'Spain', state: 'Comunidad de Madrid', street: '4158 Hedge Street' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-009',
//     name: 'Marcus Finn',
//     avatar: '/assets/avatar-9.png',
//     email: 'marcus.finn@devias.io',
//     phone: '415-907-2647',
//     address: { city: 'Carson City', country: 'USA', state: 'Nevada', street: '2188 Armbrester Drive' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-008',
//     name: 'Jie Yan',
//     avatar: '/assets/avatar-8.png',
//     email: 'jie.yan.song@devias.io',
//     phone: '770-635-2682',
//     address: { city: 'North Canton', country: 'USA', state: 'Ohio', street: '4894 Lakeland Park Drive' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-007',
//     name: 'Nasimiyu Danai',
//     avatar: '/assets/avatar-7.png',
//     email: 'nasimiyu.danai@devias.io',
//     phone: '801-301-7894',
//     address: { city: 'Salt Lake City', country: 'USA', state: 'Utah', street: '368 Lamberts Branch Road' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-006',
//     name: 'Iulia Albu',
//     avatar: '/assets/avatar-6.png',
//     email: 'iulia.albu@devias.io',
//     phone: '313-812-8947',
//     address: { city: 'Murray', country: 'USA', state: 'Utah', street: '3934 Wildrose Lane' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-005',
//     name: 'Fran Perez',
//     avatar: '/assets/avatar-5.png',
//     email: 'fran.perez@devias.io',
//     phone: '712-351-5711',
//     address: { city: 'Atlanta', country: 'USA', state: 'Georgia', street: '1865 Pleasant Hill Road' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },

//   {
//     id: 'USR-004',
//     name: 'Penjani Inyene',
//     avatar: '/assets/avatar-4.png',
//     email: 'penjani.inyene@devias.io',
//     phone: '858-602-3409',
//     address: { city: 'Berkeley', country: 'USA', state: 'California', street: '317 Angus Road' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-003',
//     name: 'Carson Darrin',
//     avatar: '/assets/avatar-3.png',
//     email: 'carson.darrin@devias.io',
//     phone: '304-428-3097',
//     address: { city: 'Cleveland', country: 'USA', state: 'Ohio', street: '2849 Fulton Street' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-002',
//     name: 'Siegbert Gottfried',
//     avatar: '/assets/avatar-2.png',
//     email: 'siegbert.gottfried@devias.io',
//     phone: '702-661-1654',
//     address: { city: 'Los Angeles', country: 'USA', state: 'California', street: '1798 Hickory Ridge Drive' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
//   {
//     id: 'USR-001',
//     name: 'Miron Vitold',
//     avatar: '/assets/avatar-1.png',
//     email: 'miron.vitold@devias.io',
//     phone: '972-333-4106',
//     address: { city: 'San Diego', country: 'USA', state: 'California', street: '75247' },
//     createdAt: dayjs().subtract(2, 'hours').toDate(),
//   },
// ] satisfies Customer[];
export interface IinitialValuesCreateCustomer {
  name: string;
  lastName: string;
  phone: string;
  lineId: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  dateOfBirth: Date | null;
  email: string;
  addresses: string;
  customerType: string;

}

const FormikTextField = ({ field, form, ...props }: any) => {
  return (
    <TextField
      {...field}
      {...props}
      variant="standard"
      error={form.touched[field.name] && !!form.errors[field.name]}
      helperText={form.touched[field.name] && form.errors[field.name]}
      fullWidth
    />
  );
};

export default function Page(): React.JSX.Element {
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const [dataFromChild, setDataFromChild] = React.useState(false);
  function handleDataFromChild(data: string) {
    setDataFromChild(true);
  }
  console.log('dataFromChild:', dataFromChild);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [customer, setCustomer] = React.useState<any[]>([]);

  const handleClose = () => setModalOpen(false);
  React.useEffect(() => {
    getContact();
  }, []);


  const page = 0;
  const rowsPerPage = 5;

  const paginatedCustomers = applyPagination(customer, page, rowsPerPage);
  const getContact = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:4001/api/v1/contact');
      console.log('response.data.data.data:', response.data.data.data);
      setCustomer(response.data.data.data);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };

  const postStaff = async (data: any, callback: any) => {
    try {
      const response = await axios.post('http://127.0.0.1:4001/api/v1/contact/create', data);
      if (callback) callback();
      getContact(); // Refresh staff list after adding new item
    } catch (error) {
      console.error('Error posting staff data:', error);
    }
  };
  React.useEffect(() => {
    const fetchData = async () => {
      console.log('dataFromChild:', dataFromChild);
      if (dataFromChild) {
        console.log('get contact again');
        await getContact();
        await setDataFromChild(false); // ไม่ต้องใช้ await กับ setState
      }
    };

    fetchData();
  }, [dataFromChild]);
  const validationSchema = Yup.object({
    firstName: Yup.string().required('กรุณากรอกชื่อ'),
    lastName: Yup.string().required('กรุณากรอกนามสกุล'),
    phone: Yup.string().required('กรุณากรอกเบอร์โทร'),
    email: Yup.string().email('อีเมลไม่ถูกต้อง'),
  });

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">รายชื่อลูกค้า</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button onClick={() => setModalOpen(true)} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            เพิ่มรายชื่อลูกค้า
          </Button>
        </div>

        <AddCustomerModal open={modalOpen} handleClose={handleClose} title="บันทึกข้อมูลพนักงาน">
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              phone: '',
              lineId: '',
              age: '',
              weight: '',
              height: '',
              dateOfBirth: null,
              email: '',
              addresses: '',
              customerType: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              const valuesToSubmit: IinitialValuesCreateCustomer = {
                name: values.firstName.trim(),
                lastName: values.lastName.trim(),
                phone: values.phone.trim(),
                lineId: values.lineId.trim(),
                age: values.age ? Number(values.age) : null,
                weight: values.weight ? Number(values.weight) : null,
                height: values.height ? Number(values.height) : null,
                dateOfBirth: values.dateOfBirth
                  ? new Date(values.dateOfBirth) : null,
                email: values.email.trim(),
                addresses: values.addresses.trim(),
                customerType: values.customerType.trim(),
              }

              await sleep(20);
              postStaff(valuesToSubmit, () => {
                getContact();
                handleClose();
                setSubmitting(false);
              });
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                <Box mb={2}>
                  <Field name="firstName" label="ชื่อ" component={FormikTextField} fullWidth />
                </Box>

                <Box mb={2}>
                  <Field name="lastName" label="นามสกุล" component={FormikTextField} fullWidth />
                </Box>

                <Box mb={2}>
                  <Field name="dateOfBirth">
                    {({ field, meta }: any) => (
                      <DatePicker
                        label="วันเกิด"
                        value={values.dateOfBirth}
                        onChange={(newValue) => {
                          setFieldValue('dateOfBirth', newValue);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!meta.touched && !!meta.error,
                            helperText: meta.touched && meta.error,
                          },
                        }}
                      />
                    )}
                  </Field>
                </Box>

                <Box mb={2}>
                  <Field name="age" label="อายุ" component={FormikTextField} fullWidth />
                </Box>

                <Box mb={2}>
                  <Field name="weight" label="น้ำหนัก" component={FormikTextField} fullWidth />
                </Box>

                <Box mb={2}>
                  <Field name="height" label="ส่วนสูง" component={FormikTextField} fullWidth />
                </Box>

                <Box mb={2}>
                  <Field
                    name="phone"
                    label="หมายเลขโทรศัพท์"
                    placeholder="099..."
                    component={FormikTextField}
                    fullWidth
                  />
                </Box>

                <Box mb={2}>
                  <Field name="lineId" label="Line ID" component={FormikTextField} fullWidth />
                </Box>

                <Box mb={2}>
                  <Field name="email" label="Email" component={FormikTextField} fullWidth />
                </Box>

                <Box mb={2}>
                  <Field name="addresses" label="ที่อยู่" component={FormikTextField} fullWidth />
                </Box>

                <Box mb={2}>
                  <Field name="customerType">
                    {({ field }: any) => (
                      <>
                        <FormLabel component="legend">ประเภทลูกค้า</FormLabel>
                        <RadioGroup {...field} row>
                          {['บุคคล', 'บริษัท'].map((type) => (
                            <FormControlLabel
                              key={type}
                              value={type}
                              control={<Radio />}
                              label={type}
                            />
                          ))}
                        </RadioGroup>
                      </>
                    )}
                  </Field>
                </Box>

                <Button type="submit" disabled={isSubmitting} variant="contained" color="primary">
                  บันทึก
                </Button>
              </Form>
            )}
          </Formik>
        </AddCustomerModal>
      </Stack>
      <CustomersFilters />
      <CustomersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        sendDataToParent={handleDataFromChild}
      />
    </Stack >
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
