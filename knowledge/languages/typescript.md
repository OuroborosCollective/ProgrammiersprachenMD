# TypeScript

---
slug: typescript
name: TypeScript
year: 2012
paradigms:
  - object-oriented
  - functional
  - imperative
  - event-driven
description: Typisiertes JavaScript-Superset von Microsoft – Standard für große Frontend-Projekte und Node.js-Backends.
tags:
  - compiled
  - static-typing
  - superset
  - web
  - frontend
  - backend
  - microsoft
  - general-purpose
---

## Übersicht

TypeScript ist ein **streng typisiertes Superset von JavaScript**, das von Microsoft entwickelt und 2012 öffentlich veröffentlicht wurde. TypeScript-Code wird zu JavaScript kompiliert und läuft überall, wo JavaScript läuft: Browser, Node.js, Deno, Bun, Cloudflare Workers u.v.m.

| Eigenschaft          | Wert                                            |
|----------------------|-------------------------------------------------|
| Erstveröffentlichung | Oktober 2012                                    |
| Aktuelle Version     | 5.7 (November 2024)                             |
| Entwickler           | Microsoft (geleitet von Anders Hejlsberg)       |
| Lizenz               | Apache 2.0                                      |
| Dateiendungen        | `.ts`, `.tsx` (React JSX), `.d.ts` (Deklarationen) |
| Webseite             | https://www.typescriptlang.org                  |
| Typsystem            | Strukturell, statisch, graduell, nominal opt.   |
| Ausgabe              | JavaScript (ES3 bis ESNext)                     |
| Quellcode            | https://github.com/microsoft/TypeScript         |

---

## Geschichte

| Jahr | Ereignis |
|------|----------|
| 2010 | Anders Hejlsberg (Erfinder von C#, Delphi, Turbo Pascal) beginnt bei Microsoft mit der Entwicklung |
| 2012 | TypeScript 0.8 wird öffentlich vorgestellt |
| 2014 | TypeScript 1.0 – Voll produktionsbereit |
| 2015 | TypeScript 1.5 – Decorators, Namespaces; Angular 2 kündigt TypeScript als primäre Sprache an |
| 2016 | TypeScript 2.0 – `--strictNullChecks`, Tagged Union Types |
| 2018 | TypeScript 3.0 – Tupel mit Rest-Elementen, Projektabhängigkeiten |
| 2019 | TypeScript 3.7 – Optional Chaining (`?.`), Nullish Coalescing (`??`) |
| 2020 | TypeScript 4.0 – Variadic Tuple Types, Labeled Tuple Elements |
| 2021 | TypeScript 4.4 – Using-Declarations (Preview), `--exactOptionalPropertyTypes` |
| 2022 | TypeScript 4.9 – `satisfies`-Operator |
| 2023 | TypeScript 5.0 – Decorators (Standard), `const` Type Parameter |
| 2024 | TypeScript 5.7 – Standalone `import type` Assertions, `--erasableSyntaxOnly` |

---

## Typsystem

TypeScript hat eines der **ausdrucksstärksten Typsysteme** aller Mainstream-Sprachen. Es ist **strukturell** (duck typing auf Typebene), nicht nominal.

### Grundtypen

```typescript
// Primitive
let name: string = "Alice";
let age: number = 30;
let active: boolean = true;
let nothing: null = null;
let undef: undefined = undefined;
let bignum: bigint = 100n;
let sym: symbol = Symbol("id");

// Arrays
let nums: number[] = [1, 2, 3];
let strs: Array<string> = ["a", "b"];

// Tupel
let point: [number, number] = [10, 20];
let named: [x: number, y: number, label?: string] = [10, 20];

// Objekt-Typen
interface User {
  id: number;
  name: string;
  email?: string;          // optional
  readonly createdAt: Date;
}

// Type Alias
type ID = string | number;
type Status = "active" | "inactive" | "pending";
```

### Fortgeschrittene Typen

```typescript
// Union & Intersection
type StringOrNumber = string | number;
type AdminUser = User & { admin: true; permissions: string[] };

// Generics
function identity<T>(value: T): T {
  return value;
}

// Generic mit Constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Conditional Types
type IsString<T> = T extends string ? true : false;
type NonNullable<T> = T extends null | undefined ? never : T;

// Mapped Types
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Partial<T> = { [K in keyof T]?: T[K] };
type Required<T> = { [K in keyof T]-?: T[K] };
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Record<K extends keyof any, V> = { [P in K]: V };

// Template Literal Types (4.1+)
type EventName = `on${Capitalize<string>}`;
type CSSProperty = `${string}-${string}`;
type Getter<T extends string> = `get${Capitalize<T>}`;
type Setter<T extends string> = `set${Capitalize<T>}`;

// Infer
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never;

type Awaited<T> = T extends Promise<infer R> ? Awaited<R> : T;

// Discriminated Unions
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":     return Math.PI * shape.radius ** 2;
    case "rectangle":  return shape.width * shape.height;
    case "triangle":   return (shape.base * shape.height) / 2;
  }
}
```

### Utility-Typen (Built-in)

| Typ                    | Beschreibung                                   |
|------------------------|------------------------------------------------|
| `Partial<T>`           | Alle Felder optional                           |
| `Required<T>`          | Alle Felder required                           |
| `Readonly<T>`          | Alle Felder readonly                           |
| `Record<K, V>`         | Objekt mit Keys K und Values V                 |
| `Pick<T, K>`           | Teilmenge der Felder                           |
| `Omit<T, K>`           | Felder ausschließen                            |
| `Exclude<T, U>`        | Aus Union-Typ ausschließen                     |
| `Extract<T, U>`        | Aus Union-Typ extrahieren                      |
| `NonNullable<T>`       | `null` und `undefined` entfernen               |
| `ReturnType<F>`        | Rückgabetyp einer Funktion                     |
| `Parameters<F>`        | Parameter-Typen als Tupel                      |
| `ConstructorParameters<C>` | Konstruktor-Parameter                      |
| `InstanceType<C>`      | Instanz-Typ einer Klasse                       |
| `Awaited<T>`           | Aufgelöster Typ eines Promise                  |
| `NoInfer<T>`           | Verhindert Typ-Inferenz (5.4+)                 |

---

## Paradigmen

### OOP – Klassen & Interfaces

```typescript
abstract class Repository<T, ID> {
  abstract findById(id: ID): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract save(entity: T): Promise<T>;
  abstract delete(id: ID): Promise<void>;
}

interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

class UserRepository extends Repository<User & Timestamps, number> {
  #db: Database;  // private class field (ES2022)

  constructor(db: Database) {
    super();
    this.#db = db;
  }

  async findById(id: number): Promise<(User & Timestamps) | null> {
    return this.#db.query("SELECT * FROM users WHERE id = $1", [id]);
  }

  async findAll(): Promise<(User & Timestamps)[]> {
    return this.#db.query("SELECT * FROM users ORDER BY created_at DESC");
  }

  async save(user: User & Timestamps): Promise<User & Timestamps> {
    return this.#db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [user.name, user.email]
    );
  }

  async delete(id: number): Promise<void> {
    await this.#db.query("DELETE FROM users WHERE id = $1", [id]);
  }
}
```

### Decorators (TypeScript 5.0, Standard TC39)

```typescript
function log(target: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);
  return function(this: any, ...args: any[]) {
    console.log(`Calling ${methodName} with`, args);
    const result = target.call(this, ...args);
    console.log(`${methodName} returned`, result);
    return result;
  };
}

function memoize<T extends (...args: any[]) => any>(
  fn: T,
  context: ClassMethodDecoratorContext
): T {
  const cache = new Map<string, ReturnType<T>>();
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn.apply(this, args));
    }
    return cache.get(key)!;
  } as T;
}

class Calculator {
  @log
  @memoize
  fibonacci(n: number): number {
    if (n < 2) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}
```

### Funktionale Programmierung

```typescript
// Pipe-Funktion mit Typen
type Fn<A, B> = (a: A) => B;

function pipe<A>(value: A): A;
function pipe<A, B>(value: A, fn1: Fn<A, B>): B;
function pipe<A, B, C>(value: A, fn1: Fn<A, B>, fn2: Fn<B, C>): C;
function pipe<A, B, C, D>(value: A, fn1: Fn<A, B>, fn2: Fn<B, C>, fn3: Fn<C, D>): D;
function pipe(value: any, ...fns: Array<Fn<any, any>>): any {
  return fns.reduce((v, fn) => fn(v), value);
}

// Option/Maybe-Typ
type Option<T> = { tag: "some"; value: T } | { tag: "none" };

const some = <T>(value: T): Option<T> => ({ tag: "some", value });
const none: Option<never> = { tag: "none" };

function map<A, B>(opt: Option<A>, fn: (a: A) => B): Option<B> {
  return opt.tag === "some" ? some(fn(opt.value)) : none;
}

function flatMap<A, B>(opt: Option<A>, fn: (a: A) => Option<B>): Option<B> {
  return opt.tag === "some" ? fn(opt.value) : none;
}
```

---

## tsconfig.json – Konfiguration

```jsonc
{
  "compilerOptions": {
    // Ziel-JavaScript-Version
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",

    // Striktheitsmodus (empfohlen)
    "strict": true,
    // Einzeln:
    "strictNullChecks": true,            // null/undefined nicht stillschweigend erlaubt
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // Weitere nützliche Flags
    "exactOptionalPropertyTypes": true,  // Optional ≠ T | undefined
    "noUncheckedIndexedAccess": true,    // Array-Zugriff gibt T | undefined zurück
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,

    // Output
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,

    // Interop
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,

    // Pfad-Aliase
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

## Ökosystem

### Package-Manager

```bash
npm install typescript --save-dev    # npm
yarn add typescript -D               # Yarn
pnpm add typescript -D               # pnpm (empfohlen)
bun add typescript -d                # Bun
```

### Wichtige Entwicklungswerkzeuge

| Werkzeug         | Beschreibung                                        |
|------------------|-----------------------------------------------------|
| **tsc**          | TypeScript-Compiler (offiziell)                     |
| **tsx**          | TypeScript-Ausführung ohne Build-Schritt            |
| **ts-node**      | TypeScript direkt in Node.js ausführen              |
| **esbuild**      | Extrem schneller Bundler/Transpiler                 |
| **swc**          | Rust-basierter schneller Compiler (Rust)            |
| **Bun**          | Runtime + Package-Manager + Bundler                 |
| **Vite**         | Frontend-Build-Tool mit TS-Unterstützung            |
| **tsup**         | Bibliotheks-Bundler, konfigurationsarm              |
| **Rollup**       | ES-Module-Bundler für Bibliotheken                  |
| **webpack**      | Modulbundler (älterer Standard)                     |
| **ESLint + typescript-eslint** | Linting                              |
| **Prettier**     | Code-Formatter                                      |
| **Biome**        | Linter + Formatter in einem (Rust-basiert)          |
| **Vitest**       | Schnelles Unit-Test-Framework                       |
| **Jest + ts-jest** | Test-Framework                                   |
| **Playwright**   | End-to-End-Tests im Browser                         |
| **Zod**          | Laufzeit-Validierung mit TypeScript-Typ-Inferenz    |
| **io-ts**        | Funktionale Laufzeit-Typen                          |

### Wichtige Bibliotheken

| Bibliothek       | Bereich                                             |
|------------------|-----------------------------------------------------|
| **React**        | UI-Framework (`.tsx`)                               |
| **Vue 3**        | UI-Framework (native TS)                            |
| **Angular**      | Full-Stack-Framework (TS-first)                     |
| **Svelte**       | UI-Framework                                        |
| **Next.js**      | React-Meta-Framework (SSR/SSG)                      |
| **Nuxt 3**       | Vue-Meta-Framework                                  |
| **Remix**        | React-Meta-Framework                                |
| **tRPC**         | End-to-End typsichere APIs                          |
| **Prisma**       | Datenbank-ORM mit TS-Generierung                    |
| **Drizzle ORM**  | TypeScript-first ORM                                |
| **Kysely**       | Typsicherer SQL-Query-Builder                       |
| **Zod**          | Schema-Validierung                                  |
| **Express**      | Web-Framework (mit `@types/express`)                |
| **Fastify**      | Schnelles Web-Framework (native TS)                 |
| **NestJS**       | Angular-inspiriertes Backend-Framework              |
| **Hono**         | Ultra-leichtes Web-Framework (Edge-ready)           |
| **GraphQL**      | API-Abfragesprache (codegen für TS)                 |
| **Tanstack Query** | Datenabruf-State-Management                       |
| **Zustand**      | Zustandsverwaltung                                  |
| **Redux Toolkit** | State-Management                                  |
| **Immer**        | Immutable State Updates                             |
| **date-fns**     | Datumsbibliothek                                    |

---

## Anwendungsgebiete

| Bereich              | Details                                                 |
|----------------------|---------------------------------------------------------|
| **Frontend**         | React, Vue, Angular, Svelte – alle empfehlen TS        |
| **Backend**          | Node.js (Express, Fastify, NestJS, Hono)               |
| **Full-Stack**       | Next.js, Nuxt, Remix, SvelteKit                        |
| **Serverless/Edge**  | Cloudflare Workers, Vercel Functions, AWS Lambda        |
| **CLI-Tools**        | Oclif, Commander.js                                    |
| **Monorepos**        | Turborepo, Nx                                          |
| **Mobile**           | React Native (expo)                                    |
| **Desktop**          | Electron, Tauri                                        |
| **Bibliotheken**     | Typ-sichere npm-Pakete                                 |

---

## Stärken

- **Catch-All-Superset:** Jede `.js`-Datei ist gültiges TypeScript
- **Hervorragende IDE-Integration:** IntelliSense, Autovervollständigung, Refactoring
- **Strukturelles Typsystem:** Flexibel, duck-typing-freundlich
- **Inkrementelle Adoption:** Kann graduell eingeführt werden
- **Aktive Entwicklung:** Microsoft veröffentlicht alle 3 Monate neue Versionen
- **Breite Akzeptanz:** Standard in der Web-Entwicklung, state-of-the-art
- **Definition Files:** `@types/*`-Pakete für fast jede JS-Bibliothek
- **Compiler als Design-Tool:** Fehler zur Compile-Zeit statt Laufzeit

---

## Schwächen

- **Kompilierungsschritt:** Erfordert Build-Prozess (aber `tsx` und Bun helfen)
- **Komplexes Typsystem:** Fortgeschrittene Typen können schwer lesbar sein
- **Typen sind gelöscht:** Keine Laufzeit-Typ-Informationen (außer `zod`, `io-ts`)
- **Kein ersetztes JavaScript:** Läuft immer noch als JS im Browser
- **tsconfig-Komplexität:** Viele Optionen, nicht immer offensichtlich
- **Typdefinitions-Probleme:** `@types/*` manchmal veraltet oder falsch
- **Langsamer Compiler:** `tsc` kann bei großen Projekten langsam sein

---

## Bekannte Projekte

| Projekt        | TypeScript-Nutzung                          |
|----------------|---------------------------------------------|
| **VS Code**    | Vollständig in TypeScript geschrieben        |
| **Angular**    | TypeScript-first seit Tag 1                 |
| **Deno**       | TypeScript nativ unterstützt                |
| **NestJS**     | TypeScript-Backend-Framework                |
| **Prisma**     | ORM, generiert TS-Typen                     |
| **tRPC**       | End-to-End typsichere APIs                  |
| **Supabase**   | Open-Source-Firebase-Alternative            |
| **Vercel**     | Serverless-Plattform (intern TypeScript)    |
| **Slack**      | Desktop-App (Electron + TS)                 |
| **Airbnb**     | Web-Frontend                                |

---

## Versionshistorie (Meilensteine)

| Version | Datum     | Highlights                                                      |
|---------|-----------|-----------------------------------------------------------------|
| 0.8     | Okt 2012  | Erste öffentliche Version                                       |
| 1.0     | Apr 2014  | Produktionsreif                                                 |
| 2.0     | Sep 2016  | `--strictNullChecks`, Control Flow Analysis, Tagged Unions      |
| 2.8     | Mär 2018  | Conditional Types                                               |
| 3.0     | Jul 2018  | Projektabhängigkeiten, Tupel mit Rest                           |
| 3.7     | Nov 2019  | Optional Chaining `?.`, Nullish Coalescing `??`                 |
| 4.0     | Aug 2020  | Variadic Tuple Types, Labeled Tuples                            |
| 4.1     | Nov 2020  | Template Literal Types, Recursive Conditional Types             |
| 4.4     | Aug 2021  | `--exactOptionalPropertyTypes`                                  |
| 4.7     | Mai 2022  | ES-Module-Unterstützung (NodeNext)                              |
| 4.9     | Nov 2022  | `satisfies`-Operator                                           |
| 5.0     | Mär 2023  | Decorators (Standard), `const` Type Parameter                  |
| 5.2     | Aug 2023  | `using`/`await using` (Explicit Resource Management)           |
| 5.5     | Jun 2024  | Inferred Type Predicates, Regular Expression Literals           |
| 5.7     | Nov 2024  | `--erasableSyntaxOnly`, Import-Attribute-Checks                 |

---

## Lernressourcen

### Offiziell
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [What's New in TypeScript](https://www.typescriptlang.org/docs/handbook/release-notes/overview.html)
- [TypeScript GitHub](https://github.com/microsoft/TypeScript)

### Bücher
- *Programming TypeScript* – Boris Cherny
- *Effective TypeScript* – Dan Vanderkam
- *Learning TypeScript* – Josh Goldberg (O'Reilly)

### Online-Ressourcen
- [Total TypeScript](https://www.totaltypescript.com/) – Matt Pocock
- [TypeHero](https://typehero.dev/) – Interaktive Übungen
- [Type Challenges](https://github.com/type-challenges/type-challenges) – Typ-Rätsel
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) – Basarat Ali Syed

---

*Letzte Aktualisierung: Manuell, 2024-07*
