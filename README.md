# Crucible UI

Crucible UI is the widget engine of the Crucible ecosystem. It defines the
component model and primitive lexicon used to compose widgets and manage
their lifecycle.

It implements a custom React reconciler and provides its own React-compatible
components and primitives, allowing Crucible to render widgets using React’s
runtime and features.

## Installation

[crux]([http://](https://example.com/) is Crucible's bootstrapping and build
tool and is the preferred way to install `@crucible/ui`:

```sh
crux init
```

To install manually, keep in mind that widgets should not bundle `@crucible/ui`,
so the module must be installed as a dev and peer dependency:

```sh
npm install @crucible/ui --save-dev
npm pkg set peerDependencies.@cruciblehq/ui="*"
```

## Build From Source

```sh
npm run build
```

This produces three build variants, available under the `dist/` folder:

| Variant           | Description                           | Platform   | Bundled | Minified |
|-------------------|---------------------------------------|------------|---------|----------|
| `esm-neutral`     | ESM for bundlers and npm distribution | neutral    | No      | No       |
| `esm-browser`     | ESM for browsers                      | browser    | Yes     | No       |
| `esm-browser.min` | ESM for browsers (minified)           | browser    | Yes     | Yes      |

An additional `types` build is generated under `dist/types`, containing the
TypeScript declaration files (`.d.ts`) for all public modules.

All builds are ESM and include source maps.

## Development

After cloning the repository, install dependencies:

```sh
npm install
```

Check builds and lint:

```sh
npm run check
```

## License

Copyright (c) 2025 Crucible Inc. All rights reserved.
