const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3001;
const HEALTH_URL = `http://localhost:${PORT}/healthcheck`;
const COLLECTION_DIR = path.join(__dirname, '..', 'bruno', 'ecommerce-eurostar');

function waitForServer(url, attempts = 30) {
  return new Promise((resolve, reject) => {
    const check = (remaining) => {
      http
        .get(url, (response) => {
          if (response.statusCode === 200) {
            resolve();
            return;
          }

          if (remaining === 0) {
            reject(new Error(`Server responded with status ${response.statusCode}`));
            return;
          }

          setTimeout(() => check(remaining - 1), 500);
        })
        .on('error', () => {
          if (remaining === 0) {
            reject(new Error('Server did not become ready in time'));
            return;
          }

          setTimeout(() => check(remaining - 1), 500);
        });
    };

    check(attempts);
  });
}

function runCommand(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function main() {
  const server = spawn('node', ['src/server.js'], {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  const shutdown = () => {
    if (!server.killed) {
      server.kill();
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  try {
    await waitForServer(HEALTH_URL);
    await runCommand('npx', ['bru', 'run', '--env', 'local'], {
      cwd: COLLECTION_DIR,
    });
    shutdown();
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    shutdown();
    process.exit(1);
  }
}

main();
