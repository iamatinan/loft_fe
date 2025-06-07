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
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
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
  const [inventory, setInventory] = React.useState<
    { name: string; quantity: number; cost: number; description: string }[]
  >([]);

  const handleOpen = () => { setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); };

  const getInventory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:4002/api/v1/inventory');
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

  const postInventory = async (data: any, callback: any) => {
    try {
      const response = await axios.post('http://127.0.0.1:4002/api/v1/inventory', data);
      console.log('response', response.data);
      if (callback) callback();
      getInventory(); // Refresh inventory after adding new item
    } catch (error) {
      console.error('Error posting inventory data:', error);
    }
  };

  React.useEffect(() => {
    getInventory();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item lg={12} sm={12} xs={12}>
        <Typography variant="h5">ระบบจัดการคลังสินค้า</Typography>
        <Button onClick={handleOpen} variant="contained" color="primary" sx={{ mt: 2, mb: 2 }}>
          เพิ่มสินค้า
        </Button>
        <AddInventoryModal open={modalOpen} handleClose={handleClose} title="บันทึกข้อมูลคลังสินค้า">
          <Formik
            initialValues={{
              name: '',
              quantity: '',
              cost: '',
              description: '',
            }}
            onSubmit={async (values, { setSubmitting }) => {
              console.log('ini values', values);
              await sleep(20);
              const parsedValues = {
                ...values,
                quantity: Number(values.quantity),
                cost: Number(values.cost),
              };
              postInventory(parsedValues, () => {
                getInventory();
                handleClose();
                setSubmitting(false);
              });
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Box mb={2}>
                  <Field name="name" label="ชื่อสินค้า" component={FormikTextField} />
                </Box>

                <Box mb={2}>
                  <Field name="quantity" label="จำนวน" placeholder="9999" type="number" component={FormikTextField} />
                </Box>

                <Box mb={2}>
                  <Field name="cost" label="ราคาต้นทุน" placeholder="99" type="number" component={FormikTextField} />
                </Box>

                <Box mb={2}>
                  <Field name="description" label="รายละเอียด" component={FormikTextField} />
                </Box>

                <Button type="submit" disabled={isSubmitting} variant="contained" color="primary">
                  บันทึก
                </Button>
              </Form>
            )}
          </Formik>
        </AddInventoryModal>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="inventory table">
            <TableHead>
              <TableRow>
                <TableCell>ราการคลัง</TableCell>
                <TableCell align="right">จำนวน</TableCell>
                <TableCell align="right">ราคาต้นทุน</TableCell>
                <TableCell align="right">รายละเอียด</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">{row.cost}</TableCell>
                  <TableCell align="right">{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
