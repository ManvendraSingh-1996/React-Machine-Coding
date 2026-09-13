# Interview Prep — Developer III (Full Stack: Node.js / Angular / React Native)

> Target role: 4–5 yrs Full Stack Developer (Node.js, Angular, React Native, SQL/MongoDB, Microservices basics)
> Note: NestJS intentionally skipped. Microservices kept at easy/fundamentals level. Angular includes a refresher since it's been ~2 years.

---

## Table of Contents

1. [Node.js — Core](#1-nodejs--core)
2. [Express.js & REST API Design](#2-expressjs--rest-api-design)
3. [Authentication & Authorization](#3-authentication--authorization)
4. [Angular (Refresher + Interview Depth)](#4-angular-refresher--interview-depth)
5. [TypeScript](#5-typescript)
6. [React Native](#6-react-native)
7. [HTML5 / CSS3 / Responsive Design](#7-html5--css3--responsive-design)
8. [Databases — SQL (MySQL/PostgreSQL)](#8-databases--sql-mysqlpostgresql)
9. [Databases — MongoDB](#9-databases--mongodb)
10. [Microservices (Easy Questions)](#10-microservices-easy-questions)
11. [Git, CI/CD, Docker & Cloud](#11-git-cicd-docker--cloud)
12. [Testing & Debugging](#12-testing--debugging)
13. [Agile / Scrum & Behavioral](#13-agile--scrum--behavioral)
14. [Likely Machine Coding / Practical Questions](#14-likely-machine-coding--practical-questions)
15. [Handling the NestJS Gap Honestly](#15-handling-the-nestjs-gap-honestly)

---

## 1. Node.js — Core

### Q1. What is Node.js and why is it good for backend development?
**A:** Node.js is a JavaScript runtime built on Chrome's V8 engine that runs JS outside the browser. It uses a **single-threaded, event-driven, non-blocking I/O model**, which makes it excellent for I/O-heavy applications (APIs, real-time apps, streaming) because one thread can handle thousands of concurrent connections without waiting for I/O to complete. It's less suited for CPU-heavy tasks (image processing, heavy computation) because those block the single event-loop thread.

### Q2. Explain the Event Loop.
**A:** The event loop is what allows Node to perform non-blocking I/O on a single thread. It runs in phases, in a repeating cycle:
1. **Timers** — executes `setTimeout` / `setInterval` callbacks whose time has expired
2. **Pending callbacks** — I/O callbacks deferred from the previous cycle
3. **Poll** — retrieves new I/O events and executes their callbacks (most work happens here)
4. **Check** — executes `setImmediate` callbacks
5. **Close callbacks** — e.g., `socket.on('close')`

Between each phase, Node drains the **microtask queues**: `process.nextTick` callbacks first, then resolved Promises (`.then`). So microtasks always run before the event loop moves on.

### Q3. Output-prediction question interviewers love:
```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
process.nextTick(() => console.log('4'));
console.log('5');
```
**A:** `1 5 4 3 2`. Synchronous code first (`1`, `5`), then `process.nextTick` (highest microtask priority in Node), then Promise microtasks, then timer macrotasks.

### Q4. Is Node.js really single-threaded?
**A:** The JS execution and event loop are single-threaded, but Node is not entirely single-threaded. It uses **libuv's thread pool** (default 4 threads) for filesystem operations, DNS lookups, and crypto operations. Additionally, we can use the **`worker_threads`** module for CPU-heavy work, or **`cluster`** module / PM2 to fork multiple processes and use all CPU cores.

### Q5. Difference between `process.nextTick()` and `setImmediate()`?
**A:** `process.nextTick()` fires **before** the event loop continues — right after the current operation, before any I/O. `setImmediate()` fires in the **check phase**, after the poll phase (after I/O events). So `nextTick` runs sooner. Overusing `nextTick` can starve the event loop.

### Q6. What are streams? Why use them?
**A:** Streams process data in chunks instead of loading everything into memory. Four types: **Readable** (fs.createReadStream), **Writable** (res in HTTP), **Duplex** (sockets), **Transform** (zlib compression). Example: to serve a 2GB file, `fs.readFile` would load 2GB into memory; `fs.createReadStream(file).pipe(res)` streams it chunk by chunk with constant memory. `pipe()` also handles **backpressure** automatically (pausing the source when the destination is slow).

### Q7. What is middleware chaining / how does `require` caching work? (common quick-fire)
**A:** `require` loads a module once and **caches** it (keyed by resolved path) — subsequent `require`s of the same module return the same exported object. That's why a module can act as a singleton (e.g., a shared DB connection).

### Q8. Callback hell — what is it and how do we avoid it?
**A:** Deeply nested callbacks that are hard to read and error-handle. Solutions: **Promises** (`.then` chains flatten nesting), **async/await** (reads like synchronous code, use `try/catch` for errors), and `Promise.all` for parallel operations.

### Q9. Difference between `Promise.all`, `Promise.allSettled`, `Promise.race`, `Promise.any`?
**A:**
- `Promise.all` — resolves when **all** resolve; rejects immediately if **any** rejects (fail-fast)
- `Promise.allSettled` — waits for all, never rejects; returns `{status, value/reason}` per promise
- `Promise.race` — settles with the **first** to settle (resolve or reject) — useful for timeouts
- `Promise.any` — resolves with the first to **resolve**; rejects only if all reject

### Q10. How do you handle uncaught errors in Node?
**A:** For async/await, wrap in `try/catch` (or an Express error-handling wrapper). Globally: `process.on('uncaughtException')` and `process.on('unhandledRejection')` — log the error and **gracefully shut down** (finish in-flight requests, close DB connections, exit), letting a process manager (PM2, Docker restart policy, Kubernetes) restart the app. You should not continue running after an uncaught exception because the app may be in a corrupted state.

### Q11. How would you scale a Node.js application?
**A:**
- **Vertically within a machine:** `cluster` module or PM2 cluster mode — one worker per CPU core
- **Horizontally:** multiple instances behind a load balancer (Nginx/ALB); keep the app **stateless** (sessions in Redis, not memory)
- **Caching:** Redis for hot data, HTTP caching headers
- **Offload heavy work:** queues (Bull/RabbitMQ/SQS) for background jobs; worker_threads for CPU tasks
- **DB optimization:** connection pooling, indexes, read replicas

### Q12. What is a memory leak in Node and how do you find one?
**A:** Memory that's no longer needed but never released — common causes: global variables that keep growing, forgotten timers/listeners (`EventEmitter` leak warning), closures holding large objects, unbounded in-memory caches. Detect with: monitoring RSS/heap over time, `node --inspect` + Chrome DevTools heap snapshots (compare two snapshots to see what's growing), or tools like `clinic.js`.

### Q13. `module.exports` vs `exports`? CommonJS vs ES Modules?
**A:** `exports` is just a reference to `module.exports`. Assigning `exports = {...}` breaks the reference; the module still exports the original `module.exports`. CommonJS (`require`/`module.exports`) is synchronous and dynamic; ES Modules (`import`/`export`) are static (analyzable at parse time, enabling tree-shaking), support top-level `await`, and are the modern standard (`"type": "module"` or `.mjs`).

---

## 2. Express.js & REST API Design

### Q14. What is middleware in Express?
**A:** A function with signature `(req, res, next)` that runs during the request/response cycle. It can modify `req`/`res`, end the response, or call `next()` to pass control on. Types: application-level (`app.use`), router-level, error-handling (4 args: `(err, req, res, next)`), built-in (`express.json()`), and third-party (`cors`, `helmet`, `morgan`). Order of registration matters — middleware runs top to bottom.

### Q15. How does error handling work in Express?
**A:** Define an error middleware with 4 parameters **last**:
```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});
```
Synchronous errors are caught automatically. For async errors in Express 4, you must call `next(err)` (or use a wrapper like `express-async-handler`); Express 5 forwards rejected promises automatically.

### Q16. What are REST principles? What makes an API RESTful?
**A:**
- **Resources** identified by URLs (nouns, not verbs): `/users/42/orders`
- **HTTP methods** express intent: GET (read), POST (create), PUT (full replace), PATCH (partial update), DELETE
- **Statelessness** — each request carries everything needed (token, params); no server-side session tied to a client
- **Proper status codes**: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Validation, 500 Server Error
- Consistent JSON structure, versioning (`/api/v1/`), pagination/filtering/sorting via query params

### Q17. PUT vs PATCH? GET vs POST idempotency?
**A:** PUT replaces the whole resource (idempotent — same request repeated gives same result). PATCH applies a partial update. GET, PUT, DELETE are idempotent; POST is not (repeating it creates duplicates).

### Q18. How do you design pagination?
**A:** Two approaches:
- **Offset-based:** `?page=2&limit=20` → SQL `LIMIT 20 OFFSET 20`. Simple, but slow for deep pages and can skip/duplicate rows if data changes.
- **Cursor-based:** `?after=<lastId>&limit=20` → `WHERE id > lastId ORDER BY id LIMIT 20`. Stable and fast for infinite scroll / large datasets.
Return metadata: `{ data, total, page, hasNext }` or `nextCursor`.

### Q19. How do you validate incoming requests?
**A:** Validate at the boundary using a schema library — **Joi**, **Zod**, or `express-validator` — as middleware before the controller. Reject with 400/422 and clear field-level messages. Never trust client input: also sanitize (prevent NoSQL injection like `{$gt: ""}` in Mongo queries) and use parameterized queries in SQL.

### Q20. How do you secure an Express API? (very common)
**A:**
- **helmet** for secure HTTP headers; **cors** configured with an allowlist, not `*` in production
- **Rate limiting** (`express-rate-limit`) and request size limits (`express.json({limit})`)
- Input validation + parameterized queries (SQLi) + output encoding (XSS)
- HTTPS everywhere; secrets in env vars / secret manager, never in code
- JWT/session auth with proper expiry; hash passwords with **bcrypt**
- Keep dependencies patched (`npm audit`)

### Q21. How do you structure a Node/Express project?
**A:** Layered structure so business logic isn't stuck in route handlers:
```
src/
  routes/        → route definitions
  controllers/   → parse req, call service, send res
  services/      → business logic
  models/        → DB schemas/queries
  middlewares/   → auth, validation, error handler
  utils/, config/
```
Controllers stay thin; services are testable in isolation.

---

## 3. Authentication & Authorization

### Q22. Authentication vs Authorization?
**A:** Authentication = **who are you** (verifying identity — login). Authorization = **what are you allowed to do** (permissions — e.g., only admins can delete users). AuthN happens first; AuthZ on every protected action.

### Q23. How does JWT authentication work?
**A:**
1. User logs in with credentials → server verifies → signs a JWT (header.payload.signature) with a secret/private key
2. Client stores it and sends it on every request: `Authorization: Bearer <token>`
3. Middleware verifies the signature and expiry (`jwt.verify`) — no DB lookup needed, which makes it **stateless** and scalable
The payload is only **base64-encoded, not encrypted** — never put secrets in it. Use short expiry (e.g., 15 min) plus a **refresh token** (long-lived, stored securely, ideally httpOnly cookie) to get new access tokens. Logout/revocation is the known weakness — handled via short expiry or a token blacklist in Redis.

### Q24. JWT vs session-based auth?
**A:** Sessions store state server-side (session ID in a cookie, data in memory/Redis) — easy to revoke, but needs shared session storage when scaling. JWT is stateless — scales easily, works well for mobile and microservices, but harder to revoke before expiry. Many systems combine: JWT access token + server-tracked refresh token.

### Q25. Where should the frontend store a JWT?
**A:** Trade-off: `localStorage` is easy but vulnerable to **XSS** (any injected script can read it). An **httpOnly, Secure, SameSite cookie** can't be read by JS (XSS-safe) but needs **CSRF** protection. Best practice commonly cited: refresh token in httpOnly cookie, access token in memory. In React Native: use **Keychain (iOS) / Keystore (Android)** via libraries like `react-native-keychain`, not AsyncStorage for sensitive tokens.

### Q26. How do you implement role-based authorization (RBAC)?
**A:** Include the role in the JWT payload or fetch it per request, then guard routes with middleware:
```js
const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Forbidden' });

app.delete('/users/:id', authenticate, authorize('admin'), deleteUser);
```
401 = not logged in; 403 = logged in but not allowed.

### Q27. What is OAuth 2.0 in simple terms?
**A:** A delegation framework — "Login with Google" — where the app never sees your Google password. Flow (authorization code): app redirects to provider → user consents → provider redirects back with a code → server exchanges the code for an access token → uses it to fetch profile/APIs. OpenID Connect adds the identity layer (ID token) on top.

---

## 4. Angular (Refresher + Interview Depth)

> You used Angular ~2 years ago — expect fundamentals first, then a few deep ones. Say upfront that you've been on other stacks recently but are comfortable ramping back; then answer confidently.

### Q28. What are the building blocks of an Angular app?
**A:** **Components** (view + logic, `@Component` with template/styles), **Modules** (`@NgModule` grouping — or standalone components in modern Angular 14+), **Services** (shared logic/data, injected via DI), **Directives** (behavior added to DOM), **Pipes** (transform values in templates), **Router** (navigation). The app bootstraps from a root module/component.

### Q29. Explain Angular's data binding types.
**A:** Four types:
- **Interpolation:** `{{ user.name }}` (component → view)
- **Property binding:** `[disabled]="isSaving"` (component → view)
- **Event binding:** `(click)="save()"` (view → component)
- **Two-way binding:** `[(ngModel)]="name"` — sugar for property + event binding

### Q30. What is dependency injection in Angular?
**A:** Angular creates and provides class dependencies instead of you `new`-ing them. Declare a service `@Injectable({ providedIn: 'root' })` (singleton app-wide) and ask for it in a constructor: `constructor(private api: ApiService)`. Benefits: loose coupling, easy mocking in tests, controlled instance scope (root vs component-level providers).

### Q31. Component communication — parent ↔ child?
**A:**
- Parent → child: `@Input() item: Item;`
- Child → parent: `@Output() saved = new EventEmitter<Item>();` then `this.saved.emit(item)`
- Unrelated components: a **shared service with a Subject/BehaviorSubject** (or a state library like NgRx)
- Parent grabbing child instance: `@ViewChild`

### Q32. What are Angular lifecycle hooks?
**A:** Most important: `ngOnInit` (after first `@Input`s set — do init/API calls here, not in constructor), `ngOnChanges` (whenever `@Input`s change), `ngAfterViewInit` (view + children ready), `ngOnDestroy` (cleanup — **unsubscribe from Observables here** to prevent memory leaks).

### Q33. What is RxJS? Observable vs Promise?
**A:** RxJS is the reactive library Angular uses heavily (HttpClient, Router events, forms). An **Observable** can emit **multiple values over time**, is **lazy** (nothing runs until subscribed), and is **cancellable** (unsubscribe); a Promise resolves once, eagerly, and can't be cancelled. Key operators: `map`, `filter`, `switchMap` (cancel previous inner request — perfect for search-as-you-type), `mergeMap`, `debounceTime`, `catchError`, `takeUntil` (auto-unsubscribe pattern).

### Q34. Classic Angular search-box pattern? (practical favorite)
**A:**
```ts
this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.api.search(term)),
  takeUntil(this.destroy$)
).subscribe(results => this.results = results);
```
`debounceTime` waits for typing pause, `distinctUntilChanged` skips repeats, `switchMap` cancels stale requests.

### Q35. Template-driven vs Reactive forms?
**A:** Template-driven: logic in the template with `ngModel` — quick for simple forms. **Reactive forms**: form model built in the class (`FormGroup`, `FormControl`, `FormBuilder`) — better for complex forms: dynamic controls, custom/cross-field validators, easier unit testing, values as Observables. At 4+ yrs experience, say you prefer reactive forms for anything non-trivial.

### Q36. What are route guards and interceptors?
**A:**
- **Guards** control navigation: `CanActivate` (block route if not logged in), `CanDeactivate` (unsaved-changes warning), `Resolve` (prefetch data)
- **HTTP Interceptors** sit on every HttpClient request/response — attach the JWT `Authorization` header, show a global loader, catch 401s and redirect to login, centralized error handling

### Q37. What is change detection? What does `OnPush` do?
**A:** Angular re-checks component bindings when events/HTTP/timers fire (zone.js triggers it). Default strategy checks the whole tree. `ChangeDetectionStrategy.OnPush` only checks a component when its `@Input` **reference** changes, an event fires inside it, or an async pipe emits — big performance win for large lists, but requires immutable update patterns (create new objects/arrays instead of mutating).

### Q38. How do you optimize an Angular app's performance?
**A:** Lazy-loading feature routes (`loadChildren`), `OnPush` change detection, `trackBy` in `*ngFor` (avoid re-rendering whole lists), async pipe instead of manual subscriptions, AOT build (default), bundle analysis + tree shaking, virtual scrolling (CDK) for huge lists, image lazy loading, pure pipes over method calls in templates.

### Q39. What's new-ish in Angular you're aware of? (shows you're current)
**A:** **Standalone components** (no NgModules needed), **Signals** (fine-grained reactivity as a simpler alternative to zone-based change detection), new built-in control flow (`@if`, `@for` replacing `*ngIf`/`*ngFor`), `inject()` function as an alternative to constructor injection. Honest framing: "I used Angular 12-ish in production; I've kept up with the direction — standalone components and Signals — and would ramp up quickly."

### Q40. What is a pipe? Pure vs impure?
**A:** Pipes transform display values: `{{ price | currency:'INR' }}`, `{{ date | date:'dd/MM/yyyy' }}`. Custom pipes implement `PipeTransform`. **Pure pipes** (default) re-run only when input reference changes — fast. **Impure pipes** run every change-detection cycle — avoid unless necessary.

---

## 5. TypeScript

### Q41. Why TypeScript over JavaScript?
**A:** Static typing catches bugs at compile time (typos, wrong argument types, null access), enables great editor tooling (autocomplete, safe refactors), makes code self-documenting via interfaces, and scales better for teams. It compiles to plain JS, so runtime is unchanged.

### Q42. `interface` vs `type`?
**A:** Mostly interchangeable for object shapes. `interface` supports **declaration merging** and reads naturally for OO-style contracts and `implements`. `type` handles **unions** (`type Status = 'active' | 'inactive'`), intersections, mapped and conditional types. Common convention: interfaces for object/public API shapes, type aliases for unions/utilities.

### Q43. `any` vs `unknown` vs `never`?
**A:** `any` opts out of type checking entirely (avoid). `unknown` is the safe counterpart — you must narrow it (typeof/instanceof checks) before use. `never` means "can't happen" — a function that always throws, or the leftover type after exhaustive narrowing (useful for exhaustive switch checks).

### Q44. What are generics? Give a practical example.
**A:** Generics parameterize types so code is reusable **and** type-safe:
```ts
async function fetchApi<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return res.json() as Promise<T>;
}
const users = await fetchApi<User[]>('/api/users'); // typed!
```

### Q45. Useful utility types?
**A:** `Partial<T>` (all optional — update DTOs), `Pick<T, K>` / `Omit<T, K>` (derive DTOs from models, e.g., `Omit<User, 'password'>`), `Readonly<T>`, `Record<K, V>` (typed maps), `ReturnType<F>`. These keep DTOs in sync with a single source-of-truth model.

### Q46. What are `strict` mode benefits? Optional chaining / nullish coalescing?
**A:** `strict: true` enables `strictNullChecks` etc. — `null`/`undefined` must be handled explicitly, eliminating a whole class of runtime errors. `user?.address?.city` safely short-circuits to `undefined`; `value ?? 'default'` falls back **only** on `null`/`undefined` (unlike `||`, which also treats `0`, `''`, `false` as falsy).

---

## 6. React Native

### Q47. How does React Native work under the hood?
**A:** You write React components in JS/TS; RN renders **real native UI widgets** (not WebViews). Historically, JS and native sides talked over an async **bridge** (serialized JSON messages). The **New Architecture** replaces this with **JSI** (JavaScript Interface — direct, synchronous C++ bindings), **Fabric** (new renderer), and **TurboModules** (lazy-loaded native modules), reducing serialization overhead significantly. Hermes is the optimized JS engine used by default.

### Q48. React Native vs native development vs Flutter — when to choose RN?
**A:** RN: one JS/TS codebase for iOS + Android, shared skills with web React, faster iteration (Fast Refresh), OTA-updatable JS. Choose native when you need heavy platform-specific features, maximum performance (games, AR), or intense background processing. Flutter uses Dart and its own rendering engine — great consistency, but RN wins when your team already knows React.

### Q49. Core components — RN vs web equivalents?
**A:** `<View>` ≈ div, `<Text>` ≈ span/p (all text must be inside Text), `<Image>`, `<TextInput>`, `<ScrollView>` (renders all children), `<FlatList>` (virtualized list), `<TouchableOpacity>`/`<Pressable>` for taps. Styling via `StyleSheet.create` — flexbox by default (`flexDirection: 'column'` default, unlike web's row), no CSS cascade, dimensions are unitless density-independent pixels.

### Q50. `ScrollView` vs `FlatList`? (guaranteed question)
**A:** `ScrollView` renders **all** children at once — fine for a small, fixed set. `FlatList` **virtualizes**: renders only items near the viewport, recycles views as you scroll — required for long/dynamic lists. FlatList also gives `keyExtractor`, `onEndReached` (infinite scroll), `refreshing`/`onRefresh` (pull-to-refresh), `ListHeaderComponent`, etc.

### Q51. How do you optimize React Native performance? (explicitly in the JD)
**A:**
- **Lists:** FlatList with `keyExtractor`, `getItemLayout` (skip measurement), `windowSize`/`initialNumToRender` tuning, memoized `renderItem`
- **Re-renders:** `React.memo`, `useCallback`/`useMemo` so child props stay referentially stable
- **Images:** proper sizing, caching (e.g., `expo-image` / FastImage), lazy loading
- **JS thread:** avoid heavy computation during scroll/animations; use `InteractionManager`
- **Animations:** `useNativeDriver: true` with Animated, or **Reanimated** (runs worklets on the UI thread — no bridge hops)
- **Hermes** engine + New Architecture; measure with Flipper/DevTools before optimizing
- Watch for console.log left in production (it's slow over the bridge)

### Q52. How does navigation work in React Native?
**A:** **React Navigation** is the standard: `NavigationContainer` wraps the app; navigators — **Stack** (push/pop screens), **Bottom Tabs**, **Drawer** — can be nested. Navigate with `navigation.navigate('Details', { id })`; read params via `route.params`. Deep linking maps URLs to screens. Alternative: Expo Router (file-based).

### Q53. How do you handle platform-specific code?
**A:** `Platform.OS === 'ios'` checks, `Platform.select({ ios: ..., android: ... })` for styles, or platform-specific files: `Component.ios.tsx` / `Component.android.tsx` — the bundler picks the right one automatically.

### Q54. How do you store data locally in RN? Secure storage?
**A:** **AsyncStorage** for non-sensitive key-value data (preferences, cache). **Keychain/Keystore** (via `react-native-keychain` or `expo-secure-store`) for tokens/credentials. For structured offline data: SQLite, WatermelonDB, Realm, or MMKV (fast key-value).

### Q55. How do you debug a React Native app?
**A:** Fast Refresh for iteration; React Native DevTools / Flipper (network inspector, layout, logs); `console.log` + Metro logs; error boundaries + crash reporting in production (Sentry/Crashlytics); performance monitor overlay (JS FPS vs UI FPS — tells you which thread is the bottleneck).

### Q56. What do you know about the app release process? (JD "nice to have")
**A:** Android: generate a signed **AAB** with a release keystore → Play Console → internal testing track → staged rollout to production. iOS: Xcode archive with distribution certificate + provisioning profile → App Store Connect → TestFlight → App Review. Version bumps (versionCode/buildNumber), release notes, and OTA JS updates via CodePush/EAS Update for non-native changes. (If you haven't done it yourself: "I understand the process — signing, store consoles, staged rollouts, TestFlight — though releases were handled by a dedicated team member in my last project.")

### Q57. Common React hooks questions (apply to RN too):
**A:**
- `useState` — local state; updates are async-ish and batched; use functional form `setCount(c => c + 1)` when depending on previous value
- `useEffect` — side effects after render; dependency array controls when it runs; return a **cleanup** function (unsubscribe, clearTimeout); empty array `[]` = run once on mount
- `useMemo` / `useCallback` — memoize values/functions to keep references stable and skip expensive recomputation
- `useRef` — mutable value that survives renders without causing re-renders; also for accessing component instances (e.g., focusing a TextInput)
- `useContext` — read shared context (theme, auth) without prop drilling
- Custom hooks — extract reusable stateful logic (e.g., `useDebounce`, `useFetch`)

---

## 7. HTML5 / CSS3 / Responsive Design

### Q58. Key HTML5 features?
**A:** Semantic elements (`header, nav, main, section, article, footer` — better accessibility and SEO), form input types (`email, date, number` with built-in validation), `localStorage`/`sessionStorage`, canvas/SVG, audio/video, data attributes.

### Q59. Flexbox vs Grid?
**A:** **Flexbox** = one-dimensional (row **or** column): navbars, toolbars, centering, distributing space (`justify-content`, `align-items`, `gap`). **Grid** = two-dimensional (rows **and** columns): page layouts, card grids (`grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))`). They combine well — Grid for the page, Flexbox inside components.

### Q60. How do you make a site responsive?
**A:** Mobile-first CSS with `min-width` media queries; fluid layouts (%, fr, flex) over fixed px; relative units (`rem`, `em`, `clamp()` for fluid type); responsive images (`max-width: 100%`, `srcset`); `<meta name="viewport" content="width=device-width, initial-scale=1">`; test at real breakpoints. Avoid horizontal page scroll — wide tables get their own `overflow-x: auto` container.

### Q61. CSS specificity and the box model?
**A:** Specificity order: inline styles > IDs > classes/attributes/pseudo-classes > elements. `!important` overrides all (avoid). Box model: content + padding + border + margin; `box-sizing: border-box` makes width include padding/border (standard practice).

### Q62. `position` values? Centering a div (classic)?
**A:** `static` (default), `relative` (offset from itself, creates positioning context), `absolute` (positioned against nearest non-static ancestor), `fixed` (viewport), `sticky` (scrolls then sticks). Centering: `display: flex; justify-content: center; align-items: center;` on the parent — or `display: grid; place-items: center;`.

---

## 8. Databases — SQL (MySQL/PostgreSQL)

### Q63. Explain SQL JOINs.
**A:**
- **INNER JOIN** — only rows with matches in both tables
- **LEFT JOIN** — all left rows + matched right rows (NULLs where no match) — e.g., all users including those with zero orders
- **RIGHT JOIN** — mirror of left
- **FULL OUTER JOIN** — all rows from both sides
- **CROSS JOIN** — cartesian product

### Q64. Classic query: second-highest salary.
**A:**
```sql
SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
-- or, handles ties & Nth generally:
SELECT DISTINCT salary FROM employees
ORDER BY salary DESC LIMIT 1 OFFSET 1;
```

### Q65. Classic query: find duplicate emails / department-wise counts.
**A:**
```sql
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;

SELECT department, COUNT(*) AS cnt, AVG(salary)
FROM employees GROUP BY department HAVING COUNT(*) > 5;
```
`WHERE` filters rows **before** grouping; `HAVING` filters groups **after** aggregation.

### Q66. What are indexes? Trade-offs?
**A:** An index (typically a B-tree) lets the DB find rows without scanning the whole table — like a book index. Index columns used in `WHERE`, `JOIN ON`, `ORDER BY`. Composite indexes follow the **leftmost-prefix rule** (index on `(a, b)` serves queries filtering on `a` or `a AND b`, not `b` alone). Trade-offs: slower writes (every INSERT/UPDATE maintains the index) and extra storage — don't index everything. Diagnose with `EXPLAIN`.

### Q67. What is a transaction? ACID?
**A:** A group of statements that succeed or fail as one unit (`BEGIN … COMMIT / ROLLBACK`). **ACID**: **Atomicity** (all or nothing — money leaves account A only if it reaches B), **Consistency** (constraints hold before and after), **Isolation** (concurrent transactions don't corrupt each other — isolation levels trade correctness vs performance), **Durability** (committed data survives crashes).

### Q68. What is normalization? When would you denormalize?
**A:** Organizing tables to remove redundancy: 1NF (atomic values), 2NF (no partial dependency on composite key), 3NF (no transitive dependencies — non-key columns depend only on the key). Denormalize deliberately for read-heavy workloads (reporting tables, caching computed totals) when JOIN cost hurts, accepting managed redundancy.

### Q69. How do you prevent SQL injection?
**A:** **Parameterized queries / prepared statements** — never concatenate user input into SQL:
```js
db.query('SELECT * FROM users WHERE email = ?', [email]); // safe
```
ORMs/query builders (Sequelize, Prisma, Knex) parameterize by default. Also: least-privilege DB users, input validation.

### Q70. How would you find and fix a slow query?
**A:** Run `EXPLAIN` (`EXPLAIN ANALYZE` in Postgres) to see the plan — look for full table scans on large tables. Fixes: add the right index, rewrite the query (avoid `SELECT *`, avoid functions on indexed columns in WHERE, avoid leading-wildcard `LIKE '%x'`), paginate, batch N+1 query patterns into JOINs or `WHERE id IN (...)`, add caching for hot reads.

---

## 9. Databases — MongoDB

### Q71. SQL vs MongoDB — when do you choose which?
**A:** SQL: structured relational data, strong consistency, complex multi-table transactions and reporting (payments, inventory). MongoDB: flexible/evolving schemas, document-shaped data (a product with nested variants), rapid iteration, horizontal scaling via sharding. Real answer: many systems use both — relational core + Mongo for flexible/high-volume documents. Note MongoDB **does** support multi-document ACID transactions since 4.0, but its sweet spot is when a document boundary matches the transaction boundary.

### Q72. Basic MongoDB CRUD? (be ready to write these)
**A:**
```js
db.users.insertOne({ name: 'Asha', age: 28, skills: ['node'] });
db.users.find({ age: { $gte: 25 }, skills: 'node' }).sort({ age: -1 }).limit(10);
db.users.updateOne({ _id: id }, { $set: { age: 29 }, $push: { skills: 'angular' } });
db.users.deleteOne({ _id: id });
```
Operators: `$gt/$gte/$lt/$in/$ne`, `$and/$or`, `$set/$inc/$push/$pull`, `$exists`, `$regex`.

### Q73. Embedding vs referencing documents?
**A:** **Embed** when data is accessed together and bounded in size (order + its line items, user + addresses) — one read, atomic update. **Reference** (store an ObjectId, resolve with `$lookup` or app-side) when data is shared across parents, unbounded (a user's ever-growing activity log), or updated independently. Rule of thumb: "data that's read together, stays together" — but respect the 16MB document limit.

### Q74. What is the aggregation pipeline?
**A:** A data-processing pipeline of stages — Mongo's GROUP BY and more:
```js
db.orders.aggregate([
  { $match: { status: 'delivered' } },
  { $group: { _id: '$customerId', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  { $sort: { total: -1 } },
  { $limit: 5 }
]);
```
Other stages: `$project` (reshape), `$lookup` (join), `$unwind` (flatten arrays), `$facet`.

### Q75. Indexes in MongoDB?
**A:** Same concept as SQL — `db.users.createIndex({ email: 1 }, { unique: true })`. Compound indexes follow prefix rules; also text indexes, TTL indexes (auto-expiring docs — great for sessions/OTPs), and partial indexes. Check usage with `.explain('executionStats')` — look for IXSCAN vs COLLSCAN.

### Q76. What is Mongoose and why use it?
**A:** An ODM for Node: schemas add structure/validation on top of schemaless Mongo, plus middleware hooks (e.g., hash password `pre('save')`), instance/static methods, `populate()` for references, and TypeScript-friendly models.

---

## 10. Microservices (Easy Questions)

> You said you haven't worked with microservices — these are fundamentals-level Q&As you can learn and answer confidently. If asked directly, be honest: "My production experience is with well-structured monoliths, but I understand the concepts well" — then demonstrate with these.

### Q77. What are microservices, in simple terms?
**A:** An architecture where an application is split into **small, independent services**, each owning one business capability (users, orders, payments, notifications), running as its own process, communicating over the network (usually HTTP/REST or message queues). Each can be **developed, deployed, and scaled independently**. Contrast with a monolith: one codebase, one deployable unit.

### Q78. What are the main advantages of microservices?
**A:**
- **Independent deployment** — ship the payment service without redeploying everything
- **Independent scaling** — scale only the busy service (e.g., orders on a sale day)
- **Fault isolation** — one service crashing doesn't necessarily take down the whole app
- **Team autonomy** — small teams own services end to end
- **Tech flexibility** — each service can pick its own stack/database if justified

### Q79. What are the disadvantages? (asking this shows maturity)
**A:** Distributed-system complexity: network calls can fail/time out, debugging spans multiple services, data consistency across services is hard (no single DB transaction), operational overhead (many deployments, monitoring, service discovery), and latency from inter-service calls. That's why the common advice is: **start with a modular monolith, split when you have a real reason** (team size, scaling hotspots).

### Q80. How do microservices communicate with each other?
**A:** Two styles:
- **Synchronous** — direct HTTP/REST (or gRPC) calls: simple, but the caller waits and is coupled to the callee's availability
- **Asynchronous** — messages/events via a broker (RabbitMQ, Kafka, SQS): the order service publishes "OrderPlaced", the notification service consumes it later. Loose coupling, resilient to downtime, but eventually consistent

### Q81. What is an API Gateway?
**A:** A single entry point in front of all services. Clients call the gateway; it routes to the right service. It centralizes cross-cutting concerns: authentication, rate limiting, SSL, request logging, and response aggregation (one client call fanned out to multiple services). Examples: Nginx, Kong, AWS API Gateway. Without it, clients would need to know every service's address.

### Q82. How is data managed in microservices?
**A:** **Database-per-service** — each service owns its data and others access it only through the service's API, never its tables directly. This keeps services decoupled. The cost: no cross-service JOINs or transactions — you use API composition or events to share data, and accept **eventual consistency** for cross-service workflows.

### Q83. What happens if one service is down and another depends on it?
**A:** Design for failure: **timeouts** (don't wait forever), **retries with backoff** (careful — only for idempotent calls), **circuit breaker** (after repeated failures, stop calling and fail fast, retry later), **fallbacks** (serve cached/default data), and async messaging so work queues up instead of failing. This resilience mindset is the core difference from in-process calls.

### Q84. How do services find each other? (one-liner is enough)
**A:** **Service discovery** — a registry (Consul, Eureka) or the platform handles it (Kubernetes gives each service a stable DNS name; cloud load balancers do similar).

### Q85. Monolith vs microservices — how would you decide?
**A:** Honest, practical answer: for a small team/new product, a **well-modularized monolith** is faster to build and operate. Move to microservices when there's a concrete driver: parts of the system need independent scaling, multiple teams stepping on each other, or different availability requirements. "Microservices solve organizational and scaling problems — they add complexity, so you should feel the pain first."

### Q86. Have you heard of Docker's role in microservices?
**A:** Each service is packaged as a **container** — its code plus dependencies — so it runs identically everywhere. Containers are lightweight (share the host kernel, unlike VMs), start fast, and an orchestrator (Kubernetes / ECS) schedules, scales, and restarts them. `docker-compose` runs a multi-service stack locally with one command.

---

## 11. Git, CI/CD, Docker & Cloud

### Q87. Explain your Git branching workflow.
**A:** Feature-branch workflow: branch from `main` (`feature/JIRA-123-add-login`), commit small logical changes, push, open a **pull request**, get code review + CI passing, then merge (squash or merge commit per team convention). Hotfixes branch from main and merge back fast. Mention: meaningful commit messages, pulling/rebasing regularly to avoid big conflicts.

### Q88. `merge` vs `rebase`?
**A:** `merge` combines branches with a merge commit — preserves true history, safe for shared branches. `rebase` replays your commits on top of the target — linear, clean history, but **rewrites commits**, so never rebase a branch others have pulled. Typical: rebase your local feature branch onto main before opening the PR, merge the PR itself.

### Q89. How do you undo things in Git?
**A:** `git restore <file>` (discard working changes), `git reset --soft HEAD~1` (undo commit, keep changes staged), `git revert <sha>` (new commit that undoes — the safe choice on shared branches), `git stash` (shelve WIP), `git cherry-pick <sha>` (copy one commit), `git reflog` (recover "lost" commits).

### Q90. How do you resolve a merge conflict?
**A:** Git marks conflicting sections with `<<<<<<< / ======= / >>>>>>>`. Open each file, decide the correct combined result (sometimes both changes, sometimes one), remove markers, test, `git add`, and complete the merge/rebase. Prevention: small PRs, frequent syncs with main, talking to the teammate whose code conflicts.

### Q91. What is CI/CD? Describe a typical pipeline.
**A:** **Continuous Integration** — every push automatically builds and tests, so integration problems surface immediately. **Continuous Delivery/Deployment** — passing builds are automatically prepared for (or pushed to) production. Typical pipeline (GitHub Actions/Jenkins/GitLab): checkout → install deps → lint → unit tests → build → build Docker image → deploy to staging → (approval) → deploy to production. Benefits: fast feedback, repeatable releases, no "works on my machine".

### Q92. What cloud services have you used / would you use for a Node app? (AWS-flavored)
**A:** Compute: **EC2** (VMs) or **ECS/Fargate** (containers) or Lambda (serverless functions); **S3** for file storage; **RDS** for managed SQL / DocumentDB or Atlas for Mongo; **ElastiCache** (Redis) for caching/sessions; **ALB** load balancer + auto scaling; **CloudWatch** logs/metrics; Route 53 DNS; secrets in Parameter Store/Secrets Manager. Azure/GCP have direct equivalents (App Service/Cloud Run, Blob/GCS, etc.).

### Q93. Environment variables and config — how do you manage them?
**A:** Never commit secrets. Local: `.env` + `dotenv`, with `.env` in `.gitignore` and a committed `.env.example`. Deployed: injected by the platform (CI secrets, ECS task definitions, Kubernetes secrets, cloud secret managers). Config varies per environment (dev/staging/prod); code reads only `process.env`.

---

## 12. Testing & Debugging

### Q94. What kinds of tests do you write?
**A:** The pyramid: many **unit tests** (pure logic, services — fast, isolated, mock dependencies), fewer **integration tests** (API endpoint + real/in-memory DB — e.g., Supertest hitting Express routes), few **E2E tests** (real user flows — Cypress/Playwright for web, Detox for RN). Aim to test behavior, not implementation details.

### Q95. How do you unit test a Node service? Example tools?
**A:** **Jest** (runner + assertions + mocking) or Vitest. Mock external dependencies (DB, HTTP) with `jest.mock` / dependency injection so tests are fast and deterministic:
```js
test('creates user with hashed password', async () => {
  const repo = { save: jest.fn().mockResolvedValue({ id: 1 }) };
  const svc = new UserService(repo);
  await svc.register('a@b.com', 'secret');
  expect(repo.save).toHaveBeenCalledWith(
    expect.objectContaining({ email: 'a@b.com' })
  );
});
```
For APIs: **Supertest** — `await request(app).post('/users').send({...}).expect(201)`.

### Q96. How do you test React/React Native components? Angular?
**A:** React/RN: **React Testing Library** (`@testing-library/react-native`) — render the component, interact the way a user would (`fireEvent.press`), assert on visible output; avoids testing internals. Angular: **Jasmine/Karma** (or Jest) with `TestBed` to configure the testing module, mock services via DI, and component fixtures for DOM assertions.

### Q97. Walk me through debugging a production issue. (behavioral-technical hybrid)
**A:** Structured answer: (1) **Reproduce/scope** — which users, since when, error rate; check monitoring/alerts. (2) **Logs & traces** — correlate by request ID/timestamp; recent deploys are the first suspect (diff what changed). (3) **Isolate** — reproduce in staging with the same data. (4) **Mitigate first if severe** — rollback/feature-flag off, then root-cause. (5) **Fix + test + deploy**, and (6) **prevent** — add a regression test, alert, or validation so it can't silently recur. Give a real example from your experience if possible.

---

## 13. Agile / Scrum & Behavioral

### Q98. Describe the Scrum ceremonies you've participated in.
**A:** **Sprint planning** (pick and estimate stories for the sprint), **daily stand-up** (yesterday/today/blockers, ~15 min), **sprint review/demo** (show working software to stakeholders), **retrospective** (what went well / improve), plus **backlog refinement** (clarify and estimate upcoming stories). Mention estimating with story points and working with a definition of done.

### Q99. "Tell me about yourself." (prepare a 90-second version)
**A:** Structure: current role and years → core stack (Node.js backend, React/React Native front-end, SQL/Mongo) → 1–2 concrete achievements with impact ("built X API serving Y users", "cut list-render jank on mobile by doing Z") → why this role ("full stack across web and mobile is exactly the breadth I enjoy"). Practice it out loud.

### Q100. "Tell me about a challenging bug/production issue you solved." (STAR format)
**A:** Pick a real story and structure it: **S**ituation (what broke, impact), **T**ask (your responsibility), **A**ction (how you diagnosed — logs, isolation, hypothesis testing), **R**esult (fix + measurable outcome + prevention added). Have 2–3 STAR stories ready: a hard bug, a conflict/disagreement resolved, a deadline/priority trade-off.

### Q101. "How do you handle disagreements on technical decisions?"
**A:** Discuss trade-offs with data, not opinions — small POC or benchmarks if cheap; defer to team conventions and the person owning the consequence; disagree and commit once decided. Give one concrete example.

### Q102. "You have a production bug and a sprint deadline — what do you do?"
**A:** Assess severity/impact first. If it affects users or data, production comes first — communicate to the scrum master/PO immediately so sprint scope can be adjusted transparently, mitigate (rollback/flag), then root-cause. If minor, ticket it, prioritize in the next planning. Key point: **communicate early**, don't silently absorb both.

### Q103. Questions YOU should ask the interviewer:
- What does the team structure look like — how are web, mobile, and backend responsibilities split?
- What does the deployment process look like today (CI/CD maturity, release cadence)?
- What's the biggest technical challenge the team is facing right now?
- How is the Angular/RN codebase versioned — are you on recent versions or is migration ongoing?
- What does success look like in the first 90 days for this role?

---

## 14. Likely Machine Coding / Practical Questions

Ones that match this JD (practice in this repo!):

### Frontend (React/Angular)
1. **Todo app** with add/edit/delete/filter + persistence (you have one here — be ready to walk through it)
2. **Debounced search** with API call + cancel stale requests (`switchMap` in Angular / AbortController or flag in React)
3. **Accordion / Tabs / Modal** — accessible, reusable component design (you've built Accordion — review it)
4. **Infinite scroll / paginated list** with loading and error states
5. **Nested comments / folder tree** — recursive component rendering (parent-child communication)
6. **Form with validation** — multi-field, cross-field validation, disabled submit
7. **Stopwatch/timer** — `setInterval` + cleanup + drift awareness
8. **Star rating, OTP input, typeahead** — classic component rounds

### Backend (Node)
9. **Design a REST API for a todo/booking/library system** — routes, status codes, validation, auth middleware, folder structure
10. **Rate limiter middleware** — in-memory token bucket / fixed window per IP
11. **URL shortener** — API design + storage + collision handling
12. **File upload endpoint** — multer, size/type validation, S3 mention
13. **Implement `Promise.all` from scratch** / a `retry(fn, times)` helper / a simple event emitter

### JS fundamentals (rapid-fire coding)
14. Debounce and throttle **from scratch** (memorize these)
15. Flatten a nested array/object; deep clone discussion (structuredClone)
16. `Array.prototype.map/filter/reduce` polyfills
17. Closures: counter factory, once(fn), memoize(fn)
18. `this` binding: call/apply/bind, arrow vs regular functions
19. Event loop output-prediction snippets (see Q3)
20. Currying: `sum(1)(2)(3)`

---

## 15. Handling the NestJS Gap Honestly

If asked "Have you used NestJS?", don't bluff — interviewers can tell. A strong honest answer:

> "I haven't used NestJS in production — my Node experience is with Express. I know NestJS is an opinionated framework on top of Express/Fastify that brings Angular-style architecture to the backend — modules, dependency injection, decorators, controllers/providers — which actually maps well to my Angular background. Given that I already know both Express and Angular's DI/decorator patterns, I'm confident I'd be productive in it quickly."

That one paragraph shows: honesty, awareness of what it is, and a credible ramp-up story. Same pattern works for microservices: *"I haven't run microservices in production, but I understand the architecture — independent services, API gateway, async messaging, database-per-service — and the trade-offs versus a monolith."* (Then let the Section 10 answers back you up.)

---

## Final prep checklist

- [ ] Practice saying answers **out loud** — knowing ≠ articulating
- [ ] Re-read your own repo (Todo, Accordion, parent-child, custom hooks) — walk-through questions about *your* code are likely
- [ ] Memorize: debounce/throttle, event-loop outputs, 2nd-highest-salary SQL, JWT flow
- [ ] Refresh Angular hands-on: spin up one small standalone-component app the day before
- [ ] Prepare 3 STAR stories + your 90-second intro
- [ ] Prepare 3 questions to ask them

Good luck! 🚀
