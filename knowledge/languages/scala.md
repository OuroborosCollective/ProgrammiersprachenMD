# Scala

---
slug: scala
name: Scala
year: 2004
paradigms:
  - functional
  - object-oriented
  - concurrent
description: Hybride OOP/FP-Sprache auf der JVM – Heimat von Apache Spark, Akka und typgesteuertem Functional Programming.
tags:
  - compiled
  - static-typing
  - jvm
  - functional
  - big-data
---

## Übersicht

Scala (Scalable Language) wurde von Martin Odersky an der EPFL entwickelt. Es vereint objektorientierte und funktionale Programmierung auf der JVM. Scala ist bekannt für Apache Spark (Big Data) und Akka (Aktorsystem).

| Jahr | 2004 |
|------|------|
| Entwickler | Martin Odersky (EPFL) |
| Typsystem | Statisch, stark, algebraisch |
| Runtime | JVM, Scala.js (Browser), Scala Native |

---

## Kernsyntax

```scala
// Case Classes & Pattern Matching
sealed trait Shape
case class Circle(radius: Double) extends Shape
case class Rect(w: Double, h: Double) extends Shape

def area(shape: Shape): Double = shape match
  case Circle(r)    => math.Pi * r * r
  case Rect(w, h)   => w * h

// For-Comprehensions (Monad-Komposition)
val result = for
  user  <- findUser(id)
  order <- findOrder(user.id)
  item  <- findItem(order.itemId)
yield s"${user.name} ordered ${item.name}"

// Typklassen
trait Show[A]:
  def show(a: A): String

given Show[Int] with
  def show(n: Int): String = n.toString

def print[A: Show](a: A): Unit = println(summon[Show[A]].show(a))

// Implicits / Given-Using (Scala 3)
given Ordering[String] = Ordering.by(_.length)
List("banana", "apple", "cherry").sorted  // by length

// Futures
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

val f = Future { expensiveComputation() }
  .map(_ * 2)
  .recover { case ex => 0 }
```

---

## Ökosystem

**sbt / Mill** – Build-Tools  
**Cats / Scalaz** – Functional Programming Libraries  
**ZIO** – Effekt-System  
**Akka** – Actor-Model, Streaming  
**Apache Spark** – Big Data (in Scala geschrieben)  
**http4s / Play** – Web-Frameworks

---

## Stärken & Schwächen

**Stärken:** Leistungsstarkes Typsystem, FP + OOP, JVM-Ökosystem, Spark-Integration, ausdrucksstarke Syntax  
**Schwächen:** Sehr steile Lernkurve, langsame Kompilierung, komplexe Implicits, schrumpfende Community (ZIO hat viele Nutzer zur Scala-Nische geführt)

---

*Letzte Aktualisierung: Manuell, 2024-07*
