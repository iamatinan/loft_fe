/* eslint-disable @typescript-eslint/no-unsafe-argument -- a*/
/* eslint-disable no-promise-executor-return  -- a*/
/* eslint-disable @typescript-eslint/no-unsafe-member-access -- aa */
/* eslint-disable no-implicit-coercion  -- aa*/
/* eslint-disable @typescript-eslint/no-unsafe-assignment -- Allow unsafe assignments for flexibility with third-party libraries and dynamic form handling */
/* eslint-disable no-console -- Allow console statements for debugging and error logging in development */
/* eslint-disable @typescript-eslint/no-floating-promises -- Allow floating promises for async effects and event handlers */
/* eslint-disable @typescript-eslint/no-unsafe-call -- Allow unsafe calls for flexibility with third-party libraries and dynamic form handling */
/* eslint-disable @typescript-eslint/no-explicit-any -- Allow usage of 'any' type for flexibility in form handling and third-party integrations */
'use client';
import { AddInventoryModal } from '@/components/dashboard/modal/AddInventoryModal.tsx';
import api from '@/utils/api';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import * as React from 'react';


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

  const [modalOpen, setModalOpen] = React.useState(false);
  const [staff, setStaff] = React.useState<any[]>([]);
  // const [staff, setStaff] = React.useState<{ firstName: string; lastName: string; userType: string; branch: string }[]>(
  //   []
  // );
  // const [staff, setStaff] = React.useState<
  //   {[
  //     firstName: string;
  //     lastName: string;
  //     phone: string;
  //     username: string;
  //     email: string;
  //     addresses: string;
  //     userType: string;
  //     branch: string;
  //   }
  // >([]);

  const handleOpen = () => { setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); };

  const getStaff = async () => {
    try {
      const response = await api.get('/management-user');

      setStaff(response.data.data.data);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };

  const postStaff = async (data: any, callback: any) => {
    try {
      const response = await api.post('/management-user', data);
      if (callback) callback();
      getStaff(); // Refresh staff list after adding new item
    } catch (error) {
      console.error('Error posting staff data:', error);
    }
  };

  React.useEffect(() => {
    getStaff();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item lg={12} sm={12} xs={12}>
        <Typography variant="h5">รายชื่อพนักงาน</Typography>
        <Button onClick={handleOpen} variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>
          เพิ่มสมาชิก
        </Button>
        <AddInventoryModal open={modalOpen} handleClose={handleClose} title="บันทึกข้อมูลพนักงาน">
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              phone: '',
              username: '',
              email: '',
              password: '',
              addresses: '',
              userType: '',
            }}
            onSubmit={async (values, { setSubmitting }) => {
              await sleep(20);
              postStaff(values, () => {
                getStaff();
                handleClose();
                setSubmitting(false);
              });
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Box mb={2}>
                  <Field name="firstName" label="ชื่อ" component={FormikTextField} />
                </Box>

                <Box mb={2}>
                  <Field name="lastName" label="นามสกุล" type="string" component={FormikTextField} />
                </Box>

                <Box mb={2}>
                  <Field
                    name="phone"
                    label="หมายเลขโทรศัพท์"
                    placeholder="99"
                    type="string"
                    component={FormikTextField}
                  />
                </Box>

                <Box mb={2}>
                  <Field name="username" label="username" component={FormikTextField} />
                </Box>
                <Box mb={2}>
                  <Field name="email" label="email" component={FormikTextField} />
                </Box>
                <Box mb={2}>
                  <Field name="password" label="password" component={FormikTextField} />
                </Box>
                <Box mb={2}>
                  <Field name="addresses" label="addresses" component={FormikTextField} />
                </Box>
                <Box mb={2}>
                  <Field name="userType">
                    {({ field }: any) => (
                      <RadioGroup {...field}>
                        {['Admin', 'agent', 'Supervisor'].map((type) => (
                          <FormControlLabel key={type} value={type} control={<Radio />} label={type} />
                        ))}
                      </RadioGroup>
                    )}
                  </Field>
                </Box>

                <Button type="submit" disabled={isSubmitting} variant="contained" color="primary">
                  บันทึก
                </Button>
              </Form>
            )}
          </Formik>
        </AddInventoryModal>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="staff table">
            <TableHead>
              <TableRow>
                <TableCell align="right">ชื่อ</TableCell>
                <TableCell align="right">นามสกุล</TableCell>
                <TableCell align="right">ตำแหน่ง</TableCell>
                <TableCell align="right">สาขา</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(staff) && staff.length > 0 ? (
                staff.map((member, index) => {
        
                  return (
                    <TableRow key={index}>
                      <TableCell align="right">{member.firstName}</TableCell>
                      <TableCell align="right">{member.lastName}</TableCell>
                      <TableCell align="right">{member.userType}</TableCell>
                      <TableCell align="right">{member.branch}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
