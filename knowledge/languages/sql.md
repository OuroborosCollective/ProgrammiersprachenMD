# SQL

---
slug: sql
name: SQL
year: 1974
paradigms:
  - declarative
  - set-based
  - relational
description: Die universelle Sprache für relationale Datenbanken – seit 50 Jahren der Standard für strukturierte Datenabfragen und -manipulation.
tags:
  - declarative
  - relational
  - database
  - query-language
  - standard
---

## Übersicht

SQL (Structured Query Language) wurde in den frühen 1970ern bei IBM von Donald Chamberlin und Raymond Boyce entwickelt und 1974 vorgestellt. Es basiert auf Edgar Codds Konzept des relationalen Modells. SQL ist der einzige Sprachstandard, der seit 50 Jahren dominant geblieben ist.

| Jahr | 1974 (IBM SEQUEL) |
|------|-------------------|
| Standard | ANSI/ISO SQL (SQL:2023) |
| Paradigma | Deklarativ, mengenorientiert |
| Wichtige Implementierungen | PostgreSQL, MySQL, SQLite, SQL Server, Oracle, DuckDB |

---

## Kern-SQL

```sql
-- DDL: Data Definition Language
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(255) UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata    JSONB
);

CREATE INDEX CONCURRENTLY idx_users_email ON users (email);

-- DML: Data Manipulation Language
INSERT INTO users (email, name, metadata)
VALUES ('alice@example.com', 'Alice', '{"role": "admin"}')
RETURNING id, created_at;

UPDATE users
SET name = 'Alice Smith', metadata = metadata || '{"updated": true}'
WHERE id = 1;

DELETE FROM users WHERE created_at < NOW() - INTERVAL '1 year';

-- DQL: Komplexe Abfragen
SELECT
    u.name,
    COUNT(o.id)            AS order_count,
    SUM(o.total)           AS total_spent,
    ROUND(AVG(o.total), 2) AS avg_order,
    RANK() OVER (ORDER BY SUM(o.total) DESC) AS spending_rank
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
LIMIT 20;

-- CTEs (Common Table Expressions)
WITH RECURSIVE org_tree AS (
    SELECT id, name, parent_id, 0 AS depth
    FROM departments
    WHERE parent_id IS NULL

    UNION ALL

    SELECT d.id, d.name, d.parent_id, t.depth + 1
    FROM departments d
    JOIN org_tree t ON t.id = d.parent_id
)
SELECT * FROM org_tree ORDER BY depth, name;

-- Window Functions
SELECT
    name,
    salary,
    department,
    LAG(salary)  OVER w AS prev_salary,
    LEAD(salary) OVER w AS next_salary,
    AVG(salary)  OVER (PARTITION BY department) AS dept_avg,
    NTILE(4)     OVER (ORDER BY salary DESC) AS quartile
FROM employees
WINDOW w AS (PARTITION BY department ORDER BY hire_date);

-- JSON (PostgreSQL)
SELECT
    metadata->>'role' AS role,
    jsonb_array_elements_text(metadata->'tags') AS tag
FROM users
WHERE metadata @> '{"verified": true}';

-- Full-Text Search (PostgreSQL)
CREATE INDEX idx_posts_fts ON posts USING GIN(
    to_tsvector('german', title || ' ' || content)
);

SELECT title FROM posts
WHERE to_tsvector('german', title || ' ' || content)
    @@ plainto_tsquery('german', 'Python Programmierung');
```

---

## SQL-Varianten

| Datenbank       | Besonderheiten                                          |
|-----------------|---------------------------------------------------------|
| **PostgreSQL**  | Vollständigste SQL-Implementierung, JSONB, PostGIS, Extensions |
| **MySQL/MariaDB** | Weit verbreitet, Web-Standard, Performance          |
| **SQLite**      | Serverlos, eine Datei, ideal für Embedded              |
| **SQL Server**  | Microsoft, gut für Windows/.NET                         |
| **Oracle**      | Enterprise, PL/SQL, sehr leistungsfähig                |
| **DuckDB**      | In-Process OLAP, ideal für Data-Analyse                |
| **BigQuery**    | Google Cloud, Petabyte-skalierend                       |
| **Redshift**    | AWS Data Warehouse                                      |
| **Snowflake**   | Cloud Data Warehouse                                    |

---

## Stärken & Schwächen

**Stärken:** Deklarativ (WAS, nicht WIE), universell (jede DB), 50 Jahre Standardisierung, sehr mächtig für Datenabfragen, ACID-Transaktionen  
**Schwächen:** Komplexe Joins schwer zu verstehen, kein echtes Programmierkonstrukt (Schleifen umständlich), Dialekt-Unterschiede zwischen Datenbanken, ORM-Impedance-Mismatch

---

*Letzte Aktualisierung: Manuell, 2024-07*
