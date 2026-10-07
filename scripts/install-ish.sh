#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const dataDir = path.join(root, 'data');
const tasksPath = path.join(dataDir, 'tasks.json');
const knowledgePath = path.join(dataDir, 'knowledge.json');

function ensureStore() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(tasksPath)) fs.writeFileSync(tasksPath, JSON.stringify([], null, 2));
  if (!fs.existsSync(knowledgePath)) fs.writeFileSync(knowledgePath, JSON.stringify({ entries: [] }, null, 2));
}

function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function printHelp() {
  console.log(`
Copilot AI CLI

Usage:
  node bin/copilot-ai.js task "Your prompt"
  node bin/copilot-ai.js status
  node bin/copilot-ai.js help

Examples:
  node bin/copilot-ai.js task "Build a lightweight dashboard"
  node bin/copilot-ai.js task "Fix a failing shell script"

Notes:
  This wrapper is designed for use with iSH Shell + GitHub Copilot CLI.
  If `copilot` is installed, it can be used directly afterward.
`);
}

function getStatus() {
  ensureStore();
  const tasks = readJson(tasksPath, []);
  const knowledge = readJson(knowledgePath, { entries: [] });
  console.log(JSON.stringify({
    app: 'copilot-autonomous-assistant',
    totalTasks: tasks.length,
    totalKnowledgeEntries: knowledge.entries.length,
    copilotAvailable: hasCopilot(),
    status: 'ready'
  }, null, 2));
}

function hasCopilot() {
  try {
    execSync('copilot --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function createTask(prompt) {
  const task = {
    id: `cli-${Date.now()}`,
    prompt,
    createdAt: new Date().toISOString(),
    status: 'queued'
  };

  const tasks = readJson(tasksPath, []);
  tasks.unshift(task);
  fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));

  const knowledge = readJson(knowledgePath, { entries: [] });
  knowledge.entries.push({
    id: task.id,
    prompt,
    createdAt: task.createdAt,
    type: 'cli-task'
  });
  fs.writeFileSync(knowledgePath, JSON.stringify(knowledge, null, 2));

  console.log(JSON.stringify({
    ok: true,
    task,
    copilotHint: hasCopilot() ? 'Run: copilot ' + prompt : 'Install GitHub Copilot CLI or run: npm run install:ish',
    note: 'The project stores tasks locally for persistent learning.'
  }, null, 2));
}

const args = process.argv.slice(2);
const command = args[0];

ensureStore();

if (!command || command === '--help' || command === '-h') {
  printHelp();
  process.exit(0);
}

if (command === 'status') {
  getStatus();
  process.exit(0);
}

if (command === 'task') {
  const prompt = args.slice(1).join(' ');
  if (!prompt) {
    console.error('A task prompt is required.');
    process.exit(1);
  }
  createTask(prompt);
  process.exit(0);
}

console.error(`Unknown command: ${command}`);
printHelp();
process.exit(1);
