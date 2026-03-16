"use client";

import { useEffect, useState } from "react";
import { getMyProfile, updateMyPassword, updateMyProfile, UserProfile } from "../../services/profile";
import { addAddress, getAddresses, Address, deleteAddress, setDefaultAddress, updateAddress } from "../../services/addresses";
import { useToast } from "../../components/ToastProvider";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addingAddress, setAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const { show } = useToast();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    documentId: "",
    department: "",
    city: "",
    addressLine: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const departmentCities: Record<string, string[]> = {
    "Amazonas": ["Leticia"],
    "Antioquia": ["Medellin", "Bello", "Sabaneta", "Itagui", "La Estrella"],
    "Arauca": ["Arauca"],
    "Atlántico": ["Barranquilla", "Soledad", "Malambo"],
    "Bolívar": ["Cartagena", "Magangue"],
    "Boyacá": ["Tunja", "Duitama", "Sogamoso"],
    "Caldas": ["Manizales", "Chinchina"],
    "Caquetá": ["Florencia"],
    "Casanare": ["Yopal"],
    "Cauca": ["Popayan"],
    "Cesar": ["Valledupar"],
    "Chocó": ["Quibdo"],
    "Córdoba": ["Monteria"],
    "Cundinamarca": ["Soacha", "Zipaquira", "Chia"],
    "Guainía": ["Inirida"],
    "Guaviare": ["San Jose del Guaviare"],
    "Huila": ["Neiva"],
    "La Guajira": ["Riohacha", "Maicao"],
    "Magdalena": ["Santa Marta"],
    "Meta": ["Villavicencio"],
    "Nariño": ["Pasto", "Tumaco"],
    "Norte de Santander": ["Cucuta"],
    "Putumayo": ["Mocoa"],
    "Quindío": ["Armenia"],
    "Risaralda": ["Pereira", "Dosquebradas"],
    "San Andrés y Providencia": ["San Andres"],
    "Santander": ["Bucaramanga", "Floridablanca"],
    "Sucre": ["Sincelejo"],
    "Tolima": ["Ibague"],
    "Valle del Cauca": ["Cali", "Palmira", "Buenaventura"],
    "Vaupés": ["Mitu"],
    "Vichada": ["Puerto Carreno"],
    "Bogotá D.C.": ["Bogota"]
  };
  const departmentOptions = Object.keys(departmentCities);

  const [newAddress, setNewAddress] = useState({
    department: "Antioquia",
    city: "Medellin",
    addressLine: ""
  });

  const [editAddress, setEditAddress] = useState({
    department: "Antioquia",
    city: "Medellin",
    addressLine: "",
    isDefault: false
  });

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setProfile(data);
        const [firstName = "", lastName = ""] = data.fullName.split(" ");
        setForm({
          firstName,
          lastName,
          phone: data.phone,
          documentId: data.documentId,
          department: data.department,
          city: data.city,
          addressLine: data.addressLine
        });
      })
      .finally(() => setLoading(false));
    getAddresses().then(setAddresses).catch(() => setAddresses([]));
  }, []);

  const saveProfile = async () => {
    if (form.firstName.length > 20) {
      show("El nombre no debe superar 20 letras", "error");
      return;
    }
    if (form.lastName.length > 25) {
      show("El apellido no debe superar 25 letras", "error");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      show("El celular debe tener 10 numeros", "error");
      return;
    }
    if (!/^\d+$/.test(form.documentId)) {
      show("El documento debe contener solo numeros", "error");
      return;
    }
    try {
      setSaving(true);
      const updated = await updateMyProfile(form);
      setProfile(updated);
      show("Perfil actualizado");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar el perfil";
      show(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    if (passwordForm.newPassword.length < 8) {
      show("La contraseña debe tener mínimo 8 caracteres", "error");
      return;
    }
    try {
      setPasswordSaving(true);
      await updateMyPassword(passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      show("Contraseña actualizada");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar la contraseña";
      show(message, "error");
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.addressLine.trim()) {
      show("La direccion es obligatoria", "error");
      return;
    }
    try {
      const created = await addAddress({
        department: newAddress.department,
        city: newAddress.city,
        addressLine: newAddress.addressLine,
        isDefault: addresses.length === 0
      });
      setAddresses((prev) => [created, ...prev]);
      setNewAddress({ ...newAddress, addressLine: "" });
      setAddingAddress(false);
      show("Direccion añadida");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo añadir la direccion";
      show(message, "error");
    }
  };

  const startEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setEditAddress({
      department: addr.department,
      city: addr.city,
      addressLine: addr.addressLine,
      isDefault: addr.isDefault
    });
  };

  const handleUpdateAddress = async () => {
    if (!editingAddressId) return;
    if (!editAddress.addressLine.trim()) {
      show("La direccion es obligatoria", "error");
      return;
    }
    try {
      const updated = await updateAddress(editingAddressId, editAddress);
      setAddresses((prev) => prev.map((addr) => (addr.id === updated.id ? updated : addr)));
      setEditingAddressId(null);
      show("Direccion actualizada");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar la direccion";
      show(message, "error");
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      show("Direccion eliminada");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo eliminar la direccion";
      show(message, "error");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((addr) => ({ ...addr, isDefault: addr.id === id }))
      );
      show("Direccion principal actualizada");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo actualizar la direccion";
      show(message, "error");
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div>
        <h1 className="font-display text-4xl">Mi perfil</h1>
        {profile && <p className="mt-2 text-ink/70">{profile.email}</p>}
      </div>

      {loading ? (
        <p>Cargando perfil...</p>
      ) : (
        <>
          <div className="bg-white/70 border border-sand rounded-3xl p-6 grid gap-4 text-sm">
            <h2 className="font-display text-2xl">Datos personales</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Nombre</label>
                <input
                  maxLength={20}
                  className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Apellido</label>
                <input
                  maxLength={25}
                  className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Celular</label>
                <input
                  inputMode="numeric"
                  maxLength={10}
                  className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Documento</label>
                <input
                  inputMode="numeric"
                  className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                  value={form.documentId}
                  onChange={(e) => setForm({ ...form, documentId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Departamento</label>
                <select
                  className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                  value={form.department}
                  onChange={(e) => {
                    const nextDepartment = e.target.value;
                    const nextCities = departmentCities[nextDepartment] || [];
                    setForm({
                      ...form,
                      department: nextDepartment,
                      city: nextCities[0] || ""
                    });
                  }}
                >
                  {departmentOptions.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Ciudad</label>
                <select
                  className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                >
                  {(departmentCities[form.department] || []).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Direccion</label>
              <input
                className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                value={form.addressLine}
                onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="w-full rounded-full bg-terracotta text-cream py-3 uppercase tracking-[0.2em]"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>

          <div className="bg-white/70 border border-sand rounded-3xl p-6 grid gap-4 text-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Direcciones de entrega</h2>
              <button
                type="button"
                onClick={() => setAddingAddress((prev) => !prev)}
                className="text-terracotta uppercase tracking-[0.2em] text-xs"
              >
                {addingAddress ? "Cerrar" : "Añadir nueva direccion"}
              </button>
            </div>
            <div className="grid gap-2">
              {addresses.map((addr) => (
                <div key={addr.id} className="border border-sand rounded-2xl p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">{addr.department} - {addr.city}</p>
                      <p className="text-ink/70 text-sm">{addr.addressLine}</p>
                    </div>
                    {addr.isDefault && (
                      <span className="text-xs uppercase tracking-[0.2em] text-olive">Principal</span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em]">
                    <button
                      type="button"
                      onClick={() => startEditAddress(addr)}
                      className="text-terracotta"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-ink/70"
                    >
                      Marcar principal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-terracotta"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              {addresses.length === 0 && <p>No tienes direcciones registradas.</p>}
            </div>

            {addingAddress && (
              <div className="mt-4 grid gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Departamento</label>
                  <select
                    className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                    value={newAddress.department}
                    onChange={(e) => {
                      const nextDepartment = e.target.value;
                      const nextCities = departmentCities[nextDepartment] || [];
                      setNewAddress({
                        ...newAddress,
                        department: nextDepartment,
                        city: nextCities[0] || ""
                      });
                    }}
                  >
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Ciudad</label>
                  <select
                    className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  >
                    {(departmentCities[newAddress.department] || []).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Direccion</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                    value={newAddress.addressLine}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="w-full rounded-full border border-ink py-3 uppercase tracking-[0.2em]"
                >
                  Guardar direccion
                </button>
              </div>
            )}

            {editingAddressId && (
              <div className="mt-4 grid gap-3">
                <h3 className="font-display text-lg">Editar direccion</h3>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Departamento</label>
                  <select
                    className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                    value={editAddress.department}
                    onChange={(e) => {
                      const nextDepartment = e.target.value;
                      const nextCities = departmentCities[nextDepartment] || [];
                      setEditAddress({
                        ...editAddress,
                        department: nextDepartment,
                        city: nextCities[0] || ""
                      });
                    }}
                  >
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Ciudad</label>
                  <select
                    className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                    value={editAddress.city}
                    onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })}
                  >
                    {(departmentCities[editAddress.department] || []).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Direccion</label>
                  <input
                    className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                    value={editAddress.addressLine}
                    onChange={(e) => setEditAddress({ ...editAddress, addressLine: e.target.value })}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleUpdateAddress}
                    className="rounded-full border border-ink px-4 py-2 uppercase tracking-[0.2em]"
                  >
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingAddressId(null)}
                    className="rounded-full border border-sand px-4 py-2 uppercase tracking-[0.2em] text-ink/70"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/70 border border-sand rounded-3xl p-6 grid gap-4 text-sm">
            <h2 className="font-display text-2xl">Actualizar contraseña</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Actual</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Nueva</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-ink/60">Confirmar</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl border border-sand bg-white/80 px-4 py-3"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={savePassword}
              disabled={passwordSaving}
              className="w-full rounded-full border border-ink py-3 uppercase tracking-[0.2em]"
            >
              {passwordSaving ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
