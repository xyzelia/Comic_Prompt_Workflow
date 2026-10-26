# Terms Template (EN/CN Glossary)

Single source of truth for English names, locations, and recurring props. The storyboard may use Chinese;
those named terms must use this table verbatim in Main and Character N blocks. Generic camera,
action, expression, anatomy, and lighting tags do not need glossary rows.

## Format

```markdown
# Terms - [Comic Title]

## Characters
| CN | EN |
|----|----|
| 林 | Lin |
| 猫 | Mimi |

## Locations
| CN | EN |
|----|----|
| 天台 | rooftop |
| 咖啡馆 | cafe interior |

## Props
| CN | EN |
|----|----|
| 黄色外套 | mustard yellow hooded jacket |
| 银色耳环 | thin silver hoop earrings |
```

## Rules

- Add a row before first use. Never translate a name on the fly.
- EN values are locked once written; changing one requires updating all
  prompts that used it (back up existing text before rewriting).
- Wardrobe and accessory tags should match the EN column when that item has a glossary row.
