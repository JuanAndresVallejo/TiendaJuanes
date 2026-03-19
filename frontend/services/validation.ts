export const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,20}$/;
export const lastNameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,25}$/;
export const documentRegex = /^\d{6,15}$/;
export const phoneRegex = /^\d{10}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const addressRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ#.,\- ]{8,120}$/;

export function isValidEmail(value: string) {
  return emailRegex.test(value.trim());
}
