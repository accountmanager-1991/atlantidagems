/**
 * Deploy: Ambar & Larimar — Social Media Auto-Poster
 * Deploys the workflow to your n8n instance.
 *
 * Usage:
 *   N8N_BASE_URL=https://your-instance.app.n8n.cloud/api/v1 N8N_API_KEY=your_key node n8n-workflows/deploy-social-autoposter.js
 *
 * Required env vars (set in your shell or .env.local):
 *   N8N_API_KEY   — your n8n API key (Settings > API in n8n UI)
 *   N8N_BASE_URL  — your n8n instance API URL (optional, defaults to placeholder)
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const N8N_BASE_URL = process.env.N8N_BASE_URL || "https://your-instance.app.n8n.cloud/api/v1";
const N8N_API_KEY  = process.env.N8N_API_KEY;

if (!N8N_API_KEY) {
  console.error("❌  Missing N8N_API_KEY environment variable.");
  console.error("    Run: N8N_API_KEY=your_key node n8n-workflows/deploy-social-autoposter.js");
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const workflow  = JSON.parse(readFileSync(join(__dirname, "social-media-autoposter.json"), "utf8"));

const headers = {
  "X-N8N-API-KEY": N8N_API_KEY,
  "Content-Type":  "application/json",
};

async function deploy() {
  console.log("🚀  Deploying Social Media Auto-Poster to n8n...\n");

  // Check if workflow already exists
  const listRes  = await fetch(`${N8N_BASE_URL}/workflows?limit=100`, { headers });
  const listData = await listRes.json();
  const existing = listData.data?.find(w => w.name === workflow.name);

  let result;

  if (existing) {
    console.log(`📝  Found existing workflow (ID: ${existing.id}) — updating...`);
    const updateRes = await fetch(`${N8N_BASE_URL}/workflows/${existing.id}`, {
      method:  "PUT",
      headers,
      body:    JSON.stringify({ ...workflow, id: existing.id }),
    });
    result = await updateRes.json();
    console.log(`✅  Workflow updated — ID: ${result.id}`);
  } else {
    console.log("🆕  Creating new workflow...");
    const createRes = await fetch(`${N8N_BASE_URL}/workflows`, {
      method:  "POST",
      headers,
      body:    JSON.stringify(workflow),
    });
    result = await createRes.json();
    console.log(`✅  Workflow created — ID: ${result.id}`);
  }

  console.log("\n─────────────────────────────────────────────────");
  console.log("📋  NEXT STEPS — Configure these in n8n UI:");
  console.log("─────────────────────────────────────────────────\n");

  console.log("1. GOOGLE DRIVE CREDENTIAL");
  console.log("   Settings > Credentials > Add > Google Drive OAuth2");
  console.log("   Paste credential ID into node: Drive — List Queue\n");

  console.log("2. N8N VARIABLES (Settings > Variables):");
  console.log("   GDRIVE_TO_POST_FOLDER_ID  = <ID of your 'to-post' Google Drive folder>");
  console.log("   GDRIVE_POSTED_FOLDER_ID   = <ID of your 'posted' Google Drive folder>");
  console.log("   INSTAGRAM_USER_ID         = <Your Instagram Business User ID>");
  console.log("   FACEBOOK_PAGE_ID          = <Your Facebook Page ID>");
  console.log("   META_PAGE_ACCESS_TOKEN    = <Long-lived Page Access Token from Meta>");
  console.log("   TIKTOK_ACCESS_TOKEN       = <TikTok for Business API token>");
  console.log("   PINTEREST_ACCESS_TOKEN    = <Pinterest API access token>");
  console.log("   PINTEREST_BOARD_ID        = <Pinterest Board ID to post to>\n");

  console.log("3. ENV VAR (already in Vercel — also needed in n8n):");
  console.log("   ANTHROPIC_API_KEY         = your Anthropic API key\n");

  console.log("4. FILE NAMING CONVENTION for Google Drive uploads:");
  console.log("   shop_xxx.jpg      → posts with link to /shop");
  console.log("   wholesale_xxx.jpg → posts with link to /wholesale");
  console.log("   sub_xxx.jpg       → posts with link to /subscribe");
  console.log("   anything.jpg      → defaults to /shop\n");

  console.log("5. ACTIVATE the workflow in n8n UI after configuring credentials.\n");

  console.log("─────────────────────────────────────────────────");
  const instanceUrl = N8N_BASE_URL.replace("/api/v1", "");
  console.log(`🔗  Open in n8n: ${instanceUrl}/workflow/${result.id}`);
  console.log("─────────────────────────────────────────────────\n");
}

deploy().catch(err => {
  console.error("❌  Deploy failed:", err.message);
  process.exit(1);
});
