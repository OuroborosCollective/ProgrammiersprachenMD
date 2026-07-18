# C#

---
slug: csharp
name: C#
year: 2000
paradigms:
  - object-oriented
  - functional
  - imperative
  - generic
  - component-oriented
description: Microsofts moderne .NET-Sprache – elegant, vielseitig und leistungsstark für Desktop, Web, Cloud und Spieleentwicklung (Unity).
tags:
  - compiled
  - static-typing
  - dotnet
  - enterprise
  - microsoft
  - game-development
  - general-purpose
---

## Übersicht

C# (gesprochen „C sharp") wurde von Anders Hejlsberg (auch Schöpfer von TypeScript und Turbo Pascal) bei Microsoft entwickelt und im Jahr 2000 veröffentlicht. Es läuft auf der **.NET Runtime** (früher .NET Framework, heute cross-platform .NET 5+).

| Eigenschaft     | Wert                               |
|-----------------|-----------------------------------|
| Jahr            | 2000                               |
| Entwickler      | Microsoft (Anders Hejlsberg)       |
| Typsystem       | Statisch, stark, nominell          |
| Speichermodell  | Garbage-Collected (.NET GC)        |
| Runtime         | .NET 8/9 (cross-platform)          |
| Webseite        | https://learn.microsoft.com/dotnet |
| Aktuelle Version | C# 13 (.NET 9, Nov 2024)          |

---

## Moderne Features

```csharp
// Records (immutable Datenklassen)
public record Person(string Name, int Age)
{
    public string Greeting => $"Hi, I'm {Name}, {Age} years old!";
}

// Pattern Matching
static string Describe(object obj) => obj switch
{
    int n when n < 0 => "negative number",
    int n            => $"positive number: {n}",
    string s         => $"string: {s}",
    null             => "null",
    _                => "something else"
};

// LINQ (Language Integrated Query)
var result = employees
    .Where(e => e.Department == "Engineering")
    .OrderBy(e => e.Salary)
    .Select(e => new { e.Name, e.Salary })
    .Take(10)
    .ToList();

// Async/Await (seit C# 5.0)
public async Task<User> GetUserAsync(int id, CancellationToken ct = default)
{
    var user = await _db.Users
        .Include(u => u.Orders)
        .FirstOrDefaultAsync(u => u.Id == id, ct)
        ?? throw new KeyNotFoundException($"User {id} not found");
    return user;
}

// Nullable Reference Types
string? maybeNull = null;
string notNull = maybeNull ?? "default";

// Span<T> für Performance ohne Allokation
static int Sum(Span<int> numbers)
{
    int total = 0;
    foreach (var n in numbers) total += n;
    return total;
}

// Primary Constructors (C# 12)
public class UserService(IUserRepository repo, ILogger<UserService> logger)
{
    public async Task<User?> FindAsync(int id) =>
        await repo.GetByIdAsync(id);
}
```

---

## Ökosystem

**Build-Tool:** dotnet CLI  
**Package-Manager:** NuGet  
**Frameworks:**
- **ASP.NET Core** – Web/API
- **Blazor** – Web-App mit C# im Browser (WASM)
- **MAUI** – Cross-platform Mobile/Desktop
- **Unity** – Spieleentwicklung (größtes C#-Ökosystem)
- **Entity Framework Core** – ORM
- **SignalR** – Echtzeit-Web
- **gRPC** – RPC

---

## Anwendungsgebiete

Enterprise-Anwendungen, Unity-Spieleentwicklung, Windows-Desktop (WPF, WinForms), Cross-platform Mobile (MAUI), ASP.NET Core Web-APIs, Azure Cloud

---

## Stärken & Schwächen

**Stärken:** Hervorragende IDE-Integration (Visual Studio, Rider), LINQ, Async/Await, Unity-Integration, cross-platform, starkes Typsystem  
**Schwächen:** Hauptsächlich Microsoft-Ökosystem, historisches Windows-Bias, weniger Einsatz außerhalb .NET-Welt, GC-Overhead bei Echtzeit-Systemen (Godot-Wechsel zu C++)

---

*Letzte Aktualisierung: Manuell, 2024-07*
