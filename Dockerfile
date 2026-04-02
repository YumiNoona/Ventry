FROM node:22-alpine

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Copy entire repo
COPY . .

# Install dependencies (workspace-aware)
RUN pnpm install

# Go to worker
WORKDIR /app/apps/worker

# Start worker
CMD ["pnpm", "start"]