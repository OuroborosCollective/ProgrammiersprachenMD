# Go

---
slug: go
name: Go
year: 2009
paradigms:
  - imperative
  - concurrent
  - structured
description: Einfache, schnell kompilierende Systemssprache von Google – ideal für Cloud-Infrastruktur, Microservices und CLI-Tools.
tags:
  - compiled
  - static-typing
  - concurrent
  - cloud
  - systems
  - google
---

## Übersicht

Go (auch Golang genannt) wurde 2007 bei Google von Robert Griesemer, Rob Pike und Ken Thompson entworfen und 2009 veröffentlicht. Die Sprache fokussiert auf Einfachheit, schnelle Kompilierung und eingebaute Nebenläufigkeit über Goroutinen und Channels.

| Eigenschaft     | Wert                               |
|-----------------|-----------------------------------|
| Jahr            | 2009 (Open Source)                 |
| Entwickler      | Google (Griesemer, Pike, Thompson) |
| Typsystem       | Statisch, stark, strukturell       |
| Speichermodell  | Garbage-Collected                  |
| Webseite        | https://go.dev                     |
| Lizenz          | BSD                                |

---

## Schlüsselfeatures

```go
package main

import (
    "fmt"
    "sync"
    "net/http"
)

// Interfaces - strukturell (duck typing)
type Writer interface {
    Write(p []byte) (n int, err error)
}

// Structs & Methoden
type Server struct {
    host string
    port int
    mu   sync.Mutex
}

func (s *Server) Address() string {
    return fmt.Sprintf("%s:%d", s.host, s.port)
}

// Multiple Return Values
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}

// Goroutinen & Channels
func producer(ch chan<- int, n int) {
    for i := 0; i < n; i++ {
        ch <- i
    }
    close(ch)
}

func main() {
    ch := make(chan int, 10)
    go producer(ch, 10)
    for v := range ch {
        fmt.Println(v)
    }

    // WaitGroup
    var wg sync.WaitGroup
    for i := 0; i < 5; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            fmt.Printf("Worker %d done\n", id)
        }(i)
    }
    wg.Wait()
}
```

---

## Fehlerbehandlung

```go
// Explizit, kein Exception-System
f, err := os.Open("file.txt")
if err != nil {
    return fmt.Errorf("open file: %w", err)  // wrapping
}
defer f.Close()

// Errors.Is / Errors.As
if errors.Is(err, os.ErrNotExist) { ... }
var pathErr *os.PathError
if errors.As(err, &pathErr) { ... }
```

---

## Ökosystem

**go mod** – Modulverwaltung seit Go 1.11  
**Wichtige Pakete:** `net/http`, `encoding/json`, `database/sql`, `crypto/tls`, `context`, `sync`

**Frameworks & Bibliotheken:**
- **Gin / Echo / Fiber / Chi** – Web-Frameworks
- **GORM / sqlc / sqlx** – Datenbank
- **gRPC** – RPC-Framework
- **cobra** – CLI-Framework
- **viper** – Konfiguration
- **zap / zerolog** – Logging

---

## Anwendungsgebiete

Docker, Kubernetes, Terraform, Helm, Prometheus, Grafana, CockroachDB, Caddy, Hugo – alle in Go geschrieben.

**Typische Nutzung:** Cloud-Infrastruktur, Microservices, Netzwerkdienste, CLI-Tools, DevOps-Tools

---

## Stärken & Schwächen

**Stärken:** Sehr schnelle Kompilierung, eingebaute Nebenläufigkeit, einfache Syntax (25 Keywords), statisch kompilierte Binaries (kein Runtime-Dependency), gute Standard-Bibliothek, starke Cloud-Community  
**Schwächen:** Kein Generics vor 1.18 (jetzt vorhanden), verbose Fehlerbehandlung, kein Exceptions, minimale Sprachfeatures (kein Overloading, keine Operator-Overloading), GC-Pausen

---

*Letzte Aktualisierung: Manuell, 2024-07*
