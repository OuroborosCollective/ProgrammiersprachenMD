# Elixir

---
slug: elixir
name: Elixir
year: 2012
paradigms:
  - functional
  - concurrent
  - distributed
description: Funktionale, nebenläufige Sprache auf der Erlang-VM – exzellent für hochverfügbare, verteilte Systeme und Echtzeit-Anwendungen.
tags:
  - compiled
  - dynamic-typing
  - functional
  - concurrent
  - distributed
  - fault-tolerant
  - beam
---

## Übersicht

Elixir wurde von José Valim (ehemaliger Rails-Kernentwickler) entwickelt und 2012 veröffentlicht. Es läuft auf der **BEAM-VM** (Erlang Virtual Machine) und erbt deren legendäre Fehlertoleranz und Nebenläufigkeit. Discord, WhatsApp (Erlang-Basis) und viele Telekommunikationssysteme nutzen BEAM.

| Jahr | 2012 |
|------|------|
| Entwickler | José Valim |
| VM | BEAM (Erlang VM) |
| Typsystem | Dynamisch, stark |
| Webseite | https://elixir-lang.org |

---

## Kernsyntax

```elixir
# Pattern Matching ist fundamental
{:ok, user} = {:ok, %{name: "Alice", age: 30}}
{:error, reason} = {:error, "Not found"}

# Pipes
"Hello World"
|> String.downcase()
|> String.split()
|> Enum.map(&String.capitalize/1)
|> Enum.join(" ")
# => "Hello World"

# Modules & Functions
defmodule Calculator do
  def factorial(0), do: 1
  def factorial(n) when n > 0, do: n * factorial(n - 1)
  
  def fib(n), do: fib(n, 0, 1)
  defp fib(0, a, _), do: a
  defp fib(n, a, b), do: fib(n - 1, b, a + b)
end

# Prozesse & Concurrency (leichtgewichtig!)
spawn(fn -> IO.puts("Hello from a process!") end)

# GenServer (OTP-Behavior)
defmodule Stack do
  use GenServer
  
  def start_link(initial \\ []), do: GenServer.start_link(__MODULE__, initial)
  def push(pid, item),  do: GenServer.call(pid, {:push, item})
  def pop(pid),         do: GenServer.call(pid, :pop)
  
  @impl true
  def init(stack), do: {:ok, stack}
  
  @impl true
  def handle_call({:push, item}, _from, stack), do: {:reply, :ok, [item | stack]}
  def handle_call(:pop, _from, [h | t]),        do: {:reply, h, t}
  def handle_call(:pop, _from, []),             do: {:reply, nil, []}
end

# Phoenix LiveView (Echtzeit-UI ohne JS)
defmodule MyAppWeb.CounterLive do
  use Phoenix.LiveView
  
  def render(assigns) do
    ~H"""
    <div>
      <p>Count: {@count}</p>
      <button phx-click="increment">+</button>
    </div>
    """
  end
  
  def mount(_params, _session, socket) do
    {:ok, assign(socket, count: 0)}
  end
  
  def handle_event("increment", _, socket) do
    {:noreply, update(socket, :count, &(&1 + 1))}
  end
end
```

---

## Ökosystem

**Mix** – Build-Tool  
**Hex** – Package-Manager  
**Phoenix** – Web-Framework (Channels, LiveView)  
**Ecto** – Datenbank-Wrapper  
**ExUnit** – Test-Framework  
**Nx** – Numerische Berechnungen / ML  
**Broadway** – Datenpipelines

---

## Stärken & Schwächen

**Stärken:** Fehlertoleranz durch OTP-Supervisoren, Millionen leichter Prozesse, verteilte Systeme, Phoenix LiveView, gut für Echtzeit  
**Schwächen:** Dynamisches Typsystem (Dialyzer hilft), kleines Ökosystem, weniger Bibliotheken als Python/Node, CPU-intensive Tasks nicht ideal

---

*Letzte Aktualisierung: Manuell, 2024-07*
