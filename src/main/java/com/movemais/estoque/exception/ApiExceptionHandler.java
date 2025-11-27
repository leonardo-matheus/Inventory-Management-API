package com.movemais.estoque.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ProblemDetails> handleNotFound(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ProblemDetails(OffsetDateTime.now(), HttpStatus.NOT_FOUND.value(),
                        "Recurso não encontrado", ex.getMessage()));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ProblemDetails> handleBusiness(BusinessException ex) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(new ProblemDetails(OffsetDateTime.now(), HttpStatus.UNPROCESSABLE_ENTITY.value(),
                        "Erro de negócio", ex.getMessage()));
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    public ResponseEntity<ProblemDetails> handleValidation(Exception ex) {
        var bindingResult = ex instanceof MethodArgumentNotValidException mar ?
                mar.getBindingResult() : ((BindException) ex).getBindingResult();

        String detalhes = bindingResult.getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining(", "));

        return ResponseEntity.badRequest()
                .body(new ProblemDetails(OffsetDateTime.now(), HttpStatus.BAD_REQUEST.value(),
                        "Dados inválidos", detalhes));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetails> handleGeneric(Exception ex) {
        ex.printStackTrace(); // TEMPORÁRIO para ver o erro no console

        ProblemDetails body = new ProblemDetails(
                OffsetDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Erro interno",
                "Ocorreu um erro inesperado."
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
