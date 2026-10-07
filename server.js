const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const TASKS_PATH = path.join(DATA_DIR, 'tasks.json');
const KNOWLEDGE_PATH = path.join(DATA_DIR, 'knowledge.json');

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'frontend')));

function ensureDataFiles() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(TASKS_PATH)) {
    fs.writeFileSync(TASKS_PATH, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(KNOWLEDGE_PATH)) {
    fs.writeFileSync(KNOWLEDGE_PATH, JSON.stringify({ entries: [] }, null, 2));
  }
}

function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

function normalizePrompt(prompt) {
  return String(prompt || '').trim();
}

function inferIntent(prompt) {
  const lower = prompt.toLowerCase();
  const intent = {
    action: 'assist',
    focus: 'general',
    confidence: 0.5,
    summary: 'General productivity assistance.'
  };

  if (/build|create|scaffold|generate|project/.test(lower)) {
    intent.action = 'build';
    intent.focus = 'project scaffolding';
    intent.confidence = 0.9;
    intent.summary = 'Project creation or app scaffolding.';
  } else if (/debug|error|fix|issue|troubleshoot/.test(lower)) {
    intent.action = 'debug';
    intent.focus = 'problem solving';
    intent.confidence = 0.9;
    intent.summary = 'Debugging support and root-cause analysis.';
  } else if (/shell|bash|command|script|terminal/.test(lower)) {
    intent.action = 'shell';
    intent.focus = 'automation';
    intent.confidence = 0.88;
    intent.summary = 'Shell workflows and automation.';
  } else if (/doc|readme|document|guide/.test(lower)) {
    intent.action = 'document';
    intent.focus = 'documentation';
    intent.confidence = 0.86;
    intent.summary = 'Documentation and technical writing.';
  } else if (/copilot|ai|assistant|smart|intelligence/.test(lower)) {
    intent.action = 'assistant';
    intent.focus = 'AI workflow';
    intent.confidence = 0.8;
    intent.summary = 'AI-assistant and workflow guidance.';
  }

  return intent;
}

function createTaskResponse(prompt) {
  const normalized = normalizePrompt(prompt);
  const intent = inferIntent(normalized);
  const timestamp = new Date().toISOString();

  const suggestions = [
    'Break the request into clear milestones.',
    'Validate assumptions before writing code.',
    'Persist important decisions to the task memory.',
    'Keep the solution lightweight and production-safe.'
  ];

  return {
    id: `task-${Date.now()}`,
    prompt: normalized,
    intent,
    suggestions,
    response: `I prepared an execution plan for: "${normalized}".\n\nFocus: ${intent.summary}\nNext logical steps: 1) clarify the objective, 2) define the minimal working scaffolding, 3) implement, 4) validate, and 5) document follow-up actions.`,
    createdAt: timestamp,
    status: 'ready'
  };
}

function learnFromPrompt(prompt, result) {
  ensureDataFiles();
  const knowledge = readJson(KNOWLEDGE_PATH, { entries: [] });
  const normalized = normalizePrompt(prompt);
  if (!normalized) return knowledge;

  const entry = {
    id: `learn-${Date.now()}`,
    prompt: normalized,
    response: result.response,
    intent: result.intent,
    createdAt: new Date().toISOString()
  };

  knowledge.entries.push(entry);
  writeJson(KNOWLEDGE_PATH, knowledge);
  return knowledge;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, app: 'copilot-autonomous-assistant', time: new Date().toISOString() });
});

app.get('/api/stats', (req, res) => {
  ensureDataFiles();
  const tasks = readJson(TASKS_PATH, []);
  const knowledge = readJson(KNOWLEDGE_PATH, { entries: [] });
  res.json({
    totalTasks: tasks.length,
    totalKnowledgeEntries: knowledge.entries.length,
    status: 'healthy'
  });
});

app.get('/api/tasks', (req, res) => {
  ensureDataFiles();
  const tasks = readJson(TASKS_PATH, []);
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  ensureDataFiles();
  const prompt = normalizePrompt(req.body.prompt || req.body.message);
  if (!prompt) {
    return res.status(400).json({ error: 'A prompt is required.' });
  }

  const result = createTaskResponse(prompt);
  const tasks = readJson(TASKS_PATH, []);
  tasks.unshift(result);
  writeJson(TASKS_PATH, tasks);

  const knowledge = learnFromPrompt(prompt, result);
  const payload = { ...result, knowledgeCount: knowledge.entries.length };
  res.status(201).json(payload);
});

app.post('/api/copilot', (req, res) => {
  const prompt = normalizePrompt(req.body.prompt || req.body.message);
  if (!prompt) {
    return res.status(400).json({ error: 'A prompt is required for Copilot assistance.' });
  }

  const suggestion = createTaskResponse(prompt);
  const commandHint = 'copilot copilot "' + prompt.replace(/"/g, '\\"') + '"';

  res.json({
    ok: true,
    prompt,
    commandHint,
    assistant: suggestion,
    status: 'ready',
    note: 'If GitHub Copilot CLI is installed, run the suggested command in iSH Shell.'
  });
});

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'frontend', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
    return;
  }
  res.status(404).send('Not found');
});

ensureDataFiles();

app.listen(PORT, () => {
  console.log(`Copilot Autonomous Assistant running on http://localhost:${PORT}`);
});
