package com.juanesstore.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtils {
  private final Key key;
  private final long expirationMinutes;

  public JwtUtils(@Value("${app.jwt.secret}") String secret,
                  @Value("${app.jwt.expirationMinutes}") long expirationMinutes) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expirationMinutes = expirationMinutes;
  }

  public String generateToken(String email, String role) {
    Instant now = Instant.now();
    Instant exp = now.plusSeconds(expirationMinutes * 60);
    return Jwts.builder()
        .setSubject(email)
        .claim("role", role)
        .setIssuedAt(Date.from(now))
        .setExpiration(Date.from(exp))
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public String getEmail(String token) {
    return getAllClaims(token).getSubject();
  }

  public String getRole(String token) {
    Object role = getAllClaims(token).get("role");
    return role == null ? null : role.toString();
  }

  public boolean isTokenValid(String token) {
    try {
      getAllClaims(token);
      return true;
    } catch (Exception ex) {
      return false;
    }
  }

  private Claims getAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody();
  }
}
