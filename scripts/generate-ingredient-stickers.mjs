/**
 * Генерация простых PNG 100x100 для стикеров ингредиентов (без внешних зависимостей).
 */
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../public/ingredients');

/** Палитра примерных цветов по имени файла */
const STICKERS = {
  'cherry.png': [0xc4, 0x2b, 0x3a],
  'sugar.png': [0xf5, 0xf0, 0xe8],
  'flour.png': [0xf2, 0xe8, 0xd8],
  'almond-crumb.png': [0xd4, 0xa5, 0x6a],
  'butter.png': [0xf4, 0xc4, 0x3c],
  'milk.png': [0xe8, 0xf4, 0xff],
  'baking-powder.png': [0xf8, 0xf8, 0xf0],
  'unsalted-butter.png': [0xf0, 0xd8, 0x78],
  'default.png': [0xc8, 0xc8, 0xc8],
};

const SIZE = 100;

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** PNG RGBA 100x100 с лёгким градиентом и «бликом» */
function createPng(rgb) {
  const [r, g, b] = rgb;
  const raw = Buffer.alloc((SIZE * 4 + 1) * SIZE);
  let offset = 0;

  for (let y = 0; y < SIZE; y++) {
    raw[offset++] = 0; // filter: none
    for (let x = 0; x < SIZE; x++) {
      const t = y / (SIZE - 1);
      const shade = 1 - t * 0.18;
      const highlight =
        x > 3 && x < 9 && y > 2 && y < 7 ? 0.22 : 0;
      const rr = Math.min(
        255,
        Math.round(r * shade + 255 * highlight),
      );
      const gg = Math.min(
        255,
        Math.round(g * shade + 255 * highlight),
      );
      const bb = Math.min(
        255,
        Math.round(b * shade + 255 * highlight),
      );
      raw[offset++] = rr;
      raw[offset++] = gg;
      raw[offset++] = bb;
      raw[offset++] = 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(SIZE, 0);
  ihdr.writeUInt32BE(SIZE, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const idat = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const [filename, rgb] of Object.entries(STICKERS)) {
    const png = createPng(rgb);
    const outPath = path.join(OUT_DIR, filename);
    await writeFile(outPath, png);
    const hash = createHash('md5').update(png).digest('hex').slice(0, 8);
    console.log(`${filename} (${png.length} bytes, md5:${hash})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
