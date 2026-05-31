#!/usr/bin/env node
/**
 * Создаёт проект Ingredify в Open Design и загружает HTML-артефакты из designs/.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DAEMON = process.env.OD_DAEMON_URL ?? 'http://127.0.0.1:17456';
const PROJECT_ID = 'ingredify';
const DESIGNS_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'designs',
);

const FILES = [
  { name: 'DESIGN.md', artifact: false },
  { name: 'design-system.html', artifact: true },
  { name: 'recipe-page.html', artifact: true },
  { name: 'login-page.html', artifact: true },
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

async function uploadFile(name, content, artifact) {
  return api('POST', `/api/projects/${PROJECT_ID}/files`, {
    name,
    content,
    encoding: 'utf8',
    artifact,
    overwrite: true,
  });
}

async function main() {
  const health = await fetch(`${DAEMON}/api/projects`);
  if (!health.ok) {
    console.error(`Open Design daemon недоступен: ${DAEMON}`);
    console.error('Запустите: pnpm run design');
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
      customInstructions:
        'Дизайн восстановлен из текущей кодовой базы Next.js (Ingredify). Источник токенов: src/app/globals.css. Основной экран — recipe-page.html.',
    });
    console.log(`Создан проект: ${PROJECT_ID}`);
  } else {
    console.log(`Проект уже существует: ${PROJECT_ID}`);
  }

  for (const { name, artifact } of FILES) {
    const content = await fs.readFile(path.join(DESIGNS_DIR, name), 'utf8');
    await uploadFile(name, content, artifact);
    console.log(`Загружен: ${name}${artifact ? ' (artifact)' : ''}`);
  }

  console.log(`\nОткройте: http://127.0.0.1:17573/project/${PROJECT_ID}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
