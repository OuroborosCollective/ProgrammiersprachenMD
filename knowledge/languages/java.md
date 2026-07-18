# Java

---
slug: java
name: Java
year: 1995
paradigms:
  - object-oriented
  - imperative
  - functional
  - reflective
description: Plattformunabhängige Enterprise-Sprache auf der JVM – „Write once, run anywhere" seit 30 Jahren im Einsatz.
tags:
  - compiled
  - static-typing
  - jvm
  - enterprise
  - object-oriented
  - general-purpose
---

## Übersicht

Java wurde von James Gosling bei Sun Microsystems entwickelt und 1995 veröffentlicht. Der Kompilator erzeugt **Bytecode**, der auf der **Java Virtual Machine (JVM)** läuft – dadurch plattformunabhängig. Oracle verwaltet Java seit 2010 (Übernahme von Sun). OpenJDK ist die Open-Source-Referenzimplementierung.

| Eigenschaft     | Wert                               |
|-----------------|-----------------------------------|
| Jahr            | 1995                               |
| Entwickler      | Sun Microsystems (jetzt Oracle)    |
| Typsystem       | Statisch, stark, nominell          |
| Speichermodell  | Garbage-Collected (JVM)            |
| Webseite        | https://www.java.com               |
| Aktuelle LTS    | Java 21 (Sep 2023), Java 17 (Sep 2021) |
| Lizenz          | GPLv2 (OpenJDK), kommerzielle Lizenzen für Oracle JDK |

---

## Kernsyntax

```java
// Records (Java 16+) - immutable Datenklassen
public record Point(double x, double y) {
    // Compact Constructor für Validierung
    public Point {
        if (Double.isNaN(x) || Double.isNaN(y))
            throw new IllegalArgumentException("NaN not allowed");
    }

    public double distanceTo(Point other) {
        return Math.hypot(this.x - other.x, this.y - other.y);
    }
}

// Sealed Classes (Java 17+)
public sealed interface Shape permits Circle, Rectangle, Triangle {}
public record Circle(double radius) implements Shape {}
public record Rectangle(double width, double height) implements Shape {}

// Pattern Matching (Java 21)
double area(Shape shape) {
    return switch (shape) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Rectangle r -> r.width() * r.height();
        case Triangle t  -> 0.5 * t.base() * t.height();
    };
}

// Generics & Collections
import java.util.*;
import java.util.stream.*;

List<String> names = List.of("Alice", "Bob", "Charlie");
Map<String, Integer> scores = Map.of("Alice", 95, "Bob", 87);

// Streams API (Java 8+)
List<String> result = names.stream()
    .filter(name -> name.startsWith("A"))
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());

OptionalInt max = IntStream.range(1, 100)
    .filter(n -> n % 2 == 0)
    .max();
```

---

## Nebenläufigkeit

```java
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

// Virtual Threads (Java 21, Project Loom)
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 1_000_000; i++) {
        executor.submit(() -> {
            // Blockierende I/O ohne Thread-Pool-Engpass
            Thread.sleep(Duration.ofMillis(100));
        });
    }
}

// CompletableFuture
CompletableFuture<String> future = CompletableFuture
    .supplyAsync(() -> fetchFromDatabase())
    .thenApply(data -> processData(data))
    .thenCompose(result -> saveResult(result))
    .exceptionally(ex -> handleError(ex));
```

---

## Ökosystem

**Build-Tools:** Maven, Gradle  
**Wichtige Frameworks:**
- **Spring Boot** – Enterprise-Anwendungen, REST-APIs
- **Quarkus** – Cloud-native, GraalVM-freundlich
- **Micronaut** – Microservices
- **Jakarta EE** – Enterprise-Standard
- **Hibernate / JPA** – ORM
- **JUnit 5** – Testing
- **Mockito** – Mocking

---

## Anwendungsgebiete

Enterprise-Anwendungen, Android-Entwicklung (ältere Apps), Finanzsysteme, Big Data (Hadoop, Spark), Microservices (Spring Boot), Trading-Systeme

---

## Stärken & Schwächen

**Stärken:** Plattformübergreifend, riesiges Ökosystem, starke Enterprise-Unterstützung, exzellente JVM-Performance, Virtual Threads (Java 21), rückwärtskompatibel  
**Schwächen:** Verboses Boilerplate (historisch, Records helfen), langsamer Startup (GraalVM hilft), schwerer als Go/Python für einfache Aufgaben

---

*Letzte Aktualisierung: Manuell, 2024-07*
