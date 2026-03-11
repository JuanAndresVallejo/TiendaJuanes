"use client";

import { useEffect, useState } from "react";
import { getToken, logout } from "../services/auth";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  return {
    isAuthenticated,
    logout
  };
}
