import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from '@mui/material';

export default function MovementsPage() {
  const [produtos, setProdutos] = useState([]);
  const [depositos, setDepositos] = useState([]);
  const [form, setForm] = useState({
    produtoId: '',
    depositoId: '',
    quantidade: 1,
    observacao: '',
  });
  const [filtros, setFiltros] = useState({
    tipo: '',
    produtoId: '',
    depositoId: '',
    dataInicio: '',
    dataFim: '',
  });
  const [movs, setMovs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const carregarMovimentos = async () => {
    setError('');
    setSuccess('');
    try {
      const res = await api.get('/api/movimentos', {
        params: { page: 0, size: 20 },
      });
      setMovs(res.data.content);
    } catch (e) {
      setError('Erro ao listar movimentos.');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await loadCombos();
        await carregarMovimentos();
      } catch (e) {
        setError('Erro ao carregar dados iniciais.');
      }
    })();
  }, []);

  const registrar = async (tipo) => {
    setError('');
    setSuccess('');
    try {
      if (!form.produtoId || !form.depositoId) {
        setError('Selecione produto e depósito.');
        return;
      }
      const url =
        tipo === 'ENTRADA'
          ? '/api/movimentos/entrada'
          : '/api/movimentos/saida';
      await api.post(url, {
        ...form,
        produtoId: Number(form.produtoId),
        depositoId: Number(form.depositoId),
      });
      setSuccess(`Movimento de ${tipo.toLowerCase()} registrado com sucesso.`);
      await carregarMovimentos();
    } catch (e) {
      setError(e.response?.data?.message || 'Erro ao registrar movimento.');
    }
  };

  const aplicarRelatorio = async () => {
    setError('');
    setSuccess('');
    try {
      const params = {
        page: 0,
        size: 50,
      };
      if (filtros.tipo) params.tipo = filtros.tipo;
      if (filtros.produtoId) params.produtoId = filtros.produtoId;
      if (filtros.depositoId) params.depositoId = filtros.depositoId;
      if (filtros.dataInicio) params.dataInicio = filtros.dataInicio;
      if (filtros.dataFim) params.dataFim = filtros.dataFim;

      const res = await api.get('/api/movimentos/relatorio', { params });
      setMovs(res.data.content);
    } catch (e) {
      setError('Erro ao aplicar filtros de relatório.');
    }
  };

  const nomeProduto = (id) =>
    produtos.find((p) => p.id === id)?.nome || id;
  const nomeDeposito = (id) =>
    depositos.find((d) => d.id === id)?.nome || id;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Movimentos de Estoque
      </Typography>

      <Grid container spacing={3}>
        {/* Novo movimento */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Novo Movimento
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    label="Produto"
                    size="small"
                    value={form.produtoId}
                    onChange={(e) =>
                      setForm({ ...form, produtoId: e.target.value })
                    }
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
                    value={form.depositoId}
                    onChange={(e) =>
                      setForm({ ...form, depositoId: e.target.value })
                    }
                  >
                    {depositos.map((d) => (
                      <MenuItem key={d.id} value={d.id}>
                        {d.nome} ({d.codigo})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Quantidade"
                    type="number"
                    fullWidth
                    size="small"
                    value={form.quantidade}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        quantidade: Number(e.target.value),
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    label="Observação"
                    fullWidth
                    size="small"
                    value={form.observacao}
                    onChange={(e) =>
                      setForm({ ...form, observacao: e.target.value })
                    }
                  />
                </Grid>
                {error && (
                  <Grid item xs={12}>
                    <Alert severity="error">{error}</Alert>
                  </Grid>
                )}
                {success && (
                  <Grid item xs={12}>
                    <Alert severity="success">{success}</Alert>
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => registrar('ENTRADA')}
                  >
                    Registrar Entrada
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => registrar('SAIDA')}
                  >
                    Registrar Saída
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Filtros de relatório */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Filtros de Relatório
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Tipo"
                    size="small"
                    value={filtros.tipo}
                    onChange={(e) =>
                      setFiltros({ ...filtros, tipo: e.target.value })
                    }
                  >
                    <MenuItem value="">(Todos)</MenuItem>
                    <MenuItem value="ENTRADA">ENTRADA</MenuItem>
                    <MenuItem value="SAIDA">SAIDA</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Produto ID"
                    fullWidth
                    size="small"
                    value={filtros.produtoId}
                    onChange={(e) =>
                      setFiltros({ ...filtros, produtoId: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Depósito ID"
                    fullWidth
                    size="small"
                    value={filtros.depositoId}
                    onChange={(e) =>
                      setFiltros({ ...filtros, depositoId: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Data início (ISO)"
                    fullWidth
                    size="small"
                    placeholder="2025-11-27T00:00:00Z"
                    value={filtros.dataInicio}
                    onChange={(e) =>
                      setFiltros({ ...filtros, dataInicio: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Data fim (ISO)"
                    fullWidth
                    size="small"
                    placeholder="2025-11-28T23:59:59Z"
                    value={filtros.dataFim}
                    onChange={(e) =>
                      setFiltros({ ...filtros, dataFim: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" onClick={aplicarRelatorio}>
                    Aplicar Filtros
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabela de movimentos */}
        <Grid item xs={12}>
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Movimentos
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Produto</TableCell>
                      <TableCell>Depósito</TableCell>
                      <TableCell>Qtd</TableCell>
                      <TableCell>Data/Hora</TableCell>
                      <TableCell>Obs</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          Nenhum movimento encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      movs.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell>{m.id}</TableCell>
                          <TableCell>{m.tipoMovimento}</TableCell>
                          <TableCell>{nomeProduto(m.produtoId)}</TableCell>
                          <TableCell>{nomeDeposito(m.depositoId)}</TableCell>
                          <TableCell>{m.quantidade}</TableCell>
                          <TableCell>{m.dataHoraMovimento}</TableCell>
                          <TableCell>{m.observacao}</TableCell>
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
    </div>
  );
}