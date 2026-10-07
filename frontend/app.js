* {
  box-sizing: border-box;
}

:root {
  --bg: #0b1020;
  --bg-soft: #121a2b;
  --panel: #171f31;
  --panel-alt: #1d2940;
  --muted: #a9b4c7;
  --text: #edf3ff;
  --accent: #5ea0ff;
  --accent-strong: #7eb3ff;
  --success: #a4f7c7;
  --border: rgba(255,255,255,0.08);
  --shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
}

body {
  margin: 0;
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(180deg, #0b1020 0%, #111a2d 100%);
  color: var(--text);
}

button, textarea {
  font: inherit;
}

.app-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 18px 50px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 6px;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

h1, h2, h3, p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(2rem, 3vw, 3.2rem);
}

.layout {
  display: grid;
  grid-template-columns: 1.5fr 0.9fr;
  gap: 20px;
}

.panel {
  background: rgba(23, 31, 49, 0.8);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow);
  padding: 20px;
}

.hero-panel {
  grid-column: 1 / 2;
}

.stats-panel {
  grid-column: 2 / 3;
}

.output-panel {
  grid-column: 1 / 2;
}

.task-panel {
  grid-column: 2 / 3;
}

.status-box {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(164, 247, 199, 0.08);
  border: 1px solid rgba(164, 247, 199, 0.35);
  border-radius: 999px;
  padding: 6px 12px;
  margin-bottom: 16px;
  color: var(--success);
}

.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 12px rgba(164, 247, 199, 0.7);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: rgba(20, 26, 38, 0.8);
  color: var(--text);
  padding: 16px;
  resize: vertical;
}

.primary-button,
.ghost-button {
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.primary-button {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 100%);
  color: white;
}

.ghost-button {
  background: rgba(255,255,255,0.04);
  color: var(--text);
  border: 1px solid var(--border);
}

.primary-button:hover,
.ghost-button:hover {
  transform: translateY(-1px);
}

.stats-grid {
  display: grid;
  gap: 16px;
  margin-top: 16px;
}

.stat-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px 16px;
}

.stat-card span {
  color: var(--muted);
  display: block;
  margin-bottom: 8px;
}

.stat-card strong {
  font-size: 2rem;
}

.response-box {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border);
  border-radius: 12px;
  min-height: 180px;
  padding: 16px;
  white-space: pre-wrap;
  color: var(--text);
  line-height: 1.6;
}

.response-box.empty {
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.task-list li {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  color: var(--text);
}

.task-list li small {
  display: block;
  color: var(--muted);
  margin-top: 6px;
}

@media (max-width: 820px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .hero-panel,
  .stats-panel,
  .output-panel,
  .task-panel {
    grid-column: auto;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
