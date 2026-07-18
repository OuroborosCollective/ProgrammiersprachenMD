# Swift

---
slug: swift
name: Swift
year: 2014
paradigms:
  - object-oriented
  - functional
  - protocol-oriented
  - imperative
description: Apples moderne Systemssprache für iOS, macOS und darüber hinaus – sicher, schnell und ausdrucksstark mit Protocol-orientiertem Design.
tags:
  - compiled
  - static-typing
  - apple
  - ios
  - macos
  - systems
  - null-safe
---

## Übersicht

Swift wurde von Chris Lattner bei Apple entwickelt und 2014 auf der WWDC vorgestellt. Es ersetzt Objective-C als primäre Entwicklungssprache für Apples Plattformen. Swift ist open source und läuft auch auf Linux und Windows.

| Eigenschaft     | Wert                              |
|-----------------|----------------------------------|
| Jahr            | 2014                              |
| Entwickler      | Apple (Chris Lattner)             |
| Typsystem       | Statisch, stark, null-safe        |
| Speichermodell  | ARC (Automatic Reference Counting) |
| Webseite        | https://swift.org                 |
| Aktuelle Version | Swift 6.0 (2024)                 |

---

## Kernsyntax

```swift
// Optionals & Null-Sicherheit
var name: String? = "Alice"
let length = name?.count ?? 0
guard let unwrapped = name else { return }

// Structs (value type) vs Classes (reference type)
struct Point: Equatable, Hashable {
    let x: Double
    let y: Double
    
    func distance(to other: Point) -> Double {
        sqrt(pow(x - other.x, 2) + pow(y - other.y, 2))
    }
}

// Enums mit assoziierten Werten
enum Result<Success, Failure: Error> {
    case success(Success)
    case failure(Failure)
    
    var value: Success? {
        guard case .success(let v) = self else { return nil }
        return v
    }
}

// Protocols (Interfaces)
protocol Drawable {
    func draw() -> String
    var area: Double { get }
}

extension Circle: Drawable {
    func draw() -> String { "◯ r=\(radius)" }
    var area: Double { .pi * radius * radius }
}

// Async/Await (Swift 5.5+)
func fetchUser(id: Int) async throws -> User {
    let url = URL(string: "https://api.example.com/users/\(id)")!
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}

// Actors (Swift 5.5+) für Thread-Sicherheit
actor BankAccount {
    private var balance: Double = 0
    
    func deposit(_ amount: Double) { balance += amount }
    func withdraw(_ amount: Double) throws {
        guard balance >= amount else { throw BankError.insufficient }
        balance -= amount
    }
}

// SwiftUI (deklaratives UI)
struct ContentView: View {
    @State private var count = 0
    
    var body: some View {
        VStack {
            Text("Count: \(count)").font(.largeTitle)
            Button("Increment") { count += 1 }
                .buttonStyle(.borderedProminent)
        }
    }
}
```

---

## Ökosystem

**Swift Package Manager (SPM)** – offizieller Package-Manager  
**Frameworks:** SwiftUI, UIKit, AppKit, Combine, Foundation, CryptoKit  
**Server:** Vapor, Hummingbird  
**Testing:** XCTest, Swift Testing (neu)

---

## Stärken & Schwächen

**Stärken:** Null-sicher, ARC (schneller als GC), Protocol-orientiert, SwiftUI, Apple-Ökosystem-Tiefe, Swift Concurrency (Actors)  
**Schwächen:** Hauptsächlich Apple-Plattformen, Server-Ökosystem klein, ABI-Stabilität erst seit Swift 5.0, langsame Kompilierung bei großen Projekten

---

*Letzte Aktualisierung: Manuell, 2024-07*
