'use client';

import * as React from 'react';
import type { IinitialValuesCreateCustomer, MetaCustomerData } from '@/app/interface/interface';
import api from '@/utils/api';
import { Box, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import type { FieldProps } from 'formik';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
// import type { Customer } from '@/components/dashboard/customer/customers-table';
// import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import CustomersTable from '@/components/dashboard/customer/customers-table';
import { AddCustomerModal } from '@/components/modal/AaddCustomerModal';
import { ImportAppointmentModal } from '@/components/modal/ImportAppointmentModal';

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

// ย้าย useCustomers จาก customers-table มาไว้ที่นี่
function useCustomers(
  page: number,
  rowsPerPage: number,
  keyword: string,
  tagId: string,
  orderBy?: string,
  orderType?: -1 | 1,
  isLineUnsynced?: boolean
) {
  const [data, setData] = React.useState<MetaCustomerData>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCustomers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: MetaCustomerData = await api.get('/contact', {
        params: {
          limit: rowsPerPage,
          page: page + 1,
          showDataAll: false,
          ...(keyword ? { keyword } : {}),
          ...(tagId ? { tagId } : {}),
          ...(orderBy ? { orderBy } : {}),
          ...(orderType ? { orderType } : {}),
          ...(isLineUnsynced ? { isLineUnsynced } : {}),
        },
      });
      // Interceptor ใน api.ts จะแปลง response.data.data -> response.data แล้ว
      setData(response);
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, keyword, tagId, orderBy, orderType, isLineUnsynced]);

  React.useEffect(() => {
    void fetchCustomers();
  }, [fetchCustomers]);

  return { data, loading, error, refetch: fetchCustomers };
}

interface Tag {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

interface MetaTagData {
  data: Tag[];
  meta: {
    count: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}

function useTags() {
  const [data, setData] = React.useState<Tag[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const response: MetaTagData = await api.get('/master/tag', {
          params: { page: 1, limit: 100 },
        });
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch tags', err);
      } finally {
        setLoading(false);
      }
    };
    void fetchTags();
  }, []);

  return { tags: data, loading };
}

export default function Page(): React.JSX.Element {
  const sleep = (ms: number) =>
    new Promise((r) => {
      setTimeout(r, ms);
    });
  const [modalOpenAddCustomer, setModalOpenAddCustomer] = React.useState(false);
  const [modalAppointmentOpen, setModalAppointmentOpen] = React.useState(false);
  const handleCloseAppointment = (): void => {
    setModalAppointmentOpen(false);
  };
  const handleCloseAddCustomer = (): void => {
    setModalOpenAddCustomer(false);
  };
  const postStaff = async (data: any, callback: any) => {
    try {
      await api.post('/contact/create', data);
      if (callback) callback();
      // getContact(); // Refresh staff list after adding new item
    } catch (error) {
      console.error('Error posting staff data:', error);
    }
  };

  const postAppointment = async (data: any, callback: any) => {
    try {
      await api.patch('/contact/add-appointment', data);
      if (callback) callback();
      // getContact(); // Refresh staff list after adding new item
    } catch (error) {
      console.error('Error posting staff data:', error);
    }
  };
  // const getContact = async () => {
  //   try {
  //     const response = await api.get('/contact');
  //     // setCustomer(response.data?.data?.data ?? []);
  //     // setCustomer(response.data?.data); // set เป็น metaCustomerData object
  //   } catch (error) {
  //     console.error('Error fetching staff data:', error);
  //   }
  // };
  const validationSchema = Yup.object({
    firstName: Yup.string().required('กรุณากรอกชื่อ'),
    lastName: Yup.string().required('กรุณากรอกนามสกุล'),
    phone: Yup.string().required('กรุณากรอกเบอร์โทร'),
    email: Yup.string().email('อีเมลไม่ถูกต้อง'),
  });

  // State สำหรับตารางลูกค้า
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [keyword, setKeyword] = React.useState('');
  const [tagId, setTagId] = React.useState('');
  const [isLineUnsynced, setIsLineUnsynced] = React.useState(false);
  const [orderBy, setOrderBy] = React.useState<string>('');
  const [orderType, setOrderType] = React.useState<-1 | 1>(1);
  const {
    data: customerData,
    loading,
    error,
    refetch,
  } = useCustomers(page, rowsPerPage, keyword, tagId, orderBy, orderType, isLineUnsynced);
  const { tags } = useTags();

  // Handler สำหรับเปลี่ยนหน้า/จำนวนแถว
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(0);
  };
  const handleTagChange = (value: string) => {
    setTagId(value);
    setPage(0);
  };
  const handleIsLineUnsyncedChange = (value: boolean) => {
    setIsLineUnsynced(value);
    setPage(0);
  };

  const handleSort = (columnName: string) => {
    if (orderBy === columnName) {
      // Toggle sort order if same column
      setOrderType(orderType === 1 ? -1 : 1);
    } else {
      // Set new column and default to ascending
      setOrderBy(columnName);
      setOrderType(1);
    }
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">รายชื่อลูกค้า</Typography>
          {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack> */}
        </Stack>
        <div>
          <Button
            onClick={() => {
              setModalOpenAddCustomer(true);
            }}
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
          >
            เพิ่มรายชื่อลูกค้า
          </Button>
        </div>
        <div>
          <Button
            onClick={() => {
              setModalAppointmentOpen(true);
            }}
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
          >
            เพิ่มข้อมูลวันนัด
          </Button>
        </div>

        <AddCustomerModal open={modalOpenAddCustomer} handleClose={handleCloseAddCustomer} title="บันทึกข้อมูลพนักงาน">
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
                dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth) : null,
                email: values.email.trim(),
                addresses: values.addresses.trim(),
                customerType: values.customerType.trim(),
              };

              await sleep(20);
              postStaff(valuesToSubmit, () => {
                handleCloseAddCustomer();
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
                            <FormControlLabel key={type} value={type} control={<Radio />} label={type} />
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

        <ImportAppointmentModal
          open={modalAppointmentOpen}
          onClose={handleCloseAppointment}
          onSave={async (parsedData) => {
            await sleep(20);
            // Sending the parsed JSON directly to the API
            postAppointment(parsedData, () => {
              handleCloseAppointment();
            });
          }}
        />
      </Stack>
      {/* Loading & Error */}
      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}
      {error && <Box color="error.main">{error}</Box>}
      <CustomersFilters
        keyword={keyword}
        onKeywordChange={handleKeywordChange}
        tagId={tagId}
        onTagChange={handleTagChange}
        tags={tags}
        showUnsyncedFilter={true}
        isUnsynced={isLineUnsynced}
        onUnsyncedChange={handleIsLineUnsyncedChange}
        unsyncedLabel="ลูกค้าที่ยังไม่ได้ sync line"
      />
      <CustomersTable
        customer={customerData?.data}
        page={page}
        rowsPerPage={rowsPerPage}
        count={customerData?.meta.count ?? 0}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        refetch={refetch}
        orderBy={orderBy}
        orderType={orderType}
        onSort={handleSort}
      />
    </Stack>
  );
}
