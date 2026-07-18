# PHP

---
slug: php
name: PHP
year: 1994
paradigms:
  - imperative
  - object-oriented
  - functional
description: Server-seitige Skriptsprache, die das Web antreibt – WordPress, Facebook und über 75% aller Websites nutzen PHP.
tags:
  - interpreted
  - dynamic-typing
  - web
  - server-side
  - scripting
---

## Übersicht

PHP (PHP: Hypertext Preprocessor) wurde von Rasmus Lerdorf 1994 entwickelt. Obwohl es oft belächelt wird, betreibt PHP einen enormen Teil des Webs. Moderne PHP-Versionen (8.x) sind leistungsfähig, gut typisiert und deutlich besser als der historische Ruf vermuten lässt.

| Eigenschaft     | Wert                              |
|-----------------|----------------------------------|
| Jahr            | 1994                              |
| Entwickler      | Rasmus Lerdorf, Zeev Suraski, Andi Gutmans |
| Typsystem       | Dynamisch, optional statisch (Type Declarations) |
| Speichermodell  | Garbage-Collected (Zend Engine)   |
| Webseite        | https://www.php.net               |
| Aktuelle Version | PHP 8.3 (Nov 2023)               |

---

## Modernes PHP (8.x)

```php
// Union Types & Null-sicher
function processId(int|string $id): User|null {
    return User::find($id);
}

// Named Arguments
htmlspecialchars(string: $html, flags: ENT_QUOTES, encoding: 'UTF-8');

// Match-Expression
$status = match($code) {
    200, 201 => 'success',
    404      => 'not found',
    500      => 'server error',
    default  => 'unknown',
};

// Fibers (PHP 8.1) – Kooperatives Multitasking
$fiber = new Fiber(function(): void {
    $value = Fiber::suspend('initial');
    echo "Got: $value\n";
});
$first = $fiber->start();   // 'initial'
$fiber->resume('hello');    // Got: hello

// Enums (PHP 8.1)
enum Status: string {
    case Active = 'active';
    case Inactive = 'inactive';
    case Pending = 'pending';
    
    public function label(): string {
        return match($this) {
            Status::Active   => 'Active',
            Status::Inactive => 'Inactive',
            Status::Pending  => 'Pending',
        };
    }
}

// Readonly Properties (PHP 8.1)
class User {
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public string $email,
    ) {}
}

// First-class Callable Syntax (PHP 8.1)
$fn = strlen(...);
$upper = strtoupper(...);
array_map($upper, ['hello', 'world']);
```

---

## Ökosystem

**Composer** – Package-Manager  
**Packagist** – Package-Repository  
**Laravel** – Elegantes Web-Framework (Eloquent ORM, Blade Templates)  
**Symfony** – Enterprise-Framework (Komponenten-basiert)  
**WordPress** – CMS (43% aller Websites)  
**Drupal / Joomla** – CMS-Frameworks  
**PHPUnit** – Testing  
**PHP-FPM + Nginx/Apache** – Web-Server-Stack

---

## Stärken & Schwächen

**Stärken:** Überall verfügbar (Shared Hosting), riesige Community, WordPress-Ökosystem, Laravel-Eleganz, niedrige Einstiegshürde  
**Schwächen:** Inkonsistente Standardbibliothek (Argumentreihenfolge), historischer schlechter Code im Web, kein echtes Async (außer Fibers/ReactPHP/Swoole)

---

*Letzte Aktualisierung: Manuell, 2024-07*
