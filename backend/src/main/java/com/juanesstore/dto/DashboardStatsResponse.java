package com.juanesstore.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardStatsResponse {
  private BigDecimal salesToday;
  private BigDecimal salesMonth;
  private Long totalOrders;
  private Long productsSold;
  private Long totalCustomers;
  private List<ChartPoint> salesByDay;
  private List<ChartPoint> salesByMonth;
  private List<ChartPoint> topProducts;

  public DashboardStatsResponse(BigDecimal salesToday, BigDecimal salesMonth, Long totalOrders,
                                Long productsSold, Long totalCustomers,
                                List<ChartPoint> salesByDay, List<ChartPoint> salesByMonth,
                                List<ChartPoint> topProducts) {
    this.salesToday = salesToday;
    this.salesMonth = salesMonth;
    this.totalOrders = totalOrders;
    this.productsSold = productsSold;
    this.totalCustomers = totalCustomers;
    this.salesByDay = salesByDay;
    this.salesByMonth = salesByMonth;
    this.topProducts = topProducts;
  }

  public BigDecimal getSalesToday() {
    return salesToday;
  }

  public BigDecimal getSalesMonth() {
    return salesMonth;
  }

  public Long getTotalOrders() {
    return totalOrders;
  }

  public Long getProductsSold() {
    return productsSold;
  }

  public Long getTotalCustomers() {
    return totalCustomers;
  }

  public List<ChartPoint> getSalesByDay() {
    return salesByDay;
  }

  public List<ChartPoint> getSalesByMonth() {
    return salesByMonth;
  }

  public List<ChartPoint> getTopProducts() {
    return topProducts;
  }

  public static class ChartPoint {
    private String label;
    private BigDecimal value;

    public ChartPoint(String label, BigDecimal value) {
      this.label = label;
      this.value = value;
    }

    public String getLabel() {
      return label;
    }

    public BigDecimal getValue() {
      return value;
    }
  }
}
