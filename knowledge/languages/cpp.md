# C++

---
slug: cpp
name: C++
year: 1985
paradigms:
  - object-oriented
  - generic
  - procedural
  - functional
  - systems
description: Erweiterung von C mit OOP, Generics und moderner Standardbibliothek – Hochleistungssprache für Spiele, Systeme und eingebettete Anwendungen.
tags:
  - compiled
  - static-typing
  - systems
  - performance
  - object-oriented
  - generic-programming
---

## Übersicht

C++ wurde von Bjarne Stroustrup bei Bell Labs entwickelt, zunächst als „C mit Klassen" (1979). Der Name „C++" erschien 1983. C++ ist heute die leistungsfähigste höhere Programmiersprache und standardisiert durch ISO (aktuell C++23).

| Eigenschaft     | Wert                                    |
|-----------------|-----------------------------------------|
| Jahr            | 1985 (erste kommerzielle Version)        |
| Entwickler      | Bjarne Stroustrup (Bell Labs)            |
| Standards       | C++98, C++11, C++14, C++17, C++20, C++23 |
| Typsystem       | Statisch, stark, nominal + strukturell   |
| Speichermodell  | Manuell + RAII (kein GC)                |
| Kompilierung    | Nativer Maschinencode                   |

---

## Modernes C++ (C++11 bis C++23)

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <memory>
#include <ranges>
#include <format>

// Smart Pointer (kein manuelles delete nötig)
auto ptr = std::make_unique<std::vector<int>>(10, 0);
auto shared = std::make_shared<std::string>("hello");

// Lambdas & Closures
auto multiply = [](int x, int y) { return x * y; };
int factor = 3;
auto triple = [factor](int x) mutable { return x * factor; };

// Templates & Concepts (C++20)
template<typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

template<Numeric T>
T square(T x) { return x * x; }

// Ranges (C++20)
std::vector<int> v = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
auto result = v
    | std::views::filter([](int n) { return n % 2 == 0; })
    | std::views::transform([](int n) { return n * n; })
    | std::ranges::to<std::vector>();

// std::format (C++20)
std::string msg = std::format("Hello, {}! You are {} years old.", name, age);

// Coroutines (C++20)
#include <coroutine>
generator<int> fibonacci() {
    int a = 0, b = 1;
    while (true) {
        co_yield a;
        auto tmp = a + b;
        a = b; b = tmp;
    }
}

// Move-Semantik
std::vector<int> createLargeVector() {
    std::vector<int> v(1'000'000, 42);
    return v;  // RVO / Move, kein Deep Copy
}
```

---

## RAII – Resource Acquisition Is Initialization

```cpp
class FileHandle {
    FILE* file_;
public:
    explicit FileHandle(const char* path, const char* mode)
        : file_(fopen(path, mode)) {
        if (!file_) throw std::runtime_error("Cannot open file");
    }
    ~FileHandle() { if (file_) fclose(file_); }
    // Kein manuelles Schließen nötig – Destruktor übernimmt es
};

// RAII mit Lock
std::mutex mtx;
{
    std::lock_guard<std::mutex> lock(mtx);
    // Kritischer Abschnitt – Lock wird automatisch freigegeben
}
```

---

## Ökosystem

**Build-Systeme:** CMake, Meson, Bazel, Make  
**Package-Manager:** vcpkg, Conan  
**Bibliotheken:** Boost, Qt, SFML, SDL2, OpenGL, Eigen, OpenCV, TensorFlow (C++ API), gRPC, Abseil, {fmt}  
**Compiler:** GCC, Clang, MSVC, Intel C++

---

## Anwendungsgebiete

Spieleentwicklung (Unreal Engine, Godot), Betriebssysteme, Echtzeit-Systeme, Hochfrequenzhandel, Browser (Chrome V8, Firefox), Grafik-Engines, Datenbanken, Raumfahrt

---

## Stärken & Schwächen

**Stärken:** Maximale Performance + Flexibilität, Zero-Cost-Abstraktionen, direkte Hardwarekontrolle, riesiges Ökosystem, Rückwärtskompatibilität zu C  
**Schwächen:** Extreme Komplexität, schwer zu lernen, undefiniertes Verhalten, langsame Kompilierung, kein einheitlicher Package-Manager, Speicherfehler möglich

---

*Letzte Aktualisierung: Manuell, 2024-07*
