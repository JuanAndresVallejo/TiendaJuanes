package com.juanesstore.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
  private final Map<String, Attempt> attempts = new ConcurrentHashMap<>();

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    if ("/api/auth/login".equals(request.getRequestURI())) {
      String key = request.getRemoteAddr();
      Attempt attempt = attempts.computeIfAbsent(key, k -> new Attempt());
      if (!attempt.allow()) {
        response.setStatus(429);
        return;
      }
    }
    filterChain.doFilter(request, response);
  }

  private static class Attempt {
    private int count = 0;
    private Instant windowStart = Instant.now();

    private boolean allow() {
      Instant now = Instant.now();
      if (now.isAfter(windowStart.plusSeconds(60))) {
        windowStart = now;
        count = 0;
      }
      count++;
      return count <= 10;
    }
  }
}
