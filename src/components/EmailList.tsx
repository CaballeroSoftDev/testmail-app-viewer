import React, { useState } from 'react';
import { List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, Paper, Divider, Box, TextField, Button, Stack } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Email {
  id: string;
  subject: string;
  from: string;
  date: number;
  text: string;
  html: string;
}

export type FilterParams = {
  tagPrefix: string;
  limit: number;
  offset: number;
  fromTimestamp: string;
  toTimestamp: string;
};

interface EmailListProps {
  emails: Email[];
  onSelectEmail: (email: Email) => void;
  selectedEmailId?: string | null;
  onRefresh?: (filters: FilterParams) => void;
  loading?: boolean;
}

const getInitials = (from: string) => {
  const match = from.match(/([A-ZÁÉÍÓÚÑa-záéíóúñ])[A-ZÁÉÍÓÚÑa-záéíóúñ]*\s*([A-ZÁÉÍÓÚÑa-záéíóúñ])?/);
  if (match) {
    return (match[1] || '').toUpperCase() + (match[2] || '').toUpperCase();
  }
  return from.charAt(0).toUpperCase();
};

const EmailList: React.FC<EmailListProps> = ({ emails, onSelectEmail, selectedEmailId, onRefresh, loading }) => {
  const [tagPrefix, setTagPrefix] = useState('');
  const [limit, setLimit] = useState(100);
  const [offset, setOffset] = useState(0);
  const [fromTimestamp, setFromTimestamp] = useState<string>('');
  const [toTimestamp, setToTimestamp] = useState<string>('');

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh({
        tagPrefix,
        limit,
        offset,
        fromTimestamp,
        toTimestamp,
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 3 }}>
      <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid #eee', background: '#fff', zIndex: 1 }}>
        <Stack spacing={1}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ borderRadius: 4, fontWeight: 'bold', fontSize: 18, mb: 1, py: 1 }}
            onClick={handleRefresh}
            disabled={loading}
          >
            REFRESH
          </Button>
          <TextField
            label="Tag Prefix"
            value={tagPrefix}
            onChange={e => setTagPrefix(e.target.value)}
            size="small"
            fullWidth
            sx={{ borderRadius: 4 }}
            InputProps={{ style: { borderRadius: 20 } }}
          />
          <Stack direction="row" spacing={1}>
            <TextField
              label="Limit"
              value={limit}
              onChange={e => setLimit(Number(e.target.value))}
              size="small"
              type="number"
              fullWidth
              sx={{ borderRadius: 4 }}
              InputProps={{ style: { borderRadius: 20 } }}
            />
            <TextField
              label="Offset"
              value={offset}
              onChange={e => setOffset(Number(e.target.value))}
              size="small"
              type="number"
              fullWidth
              sx={{ borderRadius: 4 }}
              InputProps={{ style: { borderRadius: 20 } }}
            />
          </Stack>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Stack direction="row" spacing={1}>
              <DatePicker
                label="From Timestamp"
                value={fromTimestamp ? new Date(fromTimestamp) : null}
                onChange={date => setFromTimestamp(date ? format(date, 'yyyy-MM-dd') : '')}
                slotProps={{ textField: { size: 'small', fullWidth: true, sx: { borderRadius: 4 }, InputProps: { style: { borderRadius: 20 } }, InputLabelProps: { shrink: true } } }}
              />
              <DatePicker
                label="To Timestamp"
                value={toTimestamp ? new Date(toTimestamp) : null}
                onChange={date => setToTimestamp(date ? format(date, 'yyyy-MM-dd') : '')}
                slotProps={{ textField: { size: 'small', fullWidth: true, sx: { borderRadius: 4 }, InputProps: { style: { borderRadius: 20 } }, InputLabelProps: { shrink: true } } }}
              />
            </Stack>
          </LocalizationProvider>
        </Stack>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <List sx={{ minHeight: 0 }}>
          {emails.map((email, index) => (
            <React.Fragment key={email.id}>
              <ListItemButton
                selected={selectedEmailId === email.id}
                onClick={() => onSelectEmail(email)}
                sx={{
                  alignItems: 'flex-start',
                  py: 2,
                  px: 2,
                  borderLeft: selectedEmailId === email.id ? '4px solid #1976d2' : '4px solid transparent',
                  background: selectedEmailId === email.id ? '#e3f2fd' : 'inherit',
                  transition: 'background 0.2s',
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 'bold' }}>
                    {getInitials(email.from)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#222' }}>
                      {email.subject}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {email.from}
                      </Typography>
                      <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {format(new Date(email.date), 'PPp', { locale: es })}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
              {index < emails.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default EmailList; 