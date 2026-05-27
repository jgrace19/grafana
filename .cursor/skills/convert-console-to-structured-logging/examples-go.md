# Go Backend Examples: print-style to structured logging

Use these patterns for runtime Go code under `pkg/`.

## Existing package logger

**Before**

```go
fmt.Println("Failed to close response body", "err", err)
```

**After**

```go
glog.Warn("Failed to close response body", "err", err)
```

## Existing slog logger in operator

**Before**

```go
fmt.Println("Received shutdown signal, stopping controllers")
```

**After**

```go
logger.Info("Received shutdown signal, stopping controllers")
```

## Panic recovery path

**Before**

```go
fmt.Println(fmt.Errorf("panic: %v\n%s", r, string(debug.Stack())))
```

**After**

```go
glog.Error("panic in copyData", "panic", r, "stack", string(debug.Stack()))
```

## HTTP server error hook

**Before**

```go
stdlog.Print(string(msg))
```

**After**

```go
w.log.Error("HTTP server error", "msg", string(msg))
```

## Add package logger when none exists

**Before**

```go
fmt.Printf("ERR: %v", r)
```

**After**

```go
var logger = log.New("apimachinery.utils")

logger.Error("panic in SetSecureValues", "panic", r)
```

## Keep as intentional exceptions

- `pkg/cmd/**` CLI output (`fmt.Println` to stdout/stderr)
- `pkg/build/**` and `go:build ignore` tool binaries
- `*_test.go` and other test-only helper output
- `pkg/infra/log/file.go` stderr fallback while logging subsystem is failing
