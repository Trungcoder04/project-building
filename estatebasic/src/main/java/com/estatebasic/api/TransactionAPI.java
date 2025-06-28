package com.estatebasic.api;

import com.estatebasic.dto.TransactionDTO;
import com.estatebasic.dto.TransactionTypeDTO;
import com.estatebasic.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class TransactionAPI {

    @Autowired
    private TransactionService transactionService;

    // Lấy danh sách Giao dịch theo Khách hàng
    @GetMapping("/api/transactions")
    public List<TransactionDTO> getTransactions(@RequestParam(required = false) Long customerId) {
        return transactionService.getTransactionsByCustomerId(customerId);
    }

    // Tạo mới một Giao dịch cho Khách hàng
    @PostMapping("/api/transactions")
    public TransactionDTO createTransaction(@RequestBody TransactionDTO transactionDTO) {
        return transactionService.saveTransaction(transactionDTO);
    }

    // Lấy danh sách Loại giao dịch
    @GetMapping("/api/transaction-types")
    public List<TransactionTypeDTO> getTransactionTypes() {
        return transactionService.getTransactionTypes();
    }
}
