# JavaScript

---
slug: javascript
name: JavaScript
year: 1995
paradigms:
  - event-driven
  - functional
  - imperative
  - object-oriented
  - prototype-based
description: Die Sprache des Webs – läuft in jedem Browser und auf dem Server mit Node.js.
tags:
  - interpreted
  - dynamic-typing
  - web
  - frontend
  - backend
  - scripting
  - event-driven
---

## Übersicht

JavaScript (kurz JS) ist eine dynamisch typisierte, interpretierte Skriptsprache, die 1995 von Brendan Eich bei Netscape in nur 10 Tagen entwickelt wurde. Sie ist die einzige Sprache, die nativ in Webbrowsern ausgeführt wird. Mit Node.js läuft JavaScript auch serverseitig.

**Standard:** ECMAScript (ECMA-262), verwaltet von TC39  
**Aktuelle Version:** ES2024 (ECMAScript 2024)  
**Laufzeiten:** Browser (V8, SpiderMonkey, JavaScriptCore), Node.js, Deno, Bun

---

## Typsystem

Dynamisch, schwach typisiert. Automatische Typkonversion (Coercion) ist berüchtigt:

```javascript
"5" + 3        // "53"   (string concatenation)
"5" - 3        // 2      (arithmetic)
null == undefined // true
null === undefined // false
typeof null    // "object" (historischer Bug)
NaN === NaN   // false
[] + []        // ""
[] + {}        // "[object Object]"
```

---

## Wichtige Sprachfeatures

```javascript
// Destrukturierung
const { name, age = 25 } = user;
const [first, ...rest] = array;

// Spread
const merged = { ...obj1, ...obj2 };
const combined = [...arr1, ...arr2];

// Arrow Functions & Closures
const add = (a, b) => a + b;
const counter = () => {
  let count = 0;
  return { increment: () => ++count, get: () => count };
};

// Promises & Async/Await
async function fetchUser(id) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Generators
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) yield i;
}

// Proxy & Reflect
const handler = {
  get(target, key) {
    return key in target ? target[key] : `Property ${key} not found`;
  }
};
const proxy = new Proxy({}, handler);

// WeakMap, WeakSet, WeakRef
const cache = new WeakMap();

// Modules (ESM)
export const PI = 3.14159;
export default function main() {}
import { PI } from './math.js';
```

---

## Ökosystem

**Package-Manager:** npm, Yarn, pnpm, Bun  
**Runtime:** Node.js, Deno, Bun, Browser  
**Bundler:** Vite, webpack, Rollup, esbuild, Parcel  
**Frameworks:** React, Vue, Angular, Svelte, Solid, Qwik

---

## Stärken & Schwächen

**Stärken:** Universell (Frontend + Backend), riesiges Ökosystem, kein Build-Schritt nötig, asynchron-first, große Community  
**Schwächen:** Schwaches Typsystem, inkonsistente Coercion, keine echte Parallelität (Event Loop), historische API-Inkonsistenzen

---

*Letzte Aktualisierung: Manuell, 2024-07*
