const apiKey = process.env.NEON_API_KEY;
const projectId = process.env.NEON_PROJECT_ID;
const requestedParentId = process.env.NEON_PARENT_BRANCH_ID;
const confirmed = process.env.NEON_BACKUP_CONFIRM === "true";

if (!apiKey || !projectId) {
  throw new Error("NEON_API_KEY and NEON_PROJECT_ID are required.");
}
if (!confirmed) {
  throw new Error("Set NEON_BACKUP_CONFIRM=true after confirming the release window.");
}

const headers = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
};
const baseUrl = `https://console.neon.tech/api/v2/projects/${projectId}`;

async function neonRequest(path: string, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Neon API ${response.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

const branchesResponse = (await neonRequest("/branches")) as {
  branches: Array<{ id: string; name: string; primary?: boolean }>;
};
const parentBranch =
  branchesResponse.branches.find((branch) => branch.id === requestedParentId) ??
  branchesResponse.branches.find((branch) => branch.primary) ??
  branchesResponse.branches.find((branch) => branch.name === "main");

if (!parentBranch) throw new Error("Unable to identify the Neon production branch.");

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupName = process.env.NEON_BACKUP_NAME ?? `release-backup-${timestamp}`;
const result = await neonRequest("/branches", {
  method: "POST",
  body: JSON.stringify({ branch: { name: backupName, parent_id: parentBranch.id } }),
});

console.log(JSON.stringify({ restorePoint: backupName, parentBranch, result }, null, 2));
export {};
