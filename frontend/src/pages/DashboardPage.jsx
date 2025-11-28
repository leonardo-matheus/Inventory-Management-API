import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [totais, setTotais] = useState({
    produtosAtivos: 0,
    depositos: 0,
    estoqueTotal: 0,
  });
  const [ultimosMovimentos, setUltimosMovimentos] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      try {
        // Produtos ativos
        const prodRes = await api.get('/api/produtos', {
          params: { page: 0, size: 100, ativo: true },
        });
        const produtosAtivos = prodRes.data.totalElements;

        // Depósitos
        const depRes = await api.get('/api/depositos', {
          params: { page: 0, size: 100 },
        });
        const depositos = depRes.data.totalElements;

        // Estoque total: somar quantidades de todos os produtos do depósito 1 (exemplo)
        // Se quiser algo mais sofisticado, pode criar um endpoint específico no backend.
        let estoqueTotal = 0;
        if (depositos > 0) {
          const estRes = await api.get('/api/estoques/deposito/1', {
            params: { page: 0, size: 1000 },
          });
          estoqueTotal = estRes.data.content.reduce(
            (sum, e) => sum + e.quantidadeAtual,
            0
          );
        }

        // Últimos movimentos
        const movRes = await api.get('/api/movimentos', {
          params: { page: 0, size: 5 },
        });

        setTotais({ produtosAtivos, depositos, estoqueTotal });
        setUltimosMovimentos(movRes.data.content);
      } catch (e) {
        console.error('Erro ao carregar dashboard', e);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  if (loading) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">
              Produtos ativos
            </Typography>
            <Typography variant="h4">{totais.produtosAtivos}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">
              Depósitos
            </Typography>
            <Typography variant="h4">{totais.depositos}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">
              Itens em estoque (Depósito 1)
            </Typography>
            <Typography variant="h4">{totais.estoqueTotal}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Últimos movimentos
            </Typography>
            <List dense>
              {ultimosMovimentos.map((m) => (
                <ListItem key={m.id}>
                  <ListItemText
                    primary={`${m.tipoMovimento} - Produto ${m.produtoId} - Depósito ${m.depositoId}`}
                    secondary={`${m.quantidade} un · ${m.dataHoraMovimento} · ${m.observacao || ''}`}
                  />
                </ListItem>
              ))}
              {ultimosMovimentos.length === 0 && (
                <Typography variant="body2" color="textSecondary">
                  Nenhum movimento encontrado.
                </Typography>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}