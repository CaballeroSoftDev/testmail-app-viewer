import React from 'react';
import { Paper, Typography, Box, Divider, IconButton, Tooltip, Stack } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
  downloadUrl?: string;
}

interface EmailViewProps {
  email: Email | null;
  apiKey: string;
  namespace: string;
}

const EmailView: React.FC<EmailViewProps> = ({ email, apiKey, namespace }) => {
  const handleCopy = () => {
    if (email) {
      navigator.clipboard.writeText(email.text || '');
    }
  };

  if (!apiKey || !namespace) {
    return (
      <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafbfc', borderRadius: 3 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          Set your API Key and Namespace to view email content.
        </Typography>
      </Paper>
    );
  }

  if (!email) {
    return (
      <Paper elevation={3} sx={{ p: 4, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafbfc', borderRadius: 3 }}>
        <Typography variant="h6" color="text.secondary">
          Select an email to view its content
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, height: '100%', overflow: 'auto', background: '#fafbfc', borderRadius: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          {email.subject}
        </Typography>
        <Stack direction="row" spacing={1}>
          {email.downloadUrl && (
            <Tooltip title="Download .eml">
              <IconButton href={email.downloadUrl} target="_blank" rel="noopener" size="small">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Copy text">
            <IconButton onClick={handleCopy} size="small">
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="subtitle1" color="text.primary">
          <b>From:</b> {email.from}
        </Typography>
        <Typography variant="subtitle1" color="text.primary">
          <b>To:</b> {email.to}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Date:</b> {format(new Date(email.date), 'PPpp', { locale: es })}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mt: 2, background: '#fff', borderRadius: 2, p: 3, minHeight: 200 }}>
        {email.html ? (
          <div dangerouslySetInnerHTML={{ __html: email.html }} style={{ fontSize: 16, color: '#222' }} />
        ) : (
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', fontSize: 16, color: '#222' }}>
            {email.text}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default EmailView; 