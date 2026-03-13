"use client";

import { useEffect, useState } from "react";
import { getAdminUsers } from "../../../services/admin";

type AdminUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="font-display text-2xl mb-4">Usuarios</h2>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="bg-white/70 border border-sand rounded-3xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sand/60 text-left">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-sand/60">
                  <td className="px-4 py-3">{user.fullName}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString("es-CO")}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="px-4 py-6" colSpan={4}>No hay usuarios para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
