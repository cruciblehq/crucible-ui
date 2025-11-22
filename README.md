# Crucible UI

Crucible UI is the widget engine of the Crucible ecosystem. It defines the
intent model and primitive lexicon used to compose widgets and manage their
lifecycle.

It implements a custom React reconciler and provides its own React-compatible
components and primitives, allowing Crucible to render widgets using React’s
runtime and features.

## Installation

[crux](https://github.com/cruciblehq/crux) is Crucible's bootstrapping and build
tool and is the preferred way to install `@cruciblehq/ui`:

```sh
crux init
```

To install manually, keep in mind that widgets should not bundle `@cruciblehq/ui`,
so the module must be installed as a dev and peer dependency:

```sh
npm install @cruciblehq/ui --save-dev
npm pkg set peerDependencies.@cruciblehq/ui="*"
```

## Build From Source

```sh
npm run build
```

This produces one build variant, available under `dist/esm-neutral`.

An additional `types` build is generated under `dist/types`, containing the
TypeScript declaration files (`.d.ts`) for all public modules.

## License

Copyright (c) 2025 Crucible Inc. All rights reserved.
