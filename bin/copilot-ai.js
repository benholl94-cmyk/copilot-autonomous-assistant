# Copilot Autonomous Assistant

This project is a lightweight fullstack AI assistant designed to run in iSH Shell on iOS and provide a practical local workflow for prompts, tasks, and shell assistance.

## Contents

- `server.js` — Express backend with task handling and knowledge persistence
- `bin/copilot-ai.js` — CLI wrapper to interact with the project and Copilot CLI
- `frontend/` — lightweight dashboard UI
- `data/` — generated task and knowledge memory
- `scripts/` — installation and startup scripts

## Usage

```bash
npm install
npm start
```

Then open:

- Dashboard: http://localhost:3000
- API health: http://localhost:3000/api/health

## CLI

```bash
node bin/copilot-ai.js --help
node bin/copilot-ai.js task "Build a lightweight data dashboard"
node bin/copilot-ai.js status
```

## Notes

This is a production-like prototype tuned for iSH on iOS. It keeps memory locally, runs a minimal fullstack stack, and provides a clean path for extension to real Copilot CLI or external AI services.
