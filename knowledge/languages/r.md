# R

---
slug: r
name: R
year: 1993
paradigms:
  - functional
  - array
  - object-oriented
  - imperative
description: Statistische Programmiersprache – Standard in Wissenschaft, Bioinformatik und Datenanalyse mit ggplot2, tidyverse und CRAN.
tags:
  - interpreted
  - dynamic-typing
  - statistics
  - data-science
  - scientific
  - functional
---

## Übersicht

R wurde von Ross Ihaka und Robert Gentleman an der Universität Auckland entwickelt (1993) und basiert auf der statistischen Sprache S. CRAN (Comprehensive R Archive Network) ist das zentrale Paket-Repository mit über 20.000 Paketen.

| Jahr | 1993 |
|------|------|
| Entwickler | Ross Ihaka, Robert Gentleman |
| Typsystem | Dynamisch, stark |
| Webseite | https://www.r-project.org |
| Aktuelle Version | R 4.4 (2024) |

---

## Kernsyntax

```r
# Vektoroperationen (vektorisiert)
x <- c(1, 2, 3, 4, 5)
y <- x^2 + 2*x + 1  # Elementweise Operationen
sum(y)
mean(x)
sd(x)

# Data Frames
df <- data.frame(
  name = c("Alice", "Bob", "Charlie"),
  age = c(25, 30, 35),
  score = c(95.5, 87.2, 91.8)
)

# Tidyverse (modernes R)
library(dplyr)
library(ggplot2)

result <- df |>
  filter(age >= 30) |>
  mutate(grade = ifelse(score >= 90, "A", "B")) |>
  arrange(desc(score)) |>
  select(name, grade)

# ggplot2 – Grammatik der Grafiken
ggplot(df, aes(x = age, y = score, color = name)) +
  geom_point(size = 3) +
  geom_smooth(method = "lm") +
  labs(title = "Age vs Score", x = "Age", y = "Score") +
  theme_minimal()

# Statistische Modelle
model <- lm(score ~ age, data = df)
summary(model)
predict(model, newdata = data.frame(age = 32))

# Apply-Familie (funktional)
sapply(1:10, function(x) x^2)
lapply(list(1:5, 6:10), sum)
tapply(df$score, df$name, mean)

# Funktionen & Environments
make_adder <- function(n) {
  function(x) x + n
}
add5 <- make_adder(5)
add5(10)  # 15
```

---

## Ökosystem

**CRAN** – Package-Repository (20.000+ Pakete)  
**tidyverse** – Datenmanipulation (dplyr, ggplot2, tidyr, readr, purrr)  
**data.table** – Schnelle Datenmanipulation  
**Bioconductor** – Bioinformatik  
**Shiny** – Interaktive Web-Apps direkt aus R  
**R Markdown / Quarto** – Reproduzierbare Berichte  
**RStudio / Posit** – Primäre IDE

---

## Anwendungsgebiete

Statistische Analyse, Bioinformatik, Epidemiologie, Finanzanalyse, Machine Learning (caret, tidymodels), Akademische Forschung, Datenvisualisierung

---

## Stärken & Schwächen

**Stärken:** Unschlagbar für Statistik und Visualisierung, riesiges wissenschaftliches Ökosystem, Shiny, tidyverse-Eleganz, R Markdown  
**Schwächen:** Langsam bei großen Loops (Vektorisierung notwendig), inkonsistente Basis-R-API, Speicherverbrauch (alles in RAM), ungewöhnliche Semantik (1-basiert, Copy-on-modify)

---

*Letzte Aktualisierung: Manuell, 2024-07*
