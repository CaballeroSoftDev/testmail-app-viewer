import { useState, useEffect } from 'react';
import { Box, Typography, AppBar, Toolbar, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailList from './components/EmailList';
import EmailView from './components/EmailView';
import type { FilterParams } from './components/EmailList';

interface Email {
  id: string;
  subject: string;
  from: string;
  date: number;
  text: string;
  html: string;
  downloadUrl?: string;
}

function App() {
  const [count, setCount] = useState(0);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [namespace, setNamespace] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formApiKey, setFormApiKey] = useState('');
  const [formNamespace, setFormNamespace] = useState('');
  const [filters, setFilters] = useState<FilterParams>({
    tagPrefix: '',
    limit: 100,
    offset: 0,
  });

  const fetchEmails = async (key: string, ns: string, f: FilterParams) => {
    setLoading(true);
    setError(null);
    setSelectedEmail(null);
    try {
      const params = [
        `apikey=${key}`,
        `namespace=${ns}`,
        f.tagPrefix ? `tag=${encodeURIComponent(f.tagPrefix)}` : '',
        f.limit ? `limit=${f.limit}` : '',
        f.offset ? `offset=${f.offset}` : '',
      ].filter(Boolean).join('&');
      const response = await fetch(`https://api.testmail.app/api/json?${params}`);
      const data = await response.json();
      if (data.result === 'success') {
        setEmails(data.emails);
        setCount(data.count);
      } else {
        setError('Error al cargar los correos');
        setEmails([]);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiKey && namespace) {
      fetchEmails(apiKey, namespace, filters);
    }
    // eslint-disable-next-line
  }, [apiKey, namespace]);

  const handleOpenModal = () => {
    setFormApiKey(apiKey);
    setFormNamespace(namespace);
    setModalOpen(true);
  };

  const handleSave = () => {
    setApiKey(formApiKey.trim());
    setNamespace(formNamespace.trim());
    setModalOpen(false);
  };

  const handleRefresh = (newFilters: FilterParams) => {
    setFilters(newFilters);
    if (apiKey && namespace) {
      fetchEmails(apiKey, namespace, newFilters);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f6fa' }}>
      <AppBar position="static" color="primary" elevation={2} sx={{ mb: 1 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 1, flexGrow: 1 }}>
            Bandeja de Entrada
          </Typography>
          <IconButton color="inherit" onClick={handleOpenModal}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle sx={{ textAlign: 'center' }}>Configuración de API</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
          <TextField
            sx={{ mt: 2}}
            label="API Key"
            value={formApiKey}
            onChange={e => setFormApiKey(e.target.value)}
            fullWidth
            autoFocus
            type="password"
          />
          <TextField
            label="Namespace"
            value={formNamespace}
            onChange={e => setFormNamespace(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
      {(!apiKey || !namespace) ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <Typography color="text.secondary">Configura tu API Key y Namespace para ver los correos.</Typography>
        </Box>
      )
       : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flex: 1, minHeight: 0, px: 0, py: 0 }}>
          <Box sx={{ width: 370, minWidth: 260, maxWidth: 400, height: '85vh', overflowY: 'auto', boxShadow: 2, bgcolor: '#fff', borderRadius: 3, m: 3, mb: 3, display: 'flex', flexDirection: 'column' }}>
            <EmailList
              emails={emails}
              onSelectEmail={setSelectedEmail}
              selectedEmailId={selectedEmail?.id}
              onRefresh={handleRefresh}
              loading={loading}
              count={count}
            />
          </Box>
          <Box sx={{ flex: 1, boxShadow: 2, bgcolor: '#fafbfc', borderRadius: 3, m: 3, mb: 3, ml: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <EmailView email={selectedEmail} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default App;
