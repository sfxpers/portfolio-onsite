/// <reference types="vite/client" />

type ClientEnv = typeof import("../env").default;

interface ImportMetaEnv extends ClientEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
