import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const cssPath = resolve(root, 'dist/styles.css');
const entryFiles = [resolve(root, 'dist/index.js'), resolve(root, 'dist/index.cjs')];
const styleId = 'ragrails-api-playground-react-styles';

const css = await readFile(cssPath, 'utf8');
const injector = `const __RAGRAILS_API_PLAYGROUND_CSS__=${JSON.stringify(css)};
if(typeof document!=="undefined"&&!document.getElementById("${styleId}")){const style=document.createElement("style");style.id="${styleId}";style.textContent=__RAGRAILS_API_PLAYGROUND_CSS__;(document.head||document.documentElement).appendChild(style);}
`;

for (const file of entryFiles) {
  const source = await readFile(file, 'utf8');
  if (source.includes('__RAGRAILS_API_PLAYGROUND_CSS__')) continue;
  await writeFile(file, `${injector}${source}`);
}
