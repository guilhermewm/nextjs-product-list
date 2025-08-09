### Project overview

This is a Next.js app built with TypeScript and Ant Design. It exposes three API routes and a small UI to filter and list products.

### What was implemented

- A single page application that shows to the user a table of Products and filters
- This UI consumes APIs to fill the Table and the possible search elements
- Project was built using Next.js easily providing server and client in the same application
- Jest and react-testing library for unit and component tests
- For this exercise, an in-memory dataset simulates the backend. In production, a persistent data store (e.g., PostgreSQL, MongoDB, or a search engine like Elasticsearch) would back the API, and endpoints might support writes where needed.
- Filtering and search run on the server. This mirrors real systems where large datasets are filtered at the source for scalability, correctness, and security. The client can still apply lightweight refinements on already-fetched results when appropriate.

### Structure

- Main UI is under `src/pages/index.tsx`
- Components are under `src/pages/components`
- Server implementations are under `src/pages/api`
- Tests are under their respective files under `__tests__`

### Running locally

Install deps and run the dev server:

```bash
npm i
npm run dev
```

Run tests:

```bash
npm test
```

### Assumptions

- Data/backend
  - In-memory datastore simulates a backend; data is static, deterministic, and read-only for this exercise.
  - No authentication/authorization; all API routes are public.
  - Only GET endpoints are required;

- Filtering semantics
  - Filtering/search is performed on the server; the client only reflects results.
  - Operators are constrained by property type:
    - string: `equals`, `contains`, `any`, `none`, `in`
    - number: `equals`, `greater_than`, `less_than`, `any`, `none`, `in`
    - enumerated: `equals`, `any`, `none`, `in`
  - Query rules:
    - `propertyId`: numeric and must exist
    - `operator`: must be a supported id
    - `search`: string; for `in` it is comma-separated
    - `contains` is case-insensitive
    - `any`/`none` ignore `search`

- UI behavior
  - URL query acts as the UI state source-of-truth.
  - Search field is shown only when required (hidden for `any`/`none`).
  - No pagination needed given the small dataset.

- Scope and tooling
  - Unit/component tests only (no e2e); mocks for `fetch` and `next/router`.

- Data typing/formatting
  - Enumerated values are strings.
  - Numeric comparisons parse `search` to number; for `in`, numeric comparison uses string inclusion of numeric representation.

### Guided tour

- We have 3 endpoints ready from this project
  - GET `/api/properties`
    - Description: Returns the list of available properties that can be used to filter products.
    - Query params: none
    - Response: `Property[]` with fields `{ id: number, name: string, type: 'string' | 'number' | 'enumerated', values?: string[] }`
  - GET `/api/operators`
    - Description: Returns the set of operators. Optionally filters by a property `type`.
    - Query params:
      - `type?`: `'string' | 'number' | 'enumerated'`
    - Responses:
      - 200: `Operator[]` with fields `{ id: 'equals' | 'greater_than' | 'less_than' | 'any' | 'none' | 'in' | 'contains', text: string }`
      - 400: `{ message, timestamp, status }` when `type` is invalid
  - GET `/api/products`
    - Description: Returns products optionally filtered by `propertyId`, `operator`, and `search`.
    - Query params:
      - `propertyId?`: number (must exist in `/api/properties`)
      - `operator?`: one of operator ids (see `/api/operators`); when provided with `propertyId`, combination must be valid
      - `search?`: string
        - For `equals`: matches string or number equality
        - For `greater_than` / `less_than`: numeric comparison
        - For `contains`: substring match (case-insensitive)
        - For `in`: comma-separated values (e.g. `electronics, tools`)
    - Responses:
      - 200: `Product[]` with `{ id: number, property_values: { property_id: number, value: string | number }[] }`
      - 400/405: `{ message, timestamp, status }` for invalid method/params or invalid combinations

- On the UI side the user can
  - Select a Property to filter by; available Operators are fetched dynamically based on the Property type.
  - Select an Operator; the Search field is shown only when required (hidden for `any`/`none` operators).
  - Enter a Search value depending on the Property type and Operator:
    - string: free text for `equals`, `contains`, `in` (comma-separated)
    - number: numeric input for `equals`, `greater_than`, `less_than`; `in`
    - enumerated: checkbox group for values; selections are treated as comma-separated for `in`
  - The table displays the matching products and shows a count above it; an empty state appears when no rows match.
  - Use the Clear button to reset the form and URL query.

### Time spent

Approx. 5 hours total
