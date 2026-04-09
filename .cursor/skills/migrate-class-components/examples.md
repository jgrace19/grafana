# Migration Examples

## Example 1: PureComponent with getDerivedStateFromProps → useMemo

**Before** (`LogMessageAnsi.tsx` — class with `getDerivedStateFromProps` + `withTheme2` HOC):

```tsx
import { PureComponent } from 'react';
import { withTheme2, type Themeable2 } from '@grafana/ui';

interface Props extends Themeable2 {
  value: string;
  highlight?: { searchWords: string[]; highlightClassName: string };
}

interface State {
  chunks: ParsedChunk[];
  prevValue: string;
}

export class UnThemedLogMessageAnsi extends PureComponent<Props, State> {
  state: State = { chunks: [], prevValue: '' };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.value === state.prevValue) {
      return null;
    }
    const parsed = ansicolor.parse(props.value);
    return {
      chunks: parsed.spans.map((span) =>
        span.css
          ? { style: convertCSSToStyle(props.theme, span.css), text: span.text }
          : { text: span.text }
      ),
      prevValue: props.value,
    };
  }

  render() {
    const { chunks } = this.state;
    return chunks.map((chunk, index) => (
      // ... render logic
    ));
  }
}

export const LogMessageAnsi = withTheme2(UnThemedLogMessageAnsi);
LogMessageAnsi.displayName = 'LogMessageAnsi';
```

**After** (function component with `useMemo` + `useTheme2` hook):

```tsx
import { useMemo } from 'react';
import { useTheme2 } from '@grafana/ui';

interface Props {
  value: string;
  highlight?: { searchWords: string[]; highlightClassName: string };
}

export function LogMessageAnsi({ value, highlight }: Props) {
  const theme = useTheme2();

  const chunks = useMemo(() => {
    const parsed = ansicolor.parse(value);
    return parsed.spans.map((span) =>
      span.css
        ? { style: convertCSSToStyle(theme, span.css), text: span.text }
        : { text: span.text }
    );
  }, [value, theme]);

  return chunks.map((chunk, index) => (
    // ... same render logic, but without this.props / this.state
  ));
}
```

Key changes:
- `getDerivedStateFromProps` → `useMemo` (the "prevValue" tracking is free — `useMemo` handles it)
- `withTheme2(Unthemed...)` HOC → `useTheme2()` hook
- `Themeable2` removed from Props — theme comes from hook
- No `displayName` needed — named export provides it

## Example 2: PureComponent with UNSAFE_componentWillReceiveProps → useEffect

**Before** (`TimelineViewingLayer.tsx` — class with unsafe lifecycle + imperative refs):

```tsx
export default class TimelineViewingLayer extends React.PureComponent<Props> {
  _draggerReframe: DraggableManager;
  _root: Element | TNil;

  constructor(props: Props) {
    super(props);
    this._draggerReframe = new DraggableManager({
      getBounds: this._getDraggingBounds,
      onDragEnd: this._handleReframeDragEnd,
      // ...
    });
    this._root = undefined;
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.boundsInvalidator !== nextProps.boundsInvalidator) {
      this._draggerReframe.resetBounds();
    }
  }

  componentWillUnmount() {
    this._draggerReframe.dispose();
  }

  _setRoot = (elm: Element | TNil) => { this._root = elm; };

  _getDraggingBounds = (): DraggableBounds => {
    if (!this._root) { throw new Error('invalid state'); }
    const { left: clientXLeft, width } = this._root.getBoundingClientRect();
    return { clientXLeft, width };
  };

  render() { /* ... */ }
}
```

**After** (function component with `useRef` + `useEffect`):

```tsx
export default function TimelineViewingLayer({
  boundsInvalidator,
  updateNextViewRangeTime,
  updateViewRangeTime,
  viewRangeTime,
}: Props) {
  const rootRef = useRef<Element | null>(null);

  const draggerReframe = useRef(
    new DraggableManager({
      getBounds: () => {
        if (!rootRef.current) { throw new Error('invalid state'); }
        const { left: clientXLeft, width } = rootRef.current.getBoundingClientRect();
        return { clientXLeft, width };
      },
      onDragEnd: handleReframeDragEnd,
      // ...
    })
  ).current;

  useEffect(() => {
    draggerReframe.resetBounds();
  }, [boundsInvalidator, draggerReframe]);

  useEffect(() => {
    return () => draggerReframe.dispose();
  }, [draggerReframe]);

  // ... same render JSX, using rootRef as ref callback
}
```

Key changes:
- `UNSAFE_componentWillReceiveProps` → `useEffect` with `[boundsInvalidator]` dep
- `componentWillUnmount` → cleanup return in `useEffect`
- Instance fields (`_root`, `_draggerReframe`) → `useRef`
- Arrow method class properties → plain functions or `useCallback`

## Example 3: connect() HOC Removal

**Before**:

```tsx
interface OwnProps {
  panelId: number;
}

interface ConnectedProps {
  items: Item[];
  loading: boolean;
}

interface DispatchProps {
  loadItems: typeof loadItems;
  clearItems: typeof clearItems;
}

type Props = OwnProps & ConnectedProps & DispatchProps;

class MyPanel extends PureComponent<Props> {
  componentDidMount() {
    this.props.loadItems(this.props.panelId);
  }

  render() {
    const { items, loading } = this.props;
    return loading ? <Spinner /> : <ItemList items={items} />;
  }
}

const mapStateToProps = (state: StoreState): ConnectedProps => ({
  items: state.items.list,
  loading: state.items.loading,
});

const mapDispatchToProps: DispatchProps = { loadItems, clearItems };

export default connect(mapStateToProps, mapDispatchToProps)(MyPanel);
```

**After**:

```tsx
interface Props {
  panelId: number;
}

export default function MyPanel({ panelId }: Props) {
  const items = useSelector((state: StoreState) => state.items.list);
  const loading = useSelector((state: StoreState) => state.items.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadItems(panelId));
  }, [dispatch, panelId]);

  return loading ? <Spinner /> : <ItemList items={items} />;
}
```

Key changes:
- Three interfaces (`OwnProps`, `ConnectedProps`, `DispatchProps`) → one `Props`
- `mapStateToProps` fields → individual `useSelector` calls
- `mapDispatchToProps` → `useDispatch()` + `dispatch(action())`
- `connect()()` wrapper removed — component exported directly
- `componentDidMount` → `useEffect` with `[]` deps
