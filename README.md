# PliegoAI

[PliegoAI](https://pliegoai.com) is a public, actively developed B2B product for the early assessment of Spanish public procurement opportunities.

It collects tender information, extracts requirements from source documents and compares them with a company's declared dossier. The result highlights potential eligibility risks, missing information and the evidence behind each conclusion so that a human can decide whether an opportunity deserves further review.

> PliegoAI supports an initial assessment. It does not provide legal advice, guarantee eligibility or eliminate the possibility of model errors.

## Product status

- Public deployment: <https://pliegoai.com>
- API health: <https://api.pliegoai.com/health>
- Status: deployed and under active development
- Adoption: personal testing only; no claim of established customers or commercial adoption
- Product owner and developer: [Luis Arias Mendoza](https://www.linkedin.com/in/luisgam)

`AI-testing-lab` is the historical repository name. The product's final public name is **PliegoAI**.

## What it does

1. Ingests public procurement opportunities and their documents.
2. Extracts structured requirements with Gemini.
3. Anchors model-produced citations to the source document.
4. Compares requirements with evidence declared in a company dossier.
5. Applies deterministic gates for objective blocking or review conditions.
6. Presents potential eligibility, uncertainty and evidence for human review.

## Evidence and model controls

The application does not treat model output as automatically true. The current pipeline includes:

- structured JSON output and strict Zod schema validation;
- rejection of invalid JSON and unexpected output shapes;
- exact citation checks against stored document text;
- filtering of evidence references that do not exist in the supplied dossier;
- deterministic eligibility gates outside the language model;
- explicit `UNKNOWN`, `CONFLICTING` and expert-review states;
- unit tests for fabricated citations, offset tampering and prompt injection.

These controls reduce unsupported output and make failures visible; they do not make the system infallible.

## Technology

- Frontend: React, TypeScript, Vite and Cloudflare Pages
- API: Node.js, Express and TypeScript
- Data: PostgreSQL, Drizzle ORM and row-level tenant isolation
- Authentication: Supabase Auth with verified JWTs
- AI pipeline: Gemini `gemini-3.5-flash-lite`
- Delivery: Docker, Docker Compose and GitHub Actions
- Testing: Node test runner, Vitest and Playwright

## Repository structure

```text
api/       Express API, persistence, extraction and qualification pipeline
frontend/  React application deployed through Cloudflare Pages
docs/      Architecture, product decisions and operational documentation
.github/   CI/CD workflows
```

## Local development

### API

```bash
cd api
npm ci
npm run typecheck
npm run test:unit
npm run dev
```

Copy the required variables into a local `.env` file. Never commit secrets or reuse production credentials for tests.

### Frontend

```bash
cd frontend
npm ci
npm run lint
npm run test:unit
npm run dev
```

Integration tests require an isolated PostgreSQL test database and the test-only variables documented in the repository. Production credentials must not be used.

## AI-first development approach

PliegoAI was built with an AI-first workflow. Luis defined the product requirements, architecture, validation rules, tests and deployment decisions, using Codex, ChatGPT and Antigravity to help implement and review the code. Generated code is treated as untrusted until it is understood, tested and validated against the repository rules.

See [`AGENTS.md`](./AGENTS.md) for the engineering constraints and [`docs/`](./docs/README.md) for the detailed technical documentation.

## License

No open-source license has been granted. The source is publicly visible, but all rights remain reserved unless a license is added later.
