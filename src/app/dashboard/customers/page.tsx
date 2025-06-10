/* eslint-disable import/newline-after-import -- a */
/* eslint-disable react/react-in-jsx-scope -- a*/
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style -- aa */
/* eslint-disable @typescript-eslint/no-confusing-void-expression -- a */
/* eslint-disable @typescript-eslint/await-thenable -- a*/
/* eslint-disable @typescript-eslint/no-unused-vars -- a*/
/* eslint-disable @typescript-eslint/no-unsafe-argument -- a*/
/* eslint-disable no-promise-executor-return  -- a*/
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- aa */
/* eslint-disable no-implicit-coercion  -- aa*/
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- Allow unsafe assignments for flexibility with third-party libraries and dynamic form handling */
/* eslint-disable no-console -- Allow console statements for debugging and error logging in development */
/* eslint-disable @typescript-eslint/no-floating-promises -- Allow floating promises for async effects and event handlers */
/* eslint-disable @typescript-eslint/no-unsafe-call -- Allow unsafe calls for flexibility with third-party libraries and dynamic form handling */
/* eslint-disable @typescript-eslint/no-explicit-any -- Allow usage of 'any' type for flexibility in form handling and third-party integrations */
"use client";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import * as React from 'react';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { AddCustomerModal } from '@/components/modal/AaddCustomerModal';
import api from '@/utils/api';
import { Box, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { FieldProps } from 'formik';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';


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


function FormikTextField(props: FieldProps & { label?: string; fullWidth?: boolean }): React.JSX.Element {
  const { field, form, ...rest } = props;
  const { name } = field;
  const touched = (form.touched as Record<string, boolean | undefined>)[name];
  const error = (form.errors as Record<string, string | undefined>)[name];
  return (
    <TextField
      {...field}
      {...rest}
      variant="standard"
      error={Boolean(touched && error)}
      helperText={touched && error ? error : ''}
      fullWidth
    />
  );
}

export default function Page(): React.JSX.Element {
  const sleep = (ms: number) => new Promise((r) => { setTimeout(r, ms) });
  const [dataFromChild, setDataFromChild] = React.useState(false);
  function handleDataFromChild(_data: string): void {
    setDataFromChild(true);
  }


  const [modalOpen, setModalOpen] = React.useState(false);
  const [customer, setCustomer] = React.useState<Customer[]>([]);

  const handleClose = (): void => { setModalOpen(false); };
  React.useEffect(() => {
    void getContact();
  }, []);


  const page = 0;
  const rowsPerPage = 5;

  const paginatedCustomers = applyPagination(customer, page, rowsPerPage);
  const getContact = async () => {
    try {
      const response = await api.get('/contact');
      setCustomer(response.data?.data?.data ?? []);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };

  const postStaff = async (data: any, callback: any) => {
    try {
      await api.post('/contact/create', data);
      if (callback) callback();
      getContact(); // Refresh staff list after adding new item
    } catch (error) {
      console.error('Error posting staff data:', error);
    }
  };
  React.useEffect(() => {
    const fetchData = async () => {
      if (dataFromChild) {
        await getContact();
        setDataFromChild(false); // ไม่ต้องใช้ await กับ setState
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
          <Button onClick={() => { setModalOpen(true); }} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
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
                    {({ meta }: any) => (
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
