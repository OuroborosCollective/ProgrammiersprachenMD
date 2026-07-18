# Julia

---
slug: julia
name: Julia
year: 2012
paradigms:
  - scientific
  - functional
  - imperative
  - multiple-dispatch
description: Hochleistungssprache für wissenschaftliche Berechnungen – Python-Lesbarkeit + C-Geschwindigkeit durch JIT-Kompilierung und Multiple-Dispatch.
tags:
  - compiled
  - dynamic-typing
  - scientific
  - numerical
  - high-performance
  - jit
---

## Übersicht

Julia wurde 2012 am MIT von Jeff Bezanson, Stefan Karpinski, Viral Shah und Alan Edelman entwickelt. Das Ziel: Eine Sprache, die sowohl Produktivität als auch Performance für wissenschaftliche Berechnungen bietet. Julia kompiliert Just-in-Time via LLVM.

| Jahr | 2012 (1.0: 2018) |
|------|------------------|
| Entwickler | MIT (Bezanson, Karpinski, Shah, Edelman) |
| Typsystem | Dynamisch, optional statisch, abstrakte Typen |
| Kompilierung | JIT via LLVM |
| Webseite | https://julialang.org |

---

## Kernsyntax

```julia
# Multiple Dispatch – Kernkonzept
function area(shape)
    error("Unknown shape: $(typeof(shape))")
end

struct Circle r::Float64 end
struct Rectangle w::Float64; h::Float64 end

area(c::Circle) = π * c.r^2
area(r::Rectangle) = r.w * r.h

# Funktioniert für beide!
area(Circle(5.0))       # 78.54...
area(Rectangle(4.0, 3.0))  # 12.0

# Vektorisierung mit Broadcast (Dot-Syntax)
x = 1:1000
y = sin.(x) .* cos.(x) .+ x.^2   # Elementweise, kein Overhead!

# Makros (Metaprogrammierung)
@time sum(rand(10^6))
@benchmark sum($x)

# Generatoren & Comprehensions
[x^2 for x in 1:10 if x % 2 == 0]  # [4, 16, 36, 64, 100]

# Typen & Parametrische Typen
struct Stack{T}
    data::Vector{T}
end
push!(s::Stack{T}, x::T) where T = push!(s.data, x)
pop!(s::Stack) = pop!(s.data)

# Differentialgleichungen (DifferentialEquations.jl)
using DifferentialEquations
f(u, p, t) = p * u
prob = ODEProblem(f, 1.0, (0.0, 10.0), 1.5)
sol = solve(prob, Tsit5())

# Lineare Algebra (eingebaut)
A = rand(1000, 1000)
b = rand(1000)
x = A \ b  # Löst Ax = b – nutzt LAPACK

# Parallele Berechnungen
using Distributed
addprocs(4)
@distributed (+) for i in 1:10^6
    rand()
end
```

---

## Ökosystem

**Pkg.jl** – Package-Manager  
**Flux.jl** – Machine Learning  
**Turing.jl** – Bayesianische Inferenz  
**Plots.jl / Makie.jl** – Visualisierung  
**DataFrames.jl** – Datenrahmen  
**DifferentialEquations.jl** – ODE/PDE-Löser  
**JuMP.jl** – Mathematische Optimierung  
**Pluto.jl** – Reaktive Notebooks

---

## Stärken & Schwächen

**Stärken:** C-ähnliche Performance ohne Low-Level-Code, Multiple Dispatch, starke Mathematik-Bibliotheken, interoperabel mit Python/C/Fortran, GPU-Unterstützung  
**Schwächen:** Time-to-first-plot (Kompilierungsverzögerung), kleines Ökosystem verglichen mit Python, wenige Nutzer außerhalb Wissenschaft

---

*Letzte Aktualisierung: Manuell, 2024-07*
