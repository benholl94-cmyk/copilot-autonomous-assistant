const statusText = document.getElementById('statusText');
const taskCount = document.getElementById('taskCount');
const knowledgeCount = document.getElementById('knowledgeCount');
const promptInput = document.getElementById('promptInput');
const responseBox = document.getElementById('responseBox');
const taskList = document.getElementById('taskList');
const runBtn = document.getElementById('runBtn');
const refreshBtn = document.getElementById('refreshBtn');

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  return response.json();
}

async function loadStats() {
  try {
    const data = await fetchJson('/api/stats');
    statusText.textContent = data.status === 'healthy' ? 'Healthy' : 'Attention';
    taskCount.textContent = data.totalTasks ?? 0;
    knowledgeCount.textContent = data.totalKnowledgeEntries ?? 0;
  } catch (error) {
    statusText.textContent = 'Offline';
    taskCount.textContent = '0';
    knowledgeCount.textContent = '0';
  }
}

async function loadTasks() {
  try {
    const tasks = await fetchJson('/api/tasks');
    taskList.innerHTML = '';
    if (!tasks.length) {
      taskList.innerHTML = '<li>No tasks yet. Create one from the prompt box.</li>';
      return;
    }

    tasks.slice(0, 6).forEach((task) => {
      const item = document.createElement('li');
      item.innerHTML = `<div>${task.prompt}</div><small>${task.createdAt || 'just now'}</small>`;
      taskList.appendChild(item);
    });
  } catch (error) {
    taskList.innerHTML = '<li>Unable to load recent tasks.</li>';
  }
}

async function runTask() {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    responseBox.textContent = 'Please enter a prompt first.';
    responseBox.classList.remove('empty');
    return;
  }

  runBtn.disabled = true;
  runBtn.textContent = 'Running...';
  responseBox.classList.remove('empty');
  responseBox.textContent = 'Working through the request...';

  try {
    const payload = await fetchJson('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    responseBox.textContent = payload.response || JSON.stringify(payload, null, 2);
  } catch (error) {
    responseBox.textContent = 'The task could not be processed. Check that the backend is running.';
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = 'Run task';
    await loadStats();
    await loadTasks();
  }
}

runBtn.addEventListener('click', runTask);
refreshBtn.addEventListener('click', async () => {
  await loadStats();
  await loadTasks();
});

loadStats();
loadTasks();
