# Dart

---
slug: dart
name: Dart
year: 2011
paradigms:
  - object-oriented
  - functional
  - imperative
description: Googles typsichere Sprache – die Basis von Flutter für plattformübergreifende Mobile-, Web- und Desktop-Anwendungen aus einer Codebasis.
tags:
  - compiled
  - static-typing
  - flutter
  - mobile
  - google
  - cross-platform
---

## Übersicht

Dart wurde von Google entwickelt (Lars Bak und Kasper Lund) und 2011 veröffentlicht. Mit Flutter (2018) erlebte Dart eine Renaissance: Flutter kompiliert Dart direkt zu nativem ARM-Code und nutzt die Skia/Impeller-Rendering-Engine.

| Jahr | 2011 |
|------|------|
| Entwickler | Google (Lars Bak, Kasper Lund) |
| Typsystem | Statisch, stark, null-safe (seit Dart 2.12) |
| Kompilierung | AOT (native), JIT (Dev-Modus), JS |
| Webseite | https://dart.dev |
| Aktuelle Version | Dart 3.5 (2024) |

---

## Kernsyntax

```dart
// Null-Sicherheit (Sound Null Safety seit 2.12)
String? maybeNull;
String notNull = maybeNull ?? "default";
int length = maybeNull?.length ?? 0;

// Klassen & Mixins
mixin Flyable {
  void fly() => print("$runtimeType is flying!");
}

class Bird with Flyable {
  final String name;
  const Bird(this.name);
  
  @override
  String toString() => 'Bird($name)';
}

// Sealed Classes & Pattern Matching (Dart 3.0+)
sealed class Shape {}
class Circle extends Shape { final double radius; Circle(this.radius); }
class Rect extends Shape { final double w, h; Rect(this.w, this.h); }

double area(Shape s) => switch (s) {
  Circle(:var radius) => math.pi * radius * radius,
  Rect(:var w, :var h) => w * h,
};

// Async/Await & Streams
Future<String> fetchUser(int id) async {
  final response = await http.get(Uri.parse('/api/users/$id'));
  if (response.statusCode != 200) throw Exception('Not found');
  return response.body;
}

Stream<int> countDown(int from) async* {
  for (var i = from; i >= 0; i--) {
    await Future.delayed(const Duration(seconds: 1));
    yield i;
  }
}

// Flutter Widget (StatelessWidget)
class GreetingCard extends StatelessWidget {
  final String name;
  const GreetingCard({super.key, required this.name});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Text(
          'Hello, $name!',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
      ),
    );
  }
}
```

---

## Ökosystem

**pub.dev** – Package-Repository  
**Flutter** – UI-Framework (iOS, Android, Web, Desktop, Embedded)  
**Riverpod / Provider / Bloc** – State-Management  
**Drift** – SQLite ORM  
**Freezed** – Code-Generierung für immutable Klassen  
**Dart Frog** – Backend-Framework

---

## Stärken & Schwächen

**Stärken:** Flutter-Integration (eine Codebasis, alle Plattformen), null-sicher, hot reload, ausdrucksstarke Widgets, AOT-Performance  
**Schwächen:** Außerhalb Flutter wenig genutzt, kleinere Community als Swift/Kotlin, package.dev-Ökosystem kleiner als npm

---

*Letzte Aktualisierung: Manuell, 2024-07*
