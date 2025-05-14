import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import EmailList from './components/EmailList';
import EmailView from './components/EmailView';
import type { FilterParams } from './components/EmailList';
import TopBar from './components/TopBar';

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

function App() {
  const [count, setCount] = useState(0);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [namespace, setNamespace] = useState('');
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

  const handleRefresh = (newFilters: FilterParams) => {
    setFilters(newFilters);
    if (apiKey && namespace) {
      fetchEmails(apiKey, namespace, newFilters);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f6fa' }}>
      <TopBar apiKey={apiKey} setApiKey={setApiKey} namespace={namespace} setNamespace={setNamespace} />
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0, px: 0, py: 0 }}>
        <Box sx={{ width: 370, minWidth: 260, maxWidth: 400, height: '85vh', overflowY: 'auto', boxShadow: 2, bgcolor: '#fff', borderRadius: 3, m: 3, mb: 3, display: 'flex', flexDirection: 'column' }}>
          <EmailList
            emails={emails}
            onSelectEmail={setSelectedEmail}
            selectedEmailId={selectedEmail?.id}
            onRefresh={handleRefresh}
            loading={loading}
            count={count}
            apiKey={apiKey}
            namespace={namespace}
          />
        </Box>
        <Box sx={{ flex: 1, boxShadow: 2, bgcolor: '#fafbfc', borderRadius: 3, m: 3, mb: 3, ml: 0, display: 'flex', flexDirection: 'column', minHeight: 0, maxHeight: '85vh', overflowY: 'auto' }}>
          <EmailView email={selectedEmail} apiKey={apiKey} namespace={namespace} />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
