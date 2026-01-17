import React, { useState } from 'react';
import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
    Stack,
    Alert,
    Divider,
} from '@mui/material';
import { Check as CheckIcon } from '@phosphor-icons/react/dist/ssr/Check';

interface ImportAppointmentModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export function ImportAppointmentModal({
    open,
    onClose,
    onSave,
}: ImportAppointmentModalProps): React.JSX.Element {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<any | null>(null);

    const handleValidate = () => {
        try {
            if (!jsonInput.trim()) {
                setError('กรุณากรอกข้อมูล JSON');
                setParsedData(null);
                return;
            }
            const parsed = JSON.parse(jsonInput);

            // Basic validation based on sample
            if (typeof parsed !== 'object' || parsed === null) {
                throw new Error('ข้อมูลต้องเป็น JSON Object');
            }

            setParsedData(parsed);
            setError(null);
        } catch (err: any) {
            setError('รูปแบบ JSON ไม่ถูกต้อง: ' + err.message);
            setParsedData(null);
        }
    };

    const handleSave = () => {
        if (parsedData) {
            onSave(parsedData);
            // Reset state
            setJsonInput('');
            setParsedData(null);
            setError(null);
            onClose();
        }
    };

    const handleCloseInternal = () => {
        // Optional: Reset state on close? Or keep it? keeping it simpler for now.
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleCloseInternal}
            aria-labelledby="modal-import-appointment-title"
        >
            <Box sx={style}>
                <Typography id="modal-import-appointment-title" variant="h5" mb={2}>
                    นำเข้าข้อมูลวันนัดหมาย (JSON)
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={2}>
                    วางข้อมูล JSON ที่ได้จากระบบเพื่อนำเข้าข้อมูลการนัดหมาย
                </Typography>

                <TextField
                    label="JSON Data"
                    multiline
                    rows={8}
                    fullWidth
                    variant="outlined"
                    value={jsonInput}
                    onChange={(e) => {
                        setJsonInput(e.target.value);
                        // Reset validation when user types to force re-validation
                        if (parsedData || error) {
                            setParsedData(null);
                            setError(null);
                        }
                    }}
                    placeholder='{ "success": true, "c_data": [...] }'
                    sx={{ mb: 2, fontFamily: 'monospace' }}
                    inputProps={{ style: { fontFamily: 'monospace', fontSize: '12px' } }}
                />

                <Button
                    variant="outlined"
                    onClick={handleValidate}
                    disabled={!jsonInput}
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    ตรวจสอบข้อมูล (Validate)
                </Button>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {parsedData && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', borderRadius: 1, color: 'success.contrastText' }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                            <CheckIcon size={20} />
                            <Typography variant="subtitle1" fontWeight="bold">
                                ข้อมูลถูกต้อง
                            </Typography>
                        </Stack>
                        <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.3)' }} />
                        <Typography variant="body2">
                            <strong>สถานะ (Success):</strong> {parsedData.success ? 'True' : 'False'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>จำนวนรายการ (Count):</strong> {Array.isArray(parsedData.c_data) ? parsedData.c_data.length : 0} รายการ
                        </Typography>
                        {parsedData.d_start && (
                            <Typography variant="body2">
                                <strong>วันที่เริ่มต้น:</strong> {parsedData.d_start}
                            </Typography>
                        )}
                        {parsedData.d_end && (
                            <Typography variant="body2">
                                <strong>วันที่สิ้นสุด:</strong> {parsedData.d_end}
                            </Typography>
                        )}
                    </Box>
                )}

                <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
                    <Button onClick={handleCloseInternal} color="inherit">
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        disabled={!parsedData}
                    >
                        บันทึกข้อมูล
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}
