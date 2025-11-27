package com.movemais.estoque.service;

import com.movemais.estoque.dto.deposito.*;
import com.movemais.estoque.entity.Deposito;
import com.movemais.estoque.exception.BusinessException;
import com.movemais.estoque.exception.NotFoundException;
import com.movemais.estoque.repository.DepositoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DepositoService {

    private final DepositoRepository depositoRepository;

    @Transactional
    public DepositoResponse criar(DepositoCreateRequest request) {
        if (depositoRepository.existsByCodigo(request.codigo())) {
            throw new BusinessException("Já existe depósito com o código informado");
        }

        Deposito deposito = Deposito.builder()
                .nome(request.nome())
                .codigo(request.codigo())
                .endereco(request.endereco())
                .build();

        return toResponse(depositoRepository.save(deposito));
    }

    @Transactional
    public DepositoResponse atualizar(Long id, DepositoUpdateRequest request) {
        Deposito deposito = depositoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Depósito não encontrado"));

        if (!deposito.getCodigo().equals(request.codigo())
                && depositoRepository.existsByCodigo(request.codigo())) {
            throw new BusinessException("Já existe depósito com o código informado");
        }

        deposito.setNome(request.nome());
        deposito.setCodigo(request.codigo());
        deposito.setEndereco(request.endereco());

        return toResponse(depositoRepository.save(deposito));
    }

    @Transactional(readOnly = true)
    public Page<DepositoResponse> listar(Pageable pageable) {
        return depositoRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public DepositoResponse buscarPorId(Long id) {
        Deposito deposito = depositoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Depósito não encontrado"));
        return toResponse(deposito);
    }

    private DepositoResponse toResponse(Deposito d) {
        return new DepositoResponse(
                d.getId(),
                d.getNome(),
                d.getCodigo(),
                d.getEndereco()
        );
    }
}