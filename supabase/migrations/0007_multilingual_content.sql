-- Add optional English translation columns to courses, modules, lessons
alter table public.courses
  add column if not exists title_en       text,
  add column if not exists subtitle_en    text,
  add column if not exists description_en text;

alter table public.modules
  add column if not exists title_en text;

alter table public.lessons
  add column if not exists title_en   text,
  add column if not exists content_en jsonb;
