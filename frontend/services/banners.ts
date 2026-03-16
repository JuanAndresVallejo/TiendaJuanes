import { apiGet } from "./api";

export type Banner = {
  id: number;
  title: string;
  subtitle: string;
  link?: string | null;
  active: boolean;
  createdAt: string;
};

export async function getActiveBanners(): Promise<Banner[]> {
  return apiGet<Banner[]>("/banners");
}
