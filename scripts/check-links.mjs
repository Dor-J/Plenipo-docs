import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const docsRoot = path.resolve('docs');
const markdownFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.vitepress') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      markdownFiles.push(fullPath);
    }
  }
}

function splitTarget(raw) {
  const trimmed = raw.trim().replace(/^<|>$/g, '');
  const withoutTitle = trimmed.split(/\s+(?=["'])/)[0] ?? trimmed;
  return withoutTitle.split(/[?#]/, 1)[0];
}

function isExternal(target) {
  return /^(https?:|mailto:|tel:|javascript:)/i.test(target);
}

function candidatesFor(file, target) {
  let decoded = target;
  try {
    decoded = decodeURIComponent(target);
  } catch {
    return [];
  }

  const base = decoded.startsWith('/')
    ? path.join(docsRoot, decoded.replace(/^\/+/, ''))
    : path.resolve(path.dirname(file), decoded);

  const candidates = [base];
  if (!path.extname(base)) {
    candidates.push(`${base}.md`);
    candidates.push(path.join(base, 'index.md'));
  }
  if (base.endsWith('.html')) {
    candidates.push(base.replace(/\.html$/, '.md'));
  }
  return candidates;
}

function existsAsDocsTarget(file, target) {
  if (!target || target.startsWith('#') || isExternal(target)) return true;
  const candidates = candidatesFor(file, target);
  return candidates.some((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

walk(docsRoot);

const markdownLinkPattern = /!?\[[^\]]*]\(([^)]+)\)/g;
const failures = [];

for (const file of markdownFiles) {
  const text = await Bun.file(file).text();
  let match;
  while ((match = markdownLinkPattern.exec(text)) !== null) {
    const target = splitTarget(match[1]);
    if (!existsAsDocsTarget(file, target)) {
      failures.push(`${path.relative(process.cwd(), file)} -> ${target}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Broken local docs links:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`docs links ok (${markdownFiles.length} markdown files)`);
