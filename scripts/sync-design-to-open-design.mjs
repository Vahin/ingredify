#!/usr/bin/env node
/**
 * Создаёт проект Ingredify в Open Design и загружает HTML-артефакты из designs/
 * вместе с изображениями из public/ (те же пути, что в приложении).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAEMON = process.env.OD_DAEMON_URL ?? 'http://127.0.0.1:17456';
const PROJECT_ID = 'ingredify';
const PROJECT_INSTRUCTIONS =
  'Дизайн восстановлен из текущей кодовой базы Next.js (Ingredify). Источник токенов: src/app/globals.css. Основные экраны — recipe-page.html и cart-page.html. Изображения — из public/.';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DESIGNS_DIR = path.join(ROOT, 'designs');
const PUBLIC_DIR = path.join(ROOT, 'public');
const NUTRITION_ICONS_DIR = path.join(
  ROOT,
  'src/widgets/recipe-intro/assets/icons',
);

const FILES = [
  { name: 'DESIGN.md', artifact: false },
  { name: 'shared-tokens.css', artifact: false },
  { name: 'design-system.html', artifact: true },
  { name: 'recipe-page.html', artifact: true },
  { name: 'cart-page.html', artifact: true },
  { name: 'login-page.html', artifact: true },
  { name: 'ingredient-line-variants.html', artifact: true },
];

/** Изображения для recipe-page.html — пути как в public/ и в seed */
const PUBLIC_ASSETS = [
  'recipes/ingredify-cherry-cobbler-hero.png',
  'recipes/step-01-prepared-ingredients.png',
  'recipes/step-03-milk-into-flour.png',
  'ingredients/cherry.png',
  'ingredients/sugar.png',
  'ingredients/flour.png',
  'ingredients/almond-crumb.png',
  'ingredients/butter.png',
  'ingredients/milk.png',
  'ingredients/baking-powder.png',
  'ingredients/egg.png',
  'ingredients/garlic.png',
  'ingredients/parmesan.png',
  'ingredients/olive-oil.png',
  'ingredients/salt.png',
  'ingredients/fettuccine.png',
  'ingredients/cream-20.png',
  'ingredients/black-pepper.png',
  'ingredients/unsalted-butter.png',
];

/** SVG КБЖУ — те же файлы, что в NutritionIcon */
const NUTRITION_ICON_ASSETS = [
  { dest: 'icons/nutrition/fire.svg', file: 'fire.svg' },
  { dest: 'icons/nutrition/biceps.svg', file: 'biceps.svg' },
  { dest: 'icons/nutrition/drop.svg', file: 'drop.svg' },
  { dest: 'icons/nutrition/wheat.svg', file: 'wheat.svg' },
];

async function api(method, urlPath, body) {
  const res = await fetch(`${DAEMON}${urlPath}`, {
    method,
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(`${method} ${urlPath} → ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

function fileApiPath(name) {
  return `/api/projects/${PROJECT_ID}/files/${encodeURIComponent(name)}`;
}

async function deleteIfExists(name, listedFiles) {
  const exists = listedFiles.some((file) => file.name === name);
  if (exists) {
    await api('DELETE', fileApiPath(name));
  }
}

async function uploadTextFile(name, content, artifact, listedFiles) {
  await deleteIfExists(name, listedFiles);

  return api('POST', `/api/projects/${PROJECT_ID}/files`, {
    name,
    content,
    encoding: 'utf8',
    artifact,
    ...(artifact ? {} : { overwrite: true }),
  });
}

async function uploadBinaryAsset(name, absolutePath, listedFiles) {
  try {
    await fs.access(absolutePath);
  } catch {
    throw new Error(`Файл не найден: ${absolutePath}`);
  }

  const content = await fs.readFile(absolutePath);
  await deleteIfExists(name, listedFiles);

  return api('POST', `/api/projects/${PROJECT_ID}/files`, {
    name,
    content: content.toString('base64'),
    encoding: 'base64',
    overwrite: true,
  });
}

async function uploadTextAsset(name, absolutePath, listedFiles) {
  try {
    await fs.access(absolutePath);
  } catch {
    throw new Error(`Файл не найден: ${absolutePath}`);
  }

  const content = await fs.readFile(absolutePath, 'utf8');
  await deleteIfExists(name, listedFiles);

  return api('POST', `/api/projects/${PROJECT_ID}/files`, {
    name,
    content,
    encoding: 'utf8',
    overwrite: true,
  });
}

async function main() {
  const health = await fetch(`${DAEMON}/api/projects`);
  if (!health.ok) {
    console.error(`Open Design daemon недоступен: ${DAEMON}`);
    console.error('Запустите: npm run design');
    process.exit(1);
  }

  const existing = (await health.json()).projects ?? [];
  if (!existing.some((p) => p.id === PROJECT_ID)) {
    await api('POST', '/api/projects', {
      id: PROJECT_ID,
      name: 'Ingredify',
      skillId: 'frontend-design',
      skipDiscoveryBrief: true,
      metadata: { kind: 'prototype' },
      customInstructions: PROJECT_INSTRUCTIONS,
    });
    console.log(`Создан проект: ${PROJECT_ID}`);
  } else {
    await api('PATCH', `/api/projects/${PROJECT_ID}`, {
      customInstructions: PROJECT_INSTRUCTIONS,
    });
    console.log(`Проект уже существует: ${PROJECT_ID}`);
    console.log('Инструкции проекта обновлены');
  }

  const listed = await api('GET', `/api/projects/${PROJECT_ID}/files`);
  const listedFiles = listed.files ?? [];

  for (const { name, artifact } of FILES) {
    const content = await fs.readFile(path.join(DESIGNS_DIR, name), 'utf8');
    await uploadTextFile(name, content, artifact, listedFiles);
    console.log(`Загружен: ${name}${artifact ? ' (artifact)' : ''}`);
  }

  for (const assetPath of PUBLIC_ASSETS) {
    await uploadBinaryAsset(
      assetPath,
      path.join(PUBLIC_DIR, assetPath),
      listedFiles,
    );
    console.log(`Загружен: ${assetPath}`);
  }

  for (const { dest, file } of NUTRITION_ICON_ASSETS) {
    await uploadTextAsset(
      dest,
      path.join(NUTRITION_ICONS_DIR, file),
      listedFiles,
    );
    console.log(`Загружен: ${dest}`);
  }

  console.log(`\nОткройте: http://127.0.0.1:17573/project/${PROJECT_ID}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
