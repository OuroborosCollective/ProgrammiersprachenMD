# Lua

---
slug: lua
name: Lua
year: 1993
paradigms:
  - imperative
  - functional
  - object-oriented
  - prototype-based
description: Leichtgewichtige Einbettungssprache aus Brasilien – Standard-Skriptsprache in Spielen, Neovim und eingebetteten Systemen.
tags:
  - interpreted
  - dynamic-typing
  - embeddable
  - scripting
  - lightweight
  - gaming
---

## Übersicht

Lua (portugiesisch für „Mond") wurde an der PUC-Rio in Brasilien von Roberto Ierusalimschy, Luiz Henrique de Figueiredo und Waldemar Celes entwickelt. Es ist die Referenz-Einbettungssprache und bekannt für seine extrem kleine Laufzeit (~250 KB).

| Jahr | 1993 |
|------|------|
| Entwickler | PUC-Rio (Ierusalimschy, Figueiredo, Celes) |
| Typsystem | Dynamisch, schwach |
| Webseite | https://www.lua.org |
| Aktuelle Version | Lua 5.4 (2020) |

---

## Kernsyntax

```lua
-- Tables sind der einzige Datenstruktur-Typ in Lua
local t = {1, 2, 3, "vier", "fünf"}
local dict = {name = "Alice", age = 30}

-- OOP mit Metatables (Prototype-basiert)
local Animal = {}
Animal.__index = Animal

function Animal.new(name, sound)
    return setmetatable({name = name, sound = sound}, Animal)
end

function Animal:speak()
    print(self.name .. " says " .. self.sound)
end

local dog = Animal.new("Rex", "Woof!")
dog:speak()  -- Rex says Woof!

-- Closures
function counter(start)
    local count = start or 0
    return {
        increment = function() count = count + 1 end,
        get = function() return count end,
    }
end

local c = counter(10)
c.increment()
print(c.get())  -- 11

-- Coroutines
local co = coroutine.create(function(a, b)
    print("start", a, b)
    local c = coroutine.yield(a + b)
    print("resume", c)
    return "done"
end)

print(coroutine.resume(co, 10, 20))  -- true, 30
print(coroutine.resume(co, "hello")) -- resume hello / true, done

-- Metatables für Operator-Overloading
local Vector = {}
Vector.__index = Vector
Vector.__add = function(a, b)
    return Vector.new(a.x + b.x, a.y + b.y)
end
function Vector.new(x, y)
    return setmetatable({x=x, y=y}, Vector)
end
```

---

## Anwendungsgebiete

**Spieleentwicklung:** Roblox (Lua als Primärsprache), World of Warcraft (Add-ons), Love2D  
**Editoren:** Neovim (Konfiguration in Lua), Redis (Scripting)  
**Eingebettet:** Arduino, ESP32, OpenWrt, nginx (OpenResty)  
**Sicherheit:** Wireshark (Dissector-Skripte)

---

## Stärken & Schwächen

**Stärken:** Extrem leichtgewichtig, einfach zu embedden, schnell (LuaJIT ist einer der schnellsten JIT-Compiler), klare C-API  
**Schwächen:** 1-basierte Array-Indizes (unkonventionell), keine Standard-Bibliothek für alles, kein native OOP, schwaches Typsystem

---

*Letzte Aktualisierung: Manuell, 2024-07*
