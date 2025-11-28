import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
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
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    sku: '',
    nome: '',
    descricao: '',
    precoUnitario: 0,
    ativo: true,
  });
  const [filters, setFilters] = useState({
    nome: '',
    sku: '',
    ativo: 'true',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProducts = async (page = 0) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.get('/api/produtos', {
        params: {
          page,
          size: pageInfo.size,
          nome: filters.nome || undefined,
          sku: filters.sku || undefined,
          ativo: filters.ativo || undefined,
        },
      });
      setProducts(res.data.content);
      setPageInfo((old) => ({
        ...old,
        page: res.data.number,
        totalPages: res.data.totalPages,
      }));
    } catch (e) {
      setError('Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      sku: '',
      nome: '',
      descricao: '',
      precoUnitario: 0,
      ativo: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await api.put(`/api/produtos/${editingId}`, form);
        setSuccess('Produto atualizado com sucesso.');
      } else {
        await api.post('/api/produtos', form);
        setSuccess('Produto criado com sucesso.');
      }
      resetForm();
      await loadProducts(pageInfo.page);
    } catch (e) {
      setError(
        e.response?.data?.message || 'Erro ao salvar produto (SKU duplicado?)'
      );
    }
  };

  const handleRowClick = (p) => {
    setEditingId(p.id);
    setForm({
      sku: p.sku,
      nome: p.nome,
      descricao: p.descricao,
      precoUnitario: p.precoUnitario,
      ativo: p.ativo,
    });
  };

  const handleInativar = async () => {
    if (!editingId) return;
    setError('');
    setSuccess('');
    try {
      await api.patch(`/api/produtos/${editingId}/inativar`);
      setSuccess('Produto inativado com sucesso.');
      resetForm();
      await loadProducts(pageInfo.page);
    } catch (e) {
      setError(e.response?.data?.message || 'Erro ao inativar produto.');
    }
  };

  const applyFilters = async () => {
    await loadProducts(0);
  };

  const handlePageChange = async (direction) => {
    const newPage = pageInfo.page + direction;
    if (newPage < 0 || newPage >= pageInfo.totalPages) return;
    await loadProducts(newPage);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Produtos
      </Typography>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Filtros
          </Typography>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={4}>
              <TextField
                label="Nome"
                fullWidth
                size="small"
                value={filters.nome}
                onChange={(e) =>
                  setFilters({ ...filters, nome: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="SKU"
                fullWidth
                size="small"
                value={filters.sku}
                onChange={(e) =>
                  setFilters({ ...filters, sku: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Ativo"
                fullWidth
                size="small"
                value={filters.ativo}
                onChange={(e) =>
                  setFilters({ ...filters, ativo: e.target.value })
                }
              >
                <MenuItem value="">(Todos)</MenuItem>
                <MenuItem value="true">Sim</MenuItem>
                <MenuItem value="false">Não</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={applyFilters}
                sx={{ mt: { xs: 1, md: 0 } }}
              >
                Aplicar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Formulário */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                {editingId ? `Editar Produto #${editingId}` : 'Novo Produto'}
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="SKU"
                  margin="dense"
                  fullWidth
                  size="small"
                  value={form.sku}
                  onChange={(e) =>
                    setForm({ ...form, sku: e.target.value })
                  }
                />
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
                  label="Descrição"
                  margin="dense"
                  fullWidth
                  size="small"
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                />
                <TextField
                  label="Preço Unitário"
                  margin="dense"
                  fullWidth
                  size="small"
                  type="number"
                  value={form.precoUnitario}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      precoUnitario: Number(e.target.value),
                    })
                  }
                />
                <FormControlLabel
                  sx={{ mt: 1 }}
                  control={
                    <Checkbox
                      checked={form.ativo}
                      onChange={(e) =>
                        setForm({ ...form, ativo: e.target.checked })
                      }
                    />
                  }
                  label="Ativo"
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
                    <>
                      <Button
                        variant="outlined"
                        color="inherit"
                        fullWidth
                        onClick={resetForm}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={handleInativar}
                      >
                        Inativar
                      </Button>
                    </>
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
                Lista de Produtos
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell align="right">Preço</TableCell>
                      <TableCell align="center">Ativo</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6}>Carregando...</TableCell>
                      </TableRow>
                    ) : products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          Nenhum produto encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((p) => (
                        <TableRow
                          key={p.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => handleRowClick(p)}
                        >
                          <TableCell>{p.id}</TableCell>
                          <TableCell>{p.sku}</TableCell>
                          <TableCell>{p.nome}</TableCell>
                          <TableCell align="right">
                            {`R$ ${Number(p.precoUnitario).toFixed(2)}`}
                          </TableCell>
                          <TableCell align="center">
                            {p.ativo ? 'Sim' : 'Não'}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowClick(p);
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

              {/* Paginação simples */}
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