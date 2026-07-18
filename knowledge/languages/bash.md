# Bash

---
slug: bash
name: Bash
year: 1989
paradigms:
  - imperative
  - scripting
  - pipeline
description: Die GNU-Shell und Skriptsprache – unverzichtbar für Unix/Linux-Systemadministration, DevOps-Automatisierung und CI/CD-Pipelines.
tags:
  - interpreted
  - dynamic-typing
  - scripting
  - unix
  - devops
  - automation
  - shell
---

## Übersicht

Bash (Bourne Again Shell) wurde von Brian Fox für das GNU-Projekt entwickelt und 1989 veröffentlicht. Es ist die Weiterentwicklung der Bourne-Shell (sh, 1979). Bash ist Standard-Shell auf Linux und war bis macOS Catalina auch auf macOS Standard (jetzt zsh).

| Jahr | 1989 |
|------|------|
| Entwickler | Brian Fox (GNU Project) |
| Typsystem | Dynamisch, alles sind Strings/Listen |
| Webseite | https://www.gnu.org/software/bash/ |
| Aktuelle Version | Bash 5.2 (2022) |

---

## Kernkonzepte

```bash
#!/usr/bin/env bash
set -euo pipefail  # Fehler sofort beenden, undefinierte Variablen verbieten

# Variablen
NAME="World"
echo "Hello, ${NAME}!"

# Arithmetik
COUNT=0
((COUNT++))
RESULT=$(( 10 * 5 + 3 ))

# Conditionals
if [[ -f "/etc/hosts" ]]; then
    echo "File exists"
elif [[ -d "/tmp" ]]; then
    echo "Directory exists"
else
    echo "Neither"
fi

# Numerische Vergleiche: -eq -ne -lt -le -gt -ge
# String-Vergleiche: == != < > (in [[ ]])
[[ "$VERSION" =~ ^[0-9]+\.[0-9]+$ ]] && echo "Valid version"

# Schleifen
for i in {1..10}; do echo $i; done
for file in *.txt; do
    echo "Processing: $file"
done

while IFS= read -r line; do
    echo "Line: $line"
done < input.txt

# Arrays
FRUITS=("apple" "banana" "cherry")
echo "${FRUITS[0]}"         # apple
echo "${FRUITS[@]}"         # alle
echo "${#FRUITS[@]}"        # Anzahl
FRUITS+=("date")            # anhängen

# Assoziative Arrays (Bash 4+)
declare -A CONFIG
CONFIG[host]="localhost"
CONFIG[port]="5432"
echo "${CONFIG[host]}:${CONFIG[port]}"

# Funktionen
log() {
    local level="${1:-INFO}"
    local message="${2:-}"
    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    echo "[${timestamp}] [${level}] ${message}" >&2
}

retry() {
    local max_attempts="${1:-3}"
    local delay="${2:-1}"
    shift 2
    local attempt=1
    until "$@"; do
        if (( attempt >= max_attempts )); then
            log "ERROR" "Command failed after ${max_attempts} attempts"
            return 1
        fi
        log "WARN" "Attempt ${attempt} failed. Retrying in ${delay}s..."
        sleep "${delay}"
        ((attempt++))
    done
}

# Pipes & Subshells
cat /etc/passwd | grep -v '^#' | cut -d: -f1 | sort | uniq

# Process Substitution
diff <(ls dir1/) <(ls dir2/)

# Here-Doc
cat <<'EOF' > config.yaml
database:
  host: localhost
  port: 5432
EOF

# Fehlerbehandlung
cleanup() {
    local exit_code=$?
    log "INFO" "Cleaning up (exit: ${exit_code})"
    rm -f /tmp/lockfile.$$
    exit "${exit_code}"
}
trap cleanup EXIT INT TERM

# Parameter Expansion
FILE="document.txt"
echo "${FILE%.txt}"          # document (Extension entfernen)
echo "${FILE^^}"             # DOCUMENT.TXT (Großbuchstaben)
echo "${FILE/doc/report}"    # report.txt (Ersetzen)
echo "${FILE:-default.txt}"  # Fallback wenn leer

# Command Substitution
CURRENT_DIR=$(pwd)
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
GIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# xargs & Parallelisierung
find . -name "*.log" -mtime +30 | xargs rm -f
cat urls.txt | xargs -P 8 -I{} curl -s {} -o /dev/null

# Nützliche Einzeiler
# Alle Dateien umbenennen
for f in *.jpeg; do mv "$f" "${f%.jpeg}.jpg"; done

# Fortschrittsbalken
total=100
for i in $(seq 1 $total); do
    printf "\r[%-50s] %d%%" "$(head -c $((i/2)) /dev/zero | tr '\0' '#')" "$i"
    sleep 0.05
done; echo
```

---

## Wichtige Unix-Tools (zusammen mit Bash)

| Tool      | Zweck                                    |
|-----------|------------------------------------------|
| `grep`    | Muster-Suche in Text                     |
| `sed`     | Stream-Editor (Ersetzen, Löschen)        |
| `awk`     | Textverarbeitungssprache                 |
| `sort`    | Sortieren                                |
| `uniq`    | Duplikate entfernen                      |
| `cut`     | Spalten ausschneiden                     |
| `tr`      | Zeichen-Übersetzung                      |
| `wc`      | Zählen (Zeilen, Wörter, Bytes)           |
| `find`    | Dateien suchen                           |
| `xargs`   | Argumente aus stdin                      |
| `jq`      | JSON-Verarbeitung                        |
| `curl`    | HTTP-Anfragen                            |
| `ssh`     | Secure Shell                             |
| `rsync`   | Dateisynchronisation                     |
| `tar`     | Archivierung                             |
| `awk`     | Leistungsstarke Textverarbeitung         |

---

## Stärken & Schwächen

**Stärken:** Überall verfügbar auf Unix-Systemen, direkter Zugriff auf Betriebssystem-Kommandos, Pipes, DevOps-Standard, keine Installation nötig  
**Schwächen:** Fehleranfällig (Leerzeichen in Variablen, globbing), schwieriger für komplexe Logik, langsam für große Datenmengen, inkonsistente Syntax, keine Datenstrukturen außer Arrays

---

*Letzte Aktualisierung: Manuell, 2024-07*
