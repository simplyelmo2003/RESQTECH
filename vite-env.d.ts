/// <reference types="vite/client" />
/// <reference types="leaflet" />
/// <reference types="leaflet-routing-machine" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // more env variables can be added here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}