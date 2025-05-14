import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, TextField, Box, Button } from '@mui/material';

interface TopBarProps {
  apiKey: string;
  setApiKey: (v: string) => void;
  namespace: string;
  setNamespace: (v: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ apiKey, setApiKey, namespace, setNamespace }) => {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localNamespace, setLocalNamespace] = useState(namespace);

  const handleSave = () => {
    setApiKey(localApiKey.trim());
    setNamespace(localNamespace.trim());
  };

  return (
    <AppBar position="static" color="primary" elevation={2} sx={{ mb: 1 }}>
      <Toolbar>
        <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 1, flexGrow: 1 }}>
          Testmail.app Mail Viewer
          <span style={{ fontSize: 12, fontWeight: 'normal', marginLeft: 10 }}>
            by
            <a style={{ color: 'white', textDecoration: 'underline', marginLeft: 5 }} href="https://github.com/Caballero-dev">
              Caballero-dev
            </a>
          </span>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="API Key"
            value={localApiKey}
            onChange={e => setLocalApiKey(e.target.value)}
            size="small"
            variant="filled"
            type="password"
            sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 300 }}
          />
          <TextField
            label="Namespace"
            value={localNamespace}
            onChange={e => setLocalNamespace(e.target.value)}
            size="small"
            variant="filled"
            sx={{ bgcolor: '#fff', borderRadius: 2, minWidth: 180 }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={handleSave}
            sx={{ borderRadius: 2, fontWeight: 'bold', minWidth: 100 }}
          >
            Guardar
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;