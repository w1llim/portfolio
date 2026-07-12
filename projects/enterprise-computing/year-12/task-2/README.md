# E-Commerce Data Dashboard

**Enterprise Computing — Year 12 HSC, Assessment Task 2 (2026)**
*"Enterprise Computing Data Visualisation Task"*

A ~500,000-row e-commerce transaction dataset normalised into a proper
relational schema in Access, then live-linked into an Excel workbook
built out as a full sales dashboard — revenue targets, regional
comparisons, top/bottom products, and a what-if analysis tool.

## Dataset

[Kaggle — "An Online Shop Business"](https://www.kaggle.com/datasets/gabrielramos87/an-online-shop-business):
a year of real transactions (Dec 2018 – Dec 2019) from an anonymised UK
e-commerce store, ~500,000 records, no missing fields. Assessed in the
folio for reliability, validity and bias — including honestly flagging
that a single pre-COVID year can't represent post-COVID e-commerce
behaviour, and that customer anonymisation rules out demographic
analysis.

## Database schema (3NF)

Five tables, normalised to avoid partial/transitive dependencies:

```
Regions ─┬─< Countries ─┬─< Customers ─┬─< Transactions >─┬─ Products
  (1)    │     (1)      │     (1)      │   (bridge table)  │    (1)
         └──────────────┴──────────────┘                    └─────────
```

- **Regions** → **Countries** → **Customers** (one-to-many down the chain)
- **Products** → **Transactions** (one-to-many)
- **Transactions** is the bridge table resolving the many-to-many between
  Customers and Products, carrying `Quantity`, `Price`, and — added later
  via Power Query rather than stored directly, to avoid violating 3NF —
  computed `UnitTax` and `LineTotal` columns.

Full data dictionary (field types, sizes, formats, examples) for every
table is in the folio.

## Dashboard (Excel, live-linked to Access)

Built as a set of linked query sheets feeding a single `Dashboard` view:
Revenue Targets, Sales Target Met, Comparing Regions, Cumulative Sales,
Daily Revenue, Daily Count of Invoices, Percentage of Transactions by
Region, Top 3 / Bottom 3 Products, Top/Bottom Day Revenue, plus a
What-If Analysis sheet for scenario testing.

## Files

- [`Task 2 Folio.pdf`](Task%202%20Folio.pdf) — full folio: dataset evaluation, import instructions, schema, ER diagram, data dictionary
- [`William Lam Data Dashboard and Sheets.xlsx`](William%20Lam%20Data%20Dashboard%20and%20Sheets.xlsx) — the dashboard workbook
- [`William_Lam_Database.accdb`](William_Lam_Database.accdb) — the Access database (compacted from ~300MB down to ~45MB). Download it into the same folder as the Excel workbook to keep its live query links working (per the folio's import instructions).

## Video

[Watch the demo](https://youtu.be/6aCC902H6T4) (unlisted)
