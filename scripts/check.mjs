import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
if(!scripts.length) throw new Error('No application script');
for(const script of scripts) new vm.Script(script);
const markup = html.replace(/<script>[\s\S]*?<\/script>/g,'');
const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
if(new Set(ids).size!==ids.length) throw new Error('Duplicate static element IDs');
for(const script of scripts){
 for(const match of script.matchAll(/el\('([^']+)'\)\.addEventListener/g)){
  const id=match[1];
  if(!ids.includes(id) && !html.includes('id="'+id+'"')) throw new Error('Missing DOM binding target: '+id);
 }
}
if(!html.includes('name="viewport"')) throw new Error('Missing mobile viewport');
console.log('PASS: JavaScript syntax, element IDs, event targets, mobile viewport');
