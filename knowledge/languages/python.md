# Python

---
slug: python
name: Python
year: 1991
paradigms:
  - object-oriented
  - imperative
  - functional
  - procedural
  - reflective
description: Klare, lesbare Allzwecksprache mit riesigem Ökosystem, dominant in Data-Science, KI und Scripting.
tags:
  - interpreted
  - dynamic-typing
  - high-level
  - scripting
  - data-science
  - ai
  - general-purpose
---

## Übersicht

Python ist eine **interpretierte, hochrangige, allgemeingültige Programmiersprache**, die 1991 von Guido van Rossum veröffentlicht wurde. Sie betont Lesbarkeit, einfache Syntax und Produktivität. Python verwendet signifikante Einrückung (Whitespace) zur Strukturierung von Codeblöcken, was den Code erzwingt konsistent und lesbar zu sein.

| Eigenschaft          | Wert                                    |
|----------------------|-----------------------------------------|
| Erstveröffentlichung | 1991                                    |
| Aktuelle Version     | 3.13 (Oktober 2024)                     |
| Entwickler           | Python Software Foundation (PSF)        |
| Lizenz               | PSF License (Open Source, GPL-kompatibel) |
| Dateiendungen        | `.py`, `.pyw`, `.pyi`, `.pyz`           |
| Webseite             | https://www.python.org                  |
| Typsystem            | Dynamisch, stark                        |
| Ausführungsmodell    | Interpretiert (CPython-Referenzimpl.)   |

---

## Geschichte

| Jahr | Ereignis |
|------|----------|
| 1989 | Guido van Rossum beginnt die Entwicklung während der Weihnachtsferien beim CWI in Amsterdam |
| 1991 | Python 0.9.0 – erste öffentliche Veröffentlichung mit Klassen, Fehlerbehandlung, Funktionen |
| 1994 | Python 1.0 – `lambda`, `map`, `filter`, `reduce` eingeführt |
| 2000 | Python 2.0 – Listenverständnisse, Garbage Collection, Unicode-Unterstützung |
| 2008 | Python 3.0 – Großer Neuentwurf, bricht Rückwärtskompatibilität; `print` wird Funktion, Unicode standardmäßig |
| 2010 | Python 2.7 – letzte 2.x-Version, erhält LTS-Status bis 2020 |
| 2020 | Python 2 offiziell EOL (End of Life) |
| 2022 | Python 3.11 – 60% Speedup gegenüber 3.10 |
| 2023 | Python 3.12 – Verbesserte Fehlermeldungen, `@override`-Decorator |
| 2024 | Python 3.13 – Experimentelle JIT-Kompilierung, GIL optional (PEP 703) |

**Namengebung:** Benannt nach der britischen Comedy-Gruppe „Monty Python's Flying Circus", nicht nach der Schlange.

---

## Typsystem

Python verwendet **duck typing** – ein Objekt ist verwendbar, wenn es die erwartete Schnittstelle besitzt, unabhängig von seinem konkreten Typ.

### Dynamisch & stark
```python
x = 42        # int
x = "Hallo"   # str – dynamisch, kein Fehler
x = x + 1    # TypeError! str + int – stark (keine implizite Konversion)
```

### Type Hints (PEP 484, seit Python 3.5)
Type Hints sind **optional** und werden zur Laufzeit nicht erzwungen, erlauben aber statische Analyse:

```python
from typing import Optional, Union, Callable, TypeVar

def greet(name: str, times: int = 1) -> str:
    return f"Hello, {name}! " * times

def process(value: Optional[int] = None) -> list[str]:
    ...

# Generics
T = TypeVar('T')
def identity(x: T) -> T:
    return x
```

### Wichtige Built-in-Typen

| Typ        | Beschreibung                          | Beispiel                     |
|------------|---------------------------------------|------------------------------|
| `int`      | Beliebig große Ganzzahl               | `42`, `10**100`              |
| `float`    | IEEE 754 Doppelpräzision              | `3.14`, `1e-10`              |
| `complex`  | Komplexe Zahl                         | `3+4j`                       |
| `bool`     | Subklasse von int                     | `True`, `False`              |
| `str`      | Unicode-String, immutabel             | `"Hallo"`, `'Welt'`          |
| `bytes`    | Byte-Sequenz, immutabel               | `b"data"`                    |
| `bytearray`| Veränderliche Byte-Sequenz            | `bytearray(b"data")`         |
| `list`     | Geordnete, veränderliche Sequenz      | `[1, 2, 3]`                  |
| `tuple`    | Geordnete, immutabile Sequenz         | `(1, 2, 3)`                  |
| `dict`     | Schlüssel-Wert-Abbildung (seit 3.7 geordnet) | `{"a": 1}`            |
| `set`      | Ungeordnete Menge ohne Duplikate      | `{1, 2, 3}`                  |
| `frozenset`| Immutables Set                        | `frozenset({1, 2})`          |
| `None`     | Fehlender Wert                        | `None`                       |

---

## Paradigmen

### Objektorientierte Programmierung (OOP)

```python
from dataclasses import dataclass, field
from abc import ABC, abstractmethod
from typing import ClassVar

class Animal(ABC):
    species_count: ClassVar[int] = 0

    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age
        Animal.species_count += 1

    @abstractmethod
    def speak(self) -> str: ...

    def __repr__(self) -> str:
        return f"{type(self).__name__}(name={self.name!r}, age={self.age})"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Animal):
            return NotImplemented
        return self.name == other.name and self.age == other.age

class Dog(Animal):
    def speak(self) -> str:
        return f"{self.name} says: Woof!"

    def fetch(self, item: str) -> str:
        return f"{self.name} fetches the {item}!"

# Dataclass (Python 3.7+)
@dataclass
class Point:
    x: float
    y: float
    label: str = ""
    tags: list[str] = field(default_factory=list)

    def distance_to(self, other: "Point") -> float:
        return ((self.x - other.x)**2 + (self.y - other.y)**2) ** 0.5
```

### Funktionale Programmierung

```python
from functools import reduce, partial, lru_cache
from itertools import chain, islice
from typing import Iterable

# Listenverständnisse & Generatoren
squares = [x**2 for x in range(10) if x % 2 == 0]
gen = (x**2 for x in range(10**9))  # lazy, kein Speicher

# Higher-Order-Funktionen
numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers))
evens   = list(filter(lambda x: x % 2 == 0, numbers))
total   = reduce(lambda acc, x: acc + x, numbers, 0)

# Closures & Partial Application
def multiplier(factor: int):
    def inner(x: int) -> int:
        return x * factor
    return inner

triple = multiplier(3)
print(triple(7))  # 21

double = partial(multiplier(2), )

# Memoization
@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

---

## Syntax-Besonderheiten

### Kontextmanager (Context Manager)
```python
# Eingebaut
with open("datei.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Eigener Kontextmanager
from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = time.perf_counter() - start
        print(f"Elapsed: {elapsed:.4f}s")

with timer():
    result = sum(range(10_000_000))
```

### Dekoratoren
```python
import functools
import time
from typing import Callable, TypeVar, ParamSpec

P = ParamSpec('P')
R = TypeVar('R')

def retry(max_attempts: int = 3, delay: float = 1.0):
    def decorator(func: Callable[P, R]) -> Callable[P, R]:
        @functools.wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5)
def fetch_data(url: str) -> dict:
    import urllib.request
    import json
    with urllib.request.urlopen(url) as resp:
        return json.loads(resp.read())
```

### Pattern Matching (Python 3.10+)
```python
def classify(point):
    match point:
        case (0, 0):
            return "Ursprung"
        case (x, 0):
            return f"Auf X-Achse bei {x}"
        case (0, y):
            return f"Auf Y-Achse bei {y}"
        case (x, y) if x == y:
            return f"Auf Diagonale bei {x}"
        case (x, y):
            return f"Punkt ({x}, {y})"
        case _:
            return "Unbekannt"

# Matching auf Klassen
class Point:
    def __init__(self, x, y): self.x, self.y = x, y

def process(shape):
    match shape:
        case Point(x=0, y=0):
            print("Ursprung")
        case Point(x=x, y=y):
            print(f"Punkt: ({x}, {y})")
        case {"action": "quit"}:
            print("Beenden")
        case [first, *rest]:
            print(f"Liste mit {len(rest)+1} Elementen")
```

### Async/Await (Python 3.5+)
```python
import asyncio
import aiohttp
from typing import Any

async def fetch_json(session: aiohttp.ClientSession, url: str) -> Any:
    async with session.get(url) as response:
        return await response.json()

async def fetch_all(urls: list[str]) -> list[Any]:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_json(session, url) for url in urls]
        return await asyncio.gather(*tasks)

# Async Generator
async def paginate(base_url: str, pages: int):
    async with aiohttp.ClientSession() as session:
        for page in range(1, pages + 1):
            data = await fetch_json(session, f"{base_url}?page={page}")
            for item in data["items"]:
                yield item

async def main():
    async for item in paginate("https://api.example.com/items", 5):
        print(item)

asyncio.run(main())
```

---

## Standardbibliothek (Auswahl)

| Modul          | Zweck                                    |
|----------------|------------------------------------------|
| `os`           | Betriebssystem-Interface, Dateipfade     |
| `sys`          | Python-Interpreter-Steuerung             |
| `pathlib`      | Objektorientierte Dateipfade             |
| `io`           | Stream-I/O, StringIO, BytesIO            |
| `re`           | Reguläre Ausdrücke                       |
| `json`         | JSON-Serialisierung                      |
| `csv`          | CSV-Lesen und -Schreiben                 |
| `datetime`     | Datum und Uhrzeit                        |
| `collections`  | `defaultdict`, `Counter`, `deque`, `namedtuple` |
| `itertools`    | Iterator-Werkzeuge                       |
| `functools`    | Höherer Ordnung: `lru_cache`, `partial`, `reduce` |
| `threading`    | OS-Threads                               |
| `multiprocessing` | Prozessbasierte Parallelisierung      |
| `asyncio`      | Asynchrones I/O                          |
| `subprocess`   | Unterprozesse                            |
| `socket`       | Low-Level-Netzwerk                       |
| `http.server`  | Einfacher HTTP-Server                    |
| `urllib`       | URL-Handling, HTTP-Requests              |
| `email`        | E-Mail-Parsing und -Erstellung           |
| `xml`          | XML-Verarbeitung (SAX, DOM, ElementTree) |
| `sqlite3`      | SQLite-Datenbank eingebaut               |
| `hashlib`      | Kryptografische Hash-Funktionen          |
| `hmac`         | Keyed-Hashing für Authentifizierung      |
| `secrets`      | Kryptografisch sichere Zufallszahlen     |
| `struct`       | Binärprotokoll-Packing                   |
| `logging`      | Logging-Framework                        |
| `unittest`     | Unit-Test-Framework                      |
| `doctest`      | Tests aus Docstrings                     |
| `typing`       | Typ-Annotationen                         |
| `dataclasses`  | Automatische `__init__`, `__repr__` etc. |
| `enum`         | Aufzählungstypen                         |
| `abc`          | Abstrakte Basisklassen                   |
| `contextlib`   | Kontext-Manager-Werkzeuge                |
| `argparse`     | Kommandozeilen-Argument-Parsing          |
| `configparser` | INI-Konfigurationsdateien                |
| `copy`         | Flache und tiefe Kopien                  |
| `pprint`       | Pretty-Print für Datenstrukturen         |
| `textwrap`     | Textformatierung                         |
| `string`       | String-Konstanten und -Werkzeuge         |
| `math`         | Mathematische Funktionen                 |
| `random`       | Pseudozufallszahlen                      |
| `statistics`   | Statistische Berechnungen                |
| `decimal`      | Dezimalzahlen mit beliebiger Präzision   |
| `fractions`    | Rationale Zahlen                         |
| `time`         | Zeit-Funktionen                          |
| `calendar`     | Kalender-Operationen                     |
| `pickle`       | Python-Objekt-Serialisierung             |
| `shelve`       | Persistente Objekt-Speicherung           |
| `gzip`/`bz2`/`lzma` | Kompressionsformate               |
| `zipfile`/`tarfile` | Archivformate                       |
| `tempfile`     | Temporäre Dateien und Verzeichnisse      |
| `shutil`       | Datei-Operationen (kopieren, bewegen)    |
| `glob`         | Unix-Shell-Muster für Dateien            |
| `inspect`      | Objekt-Introspection                     |
| `dis`          | CPython-Bytecode-Disassembler            |
| `ast`          | Abstract Syntax Trees                    |
| `tokenize`     | Python-Tokenizer                         |
| `importlib`    | Dynamisches Importieren                  |
| `traceback`    | Ausnahme-Stack-Traces                    |
| `warnings`     | Warn-Framework                           |

---

## Ökosystem & Package-Manager

### pip – der Standard-Package-Manager
```bash
pip install requests numpy pandas          # Pakete installieren
pip install -r requirements.txt            # aus Requirements-Datei
pip install --upgrade pip                  # pip selbst aktualisieren
pip list                                   # installierte Pakete anzeigen
pip freeze > requirements.txt             # Requirements einfrieren
pip show requests                          # Paketinfo
pip uninstall requests                     # Paket entfernen
pip install requests==2.28.0              # bestimmte Version
pip install "requests>=2.20,<3.0"         # Versionsbereich
```

### Virtuelle Umgebungen
```bash
# venv (eingebaut)
python -m venv .venv
source .venv/bin/activate          # Linux/macOS
.venv\Scripts\activate             # Windows
deactivate

# uv (moderner, sehr schnell – empfohlen)
pip install uv
uv venv
uv pip install requests
uv pip compile requirements.in > requirements.txt

# conda (für Data-Science/Wissenschaft)
conda create -n myenv python=3.12
conda activate myenv
conda install numpy pandas matplotlib
```

### pyproject.toml (modernes Projektformat)
```toml
[project]
name = "my-package"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "requests>=2.28",
    "pydantic>=2.0",
]

[project.optional-dependencies]
dev = ["pytest", "black", "mypy", "ruff"]

[tool.black]
line-length = 88

[tool.ruff]
select = ["E", "F", "I", "N"]

[tool.mypy]
strict = true
python_version = "3.12"
```

---

## Wichtige Third-Party-Bibliotheken

### Data Science & KI
| Bibliothek    | Zweck                                  |
|---------------|----------------------------------------|
| **NumPy**     | N-dimensionale Arrays, numerische Berechnungen |
| **Pandas**    | Datenrahmen, Datenanalyse              |
| **Matplotlib**| 2D-Visualisierungen                    |
| **Seaborn**   | Statistische Visualisierungen          |
| **Plotly**    | Interaktive Visualisierungen           |
| **SciPy**     | Wissenschaftliche Berechnungen         |
| **Scikit-learn** | Machine Learning                    |
| **TensorFlow** | Deep Learning (Google)               |
| **PyTorch**   | Deep Learning (Meta/Facebook)          |
| **Keras**     | High-Level Deep Learning API           |
| **JAX**       | Autodifferentiation, GPU/TPU           |
| **Hugging Face Transformers** | NLP-Modelle, LLMs    |
| **LangChain** | LLM-Anwendungs-Framework              |
| **OpenCV**    | Computer Vision                        |
| **NLTK / spaCy** | Natural Language Processing        |
| **statsmodels** | Statistische Modelle               |

### Web-Frameworks
| Framework     | Beschreibung                           |
|---------------|----------------------------------------|
| **Django**    | „Batteries included" Full-Stack-MVC    |
| **Flask**     | Minimalistisches Micro-Framework       |
| **FastAPI**   | Moderne asynchrone API, auto OpenAPI   |
| **Starlette** | ASGI-Basis-Framework                   |
| **Tornado**   | Asynchrones Web-Framework              |
| **aiohttp**   | Async HTTP Client/Server               |
| **Sanic**     | Async, sehr schnell                    |
| **Litestar**  | Typannotiertes, hochperformantes Framework |

### Datenbanken & ORM
| Bibliothek    | Beschreibung                           |
|---------------|----------------------------------------|
| **SQLAlchemy** | Das ORM für Python                   |
| **Django ORM** | Djangos eingebautes ORM              |
| **Tortoise ORM** | Async ORM                          |
| **Alembic**   | Datenbankmigrationen für SQLAlchemy    |
| **psycopg2/psycopg3** | PostgreSQL-Adapter             |
| **pymongo**   | MongoDB-Client                         |
| **redis-py**  | Redis-Client                           |
| **motor**     | Async MongoDB                          |

### Testing
| Werkzeug      | Beschreibung                           |
|---------------|----------------------------------------|
| **pytest**    | De-facto-Standard-Test-Framework       |
| **unittest**  | Eingebaut, xUnit-Stil                  |
| **hypothesis** | Property-Based Testing               |
| **mock**      | Mocking und Patching                   |
| **coverage**  | Code-Coverage                          |
| **tox**       | Automatisiertes Testen in mehreren Umgebungen |

---

## Anwendungsgebiete

| Bereich                | Beispiele                                              |
|------------------------|--------------------------------------------------------|
| **Data Science**       | Jupyter, Pandas, NumPy, Matplotlib                     |
| **Machine Learning**   | TensorFlow, PyTorch, Scikit-learn                      |
| **KI / LLMs**          | OpenAI API, Hugging Face, LangChain                    |
| **Web-Backend**        | Django, Flask, FastAPI                                 |
| **Scripting / Automation** | Systemadministration, Textverarbeitung           |
| **DevOps**             | Ansible, AWS CDK, Terraform (Python-Provider)          |
| **Wissenschaft**       | Bioinformatik, Astrophysik, Quantencomputing           |
| **Finanzen**           | Quantitative Analyse, Algorithmus-Trading              |
| **Computer Vision**    | OpenCV, PIL/Pillow, scikit-image                       |
| **NLP**                | spaCy, NLTK, Transformers                              |
| **Spieleentwicklung**  | Pygame, Panda3D                                        |
| **Embedded**           | MicroPython (auf Mikrocontrollern)                     |
| **CLI-Tools**          | Click, Typer, Rich, argparse                           |
| **GUI**                | Tkinter, PyQt6, wxPython, Kivy                         |

---

## Stärken

- **Einsteigerfreundlich:** Klarste Syntax aller populären Sprachen
- **Riesiges Ökosystem:** PyPI hat über 500.000 Pakete
- **Universell einsetzbar:** Von Skripting bis KI-Research
- **Interaktiv:** REPL, Jupyter Notebooks
- **Große Gemeinschaft:** Stackoverflow, PyCon, Pyladies
- **Gute Lesbarkeit:** Erzwungene Einrückung verhindert unleserlichen Code
- **Rapid Prototyping:** Schnell vom Konzept zur Implementierung
- **Plattformübergreifend:** Windows, Linux, macOS, Web (Pyodide), Eingebettet

---

## Schwächen

- **Geschwindigkeit:** CPython deutlich langsamer als C, Rust, Go (aber JIT in 3.13)
- **GIL (Global Interpreter Lock):** Verhindert echte Parallelität in Threads (optional seit 3.13)
- **Nicht ideal für Mobile:** Kaum nativ auf iOS/Android
- **Paketabhängigkeiten:** Versionskonflikte, komplexe Umgebungsverwaltung
- **Laufzeit-Typfehler:** Dynamische Typisierung macht manche Fehler erst spät sichtbar
- **Hoher Speicherverbrauch:** Verglichen mit systemnahen Sprachen
- **Python 2/3-Spaltung:** Historisch problematisch, heute weitgehend überwunden

---

## Bekannte Projekte & Nutzer

| Projekt / Organisation | Nutzung                                          |
|------------------------|--------------------------------------------------|
| **Instagram**          | Django-Backend (eine der größten Django-Deployments) |
| **YouTube**            | Python-Backend-Anteil (zusammen mit C++)        |
| **Dropbox**            | Ursprünglich vollständig in Python               |
| **Google**             | Interne Tools, AI-Forschung                     |
| **NASA**               | Teleskop-Steuerung, Datenpipelines               |
| **CERN**               | Teilchenpyhsik-Datenanalyse                      |
| **Netflix**            | Datenpipelines, ML                               |
| **Spotify**            | Empfehlungssysteme                               |
| **Reddit**             | Ursprünglich in Python geschrieben               |
| **Wikipedia**          | MediaWiki-Tooling                                |
| **Ansible**            | IT-Automatisierung                               |
| **Jupyter**            | Standard für wissenschaftliche Notebooks         |

---

## Versionshistorie (Meilensteine)

| Version | Datum      | Highlights                                                    |
|---------|------------|---------------------------------------------------------------|
| 0.9.0   | Feb 1991   | Erste Veröffentlichung                                        |
| 1.0     | Jan 1994   | `lambda`, `map`, `filter`, `reduce`                           |
| 2.0     | Okt 2000   | Listenverständnisse, Garbage Collector, Unicode               |
| 2.5     | Sep 2006   | `with`-Statement, `try/except/finally`                        |
| 2.7     | Jul 2010   | Letzte 2.x-Version (EOL: Jan 2020)                            |
| 3.0     | Dez 2008   | `print()`, `bytes`, `range`, Division                         |
| 3.5     | Sep 2015   | `async`/`await`, Type Hints (PEP 484)                         |
| 3.6     | Dez 2016   | f-Strings, `__future__` Annotationen                          |
| 3.7     | Jun 2018   | Dataclasses, `breakpoint()`, geordnete Dicts                  |
| 3.8     | Okt 2019   | Walrus-Operator (`:=`), Positional-only-Parameter             |
| 3.9     | Okt 2020   | `dict | dict`, `list[int]` statt `List[int]`                  |
| 3.10    | Okt 2021   | Pattern Matching (`match`/`case`), bessere Fehlermeldungen    |
| 3.11    | Okt 2022   | 60% schneller, Exception Groups                               |
| 3.12    | Okt 2023   | Typ-Parameter-Syntax, `@override`, f-String-Verbesserungen    |
| 3.13    | Okt 2024   | Experimenteller JIT, GIL optional (PEP 703), REPL-Verbesserungen |

---

## Lernressourcen

### Offiziell
- [Python Docs](https://docs.python.org/3/) – Offizielle Dokumentation
- [Python Tutorial](https://docs.python.org/3/tutorial/) – Einsteiger-Tutorial
- [PEPs (Python Enhancement Proposals)](https://peps.python.org/) – Sprachspezifikationen
- [Python Glossary](https://docs.python.org/3/glossary.html)

### Bücher
- *Automate the Boring Stuff with Python* – Al Sweigart (kostenlos online)
- *Python Crash Course* – Eric Matthes
- *Fluent Python* – Luciano Ramalho (fortgeschritten)
- *Python Cookbook* – David Beazley & Brian K. Jones
- *Effective Python* – Brett Slatkin

### Online-Kurse
- [Real Python](https://realpython.com/) – Umfangreiches Tutorial-Portal
- [Python for Everybody (Coursera)](https://www.coursera.org/specializations/python)
- [CS50P – Python (Harvard)](https://cs50.harvard.edu/python/)
- [Talk Python Training](https://training.talkpython.fm/)

### Tools & IDEs
| Tool          | Beschreibung                              |
|---------------|-------------------------------------------|
| **PyCharm**   | Vollständige Python-IDE (JetBrains)       |
| **VS Code + Pylance** | Leichtgewichtige IDE mit starker Python-Unterstützung |
| **Jupyter**   | Interaktive Notebooks                     |
| **IPython**   | Erweiterte interaktive Shell              |
| **mypy**      | Statischer Typ-Checker                    |
| **ruff**      | Sehr schneller Linter/Formatter           |
| **black**     | Opinionierter Code-Formatter              |
| **isort**     | Import-Sortierer                          |
| **pytest**    | Test-Framework                            |
| **uv**        | Moderner Package-Manager (Rust-basiert)   |

---

*Letzte Aktualisierung: Manuell, 2024-07*
