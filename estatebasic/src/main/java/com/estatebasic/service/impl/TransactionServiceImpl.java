package com.estatebasic.service.impl;

import com.estatebasic.dto.TransactionDTO;
import com.estatebasic.dto.TransactionTypeDTO;
import com.estatebasic.entity.TransactionEntity;
import com.estatebasic.entity.TransactionTypeEntity;
import com.estatebasic.repository.TransactionRepository;
import com.estatebasic.repository.TransactionTypeRepository;
import com.estatebasic.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TransactionTypeRepository transactionTypeRepository;

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @Override
    public List<TransactionDTO> getTransactionsByCustomerId(Long customerId) {
        List<TransactionEntity> entities = (customerId != null)
                ? transactionRepository.findByCustomerId(customerId)
                : transactionRepository.findAll();

        List<TransactionDTO> results = new ArrayList<>();
        for (TransactionEntity item : entities) {
            TransactionDTO dto = new TransactionDTO();
            dto.setId(item.getId());
            dto.setNote(item.getNote());
            dto.setCustomerId(item.getCustomerId());
            dto.setType(item.getType());
            dto.setCreatedBy(item.getCreatedBy());
            if (item.getCreatedDate() != null) {
                dto.setCreatedDate(DATE_FORMAT.format(item.getCreatedDate()));
            }
            results.add(dto);
        }
        return results;
    }

    @Override
    public TransactionDTO saveTransaction(TransactionDTO transactionDTO) {
        TransactionEntity entity = new TransactionEntity();
        entity.setNote(transactionDTO.getNote());
        entity.setCustomerId(transactionDTO.getCustomerId());
        entity.setType(transactionDTO.getType());
        entity.setCreatedDate(new Date());
        entity.setCreatedBy(transactionDTO.getCreatedBy() != null ? transactionDTO.getCreatedBy() : "system");

        TransactionEntity savedEntity = transactionRepository.save(entity);
        transactionDTO.setId(savedEntity.getId());
        transactionDTO.setCreatedDate(DATE_FORMAT.format(savedEntity.getCreatedDate()));
        return transactionDTO;
    }

    @Override
    public List<TransactionTypeDTO> getTransactionTypes() {
        List<TransactionTypeEntity> entities = transactionTypeRepository.findAll();
        List<TransactionTypeDTO> results = new ArrayList<>();
        for (TransactionTypeEntity item : entities) {
            TransactionTypeDTO dto = new TransactionTypeDTO();
            dto.setId(item.getId());
            dto.setCode(item.getCode());
            dto.setName(item.getName());
            results.add(dto);
        }
        return results;
    }
}
