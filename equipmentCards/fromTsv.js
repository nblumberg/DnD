const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const content = readFileSync('Feywild trinkets - Sheet1.tsv', { encoding: 'utf8' });
const lines = content.split('\n');
const list = lines.splice(1).map(line => line.split('\t'));

let output = `export default [`;
list.forEach(([roll, description, image, url]) => {
    const entry = { description, hero: url };
    output = `${output}\n\tcreateTrinket(${JSON.stringify(entry, null, '  ')}),`;
});
output = `${output}\n];\n`;
writeFileSync(join('js', 'data', 'trinkets.js'), output);
