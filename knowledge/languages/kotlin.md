# Kotlin

---
slug: kotlin
name: Kotlin
year: 2011
paradigms:
  - object-oriented
  - functional
  - imperative
description: Moderne JVM-Sprache von JetBrains – offizielle Android-Sprache, Null-sicher, ausdrucksstark und Java-kompatibel.
tags:
  - compiled
  - static-typing
  - jvm
  - android
  - multiplatform
  - null-safe
---

## Übersicht

Kotlin wurde von JetBrains entwickelt und 2011 vorgestellt. Google erklärte Kotlin 2017 zur bevorzugten Android-Sprache. Mit Kotlin Multiplatform (KMP) läuft Kotlin auch auf iOS, Web und Desktop.

| Eigenschaft     | Wert                           |
|-----------------|-------------------------------|
| Jahr            | 2011 (1.0: 2016)               |
| Entwickler      | JetBrains                      |
| Typsystem       | Statisch, stark, null-safe     |
| Speichermodell  | JVM GC / Native                |
| Webseite        | https://kotlinlang.org         |

---

## Kernsyntax

```kotlin
// Data Classes
data class User(val id: Long, val name: String, val email: String?)

// Extension Functions
fun String.toSlug() = lowercase().replace(Regex("[^a-z0-9]+"), "-").trim('-')
"Hello World!".toSlug()  // "hello-world"

// Coroutines (Kotlin's Async-Ansatz)
import kotlinx.coroutines.*

suspend fun fetchUser(id: Long): User = coroutineScope {
    val profile = async { profileService.get(id) }
    val orders = async { orderService.getAll(id) }
    User(id, profile.await().name, orders.await())
}

// Sealed Classes
sealed class Result<out T> {
    data class Success<T>(val value: T) : Result<T>()
    data class Failure(val error: Throwable) : Result<Nothing>()
}

when (val result = fetchData()) {
    is Result.Success -> println(result.value)
    is Result.Failure -> println(result.error.message)
}

// Scope Functions
val user = User(1L, "Alice", null).also { u ->
    println("Created: ${u.name}")
}.let { u ->
    u.copy(email = "alice@example.com")
}

// Null-Sicherheit
val length: Int? = user.email?.length
val safeLength = user.email?.length ?: 0
```

---

## Ökosystem

**Gradle** – Build-Tool (Kotlin DSL)  
**Ktor** – Web-Framework  
**Exposed** – SQL-Framework  
**Jetpack Compose** – Deklaratives Android-UI  
**Kotlin Multiplatform** – Teilen von Business-Logik zwischen Android/iOS/Web

---

## Stärken & Schwächen

**Stärken:** Null-Sicherheit, Coroutinen, interoperabel mit Java, Multiplatform, präzise Syntax, Android-first  
**Schwächen:** Langsame Kompilierung, komplexere Build-Konfiguration als Java, Multiplatform noch nicht vollständig ausgereift

---

*Letzte Aktualisierung: Manuell, 2024-07*
