@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Octopod Frontend - a Next.js application.

## Development Commands

```bash
# Start development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Type check TypeScript files
npm run check-types

# Lint code
npm run lint

# Format code with Prettier
npm run format

# Run all checks before commit
npm run test-all
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5 (strict mode)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Theming**: next-themes (light/dark/system)
- **Toast**: Sonner

### Directory Structure

- `/src/actions/` - Server actions grouped by feature
- `/src/api/` - API client functions for backend communication
- `/src/app/` - Next.js App Router pages and layouts
- `/src/components/` - Reusable UI components
  - `/src/components/ui/` - shadcn/ui components (auto-generated, do not edit directly)
  - `/src/components/provider/` - Context providers
- `/src/hooks/` - Custom React hooks
- `/src/lib/` - Utility functions (e.g., `cn()` for class merging)
- `/src/schema/` - Zod schemas for validation
- `/src/types/` - TypeScript type definitions
- `/src/store/` - Client state management
- `/src/env/` - Environment variable validation

### Key Patterns

1. **Import Alias**: Use `@/` prefix for imports from `src/` (e.g., `@/components/ui/button`)
2. **Server vs Client Components**: Use `"use client"` directive only when needed (hooks, state, browser APIs)
3. **Type Safety**: Strict TypeScript - always define proper types
4. **Formatting**: Prettier with import sorting. Run `npm run format` before committing.
5. **Component Library**: Use `npx shadcn@latest add <component>` to add new UI components
