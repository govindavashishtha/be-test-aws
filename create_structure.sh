#!/bin/bash

# Create main project structure
mkdir -p src

# Create main directories inside src
mkdir -p src/api/{routes,middleware,types}
mkdir -p src/services/{auth,society,member,trainer,event,booking,subscription,notification}
mkdir -p src/workers/{scheduler,notification-worker,payment-worker}
mkdir -p src/db/{migrations,seeds,models}
mkdir -p src/config
mkdir -p src/utils/{validation,helpers,constants}
mkdir -p src/types
mkdir -p src/tests/{unit,integration,e2e}
mkdir -p src/docs/{api,architecture,setup}

# Create base configuration files
touch src/config/database.ts
touch src/config/queue.ts
touch src/config/scheduler.ts

# Create type definition files
touch src/types/index.ts
touch src/types/models.ts
touch src/types/config.ts
touch src/types/api.ts

# Create main application files
touch src/index.ts
touch src/app.ts

# Create example environment file
touch .env.example

# Create TypeScript configuration
touch tsconfig.json

# Create base package.json
touch package.json 