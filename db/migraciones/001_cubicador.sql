-- Cubicador: proyectos, revisiones de planos y partidas cubicadas.
-- Cada revisión guarda lo que se extrajo de un archivo (DXF hoy; PDF e IFC después). Las partidas
-- conservan la cantidad original del extractor para saber qué se corrigió a mano.

create table if not exists cub_proyectos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  cliente     text,
  notas       text,
  creado_por  text,
  creado_en   timestamptz not null default now()
);

create table if not exists cub_revisiones (
  id              uuid primary key default gen_random_uuid(),
  proyecto_id     uuid not null references cub_proyectos(id) on delete cascade,
  etiqueta        text not null,
  origen          text not null check (origen in ('dxf', 'pdf', 'ifc', 'manual')),
  archivo_nombre  text,
  archivo_sha256  text,
  archivo_bytes   integer,
  estado          text not null default 'procesando' check (estado in ('procesando', 'lista', 'error')),
  error           text,
  resumen         jsonb,
  creado_por      text,
  creado_en       timestamptz not null default now()
);
create index if not exists cub_revisiones_proyecto on cub_revisiones (proyecto_id, creado_en desc);

create table if not exists cub_partidas (
  id                 uuid primary key default gen_random_uuid(),
  revision_id        uuid not null references cub_revisiones(id) on delete cascade,
  orden              integer not null,
  grupo              text not null,
  codigo             text not null,
  descripcion        text not null,
  unidad             text not null,
  cantidad           numeric(14, 3),
  cantidad_original  numeric(14, 3),
  fuente             text,
  confianza          text not null default 'media' check (confianza in ('alta', 'media', 'baja')),
  editada_por        text,
  editada_en         timestamptz
);
create index if not exists cub_partidas_revision on cub_partidas (revision_id, orden);

create table if not exists schema_migraciones (
  nombre     text primary key,
  aplicada   timestamptz not null default now()
);
