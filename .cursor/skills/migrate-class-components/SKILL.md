---
name: migrate-class-components
description: >-
  Migrate React class components to function components with hooks, and replace
  connect() HOC with useSelector/useDispatch. Use when converting class
  components, removing connect(), replacing lifecycle methods with hooks, or
  working on JG-22. Triggers: "class component", "convert to hooks",
  "connect()", "migrate component", "function component".
---

# Migrate Class Components to Function Components

Converts legacy React class components and `connect()` HOC usage to modern
function components with hooks. Follows Grafana's codebase standard: function
components, hooks, RTK slices, Emotion `useStyles2`.

## Do NOT Convert

**Error boundaries must stay as class components** — React has no function
component equivalent for `componentDidCatch` / `getDerivedStateFromError`.

Skip any file that implements either of these methods. Known file:
- `public/app/features/plugins/components/PluginErrorBoundary.tsx`

Verify before converting: `rg 'componentDidCatch|getDerivedStateFromError' <file>`

## Find Affected Files

```bash
# Class components (~61 files)
rg 'extends (Component|PureComponent)' public/app/ --files-with-matches -g '*.{ts,tsx}'

# connect() HOC usage (~61 files, partial overlap)
rg 'connect\(' public/app/ --files-with-matches -g '*.{ts,tsx}'

# Unsafe lifecycle — highest priority
rg 'componentWillReceiveProps' public/app/ --files-with-matches
```

## Conversion Steps

### Step 1: Class → Function Component

| Class pattern | Hook replacement |
|---|---|
| `class Foo extends Component<P, S>` | `const Foo = (props: P) => { ... }` |
| `class Foo extends PureComponent<P>` | `const Foo = React.memo((props: P) => { ... })` |
| `this.state` / `this.setState` | `useState` |
| `this.props` | Destructured params |
| `componentDidMount` | `useEffect(() => { ... }, [])` |
| `componentDidUpdate(prev)` | `useEffect` with deps array |
| `componentWillUnmount` | Return cleanup fn from `useEffect` |
| `componentWillReceiveProps` | Remove — derive with `useMemo` or key the component |
| `getDerivedStateFromProps` | Compute during render or `useMemo` |
| `createRef()` | `useRef()` |
| Class methods | `const fn = useCallback(...)` or plain `const fn = () => ...` |
| `stylesFactory` / inline styles | `useStyles2(getStyles)` |

**When converting `PureComponent`**: only wrap with `React.memo()` if the
component is known to receive unchanged props frequently. Otherwise, a plain
function component is fine — unnecessary `memo()` adds overhead.

### Step 2: Replace connect() with Hooks

```tsx
// BEFORE
const mapStateToProps = (state: StoreState) => ({
  items: state.items,
  loading: state.loading,
});
const mapDispatchToProps = { loadItems };
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);

// AFTER
export default function MyComponent() {
  const items = useSelector((state: StoreState) => state.items);
  const loading = useSelector((state: StoreState) => state.loading);
  const dispatch = useDispatch();
  // Replace loadItems(args) with dispatch(loadItems(args))
}
```

- Remove `ConnectedProps`, `MapStateToProps`, and `MapDispatchToProps` types
- Remove the `connect()` wrapper — export the component directly
- Each `mapStateToProps` field becomes a `useSelector` call
- Dispatch actions via `dispatch(actionCreator(args))`

### Step 3: Update Types

- Remove `OwnProps` / `ConnectedProps` / `StateProps` / `DispatchProps` split
- Define a single `Props` interface with only the props the parent passes
- Redux state and dispatch are no longer in props — they come from hooks

### Step 4: Update Tests

- If tests import the `Connected` or wrapped component, update to import the
  unwrapped component directly
- Replace `shallow` rendering with `render` from `@testing-library/react`
- Wrap component in a Redux `<Provider store={...}>` if it uses hooks
- Update snapshots: `yarn jest --no-watch -u <test-file>`

### Step 5: Validate

After each file conversion, run:

```bash
yarn typecheck                          # Must pass
yarn lint -- --no-error-on-unmatched-pattern <file>  # Must pass
yarn jest --no-watch <test-file>        # Must pass
```

## Conversion Order (Priority)

1. **Unsafe lifecycle** — `componentWillReceiveProps` file (1 file)
2. **High-impact pages** — Explore, DashboardPage, OptionsPicker, LogsContainer, DashboardPanel
3. **connect() + class** — files that need both conversions
4. **Class-only** — remaining class components without connect()

## Common Pitfalls

- **Don't inline `useSelector` with new object/array literals** — creates new
  references every render. Extract primitives or use `createSelector`.
- **Don't copy `componentDidMount` + `componentDidUpdate` into separate effects
  when they do the same thing** — a single `useEffect` with the right deps
  covers both.
- **Watch for `this` in callbacks** — class arrow methods capture `this`
  implicitly; function components don't have `this`. Remove all `this.`
  references.
- **Don't blindly convert `getDerivedStateFromProps` to `useEffect`** — compute
  during render or use `useMemo`. See the `LogMessageAnsi.tsx` example in
  [examples.md](examples.md).
- **Preserve `displayName`** — if the original had one (e.g., for HOC wrappers
  like `withTheme2`), keep it or remove the HOC entirely if a hook alternative
  exists (`useTheme2`).

## Validation Commands (Full Sweep)

After converting a batch of files, verify no class components or connect() remain:

```bash
# Should return fewer files each time (goal: only error boundaries remain)
rg 'extends (Component|PureComponent)' public/app/ --files-with-matches -g '*.{ts,tsx}' | wc -l

# Should approach 0
rg 'connect\(' public/app/ --files-with-matches -g '*.{ts,tsx}' | wc -l

# Must be 0
rg 'componentWillReceiveProps' public/app/ --files-with-matches | wc -l

# Full checks
yarn typecheck
yarn lint
```

## Reference

- Before/after examples: [examples.md](examples.md)
