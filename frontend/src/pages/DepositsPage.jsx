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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export default function DepositsPage() {
  const [deposits, setDeposits] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nome: '',
    codigo: '',
    endereco: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadDeposits = async (page = 0) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.get('/api/depositos', {
        params: { page, size: pageInfo.size },
      });
      setDeposits(res.data.content);
      setPageInfo((old) => ({
        ...old,
        page: res.data.number,
        totalPages: res.data.totalPages,
      }));
    } catch (e) {
      setError('Erro ao carregar depósitos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeposits(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ nome: '', codigo: '', endereco: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await api.put(`/api/depositos/${editingId}`, form);
        setSuccess('Depósito atualizado com sucesso.');
      } else {
        await api.post('/api/depositos', form);
        setSuccess('Depósito criado com sucesso.');
      }
      resetForm();
      await loadDeposits(pageInfo.page);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          'Erro ao salvar depósito (código duplicado?)'
      );
    }
  };

  const handleRowClick = (d) => {
    setEditingId(d.id);
    setForm({
      nome: d.nome,
      codigo: d.codigo,
      endereco: d.endereco,
    });
  };

  const handlePageChange = async (direction) => {
    const newPage = pageInfo.page + direction;
    if (newPage < 0 || newPage >= pageInfo.totalPages) return;
    await loadDeposits(newPage);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Depósitos
      </Typography>

      <Grid container spacing={3}>
        {/* Formulário */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                {editingId ? `Editar Depósito #${editingId}` : 'Novo Depósito'}
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Nome"
                  margin="dense"
                  fullWidth
                  size="small"
                  value={form.nome}
                  onChange={(e) =>
                    setForm({ ...form, nome: e.target.value })
                  }
                />
                <TextField
                  label="Código"
                  margin="dense"
                  fullWidth
                  size="small"
                  value={form.codigo}
                  onChange={(e) =>
                    setForm({ ...form, codigo: e.target.value })
                  }
                />
                <TextField
                  label="Endereço"
                  margin="dense"
                  fullWidth
                  size="small"
                  value={form.endereco}
                  onChange={(e) =>
                    setForm({ ...form, endereco: e.target.value })
                  }
                />
                {error && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    {success}
                  </Alert>
                )}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button variant="contained" type="submit" fullWidth>
                    {editingId ? 'Atualizar' : 'Criar'}
                  </Button>
                  {editingId && (
                    <Button
                      variant="outlined"
                      color="inherit"
                      fullWidth
                      onClick={resetForm}
                    >
                      Cancelar
                    </Button>
                  )}
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Lista */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Lista de Depósitos
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Código</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Endereço</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5}>Carregando...</TableCell>
                      </TableRow>
                    ) : deposits.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          Nenhum depósito encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      deposits.map((d) => (
                        <TableRow
                          key={d.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleRowClick(d)}
                        >
                          <TableCell>{d.id}</TableCell>
                          <TableCell>{d.codigo}</TableCell>
                          <TableCell>{d.nome}</TableCell>
                          <TableCell>{d.endereco}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowClick(d);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="flex-end"
                sx={{ mt: 2 }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  disabled={pageInfo.page <= 0}
                  onClick={() => handlePageChange(-1)}
                >
                  Página anterior
                </Button>
                <Typography variant="body2">
                  Página {pageInfo.page + 1} de {pageInfo.totalPages || 1}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={
                    pageInfo.totalPages === 0 ||
                    pageInfo.page + 1 >= pageInfo.totalPages
                  }
                  onClick={() => handlePageChange(1)}
                >
                  Próxima página
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}