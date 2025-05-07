import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';

function App() {
  const [formData, setFormData] = useState({
    tipo_veiculo: '',
    UF_origem: '',
    UF_destino: '',
    transportadora: '',
    valor_frete: ''
  });

  const [resultado, setResultado] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSnackbarOpen(true);
    try {
      const response = await fetch('https://fretex-api-c5ezcebebshaaxbu.eastus2-01.azurewebsites.net/predict', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          tipo_veiculo: formData.tipo_veiculo,
          UF_origem: formData.UF_origem,
          UF_destino: formData.UF_destino,
          transportadora: formData.transportadora,
          valor_frete: parseFloat(formData.valor_frete)
        })
      });
      const data = await response.json();
      setResultado(data.previsao || data.erro);
    } catch (error) {
      setResultado('Erro ao conectar na API.');
    } finally {
      setLoading(false);
      setSnackbarOpen(false);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '40px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Previsão de Atraso de Entrega
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Tipo de Veículo" name="tipo_veiculo" fullWidth margin="normal" onChange={handleChange} required />
        <TextField label="UF Origem" name="UF_origem" fullWidth margin="normal" onChange={handleChange} required />
        <TextField label="UF Destino" name="UF_destino" fullWidth margin="normal" onChange={handleChange} required />
        <TextField label="Transportadora" name="transportadora" fullWidth margin="normal" onChange={handleChange} required />
        <TextField label="Valor do Frete" name="valor_frete" type="number" fullWidth margin="normal" onChange={handleChange} required />
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Prever
        </Button>
      </form>

      {resultado && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Typography variant="h6" align="center" style={{ marginTop: '30px' }}>
            Resultado: {resultado}
          </Typography>
        </motion.div>
      )}

      <Snackbar open={snackbarOpen}>
        <Alert severity="info" sx={{ width: '100%' }}>
          Processando previsão...
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
