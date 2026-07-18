# Haskell

---
slug: haskell
name: Haskell
year: 1990
paradigms:
  - purely-functional
  - lazy-evaluation
  - declarative
description: Rein funktionale, lazy evaluierte Sprache mit dem stärksten Typsystem aller Mainstream-Sprachen – Referenzpunkt für FP-Forschung und korrekte Software.
tags:
  - compiled
  - static-typing
  - functional
  - pure
  - lazy
  - academic
---

## Übersicht

Haskell ist eine rein funktionale Programmiersprache, die 1990 von einem Komitee entwickelt wurde. Sie basiert auf dem Lambda-Kalkül und Kategorientheorie. Haskell ist bekannt für sein Typsystem (Hindley-Milner mit Erweiterungen), lazy Evaluation und Monaden.

| Jahr | 1990 (Standard: Haskell 2010) |
|------|-------------------------------|
| Typsystem | Statisch, polymorph, Hindley-Milner, Typklassen |
| Evaluation | Lazy (call-by-need) |
| Compiler | GHC (Glasgow Haskell Compiler) |
| Webseite | https://www.haskell.org |

---

## Kernsyntax

```haskell
-- Typen & Typklassen
class Functor f where
  fmap :: (a -> b) -> f a -> f b

-- Algebraische Datentypen
data Tree a = Leaf | Node (Tree a) a (Tree a)

insert :: Ord a => a -> Tree a -> Tree a
insert x Leaf = Node Leaf x Leaf
insert x (Node l v r)
  | x < v    = Node (insert x l) v r
  | x > v    = Node l v (insert x r)
  | otherwise = Node l v r

-- Monaden & Do-Notation
import Control.Monad (forM_)
import Data.IORef

program :: IO ()
program = do
  ref <- newIORef (0 :: Int)
  forM_ [1..100] $ \i ->
    modifyIORef' ref (+i)
  total <- readIORef ref
  putStrLn $ "Sum: " ++ show total

-- Maybe & Either Monad
safeDiv :: Int -> Int -> Maybe Int
safeDiv _ 0 = Nothing
safeDiv x y = Just (x `div` y)

result :: Maybe Int
result = do
  a <- safeDiv 10 2
  b <- safeDiv a 1
  safeDiv (a + b) 2  -- Just 5

-- Typklassen
data Color = Red | Green | Blue
  deriving (Eq, Ord, Enum, Bounded, Show, Read)

-- Lenses (mit lens-Bibliothek)
import Control.Lens
data Person = Person { _name :: String, _age :: Int }
makeLenses ''Person
```

---

## Ökosystem

**Cabal / Stack** – Build-Tools  
**Hackage** – Package-Repository  
**GHC** – Hauptcompiler  
**Servant** – Typgesteuertes Web-API-Framework  
**Persistent** – ORM  
**QuickCheck** – Property-Based Testing  
**Pandoc** – Dokumenten-Converter (in Haskell!)

---

## Stärken & Schwächen

**Stärken:** Garantierte Reinheit (keine Seiteneffekte außer IO), mächtiges Typsystem fängt viele Bugs zur Compilezeit, lazy Evaluation ermöglicht unendliche Datenstrukturen, mathematisch fundiert  
**Schwächen:** Sehr steile Lernkurve, Monaden-Konzept abstrakt, lazy Evaluation macht Speicherverhalten schwer vorhersehbar, kleines Ökosystem, selten in der Industrie

---

*Letzte Aktualisierung: Manuell, 2024-07*
