
# Project Folder Structure

This project follows a feature-based architecture with clear separation of concerns.

## Folder Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common layout components
│   │   └── Layout/      # Header, Footer, Layout components
│   └── ui/              # Generic UI components
│       └── LoadingSpinner/
├── features/            # Feature-based modules
│   └── auth/           # Authentication feature
│       ├── components/ # Feature-specific components
│       ├── stores/     # Feature-specific state
│       └── index.ts    # Feature exports
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── stores/             # Global state management
├── theme/              # MUI theme configuration
│   ├── index.ts        # Main theme export
│   ├── palette.ts      # Color palette
│   ├── typography.ts   # Typography settings
│   └── components.ts   # Component overrides
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── constants.ts    # App constants
│   ├── formatters.ts   # Formatting utilities
│   └── validation.ts   # Validation utilities
└── assets/             # Static assets (images, fonts, etc.)
```

## Aliases

The following aliases are configured in `vite.config.ts`:

- `@/` → `src/`
- `@/components` → `src/components`
- `@/hooks` → `src/hooks`
- `@/utils` → `src/utils`
- `@/theme` → `src/theme`
- `@/types` → `src/types`
- `@/features` → `src/features`
- `@/services` → `src/services`
- `@/stores` → `src/stores`
- `@/assets` → `src/assets`

## Key Features

1. **Feature-based Architecture**: Each feature has its own folder with components, stores, and logic
2. **Material-UI Integration**: Complete theme system with customizable components
3. **TypeScript Support**: Full type safety with custom type definitions
4. **State Management**: Zustand for lightweight state management
5. **API Layer**: Centralized API service with error handling
6. **Custom Hooks**: Reusable logic with React hooks
7. **Utility Functions**: Common utilities for formatting, validation, etc.

## Usage Examples

```typescript
// Import with aliases
import { Layout } from '@/components/common';
import { useAuthStore } from '@/features/auth';
import { formatCurrency } from '@/utils/formatters';
import { theme } from '@/theme';
```
