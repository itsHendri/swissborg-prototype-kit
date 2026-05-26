#!/usr/bin/env bash
#
# Publish an EAS Update and print the Expo Go deep link.
#
# Usage:
#   npm run share -- "Short summary of the update"
#
# Wraps `eas update --branch main` and pulls the Update Group ID from the
# CLI output so a deep link in the canonical form
#
#   exp://u.expo.dev/<projectId>/group/<updateGroupId>
#
# is printed on the last line — paste straight into Slack / email / iMessage
# and the recipient opens it in Expo Go.
#
# Requires:
#   - EAS CLI installed and authenticated (`eas whoami`).
#   - `expo.extra.eas.projectId` set in app.json (run `npx eas project:init`
#     once if it isn't).

set -euo pipefail

MESSAGE="${1:-Untitled update}"

# Resolve the project root regardless of where the script is invoked from.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PROJECT_ID="$(node -e "console.log(require('./app.json').expo?.extra?.eas?.projectId ?? '')")"
if [ -z "$PROJECT_ID" ]; then
  printf '\033[33m✘ expo.extra.eas.projectId is missing from app.json.\033[0m\n'
  printf '  Run: \033[1mnpx eas project:init\033[0m and try again.\n'
  exit 1
fi

printf '\033[36m→ eas update --branch main --message %q\033[0m\n' "$MESSAGE"

# Capture EAS output so we can parse the update group ID while still
# streaming it to the user.
TMP_OUT="$(mktemp)"
trap 'rm -f "$TMP_OUT"' EXIT

eas update --branch main --message "$MESSAGE" --non-interactive 2>&1 | tee "$TMP_OUT"

# EAS prints the group ID across several possible lines depending on version.
# Try the most reliable forms first, fall back to a UUID match on a "Group"
# line.
GROUP_ID="$(grep -Eo 'group/[0-9a-f-]{36}' "$TMP_OUT" | head -n1 | sed 's|group/||')"
if [ -z "$GROUP_ID" ]; then
  GROUP_ID="$(grep -Ei '^[[:space:]]*Group ID[[:space:]]+[0-9a-f-]{36}' "$TMP_OUT" \
              | grep -Eo '[0-9a-f-]{36}' | head -n1)"
fi

if [ -z "$GROUP_ID" ]; then
  printf '\n\033[33m! Could not detect the Update Group ID in EAS output.\033[0m\n'
  printf '  Look for "Group ID" in the lines above and assemble the link manually:\n'
  printf '  exp://u.expo.dev/%s/group/<id>\n' "$PROJECT_ID"
  exit 2
fi

LINK="exp://u.expo.dev/$PROJECT_ID/group/$GROUP_ID"
printf '\n\033[32m✓ Update published.\033[0m\n'
printf '\033[1mShare this in Expo Go:\033[0m\n'
printf '%s\n' "$LINK"
