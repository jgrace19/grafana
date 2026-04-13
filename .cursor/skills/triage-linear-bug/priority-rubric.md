# Priority Rubric

Use this matrix to determine the correct priority. Find the row that best matches the bug's characteristics.

## Decision Matrix

| Factor | P1 Critical (Urgent) | P2 High | P3 Medium (Normal) | P4 Low |
|---|---|---|---|---|
| **User impact** | All users or critical path completely blocked | Broad user base, major feature broken | Subset of users or degraded experience | Edge case, cosmetic, single user |
| **Workaround** | None | None or extremely painful | Reasonable workaround exists | Trivial workaround or low-value flow |
| **Data risk** | Data loss or corruption possible | Data displayed incorrectly | Minor data inconsistency | No data risk |
| **Security** | Active vulnerability, exposure of sensitive data | Potential vulnerability requiring specific conditions | Minimal security relevance | No security impact |
| **Frequency** | Constant / every user hits it | Frequent / most affected users hit it | Intermittent or requires specific conditions | Rare / hard to trigger |
| **Regression** | Recently broke a previously working critical flow | Recently broke a significant feature | Long-standing or low-impact regression | Not a regression |

## Linear Priority Mapping

| Assessment | Linear `priority` value | Linear label |
|---|---|---|
| P1 Critical | `1` | Urgent |
| P2 High | `2` | High |
| P3 Medium | `3` | Normal |
| P4 Low | `4` | Low |

## Tie-breaking rules

1. If the bug affects **data integrity**, round up (more urgent).
2. If the bug is a **regression** (recently introduced), round up.
3. If a **workaround exists** and the feature is non-critical, round down.
4. When truly ambiguous, default to **P3 (Normal)** and note the ambiguity in the triage comment.

## Examples

**P1**: "Dashboard page returns 500 for all users since yesterday's deploy."
- All users, no workaround, regression, critical path.

**P2**: "Alerting rules fail to save when using the new notification channel type."
- Broad impact on alerting users, no workaround for that channel, major feature.

**P3**: "Explore graph tooltip shows wrong timezone for users with non-UTC locale."
- Subset of users (non-UTC), display-only, workaround (read UTC time).

**P4**: "Minor alignment issue on the login page submit button in Safari."
- Cosmetic, single browser, non-blocking, trivial.
