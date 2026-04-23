import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

import { log, requireEnv } from './utils.mts';

interface RulesFinding {
  path?: string;
  severity?: string;
  rule_source?: string;
  message?: string;
}

interface RulesPayload {
  summary?: string;
  findings?: RulesFinding[];
}

interface AutofixPayload {
  classification?: string;
  action_taken?: string;
  files_changed?: string[];
  confidence?: number;
  summary_for_pr_comment?: string;
}

function gh(args: string[], input?: string): string {
  return execFileSync('gh', args, {
    encoding: 'utf-8',
    timeout: 30_000,
    input,
  });
}

function readAgentPayload(): RulesPayload | AutofixPayload | null {
  const outputPath = requireEnv('AGENT_OUTPUT_PATH');

  if (!existsSync(outputPath)) {
    log.warning(`Agent output file not found: ${outputPath}`);
    return null;
  }

  const rawOutput = readFileSync(outputPath, 'utf-8').trim();
  if (!rawOutput) {
    return null;
  }

  try {
    const envelope = JSON.parse(rawOutput) as { result?: string };
    const result = (envelope.result ?? '').trim();
    if (!result) {
      return null;
    }

    const normalized = result
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    return JSON.parse(normalized) as RulesPayload | AutofixPayload;
  } catch (error) {
    log.warning(`Failed to parse agent output: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function upsertIssueComment(repo: string, prNumber: string, marker: string, body: string): void {
  const comments = JSON.parse(
    gh(['api', `/repos/${repo}/issues/${prNumber}/comments`]),
  ) as Array<{ id: number; body?: string }>;

  const existing = [...comments].reverse().find((comment) => comment.body?.includes(marker));
  const payload = JSON.stringify({ body });

  if (existing) {
    gh(['api', '--method', 'PATCH', `/repos/${repo}/issues/comments/${existing.id}`, '--input', '-'], payload);
    console.log(`Updated existing comment ${existing.id}`);
    return;
  }

  gh(['api', '--method', 'POST', `/repos/${repo}/issues/${prNumber}/comments`, '--input', '-'], payload);
  console.log(`Created new comment for PR #${prNumber}`);
}

function formatRulesComment(payload: RulesPayload | null): string {
  const marker = '<!-- cursor-pr-rules-check -->';
  const summary = payload?.summary?.trim() || 'Cursor did not return structured repo-rule findings for this run.';
  const findings = payload?.findings ?? [];

  const findingsSection =
    findings.length === 0
      ? 'No repo-specific rule violations were found in the current diff.'
      : findings
          .map((finding) => {
            const severity = finding.severity ? `\`${finding.severity}\`` : '`warn`';
            const path = finding.path ? ` \`${finding.path}\`` : '';
            const rule = finding.rule_source ? ` (${finding.rule_source})` : '';
            return `- ${severity}${path}${rule}: ${finding.message ?? 'No details provided.'}`;
          })
          .join('\n');

  return `${marker}
## Cursor Rules Check

${summary}

${findingsSection}

_Complementary to Bugbot: this check only reports repo-specific conventions and workflow expectations._`;
}

function formatAutofixComment(payload: AutofixPayload | null): string {
  const marker = '<!-- cursor-pr-autofix -->';
  const status = process.env.AUTOFIX_STATUS ?? 'unknown';
  const summary = payload?.summary_for_pr_comment?.trim() || 'Cursor did not return a structured auto-fix summary.';
  const classification = payload?.classification ?? 'unknown';
  const actionTaken = payload?.action_taken ?? 'No action recorded.';
  const confidence = typeof payload?.confidence === 'number' ? payload.confidence.toFixed(2) : 'n/a';
  const changedFiles = payload?.files_changed?.length
    ? payload.files_changed.map((path) => `- \`${path}\``).join('\n')
    : 'No files were reported as changed.';

  let statusLine = 'No safe fix was applied.';
  if (status === 'fixed') {
    statusLine = 'A safe auto-fix was applied and pushed to the PR branch.';
  } else if (status === 'no-safe-fix') {
    statusLine = 'Cursor reviewed the failing workflow and did not find a safe mechanical fix to apply.';
  } else if (status === 'commit-failed') {
    statusLine = 'Cursor produced a valid fix, but the workflow could not commit or push it.';
  } else if (status === 'guard-rejected') {
    statusLine = 'Cursor proposed changes, but the guard rejected the diff as out of scope.';
  } else if (status === 'agent-failed') {
    statusLine = 'Cursor did not complete the auto-fix attempt successfully.';
  } else if (status === 'skipped-bot-run') {
    statusLine = 'Cursor skipped this run because the failing workflow was triggered by the auto-fix bot.';
  }

  return `${marker}
## Cursor Auto-Fix

${statusLine}

${summary}

- Classification: \`${classification}\`
- Confidence: \`${confidence}\`
- Action taken: ${actionTaken}

${changedFiles}`;
}

const mode = requireEnv('COMMENT_MODE');
const repo = requireEnv('REPO');
const prNumber = requireEnv('PR_NUMBER');
const payload = readAgentPayload();

if (mode === 'rules') {
  upsertIssueComment(repo, prNumber, '<!-- cursor-pr-rules-check -->', formatRulesComment(payload as RulesPayload | null));
} else if (mode === 'autofix') {
  upsertIssueComment(repo, prNumber, '<!-- cursor-pr-autofix -->', formatAutofixComment(payload as AutofixPayload | null));
} else {
  log.error(`Unknown comment mode: ${mode}`);
  process.exit(1);
}
