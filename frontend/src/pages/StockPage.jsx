import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from '@mui/material';

export default function StockPage() {
  const [produtos, setProdutos] = useState([]);
  const [depositos, setDepositos] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [depositoId, setDepositoId] = useState('');
  const [saldo, setSaldo] = useState(null);
  const [lista, setLista] = useState([]);
  const [error, setError] = useState('');

  const loadCombos = async () => {
    const prodRes = await api.get('/api/produtos', {
      params: { page: 0, size: 100, ativo: true },
    });
    const depRes = await api.get('/api/depositos', {
      params: { page: 0, size: 100 },
    });
    setProdutos(prodRes.data.content);
    setDepositos(depRes.data.content);
  };

  useEffect(() => {
    (async () => {
      try {
        await loadCombos();
      } catch (e) {
        setError('Erro ao carregar produtos/depósitos.');
      }
    })();
  }, []);

  const consultarSaldo = async () => {
    setError('');
    setSaldo(null);
    if (!produtoId || !depositoId) {
      setError('Selecione produto e depósito.');
      return;
    }
    try {
      const res = await api.get('/api/estoques/saldo', {
        params: { produtoId, depositoId },
      });
      setSaldo(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Erro ao consultar saldo.');
    }
  };

  const listarPorDeposito = async () => {
    setError('');
    setLista([]);
    if (!depositoId) {
      setError('Selecione um depósito.');
      return;
    }
    try {
      const res = await api.get(`/api/estoques/deposito/${depositoId}`, {
        params: { page: 0, size: 200 },
      });
      setLista(res.data.content);
    } catch (e) {
      setError(e.response?.data?.message || 'Erro ao listar estoque.');
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Estoque
      </Typography>

      <Grid container spacing={3}>
        {/* Consulta de saldo */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Saldo de Produto em Depósito
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Produto"
                    size="small"
                    value={produtoId}
                    onChange={(e) => setProdutoId(e.target.value)}
                  >
                    {produtos.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.nome} ({p.sku})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Depósito"
                    size="small"
                    value={depositoId}
                    onChange={(e) => setDepositoId(e.target.value)}
                  >
                    {depositos.map((d) => (
                      <MenuItem key={d.id} value={d.id}>
                        {d.nome} ({d.codigo})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={consultarSaldo}
                  >
                    Consultar saldo
                  </Button>
                </Grid>
              </Grid>

              {saldo && (
                <Card sx={{ mt: 2, bgcolor: '#eef2ff' }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Detalhes do saldo
                    </Typography>
                    <Typography variant="body2">
                      Produto: {saldo.produtoNome} ({saldo.produtoSku}) — ID{' '}
                      {saldo.produtoId}
                    </Typography>
                    <Typography variant="body2">
                      Depósito: {saldo.depositoNome} ({saldo.depositoCodigo}) —
                      ID {saldo.depositoId}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      Quantidade Atual: {saldo.quantidadeAtual}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Lista por depósito */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Estoque do Depósito
              </Typography>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} md={8}>
                  <TextField
                    select
                    fullWidth
                    label="Depósito"
                    size="small"
                    value={depositoId}
                    onChange={(e) => setDepositoId(e.target.value)}
                  >
                    {depositos.map((d) => (
                      <MenuItem key={d.id} value={d.id}>
                        {d.nome} ({d.codigo})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={listarPorDeposito}
                  >
                    Listar estoque
                  </Button>
                </Grid>
              </Grid>

              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mt: 2, maxHeight: 320 }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell align="right">Quantidade</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lista.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3}>
                          Nenhum item para este depósito.
                        </TableCell>
                      </TableRow>
                    ) : (
                      lista.map((e) => (
                        <TableRow key={`${e.produtoId}-${e.depositoId}`}>
                          <TableCell>{e.produtoNome}</TableCell>
                          <TableCell>{e.produtoSku}</TableCell>
                          <TableCell align="right">
                            {e.quantidadeAtual}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </div>
  );
}