const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const dataDir = path.join(root, 'data');
const projectFile = path.join(dataDir, 'project.json');
const projectsFile = path.join(dataDir, 'projects.json');
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/api/project' && req.method === 'GET') {
    try { return send(res, 200, JSON.parse(fs.readFileSync(projectFile, 'utf8'))); }
    catch { return send(res, 404, { error: 'No saved project yet.' }); }
  }
  if (url.pathname === '/api/projects' && req.method === 'GET') {
    try { return send(res, 200, JSON.parse(fs.readFileSync(projectsFile, 'utf8'))); }
    catch {
      try { const legacy = JSON.parse(fs.readFileSync(projectFile, 'utf8')); legacy.id ||= 'legacy-project'; return send(res, 200, [legacy]); }
      catch { return send(res, 200, []); }
    }
  }
  const projectMatch = url.pathname.match(/^\/api\/projects\/([a-zA-Z0-9_-]+)$/);
  if (projectMatch && req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 8_000_000) { send(res, 413, { error: 'Project is too large.' }); req.destroy(); } });
    req.on('end', () => {
      try {
        const project = JSON.parse(body); if (!project || typeof project !== 'object' || !project.text || !project.background) return send(res, 400, { error: 'Invalid project data.' });
        project.id = projectMatch[1]; fs.mkdirSync(dataDir, { recursive: true });
        let list = []; try { list = JSON.parse(fs.readFileSync(projectsFile, 'utf8')); } catch { try { list = [JSON.parse(fs.readFileSync(projectFile, 'utf8'))]; } catch {} }
        list = list.filter(item => item.id !== project.id); list.unshift(project); fs.writeFileSync(projectsFile, JSON.stringify(list, null, 2), 'utf8');
        return send(res, 200, { saved: true, id: project.id });
      } catch { return send(res, 400, { error: 'Could not save project.' }); }
    });
    return;
  }
  if (projectMatch && req.method === 'DELETE') {
    let list = []; try { list = JSON.parse(fs.readFileSync(projectsFile, 'utf8')); } catch {}
    list = list.filter(item => item.id !== projectMatch[1]); fs.mkdirSync(dataDir, { recursive: true }); fs.writeFileSync(projectsFile, JSON.stringify(list, null, 2), 'utf8');
    return send(res, 200, { deleted: true, projects: list.length });
  }
  if (url.pathname === '/api/project' && req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2_000_000) { send(res, 413, { error: 'Project is too large.' }); req.destroy(); }
    });
    req.on('end', () => {
      try {
        const project = JSON.parse(body);
        if (!project || typeof project !== 'object' || !project.text || !project.background) return send(res, 400, { error: 'Invalid project data.' });
        fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(projectFile, JSON.stringify(project, null, 2), 'utf8');
        return send(res, 200, { saved: true, name: project.name || 'Untitled design' });
      } catch { return send(res, 400, { error: 'Could not read project data.' }); }
    });
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Method not allowed.' });
  const pathname = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const file = path.resolve(root, `.${pathname}`);
  if (!file.startsWith(root + path.sep) || file === projectFile || file.startsWith(dataDir + path.sep)) return send(res, 403, { error: 'Forbidden.' });
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });
});

server.listen(port, '127.0.0.1', () => console.log(`Canvasly is ready at http://127.0.0.1:${port}`));
