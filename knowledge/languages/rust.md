# Rust

---
slug: rust
name: Rust
year: 2015
paradigms:
  - systems
  - functional
  - imperative
  - concurrent
description: Systemssprache ohne Garbage-Collector mit Speichersicherheit durch das Ownership-System – schnell wie C, sicher wie keine andere.
tags:
  - compiled
  - static-typing
  - systems
  - memory-safe
  - concurrent
  - wasm
  - embedded
---

## Übersicht

Rust ist eine systemsnahe Programmiersprache, die von Mozilla Research entwickelt und 2015 in Version 1.0 veröffentlicht wurde. Das revolutionäre **Ownership-System** garantiert Speichersicherheit und Thread-Sicherheit **ohne** Garbage-Collector – zur Kompilierzeit, nicht zur Laufzeit. Rust wurde 8 Jahre in Folge zur beliebtesten Sprache auf Stack Overflow gewählt.

| Eigenschaft      | Wert                                      |
|------------------|-------------------------------------------|
| Jahr             | 2015 (1.0)                                |
| Entwickler       | Urspr. Graydon Hoare / Mozilla Research, jetzt Rust Foundation |
| Typsystem        | Statisch, stark, linear (Ownership)       |
| Speichermodell   | Ownership + Borrowing + Lifetimes (kein GC) |
| Kompilierung     | LLVM-Backend                              |
| Webseite         | https://www.rust-lang.org                 |

---

## Das Ownership-System

```rust
// Ownership
let s1 = String::from("hello");
let s2 = s1;           // s1 ist MOVED – Eigentümerschaft übertragen
// println!("{}", s1); // Kompilerfehler! s1 nicht mehr gültig

// Borrowing (Ausleihen)
let s1 = String::from("hello");
let len = calculate_length(&s1);  // s1 bleibt gültig
println!("{} has length {}", s1, len);

fn calculate_length(s: &str) -> usize { s.len() }

// Mutable Borrowing
let mut s = String::from("hello");
let r = &mut s;
r.push_str(", world");
// Nur EIN mutable borrow gleichzeitig!

// Lifetimes
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

---

## Typsystem

```rust
// Enums mit Daten (algebraische Datentypen)
enum Shape {
    Circle(f64),
    Rectangle { width: f64, height: f64 },
    Triangle(f64, f64, f64),
}

// Option & Result
fn divide(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 { None } else { Some(a / b) }
}

fn parse_and_double(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n: i32 = s.trim().parse()?;  // ? propagiert Fehler
    Ok(n * 2)
}

// Traits (ähnlich Interfaces)
trait Animal {
    fn name(&self) -> &str;
    fn sound(&self) -> String;
    fn description(&self) -> String {
        format!("{} goes {}", self.name(), self.sound())
    }
}

struct Dog { name: String }
impl Animal for Dog {
    fn name(&self) -> &str { &self.name }
    fn sound(&self) -> String { "Woof!".to_string() }
}

// Generics mit Trait-Bounds
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    list.iter().max_by(|a, b| a.partial_cmp(b).unwrap()).unwrap()
}
```

---

## Nebenläufigkeit

```rust
use std::thread;
use std::sync::{Arc, Mutex};

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles { handle.join().unwrap(); }
    println!("Result: {}", *counter.lock().unwrap());  // 10
}

// Async/Await mit Tokio
use tokio;
#[tokio::main]
async fn main() {
    let result = tokio::join!(
        fetch_data("https://api1.example.com"),
        fetch_data("https://api2.example.com"),
    );
}
```

---

## Ökosystem

**Cargo:** Build-Tool, Package-Manager (ähnlich npm)  
```bash
cargo new mein-projekt     # Neues Projekt
cargo build --release      # Optimierter Build
cargo test                 # Tests ausführen
cargo doc --open           # Dokumentation generieren
cargo add tokio            # Abhängigkeit hinzufügen (seit 1.62)
```

**Wichtige Crates (Pakete):**
- **tokio** – Async-Runtime
- **serde** – Serialisierung/Deserialisierung
- **reqwest** – HTTP-Client
- **axum / actix-web** – Web-Frameworks
- **sqlx / diesel** – Datenbank
- **clap** – CLI-Argument-Parsing
- **rayon** – Datenparallelismus
- **wasm-bindgen** – WebAssembly-Integration

---

## Anwendungsgebiete

| Bereich           | Beispiele                                    |
|-------------------|----------------------------------------------|
| **Systemsoftware** | Betriebssysteme, Treiber                   |
| **WebAssembly**    | WASM-Module für Browser                     |
| **CLI-Tools**      | bat, ripgrep, fd, exa                       |
| **Web-Backend**    | Axum, Actix-web                             |
| **Embedded**       | Bare-metal, RTOS                            |
| **Spieleentwicklung** | Bevy Game Engine                         |
| **Blockchain**     | Solana, Polkadot                            |
| **Compiler**       | Teile des Firefox, Deno, Cloudflare          |

---

## Bekannte Nutzer

Linux-Kernel (seit 6.1), Windows-Kernel (Microsoft), Firefox (Mozilla), Cloudflare, Discord, AWS, Meta, Google, Dropbox, Figma, Polkadot, Solana

---

## Stärken & Schwächen

**Stärken:** Null-Kosten-Abstraktionen, kein GC, Speichersicherheit, Thread-Sicherheit, C/C++-Performance, exzellenter Compiler mit hilfreichen Fehlermeldungen  
**Schwächen:** Steile Lernkurve (Ownership-Konzept), langsame Kompilierung, verboses Typsystem, kleineres Ökosystem als C++

---

*Letzte Aktualisierung: Manuell, 2024-07*
