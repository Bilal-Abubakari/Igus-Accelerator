# Igus Accelerator Injection Molding Configurator

This repository contains an Angular frontend and a NestJS backend;

## Getting Started

To get started with this monorepo, ensure you have [node](https://nodejs.org/) (ideally a version specified in `.nvmrc`, if present) and [yarn](https://yarnpkg.com/) installed on your machine.

1.  Clone the repository:

    ```
    git clone https://github.com/Amali-Tech/Igus-Accelerator
    cd igus-accelerator
    ```

2.  Install dependencies:

    ```
    yarn install
    ```

## Project Structure

### Key Directories Explained:

- **`apps/`**: Contains the source code for each application in the monorepo. Each application has its own directory with its project-specific files.
- **`libs/`**: Contains shared libraries that can be used by multiple applications within the monorepo.

## Development

To start the development servers for both applications, use the following commands:

To serve the Angular application, run:

```javascript
nx serve iaimc-frontend // nx test (for testing), nx lint (for running lints)
```

### NestJS Backend

To serve the NestJS application, run:

```javascript
nx serve iaimc-backend // nx test (for testing), nx lint (for running lints)
```

For a guide on the git conventions, go to:
https://amali-tech.atlassian.net/wiki/spaces/~7120208a00231f088d4cb8926bdad8c2b2842d/pages/1484816386/Project+Setup
