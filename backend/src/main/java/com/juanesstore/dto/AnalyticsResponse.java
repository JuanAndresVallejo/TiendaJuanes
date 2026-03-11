package com.juanesstore.dto;

import java.math.BigDecimal;
import java.util.List;

public class AnalyticsResponse {
  private List<DashboardStatsResponse.ChartPoint> salesByDay;
  private List<DashboardStatsResponse.ChartPoint> salesByMonth;
  private List<DashboardStatsResponse.ChartPoint> topProducts;
  private List<DashboardStatsResponse.ChartPoint> topCategories;
  private Long newCustomers;

  public AnalyticsResponse(List<DashboardStatsResponse.ChartPoint> salesByDay,
                           List<DashboardStatsResponse.ChartPoint> salesByMonth,
                           List<DashboardStatsResponse.ChartPoint> topProducts,
                           List<DashboardStatsResponse.ChartPoint> topCategories,
                           Long newCustomers) {
    this.salesByDay = salesByDay;
    this.salesByMonth = salesByMonth;
    this.topProducts = topProducts;
    this.topCategories = topCategories;
    this.newCustomers = newCustomers;
  }

  public List<DashboardStatsResponse.ChartPoint> getSalesByDay() {
    return salesByDay;
  }

  public List<DashboardStatsResponse.ChartPoint> getSalesByMonth() {
    return salesByMonth;
  }

  public List<DashboardStatsResponse.ChartPoint> getTopProducts() {
    return topProducts;
  }

  public List<DashboardStatsResponse.ChartPoint> getTopCategories() {
    return topCategories;
  }

  public Long getNewCustomers() {
    return newCustomers;
  }
}
