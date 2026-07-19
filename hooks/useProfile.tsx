"use client";
import { useState, useCallback } from "react";

type JsonPayload = Record<string, unknown>;

interface FetchOptions {
  method: "POST" | "PUT" | "PATCH";
  body: JsonPayload;
}

export function useProfile() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const execute = useCallback(async (url: string, options: FetchOptions) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(url, {
        method: options.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options.body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data === "object" && data !== null && "error" in data
            ? (data as { error?: string }).error || "Une erreur inattendue est survenue."
            : "Une erreur inattendue est survenue."
        );
      }

      setSuccess(true);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur de connexion avec le serveur.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction dédiée à l'inscription
  const registerUser = useCallback(
    async (payload: JsonPayload) => {
      return execute("/api/auth/register", { method: "POST", body: payload });
    },
    [execute]
  );

  // Fonction dédiée à la mise à jour des informations complémentaires du profil
  const updateProfile = useCallback(
    async (payload: JsonPayload) => {
      return execute("/api/user/profile", { method: "PUT", body: payload });
    },
    [execute]
  );

  return {
    registerUser,
    updateProfile,
    loading,
    error,
    success,
    setError,
  };
}
