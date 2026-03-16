package com.juanesstore.dto;

import jakarta.validation.constraints.NotBlank;

public class BannerRequest {
  @NotBlank
  private String title;

  @NotBlank
  private String subtitle;

  private String link;

  private Boolean active;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getSubtitle() {
    return subtitle;
  }

  public void setSubtitle(String subtitle) {
    this.subtitle = subtitle;
  }

  public String getLink() {
    return link;
  }

  public void setLink(String link) {
    this.link = link;
  }

  public Boolean getActive() {
    return active;
  }

  public void setActive(Boolean active) {
    this.active = active;
  }
}
