# Ruby

---
slug: ruby
name: Ruby
year: 1995
paradigms:
  - object-oriented
  - functional
  - imperative
  - reflective
description: Ausdrucksstarke, produktive Sprache – bekannt durch Rails und das Prinzip der Entwicklerfreude (Matz' Philosophie).
tags:
  - interpreted
  - dynamic-typing
  - object-oriented
  - scripting
  - web
  - metaprogramming
---

## Übersicht

Ruby wurde von Yukihiro „Matz" Matsumoto in Japan entwickelt und 1995 veröffentlicht. Ruby verfolgt das Prinzip der **minimalen Überraschung** (Principle of Least Astonishment). Durch Ruby on Rails wurde es zur wichtigsten Web-Sprache der 2000er Jahre.

| Eigenschaft     | Wert                              |
|-----------------|----------------------------------|
| Jahr            | 1995                              |
| Entwickler      | Yukihiro Matsumoto (Matz)         |
| Typsystem       | Dynamisch, stark, duck-typing     |
| Speichermodell  | Garbage-Collected (YJIT in Ruby 3) |
| Webseite        | https://www.ruby-lang.org         |
| Aktuelle Version | Ruby 3.3 (2023)                  |

---

## Syntax & Metaprogrammierung

```ruby
# Alles ist ein Objekt
3.times { puts "Hello!" }
"hello".upcase       # "HELLO"
[1,2,3].map(&:to_s)  # ["1","2","3"]

# Blocks, Procs, Lambdas
def repeat(n, &block)
  n.times { block.call }
end
repeat(3) { puts "Hey" }

# Metaprogrammierung
class Dog
  attr_accessor :name, :breed
  
  def initialize(name, breed)
    @name, @breed = name, breed
  end
  
  def method_missing(name, *args)
    if name.to_s.start_with?("say_")
      puts "#{@name} says: #{name.to_s.sub('say_', '')}"
    else
      super
    end
  end
end

dog = Dog.new("Rex", "Labrador")
dog.say_hello   # Rex says: hello
dog.say_woof    # Rex says: woof

# Open Classes
class Integer
  def factorial
    return 1 if self <= 1
    self * (self - 1).factorial
  end
end
5.factorial  # 120

# Modules als Mixins
module Serializable
  def to_json
    instance_variables.each_with_object({}) do |var, hash|
      hash[var.to_s.delete('@')] = instance_variable_get(var)
    end.to_json
  end
end

# Comparable
class Temperature
  include Comparable
  attr_reader :degrees
  def initialize(d) @degrees = d end
  def <=>(other) degrees <=> other.degrees end
end

# Enumerable
class NumberList
  include Enumerable
  def initialize(*nums) @nums = nums end
  def each(&block) @nums.each(&block) end
end
NumberList.new(3,1,4,1,5).sort  # [1,1,3,4,5]
```

---

## Ökosystem

**Bundler + Gemfile** – Dependency-Management  
**RubyGems** – Package-Repository  
**Ruby on Rails** – MVC-Web-Framework (GitHub, Shopify, Airbnb, Twitter/X entstanden damit)  
**Sinatra** – Micro-Framework  
**RSpec / Minitest** – Testing  
**Sidekiq** – Background-Jobs  
**Puma / Unicorn / Falcon** – Web-Server

---

## Bekannte Nutzer

GitHub, Shopify, Airbnb, Twitch, Basecamp/HEY, Kickstarter, Hulu, Heroku

---

## Stärken & Schwächen

**Stärken:** Maximal lesbare Syntax, Metaprogrammierung, Rails-Produktivität, offene Klassen, große Community  
**Schwächen:** Langsamer als Python/Node.js (YJIT hilft), GIL verhindert echte Thread-Parallelität, schwindende Popularität gegenüber Python/JS/Go

---

*Letzte Aktualisierung: Manuell, 2024-07*
