'use client';

import * as React from 'react';
import api from '@/utils/api';
import { Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import type { FieldProps } from 'formik';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import { TagsFilters } from '@/components/dashboard/tags/tags-filters';
import { TagsTable } from '@/components/dashboard/tags/tags-table';
import { AddTagModal } from '@/components/modal/AddTagModal';

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

interface Tag {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MetaTagData {
  data: Tag[];
  meta: {
    count: number;
    page: number;
    limit: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    orderBy?: Record<string, number>;
  };
}

interface IinitialValuesCreateTag {
  name: string;
  description?: string;
}

function useTags(
  page: number,
  rowsPerPage: number,
  keyword: string
): { data: MetaTagData | undefined; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = React.useState<MetaTagData>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchTags = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: MetaTagData = await api.get('/master/tag', {
        params: { page: page + 1, limit: rowsPerPage, keyword },
      });
      setData(response);
    } catch (err) {
      setError('Failed to fetch tags');
      // eslint-disable-next-line no-console -- Allow console for error logging
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, keyword]);

  React.useEffect(() => {
    void fetchTags();
  }, [fetchTags]);

  return { data, loading, error, refetch: fetchTags };
}

const validationSchema = Yup.object({
  name: Yup.string().required('กรุณาระบุชื่อ Tag'),
  description: Yup.string(),
});

export default function Page(): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [keyword, setKeyword] = React.useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [editingTag, setEditingTag] = React.useState<Tag | null>(null);

  const { data, loading, error, refetch } = useTags(page, rowsPerPage, keyword);

  const handlePageChange = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleKeywordChange = (value: string): void => {
    setKeyword(value);
    setPage(0);
  };

  const handleOpenModal = (): void => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsCreateModalOpen(false);
    setEditingTag(null);
  };

  const handleEdit = (tag: Tag): void => {
    setEditingTag(tag);
    setIsCreateModalOpen(true);
  };

  const initialValues: IinitialValuesCreateTag = {
    name: editingTag?.name ?? '',
    description: editingTag?.description ?? '',
  };

  const handleSubmit = async (
    values: IinitialValuesCreateTag,
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ): Promise<void> => {
    try {
      const payload = {
        ...values,
        description: values.description === '' ? null : values.description,
      };
      if (editingTag) {
        await api.patch(`/master/tag/${editingTag._id}`, payload);
      } else {
        await api.post('/master/tag', payload);
      }
      resetForm();
      handleCloseModal();
      refetch();
    } catch (err) {
      // eslint-disable-next-line no-console -- Allow console for error logging
      console.error('Failed to save tag:', err);
      // eslint-disable-next-line no-alert -- Allow alert for error notification
      alert('เกิดข้อผิดพลาดในการบันทึก Tag');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">จัดการ Tags</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleOpenModal}
          >
            เพิ่ม Tag
          </Button>
        </div>
      </Stack>

      <TagsFilters keyword={keyword} onKeywordChange={handleKeywordChange} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error || data?.data.length === 0 ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TagsTable
          tags={data?.data ?? []}
          page={page}
          rowsPerPage={rowsPerPage}
          count={data?.meta?.count ?? 0}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          refetch={refetch}
          onEdit={handleEdit}
        />
      )}

      <AddTagModal open={isCreateModalOpen} handleClose={handleCloseModal} title={editingTag ? 'แก้ไข Tag' : 'เพิ่ม Tag ใหม่'}>
        <Formik initialValues={initialValues} validationSchema={validationSchema} enableReinitialize onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Field name="name" component={FormikTextField} label="ชื่อ Tag *" fullWidth />
                <Field name="description" component={FormikTextField} label="คำอธิบาย" fullWidth multiline rows={3} />
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} fullWidth>
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </AddTagModal>
    </Stack>
  );
}
