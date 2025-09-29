export type Banca = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
};

// Mock de bancas (coordenadas aproximadas em SP)
export const BANCAS_MOCK: Banca[] = [
  { id: "b1", name: "Banca Paulista", lat: -23.561414, lng: -46.655881, address: "Av. Paulista, São Paulo" },
  { id: "b2", name: "Banca Centro", lat: -23.545284, lng: -46.635912, address: "Centro Histórico, São Paulo" },
  { id: "b3", name: "Banca Pinheiros", lat: -23.567001, lng: -46.695435, address: "Pinheiros, São Paulo" },
  { id: "b4", name: "Banca Moema", lat: -23.603772, lng: -46.664697, address: "Moema, São Paulo" },
  { id: "b5", name: "Banca Ibirapuera", lat: -23.587416, lng: -46.657634, address: "Parque Ibirapuera, São Paulo" },
];
