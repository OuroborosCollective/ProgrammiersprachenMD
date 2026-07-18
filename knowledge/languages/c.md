# C

---
slug: c
name: C
year: 1972
paradigms:
  - imperative
  - structured
  - procedural
description: Die Mutter der modernen Programmierung – nah an der Hardware, extrem performant, Basis für Betriebssysteme und Eingebettete Systeme.
tags:
  - compiled
  - static-typing
  - systems
  - embedded
  - low-level
  - portable
---

## Übersicht

C wurde 1972 von Dennis Ritchie bei den Bell Labs entwickelt, ursprünglich um das Unix-Betriebssystem zu schreiben. C ist die einflussreichste Programmiersprache der Geschichte: C++, Java, JavaScript, Python, Perl, PHP, Go und viele weitere wurden von C beeinflusst.

| Eigenschaft     | Wert                              |
|-----------------|----------------------------------|
| Jahr            | 1972                              |
| Entwickler      | Dennis Ritchie (Bell Labs)        |
| Standards       | C89/C90, C99, C11, C17, C23      |
| Typsystem       | Statisch, schwach (manuelle Verwaltung) |
| Speichermodell  | Manuell (malloc/free, kein GC)   |
| Kompilierung    | Nativer Maschinencode             |

---

## Kernsyntax

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Pointer & Speicherverwaltung
int *arr = malloc(10 * sizeof(int));
if (!arr) { perror("malloc"); exit(1); }
for (int i = 0; i < 10; i++) arr[i] = i * i;
free(arr);  // Manuell freigeben!

// Structs
typedef struct {
    char name[64];
    int age;
    double salary;
} Employee;

// Funktionszeiger
int compare_ints(const void *a, const void *b) {
    return (*(int*)a - *(int*)b);
}
int numbers[] = {5, 2, 8, 1, 9};
qsort(numbers, 5, sizeof(int), compare_ints);

// Bitfelder & Bitoperationen
uint32_t flags = 0;
flags |= (1 << 3);      // Bit 3 setzen
flags &= ~(1 << 3);     // Bit 3 löschen
int is_set = (flags >> 3) & 1;

// Präprozessor
#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define ARRAY_SIZE(arr) (sizeof(arr) / sizeof((arr)[0]))
#ifdef DEBUG
    printf("Debug: %d\n", value);
#endif
```

---

## Standardbibliothek (Auswahl)

| Header       | Inhalt                                      |
|--------------|---------------------------------------------|
| `<stdio.h>`  | I/O: printf, scanf, fopen, fclose           |
| `<stdlib.h>` | malloc, free, exit, atoi, qsort             |
| `<string.h>` | strcpy, strlen, memcpy, strcmp              |
| `<math.h>`   | sin, cos, sqrt, pow, log                    |
| `<time.h>`   | time, clock, mktime, strftime               |
| `<assert.h>` | assert-Makro für Debug                      |
| `<errno.h>`  | Fehler-Codes                                |
| `<signal.h>` | Signal-Handling                             |
| `<pthread.h>`| POSIX-Threads (POSIX, nicht Standard-C)     |

---

## Anwendungsgebiete

Betriebssysteme (Linux, macOS, Windows-Kernel), Eingebettete Systeme, Mikrocontroller, Datenbanken (PostgreSQL, SQLite), Interpreter (CPython, Ruby MRI), Netzwerkdienste

---

## Stärken & Schwächen

**Stärken:** Maximale Performance, direkte Hardware-Kontrolle, minimaler Overhead, überall verfügbar, stabiler Standard  
**Schwächen:** Manuelles Speichermanagement führt zu Buffer-Overflows, Use-After-Free, Memory-Leaks; kein Namespacing; schwaches Typsystem; keine OOP-Unterstützung nativ

---

*Letzte Aktualisierung: Manuell, 2024-07*
