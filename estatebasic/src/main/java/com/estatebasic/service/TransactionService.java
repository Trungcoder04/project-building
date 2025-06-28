package com.estatebasic.service;

import com.estatebasic.dto.TransactionDTO;
import com.estatebasic.dto.TransactionTypeDTO;
import java.util.List;

public interface TransactionService {
    List<TransactionDTO> getTransactionsByCustomerId(Long customerId);
    TransactionDTO saveTransaction(TransactionDTO transactionDTO);
    List<TransactionTypeDTO> getTransactionTypes();
}
