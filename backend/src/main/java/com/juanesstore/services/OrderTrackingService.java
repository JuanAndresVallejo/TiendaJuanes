package com.juanesstore.services;

import com.juanesstore.models.Order;
import com.juanesstore.models.OrderStatus;
import com.juanesstore.repositories.OrderStatusHistoryRepository;
import com.juanesstore.models.OrderStatusHistory;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class OrderTrackingService {
  private final OrderStatusHistoryRepository historyRepository;

  public OrderTrackingService(OrderStatusHistoryRepository historyRepository) {
    this.historyRepository = historyRepository;
  }

  public void recordStatus(Order order, OrderStatus status) {
    OrderStatusHistory history = new OrderStatusHistory();
    history.setOrder(order);
    history.setStatus(status);
    history.setCreatedAt(Instant.now());
    historyRepository.save(history);
  }
}
