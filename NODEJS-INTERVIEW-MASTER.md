# 🟢 Node.js Interview Master Guide

> One-stop Node.js prep: Easy → Medium → Hard → Situational → Practical coding challenges.
> Notion tip: paste this whole file into a Notion page (or Import → Markdown). Turn each level heading into a toggle to quiz yourself.

**How to use:**
1. First pass — read Easy + Medium fully.
2. Second pass — Hard + Situational (say answers out loud).
3. Practice — actually code every challenge in Section 5, don't just read solutions.

---

# 1️⃣ EASY — Fundamentals

### Q1. What is Node.js?
Node.js is a **JavaScript runtime** built on Chrome's **V8 engine** that runs JS outside the browser. It uses an **event-driven, non-blocking I/O model** on a single main thread, making it lightweight and efficient for I/O-heavy workloads — APIs, real-time apps, streaming, data pipelines.

Key parts:
- **V8** — compiles JS to machine code
- **libuv** — C library providing the event loop, async I/O, and a thread pool
- **Core modules** — `fs`, `http`, `path`, `crypto`, `events`, `stream`…

### Q2. What is non-blocking I/O? Blocking vs non-blocking example.
Blocking: the thread waits until the operation finishes. Non-blocking: the operation is started, a callback is registered, and the thread moves on.

```js
// BLOCKING — nothing else runs until file is read
const data = fs.readFileSync('big.txt');
console.log('runs after read');

// NON-BLOCKING — read happens in background
fs.readFile('big.txt', (err, data) => console.log('read done'));
console.log('runs immediately');
```
In a server, one `readFileSync` on a request handler freezes **every** concurrent user — that's why sync APIs are banned in request paths.

### Q3. Is Node.js single-threaded?
The **JS execution and event loop are single-threaded**, but Node itself is not:
- **libuv thread pool** (default 4 threads) handles `fs`, `dns.lookup`, `crypto.pbkdf2`, compression
- **worker_threads** module for CPU-heavy JS
- **cluster** module forks whole processes to use all CPU cores

So the honest answer: "single-threaded event loop, multi-threaded under the hood."

### Q4. What is npm? What is package.json?
npm = Node's package manager (registry + CLI). `package.json` is the project manifest: name, version, **dependencies** vs **devDependencies**, **scripts** (`npm run dev`), entry point (`main`), engines. `package-lock.json` pins the exact resolved dependency tree so installs are reproducible — **always commit it**.

### Q5. Explain semver (`^4.18.2` vs `~4.18.2` vs `4.18.2`).
`MAJOR.MINOR.PATCH` — major = breaking, minor = features, patch = fixes.
- `^4.18.2` → any `4.x.x` ≥ 4.18.2 (minor + patch updates)
- `~4.18.2` → any `4.18.x` ≥ 4.18.2 (patch only)
- `4.18.2` → exactly that version

### Q6. `require` vs `import`?
- `require` — **CommonJS**, synchronous, can be called anywhere/conditionally, values copied at call time
- `import` — **ES Modules**, static (parsed before execution → enables tree-shaking), top-level only (except dynamic `import()`), live bindings, supports top-level `await`

Enable ESM with `"type": "module"` in package.json or `.mjs` extension.

### Q7. What is `module.exports` vs `exports`?
`exports` is just a shorthand reference to `module.exports`. Adding properties works on both; **reassigning `exports` breaks the link**:
```js
exports.add = () => {};        // ✅ works
module.exports = { add };      // ✅ works
exports = { add };             // ❌ exports now points elsewhere; module still exports {}
```

### Q8. What are error-first callbacks?
Node's classic async convention: callback's **first argument is the error** (or `null`), followed by results.
```js
fs.readFile('a.txt', (err, data) => {
  if (err) return handle(err);   // always check err first
  use(data);
});
```

### Q9. `setTimeout` vs `setInterval` vs `setImmediate` vs `process.nextTick`?
- `setTimeout(fn, ms)` — run once after ≥ms (timers phase)
- `setInterval(fn, ms)` — run repeatedly
- `setImmediate(fn)` — run in the **check phase**, after I/O callbacks of the current loop iteration
- `process.nextTick(fn)` — run **before the event loop continues** — highest priority, before Promises

### Q10. What is the `process` object? Common uses?
A global giving access to the current process: `process.env` (environment variables), `process.argv` (CLI args), `process.exit(code)`, `process.cwd()`, `process.on('uncaughtException')`, `process.memoryUsage()`, `process.pid`.

### Q11. What is a Buffer?
A fixed-size chunk of **raw binary data** outside V8's heap — how Node represents binary content (files, TCP packets, images).
```js
const buf = Buffer.from('hello', 'utf8');
buf.toString('base64'); // aGVsbG8=
```
You meet Buffers in file reads without encoding, crypto, and streams.

### Q12. `__dirname` vs `process.cwd()`?
- `__dirname` — directory of the **current file** (stable regardless of where you launched from)
- `process.cwd()` — directory the process was **started from**

Use `path.join(__dirname, 'config.json')` for file paths relative to code. (In ESM, use `import.meta.url` + `fileURLToPath`.)

### Q13. What does the `path` module solve?
Cross-platform path handling: `path.join('a','b')` (correct separators on Windows/Linux), `path.resolve` (absolute path), `path.extname`, `path.basename`. Never concatenate paths with `+ '/'`.

### Q14. How do environment variables work? Why use them?
`process.env.PORT`, loaded from the shell or a `.env` file via `dotenv`. They keep **config and secrets out of code** — different values per environment (dev/staging/prod), and secrets never enter git. Commit a `.env.example`, gitignore the real `.env`.

### Q15. What is nodemon? What's the modern alternative?
Dev tool that restarts the server on file changes. Modern Node has it built in: `node --watch app.js` (Node 18+).

### Q16. What are global objects in Node?
`globalThis` (the global object — no `window`), `process`, `console`, `Buffer`, `setTimeout` family, `__dirname`/`__filename` (CJS), `URL`, `fetch` (Node 18+), `structuredClone`.

### Q17. What is the difference between Node.js and browser JavaScript?
Same language, different host APIs: Node has `fs`, `http`, `process`, Buffers, no DOM/`window`; browsers have DOM, `localStorage`, no filesystem. Module systems historically differed (CJS vs ESM). Event loop implementations differ slightly (libuv vs browser spec) but the mental model (macrotasks/microtasks) is shared.

### Q18. What is REPL?
Read-Eval-Print-Loop — run `node` with no args for an interactive JS shell. Handy for quickly testing snippets (`crypto.randomUUID()`, date math).

### Q19. What is a callback? What is callback hell?
A function passed to be invoked when an operation completes. **Callback hell** = deeply nested callbacks (pyramid of doom) — hard to read, hard to handle errors. Fixed by Promises → `async/await`, and `Promise.all` for parallelism.

### Q20. What is `npx`?
Runs a package binary without installing it globally: `npx create-react-app`, `npx kill-port 3000`. It uses the local `node_modules/.bin` first, else downloads temporarily.

---

# 2️⃣ MEDIUM — Core Depth

### Q21. Explain the Event Loop phases in order.
Each loop iteration ("tick") passes through phases:

1. **Timers** — expired `setTimeout`/`setInterval` callbacks
2. **Pending callbacks** — deferred system-level I/O callbacks
3. **Idle/prepare** — internal
4. **Poll** — pull new I/O events, run their callbacks; may block here waiting for I/O
5. **Check** — `setImmediate` callbacks
6. **Close callbacks** — `'close'` events

**Between every callback**, Node drains microtasks: the **`process.nextTick` queue first**, then the **Promise microtask queue** — completely, before touching the next macrotask.

### Q22. Predict the output (the classic).
```js
console.log('start');

setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));

Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));

console.log('end');
```
**Output:** `start`, `end`, `nextTick`, `promise`, then `timeout`/`immediate`.
Sync code → nextTick queue → promise queue → macrotasks. (Outside an I/O callback, timeout-vs-immediate order is nondeterministic; **inside an I/O callback, `setImmediate` always beats `setTimeout(0)`** because check phase comes right after poll.)

### Q23. Predict the output (async/await version).
```js
async function main() {
  console.log('1');
  await null;            // everything after await = microtask
  console.log('2');
}
main();
console.log('3');
```
**Output:** `1 3 2`. `await` pauses the function and returns control; the continuation is queued as a microtask.

### Q24. Explain `Promise.all` vs `allSettled` vs `race` vs `any` — with use cases.
```js
await Promise.all([a, b, c]);        // all succeed or fail-fast → parallel required calls
await Promise.allSettled([a, b, c]); // wait for all, get per-item status → batch jobs where partial failure is OK
await Promise.race([fetchData(), timeout(5000)]); // first to settle → timeouts
await Promise.any([mirror1, mirror2]);            // first to SUCCEED → redundant sources
```
Interview trap: `Promise.all` **rejects on first failure but the other promises keep running** — they're not cancelled.

### Q25. Sequential vs parallel async — spot the mistake.
```js
// ❌ Sequential — 3s total if each takes 1s
const a = await getA();
const b = await getB();
const c = await getC();

// ✅ Parallel — 1s total (they're independent)
const [a, b, c] = await Promise.all([getA(), getB(), getC()]);
```
Very common code-review question. Only await sequentially when one result feeds the next.

### Q26. What is the EventEmitter? Where does Node use it?
Pub/sub primitive from the `events` module. Streams, HTTP servers, `process` — most Node async APIs are EventEmitters.
```js
const { EventEmitter } = require('events');
const bus = new EventEmitter();
bus.on('order:placed', (o) => sendEmail(o));   // subscribe
bus.once('ready', init);                        // fire once
bus.emit('order:placed', order);                // publish (synchronous!)
bus.off('order:placed', handler);               // unsubscribe
```
Gotchas: `emit` calls listeners **synchronously**; >10 listeners triggers a leak warning (often a real leak — listeners added in a loop and never removed); an `'error'` event with **no listener throws** and can crash the process.

### Q27. What are streams? The four types + a real example.
Streams process data **in chunks** with constant memory instead of buffering everything.

| Type | Direction | Example |
|---|---|---|
| Readable | source | `fs.createReadStream`, `req` |
| Writable | destination | `fs.createWriteStream`, `res` |
| Duplex | both | TCP socket |
| Transform | modify in-flight | `zlib.createGzip()` |

```js
// Serve a 2GB file with ~64KB memory instead of 2GB:
const { pipeline } = require('stream');
pipeline(
  fs.createReadStream('huge.csv'),
  zlib.createGzip(),
  res,
  (err) => { if (err) console.error('stream failed', err); }
);
```
Prefer `pipeline()` over `.pipe()` — it propagates **errors and cleanup** across the whole chain.

### Q28. What is backpressure?
When a fast producer overwhelms a slow consumer (fast disk read → slow network client). `write()` returns `false` when the internal buffer is full — you should pause the source and resume on the `'drain'` event. `pipe()`/`pipeline()` handle this automatically; manual loops that ignore `write()`'s return value balloon memory.

### Q29. How does `require()` caching work, and how do you use it?
Modules are cached by resolved filename after first load — subsequent `require`s return the **same object**. This makes a module a natural **singleton**:
```js
// db.js — every requirer shares this one pool
const pool = new Pool(config);
module.exports = pool;
```

### Q30. Explain Express middleware and the order problem.
Middleware = `(req, res, next)` functions executed **in registration order**.
```js
app.use(express.json());          // 1. parse body
app.use(requestLogger);           // 2. log
app.use('/api', authenticate);    // 3. protect /api routes
app.use('/api', routes);          // 4. business routes
app.use(notFoundHandler);         // 5. 404 — after all routes
app.use(errorHandler);            // 6. errors — LAST, 4 args
```
Classic bug: registering routes before `express.json()` → `req.body` undefined. Another: forgetting `next()` → request hangs forever.

### Q31. How do you handle errors properly in Express (incl. async)?
```js
// central error middleware — must have 4 params, registered last
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  logger.error({ err, path: req.path });
  res.status(status).json({ message: status === 500 ? 'Internal error' : err.message });
});

// async wrapper so rejections reach it (Express 4)
const asyncH = (fn) => (req, res, next) => fn(req, res, next).catch(next);
app.get('/users/:id', asyncH(async (req, res) => {
  const user = await service.get(req.params.id);
  if (!user) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
  res.json(user);
}));
```
Express 5 auto-forwards rejected promises; in 4 you need the wrapper or `next(err)`. Best practice: custom `AppError` class with `statusCode`, distinguish **operational errors** (expected — 404, validation) from **programmer errors** (bugs — crash & restart).

### Q32. How does JWT auth work end-to-end? Write the middleware.
Login → server signs a token → client sends `Authorization: Bearer <token>` → middleware verifies on each request. Stateless: no session store needed.
```js
const jwt = require('jsonwebtoken');

// issue at login
const token = jwt.sign({ sub: user.id, role: user.role },
  process.env.JWT_SECRET, { expiresIn: '15m' });

// verify middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// role guard (RBAC)
const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Forbidden' });
```
Talk points: payload is base64 **not encrypted**; short expiry + refresh token; revocation needs a blacklist (Redis) or short TTLs; 401 = unauthenticated, 403 = unauthorized.

### Q33. What is CORS and how do you fix a CORS error?
Browser security: a page on origin A can't read responses from origin B unless B's response says it's allowed (`Access-Control-Allow-Origin`). It is enforced **by the browser**, not the server — Postman never sees CORS errors.
```js
const cors = require('cors');
app.use(cors({ origin: ['https://myapp.com'], credentials: true }));
```
Preflight: for non-simple requests (JSON POST with auth header), the browser first sends an `OPTIONS` request — your server must answer it. Never ship `origin: '*'` with credentials.

### Q34. How do you do request validation?
At the boundary, before controllers, with a schema library:
```js
const { z } = require('zod');
const createUser = z.object({
  email: z.string().email(),
  age: z.number().int().min(18).optional(),
});

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success)
    return res.status(422).json({ errors: result.error.flatten().fieldErrors });
  req.body = result.data; // sanitized/typed
  next();
};
app.post('/users', validate(createUser), createUserHandler);
```
Never trust client input; validation is also your first defense against injection.

### Q35. How do you structure a production Express project?
```
src/
  routes/user.routes.js      // URL → controller mapping
  controllers/user.controller.js  // req/res handling only
  services/user.service.js   // business logic (framework-free, unit-testable)
  repositories/ or models/   // DB access
  middlewares/               // auth, validate, errorHandler
  config/                    // env, db config
  utils/
app.js      // express wiring (exported for tests)
server.js   // listen() + graceful shutdown
```
Why layered: controllers stay thin, services test without HTTP, DB is swappable. Separating `app.js` from `server.js` lets Supertest import the app without opening a port.

### Q36. What is the `cluster` module? Why use it?
One Node process uses one core. `cluster` forks workers (one per core) sharing the same port — the OS/master distributes connections.
```js
const cluster = require('cluster');
const os = require('os');
if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork());
  cluster.on('exit', () => cluster.fork()); // replace dead workers
} else {
  app.listen(3000);
}
```
In practice you use **PM2** (`pm2 start app.js -i max`) or container orchestration instead of hand-rolled cluster code. Caveat: workers share nothing — sessions/caches must be external (Redis).

### Q37. `child_process` — exec vs spawn vs fork?
- `exec(cmd)` — runs in a shell, buffers whole output → small commands
- `spawn(cmd, args)` — no shell by default, **streams** output → long/large output (ffmpeg, backups)
- `fork(module)` — spawns another **Node** process with an IPC channel (`child.send/on('message')`) → CPU work in a separate Node script

Security: never pass user input into `exec` (shell injection); prefer `spawn`/`execFile` with an args array.

### Q38. How do you implement graceful shutdown?
Finish in-flight work before dying — critical for zero-downtime deploys:
```js
const server = app.listen(PORT);
async function shutdown(signal) {
  console.log(`${signal} received, draining...`);
  server.close(async () => {          // stop accepting new connections
    await db.end();                   // close pools/queues
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref(); // force-exit fallback
}
process.on('SIGTERM', shutdown);      // sent by Docker/K8s/PM2
process.on('SIGINT', shutdown);       // Ctrl+C
```

### Q39. How do you handle configuration and secrets across environments?
- Code reads only `process.env` (12-factor)
- Local: `.env` + dotenv (gitignored) + committed `.env.example`
- Deployed: CI/CD secrets, container env, or a secret manager (Azure Key Vault, AWS Secrets Manager)
- Validate config at boot (fail fast if `JWT_SECRET` missing) rather than crashing at first use

### Q40. How do you talk to a SQL database from Node correctly?
- **Connection pool**, created once (module singleton), not a connection per request
- **Parameterized queries** always:
```js
const { rows } = await pool.query(
  'SELECT * FROM users WHERE email = $1', [email]  // pg
);
```
- Transactions for multi-statement invariants; release clients in `finally`
- Or an ORM/query builder (Prisma, Sequelize, Knex) — mention trade-off: productivity vs control over generated SQL

### Q41. How do you call third-party APIs robustly? (your real-world specialty — own this)
- **Timeouts** on every call (`AbortController` / axios `timeout`) — never wait forever
- **Retry with exponential backoff + jitter**, only for transient errors (429/5xx/network), only for idempotent calls
- **Respect rate limits** — read `Retry-After`/vendor headers, queue or throttle requests
- **Pagination** — loop cursors/pages defensively with a max-page safety cap
- **Auth lifecycle** — refresh expired tokens automatically, alert when refresh fails
- **Observability** — log per-call outcome; alert on sustained failure so problems surface immediately, not as missing data

### Q42. What is middleware-level rate limiting and why?
Protects against abuse/brute force and protects downstream resources.
```js
const rateLimit = require('express-rate-limit');
app.use('/api/login', rateLimit({ windowMs: 15 * 60_000, max: 10 }));
```
Mention: in-memory limiters break with multiple instances — use a Redis store so the count is shared. (Hand-rolled version in Section 5.)

### Q43. What is the difference between `res.send`, `res.json`, `res.end`, and returning without responding?
`res.json` sets content-type and serializes; `res.send` infers type; `res.end` closes without body. A handler that neither responds nor calls `next()` **hangs the request** until client timeout — a classic bug. Also: "headers already sent" errors mean you responded twice (e.g., forgot `return` before `res.json` in a branch).

### Q44. How does HTTPS/TLS fit with Node in production?
Usually you **terminate TLS at a reverse proxy/load balancer** (Nginx, ALB, App Gateway) and run Node on plain HTTP behind it. Set `app.set('trust proxy', 1)` so `req.ip`/`req.protocol` reflect the real client. Node *can* do TLS itself (`https.createServer({ key, cert })`) for simple setups.

---

# 3️⃣ HARD — Advanced & Architecture

### Q45. `worker_threads` vs `cluster` vs `child_process` — when to use which?

| | worker_threads | cluster | child_process |
|---|---|---|---|
| Unit | thread in same process | forked Node processes | any process |
| Memory | can **share** (SharedArrayBuffer); cheap spawn | isolated | isolated |
| Use case | CPU-heavy JS (parsing, image work, crypto) | scale an HTTP server across cores | run other programs / separate Node scripts |

```js
// worker.js
const { parentPort, workerData } = require('worker_threads');
parentPort.postMessage(heavyCompute(workerData));

// main.js
const { Worker } = require('worker_threads');
const result = await new Promise((resolve, reject) => {
  const w = new Worker('./worker.js', { workerData: payload });
  w.once('message', resolve);
  w.once('error', reject);
});
```
Rule of thumb: **I/O scales on the event loop for free; CPU work needs threads/processes.**

### Q46. What exactly blocks the event loop, and how do you detect it?
Blockers: sync fs/crypto (`readFileSync`, `pbkdf2Sync`), long loops, huge `JSON.parse`/`stringify`, catastrophic regex (ReDoS), heavy template rendering.

Detection:
- Measure **event-loop lag**: schedule a timer and measure drift (`perf_hooks.monitorEventLoopDelay()`); alert when p99 lag climbs
- `--prof` / clinic.js flame graphs to find the hot function
- Symptom in prod: ALL endpoints slow down together (one thread!), CPU pegged at ~100% of one core

Fixes: move work to worker threads, chunk big loops (`setImmediate` between batches), stream instead of buffering, precompute.

### Q47. How do you find and fix a memory leak?
Common causes: module-level arrays/maps that only grow (unbounded cache), event listeners added per-request and never removed, closures capturing large objects, forgotten timers.

Process:
1. Confirm: plot heap/RSS over time (steady climb across GCs = leak)
2. `node --inspect` → Chrome DevTools → take **two heap snapshots** minutes apart → "Comparison" view → what grew?
3. Look at retainer paths to see who's holding references
4. Fix: bounded caches (LRU with max size/TTL), `emitter.off` in cleanup, `WeakMap` for metadata keyed by objects

Stopgap in prod: memory-based restart (PM2 `max_memory_restart`) while you diagnose — but say explicitly it's a mitigation, not a fix.

### Q48. Explain V8 memory structure and GC at interview depth.
Heap regions: **new space** (young objects, cheap frequent Scavenge GC) and **old space** (survivors promoted, less frequent Mark-Sweep-Compact). Buffers live **outside** the V8 heap ("external memory"). Default old-space limit ~4GB (tunable via `--max-old-space-size`). Practical implications: many short-lived objects are cheap; accidentally keeping objects alive promotes them and makes major GCs expensive; "heap out of memory" crashes usually mean a leak or buffering something you should stream.

### Q49. How would you scale a Node API from 1 server to high traffic? (whiteboard answer)
Layered, in order of cost:
1. **Measure first** — find the actual bottleneck (DB? CPU? external API?)
2. **In-process**: fix N+1 queries, add missing indexes, cache hot reads (Redis with TTL), compress responses, connection pooling
3. **Vertical/cores**: PM2 cluster mode / more container replicas
4. **Horizontal**: stateless app (JWT or Redis sessions) behind a load balancer; autoscaling
5. **Offload**: background queues (BullMQ/RabbitMQ/Service Bus) for slow work — API responds fast, workers process async
6. **Data layer**: read replicas, then sharding/partitioning as last resort
7. **Edge**: CDN for static assets, HTTP caching headers

The phrase interviewers want: **"stateless services scale horizontally; state lives in shared stores."**

### Q50. Design a rate limiter for a multi-instance deployment.
In-memory counters fail with N instances (each instance counts separately). Use **Redis**:
- **Fixed window**: `INCR key:{userId}:{minute}` + `EXPIRE` — simple, allows 2× burst at window edges
- **Sliding window log**: sorted set of timestamps, `ZREMRANGEBYSCORE` old ones, count — accurate, more memory
- **Token bucket**: refill tokens at rate R, each request consumes one — smooths bursts, the usual production choice
Wrap in middleware returning `429` + `Retry-After`. Use a Lua script/atomic operation to avoid check-then-set races.

### Q51. How do you make an endpoint/job idempotent, and why does it matter?
Retries + at-least-once queues mean **the same operation may run twice**. Techniques:
- Natural idempotency: `PUT`/upsert (`INSERT ... ON CONFLICT UPDATE`) instead of blind inserts
- **Idempotency keys**: client sends `Idempotency-Key` header; server stores key → response, returns stored response on repeats (payments pattern)
- DB unique constraints as the last line of defense
- Job dedup: unique job IDs in the queue

### Q52. How do transactions work from Node? Show the pattern.
```js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amt, from]);
  await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amt, to]);
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();     // ALWAYS release, or the pool starves
}
```
Discussion points: keep transactions short (locks!), never `await` an external API inside a transaction, isolation levels if pushed (read committed default; serializable for strict invariants).

### Q53. Node.js security checklist (be able to rattle this off).
- **Injection**: parameterized SQL; sanitize Mongo operators (`$gt` in payloads); never template user input into shell commands
- **Auth**: bcrypt/argon2 password hashing (never plain/MD5), short-lived JWTs, secure refresh flow
- **Headers**: `helmet`; strict CORS allowlist
- **Input**: schema validation everywhere; request size limits; file-upload type/size checks
- **Rate limiting** on auth endpoints (brute force)
- **Secrets**: env/secret manager, never in git; rotate on leak
- **Dependencies**: `npm audit`, lockfile committed, careful with obscure packages (supply chain)
- **DoS**: timeouts on external calls, avoid catastrophic regex (ReDoS), pagination caps
- **Errors**: never leak stack traces/SQL to clients in prod

### Q54. What is `AsyncLocalStorage` and what problem does it solve?
Context that flows through async calls without threading parameters — Node's "thread-local storage":
```js
const { AsyncLocalStorage } = require('async_hooks');
const als = new AsyncLocalStorage();

app.use((req, res, next) => {
  als.run({ requestId: crypto.randomUUID() }, next);
});
// deep inside any service/logger, no parameter passing:
logger.info({ requestId: als.getStore()?.requestId, msg: 'db call' });
```
Killer use case: **request ID / trace correlation in logs** across every async hop of a request.

### Q55. How do WebSockets work server-side, and how do they scale?
WS = persistent TCP connection upgraded from HTTP (`Upgrade: websocket` handshake). In Node: `ws` library or Socket.IO (adds rooms, fallbacks, reconnection).
Scaling challenge: connections are **stateful** — with N instances, user A on instance 1 can't receive a message emitted on instance 2. Solution: **pub/sub backplane** (Redis adapter) — instances publish events to Redis; every instance forwards to its own connected sockets. Also: sticky sessions for Socket.IO's HTTP fallback, heartbeats to detect dead connections, backoff on reconnect storms.

### Q56. Explain caching strategies for a Node API.
- **Where**: in-process LRU (fastest, per-instance, small), **Redis** (shared, survives restarts), HTTP layer (`Cache-Control`, ETag → 304), CDN
- **Cache-aside** pattern:
```js
async function getProduct(id) {
  const hit = await redis.get(`product:${id}`);
  if (hit) return JSON.parse(hit);
  const product = await db.products.findById(id);
  await redis.set(`product:${id}`, JSON.stringify(product), 'EX', 300);
  return product;
}
```
- **Invalidation**: TTLs (simplest), explicit delete on write, versioned keys
- Pitfalls: **stampede** (many misses at once hammer the DB — use a lock or stale-while-revalidate), stale data tolerance is a product decision

### Q57. How do zero-downtime deployments work for Node?
Rolling replacement: bring up new instances → health check passes → LB shifts traffic → old instances get `SIGTERM` → **graceful shutdown** drains in-flight requests → terminate. Requires: health/readiness endpoints (`/healthz` checking DB connectivity), graceful shutdown handling (Q38), backward-compatible DB migrations (expand → migrate → contract), and stateless processes.

### Q58. What are common npm/supply-chain risks and mitigations?
Typosquatting, hijacked maintainer accounts, postinstall scripts running arbitrary code. Mitigations: lockfile committed + `npm ci` in CI, `npm audit`/Dependabot, minimal dependency footprint, pin/review unusual packages, `--ignore-scripts` where viable, provenance/signature checks in mature setups.

### Q59. Streams — write a custom Transform and explain objectMode.
```js
const { Transform, pipeline } = require('stream');

const csvLineToJson = new Transform({
  objectMode: true,                       // pass JS objects, not bytes
  transform(line, _enc, cb) {
    const [id, name, price] = line.split(',');
    cb(null, { id: Number(id), name, price: Number(price) });
  },
});

pipeline(readLines('products.csv'), csvLineToJson, dbBulkWriter, (err) => {
  if (err) console.error('ETL failed', err);
});
```
`objectMode` lets streams carry objects (ETL pipelines) instead of Buffers/strings. Error handling: one `pipeline` callback covers the whole chain — with raw `.pipe()`, an unhandled `'error'` on any stream can crash the process and leak file descriptors.

### Q60. How would you process a 10GB file / export 1M rows without dying?
**Never** `readFile`/load-all-rows (heap OOM). Stream end-to-end:
- Import: `createReadStream` → line-splitter → transform → **batched** DB writes (e.g., 1000-row inserts), respecting backpressure
- Export: DB **cursor/stream** (`pg-query-stream`, Mongoose `.cursor()`) → CSV transform → `res` with `Content-Disposition: attachment` — constant memory, download starts immediately
- Long jobs: run in a worker/queue, report progress, make resumable (track last processed offset)

---

# 4️⃣ SITUATIONAL / PRODUCTION SCENARIOS

> Answer these with a structure: **clarify impact → diagnose with data → mitigate → root-cause fix → prevent recurrence.** Interviewers grade the process more than the specific fix.

### S1. "The API suddenly became slow for everyone. Walk me through what you do."
1. **Scope**: all endpoints or some? all users? when did it start? → correlate with **last deploy/config change** (most common cause — check first)
2. **Look at metrics**: CPU (pegged single core → event-loop blocking), memory (climbing → leak/GC thrash), DB (slow queries, pool exhaustion), external API latencies
3. **All endpoints slow together** is the Node-specific tell: something is blocking the single event loop — recent code with a sync call, huge JSON, bad regex
4. **Mitigate** if severe: rollback the deploy / scale out
5. **Root cause**: profiler/flame graph or event-loop-lag metric to find the blocker
6. **Prevent**: add event-loop-lag alerting; lint rules against sync APIs

### S2. "Memory usage keeps climbing until the process crashes every ~6 hours."
Classic leak. Short-term: automatic restart on memory threshold keeps prod alive. Diagnosis: heap snapshot comparison (two snapshots, diff, retainer paths) — usual suspects: unbounded in-memory cache/map, listeners accumulating, per-request data pushed to a module-level array. Fix the reference, add a bounded LRU if a cache is genuinely needed, and add heap-usage alerting so the *next* leak is caught in staging.

### S3. "One report endpoint takes 30s and while it runs, every other request stalls."
Two separate problems:
- Other requests stalling ⇒ the report does **CPU-bound work on the event loop** (or sync I/O). Fix: move computation to a **worker thread**, or better, make it an **async job** — endpoint enqueues, returns `202` + job ID, client polls/receives the result; a queue worker builds the report
- The 30s itself: usually an unindexed aggregation or N+1 — `EXPLAIN` it, precompute/materialize if it's a dashboard query

### S4. "A third-party API you depend on starts rate-limiting/failing. Orders are being lost."
- Immediately: **stop losing data** — put incoming work on a **durable queue** so nothing is dropped while downstream is sick
- Handle 429s properly: honor `Retry-After`, exponential backoff + jitter, cap concurrency to their limit
- Add a **circuit breaker** so you fail fast instead of piling up timed-out requests
- Idempotency keys on the calls so retries can't double-create orders
- Alert on sustained failure; degrade gracefully in the UI ("processing" state)

### S5. "Your nightly data pipeline silently produced no data last night. How do you make sure this never happens silently again?"
(You've lived this one — tell it as experience.) Root issue is **observability**: per-run structured logs (start, per-source counts, end status), **alert on failure AND on anomalies** ("0 rows ingested" is a failure even with exit code 0), heartbeat/dead-man's-switch monitoring (alert if the job *didn't run*), and surfacing auth expiry distinctly since expired tokens are the #1 silent killer for vendor integrations.

### S6. "Two users clicked 'Pay' twice / a message was processed twice. Money moved twice."
Duplicate side effects from retries or double-submit. Answer: **idempotency**. Client-generated idempotency key stored with the first response; unique constraint on (user, orderRef) in DB as the backstop; for queues, at-least-once delivery is a given → consumers must dedupe by message/job ID. UI: disable button on submit — but never rely on the client alone.

### S7. "You need to add a breaking change to an API that mobile apps in the field still call."
Old app versions can't be force-updated. Options: **version the API** (`/v2/...` or header-based) and keep v1 alive with a deprecation window; or make the change additive/backward-compatible (new optional fields, never repurpose old ones). Track v1 usage metrics to know when it's safe to retire. Communicate timelines.

### S8. "Login endpoint is getting brute-forced."
Rate limit by IP **and** by account (attackers rotate IPs), add exponential lockout/captcha after N failures, alert on spikes, ensure bcrypt (slow hashing is a feature here), monitor credential-stuffing patterns, and never reveal "user exists" vs "wrong password" in error messages.

### S9. "A junior's PR reads files with readFileSync inside a request handler and loops await inside a for-loop over 200 items. Review it."
Two findings: (1) sync I/O in a request path blocks all users → `fs.promises.readFile`, or cache the file at boot if static. (2) Sequential awaits: if the 200 calls are independent → `Promise.all` (with a concurrency cap — e.g., p-limit or batching — if the target can't take 200 parallel hits). Also praise structure, suggest tests — code review questions also assess how you *communicate* feedback.

### S10. "Environment variable with a production secret was committed to git. What now?"
The secret is **compromised the moment it's pushed** — history rewriting is not enough. Order: (1) **rotate the secret immediately** at the source (DB password, API key), (2) verify no unauthorized use in logs, (3) then scrub history (BFG/filter-repo) and force-push, (4) prevent: gitignore, secret scanning (GitHub push protection, gitleaks in CI), secrets manager instead of .env in repos.

### S11. "Requests randomly take 10s but only sometimes. How do you hunt an intermittent latency spike?"
Add **percentile latency metrics per endpoint** (p50/p95/p99 — averages hide spikes) and **request-scoped tracing/logging** with request IDs (AsyncLocalStorage) with per-phase timings (DB, external calls). Usual suspects: connection-pool exhaustion (waiting for a free connection), GC pauses (correlate with heap), a periodic cron on the same box, cold external API, DNS. The method — instrument first, then correlate timing of spikes with a cause — matters more than guessing.

### S12. "You inherit a legacy callback-style Node codebase. Modernization strategy?"
Incremental, not big-bang: wrap boundaries with `util.promisify`, convert leaf modules to async/await as you touch them, add tests **before** refactoring each module (characterization tests), lint rules to stop new callback code, prioritize the highest-churn files. Never a rewrite-from-scratch pitch — interviewers want pragmatism.

### S13. "How would you take an endpoint from 800ms to <200ms?"
Measure → don't guess: add timing around each phase. Typical wins in order: N+1 queries → single JOIN/`IN` query; missing index → `EXPLAIN` + add; over-fetching → select only needed columns/fields; serialize less (huge JSON) ; cache the hot read (Redis, 60s TTL often enough); parallelize independent awaits; compression for large payloads. Re-measure after each change; stop when the target is met.

### S14. "Design the backend for a real-time dashboard fed by sensors (your thermal project, generalized)."
Ingress: sensors → gateway (MQTT/HTTP) → queue/stream (Kafka/Service Bus) for buffering bursts. Processing: Node consumers validate/enrich, write time-series data (batched), evaluate alert thresholds. Fan-out: WebSocket server pushes to dashboards — **throttle/aggregate server-side** (e.g., 4Hz max to UI regardless of sensor rate), Redis pub/sub backplane if multiple WS instances. History: time-series store or partitioned SQL with downsampling for old data. Client: rolling window buffers, memoized chart updates. (Tie it to what you actually built — that's your credibility.)

### S15. "Production is down. Logs show `UnhandledPromiseRejection` and the process is crash-looping."
Stabilize first: identify the rejecting promise from the stack in logs; if a recent deploy → **rollback now**, debug later. If not deploy-related: the crash-loop restart is actually protective (process manager restarts), but find the trigger input — often a specific request payload hitting an unawaited promise. Fix: await/catch the offending path, add `process.on('unhandledRejection')` logging with **graceful shutdown** (log richly, exit, let the manager restart), add the failing input as a regression test.

---

# 5️⃣ PRACTICAL CODING CHALLENGES

> These get asked as "open your editor" rounds. Code each one yourself first; solutions here are reference implementations.

### C1. Implement `sleep` and a promise timeout wrapper
```js
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
// await withTimeout(fetchUser(id), 5000);
```

### C2. Retry with exponential backoff (asked constantly for API work)
```js
async function retry(fn, { retries = 3, baseMs = 300, factor = 2 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt === retries || !isTransient(err)) throw err;
      const delay = baseMs * factor ** attempt + Math.random() * 100; // jitter
      await sleep(delay);
    }
  }
  throw lastErr;
}
const isTransient = (err) =>
  err.code === 'ECONNRESET' || [429, 502, 503, 504].includes(err.status);
```
Talking points: jitter prevents synchronized retry storms; only retry transient + idempotent operations.

### C3. Implement `Promise.all` from scratch
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let remaining = promises.length;
    if (remaining === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((value) => {   // handles non-promise values too
        results[i] = value;                   // preserve ORDER, not completion order
        if (--remaining === 0) resolve(results);
      }, reject);                             // first rejection wins
    });
  });
}
```
Follow-up they'll ask: modify into `allSettled` (never reject, push `{status, value/reason}`).

### C4. Concurrency limiter (run N promises at a time) — very common
```js
async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;                 // claim an index
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}
// await mapWithConcurrency(userIds, 5, fetchUser); // ≤5 in flight
```
Real use: hitting a vendor API with 1000 items without tripping rate limits.

### C5. EventEmitter from scratch
```js
class MyEmitter {
  #listeners = new Map();
  on(event, fn) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(fn);
    return this;
  }
  off(event, fn) { this.#listeners.get(event)?.delete(fn); return this; }
  once(event, fn) {
    const wrapper = (...args) => { this.off(event, wrapper); fn(...args); };
    return this.on(event, wrapper);
  }
  emit(event, ...args) {
    const fns = this.#listeners.get(event);
    if (!fns?.size) return false;
    [...fns].forEach((fn) => fn(...args)); // copy: handlers may off() during emit
    return true;
  }
}
```

### C6. Debounce and throttle (memorize cold)
```js
function debounce(fn, ms) {              // fire AFTER quiet period (search box)
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

function throttle(fn, ms) {              // fire at most once per window (scroll)
  let last = 0, timer;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    } else {                             // trailing call so last event isn't lost
      clearTimeout(timer);
      timer = setTimeout(() => { last = Date.now(); fn.apply(this, args); },
        ms - (now - last));
    }
  };
}
```

### C7. In-memory rate limiter middleware (fixed window)
```js
function rateLimiter({ windowMs = 60_000, max = 100 } = {}) {
  const hits = new Map(); // key -> { count, windowStart }
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now - entry.windowStart >= windowMs) {
      hits.set(key, { count: 1, windowStart: now });
      return next();
    }
    if (++entry.count > max) {
      res.set('Retry-After', Math.ceil((entry.windowStart + windowMs - now) / 1000));
      return res.status(429).json({ message: 'Too many requests' });
    }
    next();
  };
}
```
Discuss: Map grows unbounded (sweep old keys periodically); multi-instance needs Redis; fixed window allows edge bursts → token bucket.

### C8. LRU cache
```js
class LRUCache {
  constructor(capacity) { this.cap = capacity; this.map = new Map(); }
  get(key) {
    if (!this.map.has(key)) return undefined;
    const val = this.map.get(key);
    this.map.delete(key); this.map.set(key, val); // re-insert = most recent
    return val;
  }
  set(key, val) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.cap)
      this.map.delete(this.map.keys().next().value); // oldest = first key
    this.map.set(key, val);
  }
}
```
Works because JS `Map` preserves insertion order — O(1) get/set.

### C9. Simple memoize with TTL (cache-aside helper)
```js
function memoizeAsync(fn, ttlMs = 30_000) {
  const cache = new Map(); // key -> { value: Promise, expires }
  return (...args) => {
    const key = JSON.stringify(args);
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.value;
    const value = fn(...args).catch((err) => {
      cache.delete(key);   // don't cache failures
      throw err;
    });
    cache.set(key, { value, expires: Date.now() + ttlMs });
    return value;
  };
}
```
Note: caching the **promise** (not the resolved value) also prevents cache stampede — concurrent callers share one in-flight request.

### C10. Build a minimal REST API (the standard live-coding round)
Practice building this in <20 minutes from memory: Express app with `/todos` CRUD, in-memory store, validation, error middleware, correct status codes.
```js
const express = require('express');
const app = express();
app.use(express.json());

let todos = [], nextId = 1;

app.get('/todos', (req, res) => {
  const { completed, page = 1, limit = 10 } = req.query;
  let out = todos;
  if (completed !== undefined) out = out.filter(t => t.completed === (completed === 'true'));
  const start = (page - 1) * limit;
  res.json({ data: out.slice(start, start + +limit), total: out.length });
});

app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title?.trim()) return res.status(422).json({ message: 'title is required' });
  const todo = { id: nextId++, title: title.trim(), completed: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.patch('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === +req.params.id);
  if (!todo) return res.status(404).json({ message: 'Not found' });
  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = !!completed;
  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const idx = todos.findIndex(t => t.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  todos.splice(idx, 1);
  res.status(204).end();
});

app.use((err, req, res, next) => res.status(500).json({ message: 'Internal error' }));
app.listen(3000, () => console.log('up on 3000'));
```
Variants to be ready for: add JWT auth middleware (Q32), add file-based persistence, add rate limiting (C7), write Supertest tests for it.

### C11. Read a huge file line-by-line and aggregate (streams round)
```js
const fs = require('fs');
const readline = require('readline');

async function countErrorsByCode(logPath) {
  const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity,
  });
  const counts = {};
  for await (const line of rl) {            // async iteration = built-in backpressure
    const match = line.match(/ERROR (\d{3})/);
    if (match) counts[match[1]] = (counts[match[1]] || 0) + 1;
  }
  return counts;
}
```
Say why: `readFile` on a 10GB log OOMs; this uses constant memory.

### C12. Chunked batch processor (queue-style)
```js
async function processInBatches(items, batchSize, handler) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const results = await Promise.allSettled(batch.map(handler));
    const failed = results.filter(r => r.status === 'rejected');
    console.log(`batch ${i / batchSize + 1}: ${batch.length - failed.length} ok, ${failed.length} failed`);
    // collect failures for retry instead of aborting the whole run
  }
}
```
This is literally your ERP-ingestion pattern — mention that.

### C13. Simple task queue with workers (in-process)
```js
class TaskQueue {
  #queue = []; #active = 0;
  constructor(concurrency) { this.concurrency = concurrency; }
  push(task) {
    return new Promise((resolve, reject) => {
      this.#queue.push({ task, resolve, reject });
      this.#drain();
    });
  }
  #drain() {
    while (this.#active < this.concurrency && this.#queue.length) {
      const { task, resolve, reject } = this.#queue.shift();
      this.#active++;
      task().then(resolve, reject).finally(() => { this.#active--; this.#drain(); });
    }
  }
}
// const q = new TaskQueue(3); q.push(() => sendEmail(u));
```

### C14. `groupBy` / flatten / dedupe — rapid-fire array utilities
```js
const groupBy = (arr, keyFn) =>
  arr.reduce((acc, item) => {
    (acc[keyFn(item)] ||= []).push(item);
    return acc;
  }, {});

const flatten = (arr) =>
  arr.reduce((acc, v) => acc.concat(Array.isArray(v) ? flatten(v) : v), []);

const dedupeBy = (arr, keyFn) => {
  const seen = new Set();
  return arr.filter(item => {
    const k = keyFn(item);
    return seen.has(k) ? false : (seen.add(k), true);
  });
};
```

### C15. Event-loop output drills (write your predicted output, then run them)
```js
// Drill 1
setTimeout(() => console.log('A'), 0);
Promise.resolve().then(() => console.log('B')).then(() => console.log('C'));
process.nextTick(() => console.log('D'));
console.log('E');
// → E D B C A

// Drill 2 — nested
Promise.resolve().then(() => {
  console.log('p1');
  setTimeout(() => console.log('t2'), 0);
});
setTimeout(() => {
  console.log('t1');
  Promise.resolve().then(() => console.log('p2'));
}, 0);
// → p1 t1 p2 t2

// Drill 3 — async/await interleaving
async function a() { console.log('a1'); await b(); console.log('a2'); }
async function b() { console.log('b1'); }
a();
console.log('main');
// → a1 b1 main a2
```

---

## 📅 Suggested 7-day practice plan

| Day | Focus |
|---|---|
| 1 | Easy Q1–20 + run all C15 drills yourself |
| 2 | Event loop + promises deep (Q21–25) + code C1–C4 from scratch |
| 3 | Express/API (Q30–35, Q42–44) + build C10 from memory, add JWT (Q32) |
| 4 | Streams + EventEmitter (Q26–29, Q59–60) + code C5, C11 |
| 5 | Hard section (Q45–58) — say answers out loud |
| 6 | All 15 situational scenarios — practice the diagnose→mitigate→fix→prevent structure |
| 7 | Mock: re-build C10 + C2 + C7 timed; revisit anything shaky |

**Interview-day one-liners to remember:**
- "I/O scales free on the event loop; CPU work needs workers."
- "Stateless services scale horizontally; state lives in shared stores."
- "Retries require idempotency."
- "Measure before optimizing — percentiles, not averages."
- "All endpoints slow at once = something is blocking the event loop."
