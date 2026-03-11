package com.juanesstore.services;

import com.juanesstore.models.Order;
import com.juanesstore.models.OrderItem;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class MercadoPagoService {
  private final String accessToken;
  private final String notificationUrl;

  public MercadoPagoService(@Value("${app.mercadopago.accessToken}") String accessToken,
                            @Value("${app.mercadopago.notificationUrl}") String notificationUrl) {
    this.accessToken = accessToken;
    this.notificationUrl = notificationUrl;
  }

  public Preference createPreference(Order order) throws Exception {
    configure();

    List<PreferenceItemRequest> items = new ArrayList<>();
    for (OrderItem item : order.getItems()) {
      PreferenceItemRequest preferenceItem = PreferenceItemRequest.builder()
          .title(item.getProductVariant().getProduct().getName())
          .quantity(item.getQuantity())
          .unitPrice(item.getPrice())
          .build();
      items.add(preferenceItem);
    }

    PreferenceRequest request = PreferenceRequest.builder()
        .items(items)
        .notificationUrl(notificationUrl)
        .externalReference(String.valueOf(order.getId()))
        .build();

    PreferenceClient client = new PreferenceClient();
    return client.create(request);
  }

  public void configure() {
    if (accessToken == null || accessToken.isBlank()) {
      throw new IllegalStateException("MERCADOPAGO_ACCESS_TOKEN is not configured");
    }
    MercadoPagoConfig.setAccessToken(accessToken);
  }
}
