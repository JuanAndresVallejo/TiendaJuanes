package com.juanesstore.repositories;

import com.juanesstore.models.Banner;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BannerRepository extends JpaRepository<Banner, Long> {
  List<Banner> findByActiveTrueOrderByCreatedAtDesc();
}
