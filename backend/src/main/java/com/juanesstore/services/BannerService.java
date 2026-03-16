package com.juanesstore.services;

import com.juanesstore.dto.BannerRequest;
import com.juanesstore.dto.BannerResponse;
import com.juanesstore.models.Banner;
import com.juanesstore.repositories.BannerRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BannerService {
  private final BannerRepository bannerRepository;

  public BannerService(BannerRepository bannerRepository) {
    this.bannerRepository = bannerRepository;
  }

  @Transactional(readOnly = true)
  public List<BannerResponse> getActive() {
    return bannerRepository.findByActiveTrueOrderByCreatedAtDesc().stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public List<BannerResponse> getAll() {
    return bannerRepository.findAll().stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional
  public BannerResponse create(BannerRequest request) {
    Banner banner = new Banner();
    map(banner, request);
    return toResponse(bannerRepository.save(banner));
  }

  @Transactional
  public BannerResponse update(Long id, BannerRequest request) {
    Banner banner = bannerRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Banner not found"));
    map(banner, request);
    return toResponse(bannerRepository.save(banner));
  }

  @Transactional
  public void delete(Long id) {
    bannerRepository.deleteById(id);
  }

  private void map(Banner banner, BannerRequest request) {
    banner.setTitle(request.getTitle());
    banner.setSubtitle(request.getSubtitle());
    banner.setLink(request.getLink());
    banner.setActive(request.getActive() == null || request.getActive());
  }

  private BannerResponse toResponse(Banner banner) {
    return new BannerResponse(
        banner.getId(),
        banner.getTitle(),
        banner.getSubtitle(),
        banner.getLink(),
        banner.getActive(),
        banner.getCreatedAt()
    );
  }
}
