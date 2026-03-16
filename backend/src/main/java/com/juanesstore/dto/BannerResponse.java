package com.juanesstore.dto;

import java.time.Instant;

public class BannerResponse {
  private Long id;
  private String title;
  private String subtitle;
  private String link;
  private Boolean active;
  private Instant createdAt;

  public BannerResponse(Long id, String title, String subtitle, String link, Boolean active, Instant createdAt) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.link = link;
    this.active = active;
    this.createdAt = createdAt;
  }

  public Long getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public String getSubtitle() {
    return subtitle;
  }

  public String getLink() {
    return link;
  }

  public Boolean getActive() {
    return active;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}
