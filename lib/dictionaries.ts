import fs from "node:fs";
import path from "node:path";
import { parse } from "smol-toml";

// This module runs at build time only (Server Components).

export type Entry = {
  term: string;
  definition?: string[]; // Missing or empty means a draft word.
  synonyms?: string[];
  extended_def?: string;
  etymology?: string;
  pronunciation?: string;
  part_of_speech?: string;
  see_also?: string[];
};

export type DictionaryMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  author?: string;
  description?: string;
  foreword?: string;
  // Book metadata. Validated and kept for future publishing; not shown yet.
  preface?: string;
  afterword?: string;
  edition?: string;
  publisher?: string;
  published?: string;
  language?: string;
  copyright?: string;
  license?: string;
  isbn?: string;
};

export type Dictionary = DictionaryMeta & { entries: Entry[] };

const META_KEYS = [
  "title", "subtitle", "author", "description", "foreword", "preface",
  "afterword", "edition", "publisher", "published", "language", "copyright",
  "license", "isbn",
] as const;
const ENTRY_STRING_KEYS = [
  "extended_def", "etymology", "pronunciation", "part_of_speech",
] as const;

const DIR = path.resolve(process.env.DICTIONARIES_DIR ?? "dictionaries");

function isTable(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v) && !(v instanceof Date);
}

function fail(file: string, msg: string): never {
  throw new Error(`[dictionaries] ${file}: ${msg}`);
}

function load(file: string): Dictionary {
  const slug = file.replace(/\.toml$/, "");
  if (!/^[a-z0-9-]+$/.test(slug)) fail(file, "file name must use only a-z, 0-9 and hyphens");
  let data: Record<string, unknown>;
  try {
    data = parse(fs.readFileSync(path.join(DIR, file), "utf8"));
  } catch (e) {
    fail(file, (e as Error).message);
  }

  const dict: Dictionary = { slug, title: "", entries: [] };
  for (const [key, value] of Object.entries(data)) {
    if (isTable(value)) {
      dict.entries.push(parseEntry(file, key, value));
      continue;
    }
    if (!(META_KEYS as readonly string[]).includes(key)) {
      fail(file, `unknown field "${key}". Words must be tables like ["${key}"]`);
    }
    const str = value instanceof Date ? value.toISOString().slice(0, 10) : value;
    if (typeof str !== "string") fail(file, `"${key}" must be text`);
    (dict as Record<string, unknown>)[key] = str;
  }
  if (!dict.title) fail(file, `missing required field "title"`);
  return dict;
}

function parseEntry(file: string, term: string, t: Record<string, unknown>): Entry {
  const entry: Entry = { term };
  for (const [key, value] of Object.entries(t)) {
    if (key === "definition" || key === "synonyms" || key === "see_also") {
      if (!Array.isArray(value) || !value.every((v) => typeof v === "string")) {
        fail(file, `["${term}"] ${key} must be a list of text, like ${key} = ["..."]`);
      }
      entry[key] = value.map((v) => v.trim()).filter(Boolean);
    } else if ((ENTRY_STRING_KEYS as readonly string[]).includes(key)) {
      if (typeof value !== "string") fail(file, `["${term}"] ${key} must be text`);
      (entry as Record<string, unknown>)[key] = value.trim();
    } else {
      fail(file, `["${term}"] unknown field "${key}"`);
    }
  }
  return entry;
}

let cache: Dictionary[] | undefined;

export function getDictionaries(): Dictionary[] {
  cache ??= fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".toml"))
    .map(load)
    .sort((a, b) => a.title.localeCompare(b.title));
  return cache;
}

export function getDictionary(slug: string): Dictionary | undefined {
  return getDictionaries().find((d) => d.slug === slug);
}
