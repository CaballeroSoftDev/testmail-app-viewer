import React, { useState } from 'react';
import { List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, Paper, Divider, Box, TextField, Button, Stack, CircularProgress, Select, MenuItem, FormControl, InputLabel, Autocomplete } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Email {
  id: string;
  subject: string;
  from: string;
  to: string;
  tag: string;
  date: number;
  text: string;
  html: string;
}

export type FilterParams = {
  tagPrefix: string;
  limit: number;
  offset: number;
};

interface EmailListProps {
  emails: Email[];
  count: number;
  onSelectEmail: (email: Email) => void;
  selectedEmailId?: string | null;
  onRefresh?: (filters: FilterParams) => void;
  loading?: boolean;
  apiKey: string;
  namespace: string;
}

const getInitials = (from: string) => {
  const match = from.match(/([A-ZÁÉÍÓÚÑa-záéíóúñ])[A-ZÁÉÍÓÚÑa-záéíóúñ]*\s*([A-ZÁÉÍÓÚÑa-záéíóúñ])?/);
  if (match) {
    return (match[1] || '').toUpperCase() + (match[2] || '').toUpperCase();
  }
  return from.charAt(0).toUpperCase();
};

const EmailList: React.FC<EmailListProps> = ({ emails, onSelectEmail, selectedEmailId, onRefresh, loading, count, apiKey, namespace }) => {
  if (!apiKey || !namespace) {
    return (
      <Paper elevation={3} sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 3 }}>
        <Typography color="text.secondary" align="center">
          Set your API Key and Namespace to view emails.
        </Typography>
      </Paper>
    );
  }

  const [tagPrefix, setTagPrefix] = useState('');
  const [limit, setLimit] = useState(100);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(count / limit);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh({
        tagPrefix,
        limit,
        offset
      });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
      setOffset((page + 1) * limit);
      if (onRefresh) onRefresh({
        tagPrefix,
        limit,
        offset: (page + 1) * limit,
      });
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
      setOffset((page - 1) * limit);
      if (onRefresh) onRefresh({
        tagPrefix,
        limit,
        offset: (page - 1) * limit,
      });
    }
  };

  const handleLimitChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newLimit = Number(event.target.value);
    setLimit(newLimit);
    setPage(0);
    setOffset(0);
    if (onRefresh) onRefresh({
      tagPrefix,
      limit: newLimit,
      offset: 0,
    });
  };

  const tagPrefixOptions = Array.from(new Set(emails.map(email => email.tag.split(' ')[0])));

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 3 }}>
      <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid #eee', background: '#fff', zIndex: 1 }}>
        <Stack spacing={1}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ borderRadius: 4, fontWeight: 'bold', fontSize: 18, mb: 1, py: .5 }}
            onClick={handleRefresh}
            disabled={loading}
          >
            REFRESH
          </Button>
          <Autocomplete
            freeSolo
            options={tagPrefixOptions}
            value={tagPrefix}
            onInputChange={(_, newValue) => setTagPrefix(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tag Prefix"
                size="small"
                fullWidth
                sx={{ borderRadius: 4 }}
                InputProps={{ ...params.InputProps, style: { borderRadius: 20 } }}
              />
            )}
          />
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
            <Button
              variant="outlined"
              size='small'
              onClick={handlePreviousPage}
              disabled={page === 0 || loading}
              sx={{ borderRadius: 4 }}
            >
              &lt;
            </Button>
            <Typography variant="body2">
              Page {page + 1} of {totalPages}
            </Typography>
            <Button
              variant="outlined"
              size='small'
              onClick={handleNextPage}
              disabled={page >= totalPages - 1 || loading}
              sx={{ borderRadius: 4 }}
            >
              &gt;
            </Button>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
              <InputLabel id="limit-select-label">Limit</InputLabel>
              <Select
                labelId="limit-select-label"
                id="limit-select"
                value={limit}
                onChange={handleLimitChange as any}
                label="Limit"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <span>Total: {count} emails</span>
          </Stack>
        </Stack>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
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
                          <b>From:</b> {email.from}
                        </Typography>
                        <br/>
                        <Typography component="span" variant="body2" color="text.secondary">
                          <b>Date:</b> {format(new Date(email.date), 'PPp', { locale: es })}
                        </Typography>
                        <br/>
                        <Typography component="span" variant="body2" color="text.secondary">
                          <b>To:</b> {email.to}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
                {index < emails.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default EmailList; 