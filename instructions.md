### **Backend Boilerplate for ArcFit with Custom Shared Libraries**

A **modular and scalable** Node.js backend boilerplate with custom shared libraries for **common functionalities**, reducing code duplication across services.

---

## **1. Directory Structure**

```
arcfit-backend/
│── services/               # Microservices
│   ├── auth-service/       # User authentication & authorization
│   ├── event-service/      # Event management
│   ├── booking-service/    # Booking & cancellation
│   ├── notification-service/ # Notifications & reminders
│── libs/                   # Shared Libraries
│   ├── logger/             # Centralized logging
│   ├── db/                 # Database connection pool
│   ├── api-client/         # Inter-service communication
│   ├── errors/             # Standard error handling
│   ├── utils/              # Common utility functions
│── config/                 # Environment-based configurations
│── .github/                # CI/CD workflows
│── docker/                 # Docker setup
│── scripts/                # Deployment scripts
│── .env                    # Environment variables
│── package.json            # Dependencies & scripts
│── tsconfig.json           # TypeScript configurations
│── README.md               # Documentation
```

---

## **2. Custom Shared Libraries (Under `/libs/`)**

Each library is published as an **NPM package** within the **private workspace** so all services can consume them.

---

### **2.1 Logger Library (`libs/logger/index.ts`)**

A **centralized logging module** using **Winston**.

#### **Installation**

```sh
npm install winston
```

#### **Implementation**

```ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

export default logger;
```

#### **Usage in a service (e.g., `event-service`)**

```ts
import logger from '../libs/logger';

logger.info('Event created successfully');
logger.error('Failed to create event');
```

---

### **2.2 Database Library (`libs/db/index.ts`)**

A **singleton** for managing **PostgreSQL connections**.

#### **Installation**

```sh
npm install pg
```

#### **Implementation**

```ts
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
```

#### **Usage in a service (e.g., `booking-service`)**

```ts
import { query } from '../libs/db';

const bookings = await query('SELECT * FROM bookings WHERE user_id = $1', [
  userId,
]);
```

---

### **2.3 API Client Library (`libs/api-client/index.ts`)**

Handles **inter-service communication** using **Axios**.

#### **Installation**

```sh
npm install axios
```

#### **Implementation**

```ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_GATEWAY_URL,
  timeout: 5000,
});

export default apiClient;
```

#### **Usage in `notification-service`**

```ts
import apiClient from '../libs/api-client';

const event = await apiClient.get(`/events/${eventId}`);
```

---

### **2.4 Error Handling Library (`libs/errors/index.ts`)**

Defines **standard error classes**.

#### **Implementation**

```ts
class CustomError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'CustomError';
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export { CustomError, NotFoundError };
```

#### **Usage in `auth-service`**

```ts
import { NotFoundError } from '../libs/errors';

if (!user) throw new NotFoundError('User not found');
```

---

### **2.5 Utilities Library (`libs/utils/index.ts`)**

Common **utility functions** (e.g., **date formatters, validation**).

#### **Implementation**

```ts
export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

#### **Usage**

```ts
import { formatDate } from '../libs/utils';

const today = formatDate(new Date());
```

---

## **3. Managing Shared Libraries as NPM Packages**

To use shared libraries across services:

### **3.1 Initialize NPM Workspaces**

```sh
npm init -w ./libs/logger
npm init -w ./libs/db
npm init -w ./libs/api-client
npm init -w ./libs/errors
npm init -w ./libs/utils
```

### **3.2 Add Workspaces to `package.json`**

```json
{
  "workspaces": ["libs/*", "services/*"]
}
```

### **3.3 Use Workspaces in a Service**

In `services/auth-service/package.json`:

```json
{
  "dependencies": {
    "@arcfit/logger": "file:../../libs/logger",
    "@arcfit/db": "file:../../libs/db"
  }
}
```

---

## **4. API Gateway with Kong**

### **Setup Kong with Docker Compose**

```yaml
version: '3.8'
services:
  kong:
    image: kong:latest
    environment:
      KONG_DATABASE: 'off'
      KONG_DECLARATIVE_CONFIG: '/etc/kong/kong.yaml'
    ports:
      - '8000:8000'
      - '8443:8443'
      - '8001:8001'
    volumes:
      - ./kong.yaml:/etc/kong/kong.yaml
```

### **Kong API Gateway Configuration (`kong.yaml`)**

```yaml
_format_version: '2.1'
services:
  - name: auth-service
    url: http://auth-service:3000
    routes:
      - name: auth
        paths:
          - /auth

  - name: event-service
    url: http://event-service:3000
    routes:
      - name: events
        paths:
          - /events
```

---

## **5. CI/CD Pipeline**

### **GitHub Actions Workflow**

```yaml
name: Backend CI/CD

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f k8s/
```

---

## **6. Summary**

✅ **Shared Libraries for Logging, DB, API Calls, Errors, and Utilities**  
✅ **API Gateway with Kong for Microservices Routing**  
✅ **Modular NPM Workspaces for Shared Code**  
✅ **CI/CD Pipeline with GitHub Actions**

This **boilerplate** ensures **scalability, modularity, and maintainability** across all backend services. 🚀

### **Backend Boilerplate for ArcFit with gRPC Inter-Service Communication**

This **updated backend architecture** uses **gRPC** for inter-service communication, replacing **internal Axios HTTP calls** to improve **efficiency, latency, and reliability**.

---

## **1. Directory Structure (Updated for gRPC)**

```
arcfit-backend/
│── services/               # Microservices
│   ├── auth-service/       # User authentication & authorization
│   ├── event-service/      # Event management
│   ├── booking-service/    # Booking & cancellation
│   ├── notification-service/ # Notifications & reminders
│── libs/                   # Shared Libraries
│   ├── logger/             # Centralized logging
│   ├── db/                 # Database connection pool
│   ├── grpc-client/        # gRPC clients for inter-service communication
│   ├── errors/             # Standard error handling
│   ├── utils/              # Common utility functions
│── proto/                  # gRPC Protobuf Definitions
│── config/                 # Environment-based configurations
│── .github/                # CI/CD workflows
│── docker/                 # Docker setup
│── scripts/                # Deployment scripts
│── .env                    # Environment variables
│── package.json            # Dependencies & scripts
│── tsconfig.json           # TypeScript configurations
│── README.md               # Documentation
```

---

## **2. Setup gRPC for Inter-Service Communication**

We replace **Axios HTTP calls** with **gRPC** for direct **service-to-service** communication.

### **2.1 Install gRPC Dependencies**

Run this in all microservices:

```sh
npm install @grpc/grpc-js @grpc/proto-loader
```

---

## **3. Define gRPC Service Contracts in Protobuf**

All **gRPC definitions** are stored in `/proto/`.

### **3.1 Event Service (`proto/event.proto`)**

```proto
syntax = "proto3";

package event;

service EventService {
  rpc GetEvent (EventRequest) returns (EventResponse);
}

message EventRequest {
  string event_id = 1;
}

message EventResponse {
  string event_id = 1;
  string name = 2;
  string trainer_id = 3;
  string event_date = 4;
}
```

---

## **4. Implement gRPC Server in `event-service`**

Each service **exposes a gRPC server**.

### **4.1 Event Service gRPC Server (`services/event-service/src/grpc/server.ts`)**

```ts
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { query } from '../../libs/db';

const PROTO_PATH = '../../proto/event.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const eventProto: any = grpc.loadPackageDefinition(packageDefinition).event;

const getEvent = async (call: any, callback: any) => {
  try {
    const { event_id } = call.request;
    const result = await query('SELECT * FROM events WHERE id = $1', [
      event_id,
    ]);
    if (result.rows.length === 0) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Event not found',
      });
    }
    callback(null, result.rows[0]);
  } catch (error) {
    callback({ code: grpc.status.INTERNAL, message: 'Server error' });
  }
};

const server = new grpc.Server();
server.addService(eventProto.EventService.service, { GetEvent: getEvent });

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('Event gRPC Server running on port 50051');
  }
);
```

---

## **5. Implement gRPC Client in `notification-service`**

Services **call gRPC endpoints** instead of REST.

### **5.1 Create a gRPC Client (`libs/grpc-client/index.ts`)**

```ts
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const PROTO_PATH = '../../proto/event.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const eventProto: any = grpc.loadPackageDefinition(packageDefinition).event;

const eventClient = new eventProto.EventService(
  'event-service:50051',
  grpc.credentials.createInsecure()
);

export default eventClient;
```

---

## **6. Call gRPC Service in `notification-service`**

Instead of using **Axios**, call the **gRPC client**.

### **6.1 Fetch Event Data in `notification-service`**

```ts
import eventClient from '../libs/grpc-client';

const sendNotification = (eventId: string) => {
  eventClient.GetEvent({ event_id: eventId }, (error: any, response: any) => {
    if (error) {
      console.error('Error fetching event:', error.message);
      return;
    }
    console.log('Fetched event:', response);
  });
};
```

---

## **7. API Gateway with Kong & gRPC Support**

Kong **can handle both HTTP and gRPC routing**.

### **7.1 Update `docker-compose.yml`**

```yaml
version: '3.8'
services:
  kong:
    image: kong:latest
    environment:
      KONG_DATABASE: 'off'
      KONG_DECLARATIVE_CONFIG: '/etc/kong/kong.yaml'
    ports:
      - '8000:8000'
      - '8443:8443'
      - '8001:8001'
      - '9080:9080' # gRPC Port
    volumes:
      - ./kong.yaml:/etc/kong/kong.yaml
```

### **7.2 Kong Configuration (`kong.yaml`)**

```yaml
_format_version: '2.1'
services:
  - name: event-service
    protocol: grpc
    host: event-service
    port: 50051
    routes:
      - name: event-route
        paths:
          - /event
```

---

## **8. CI/CD Pipeline (Updated for gRPC)**

### **8.1 GitHub Actions Workflow**

```yaml
name: Backend CI/CD

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Install Dependencies
        run: npm install

      - name: Run Tests
        run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f k8s/
```

---

## **9. Summary**

✅ **gRPC replaces Axios for faster, real-time service-to-service communication**  
✅ **Each service runs its own gRPC server and exposes RPC methods**  
✅ **Shared gRPC client in `libs/grpc-client` for easy integration**  
✅ **Kong API Gateway supports gRPC routing**  
✅ **Efficient, low-latency inter-service communication**

This **updated ArcFit backend** ensures **scalability, low-latency API calls, and optimized cost** with **gRPC microservices**. 🚀

### **Updated Backend Boilerplate for ArcFit with gRPC & Sequelize ORM**

This update **replaces raw SQL queries with Sequelize models** while keeping **gRPC for inter-service communication**.

---

## **1. Directory Structure (Updated for Sequelize & gRPC)**

```
arcfit-backend/
│── services/               # Microservices
│   ├── auth-service/       # User authentication & authorization
│   ├── event-service/      # Event management
│   ├── booking-service/    # Booking & cancellations
│   ├── notification-service/ # Notifications & reminders
│── libs/                   # Shared Libraries
│   ├── logger/             # Centralized logging
│   ├── db/                 # Sequelize models & database connection
│   ├── grpc-client/        # gRPC clients for inter-service communication
│   ├── errors/             # Standard error handling
│   ├── utils/              # Common utility functions
│── proto/                  # gRPC Protobuf Definitions
│── config/                 # Environment-based configurations
│── migrations/             # Sequelize migrations
│── seeders/                # Database seeders
│── .github/                # CI/CD workflows
│── docker/                 # Docker setup
│── scripts/                # Deployment scripts
│── .env                    # Environment variables
│── package.json            # Dependencies & scripts
│── tsconfig.json           # TypeScript configurations
│── README.md               # Documentation
```

---

## **2. Install Dependencies**

```sh
npm install sequelize sequelize-cli pg pg-hstore @grpc/grpc-js @grpc/proto-loader
```

---

## **3. Setup Sequelize ORM**

### **3.1 Initialize Sequelize**

```sh
npx sequelize-cli init
```

This creates:

```
config/config.json   # Database configurations
models/              # Sequelize models
migrations/          # Database migrations
seeders/             # Sample seed data
```

---

## **4. Define Models & Migrations**

### **4.1 Event Model (`models/event.ts`)**

```ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../libs/db';

class Event extends Model {}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trainerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Event',
  }
);

export default Event;
```

### **4.2 Generate Migration for Event**

```sh
npx sequelize-cli model:generate --name Event --attributes name:string,trainerId:uuid,eventDate:date
```

### **4.3 Run Migrations**

```sh
npx sequelize-cli db:migrate
```

---

## **5. Define gRPC Service Contracts**

All **gRPC definitions** are stored in `/proto/`.

### **5.1 Event Service (`proto/event.proto`)**

```proto
syntax = "proto3";

package event;

service EventService {
  rpc GetEvent (EventRequest) returns (EventResponse);
}

message EventRequest {
  string event_id = 1;
}

message EventResponse {
  string event_id = 1;
  string name = 2;
  string trainer_id = 3;
  string event_date = 4;
}
```

---

## **6. Implement gRPC Server with Sequelize**

Each service **exposes a gRPC server** using Sequelize for DB queries.

### **6.1 Event Service gRPC Server (`services/event-service/src/grpc/server.ts`)**

```ts
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import Event from '../../models/event';

const PROTO_PATH = '../../proto/event.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const eventProto: any = grpc.loadPackageDefinition(packageDefinition).event;

const getEvent = async (call: any, callback: any) => {
  try {
    const event = await Event.findByPk(call.request.event_id);
    if (!event) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'Event not found',
      });
    }
    callback(null, event);
  } catch (error) {
    callback({ code: grpc.status.INTERNAL, message: 'Server error' });
  }
};

const server = new grpc.Server();
server.addService(eventProto.EventService.service, { GetEvent: getEvent });

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('Event gRPC Server running on port 50051');
  }
);
```

---

## **7. Implement gRPC Client in `notification-service`**

Instead of using **Axios**, services **call gRPC endpoints**.

### **7.1 Create a gRPC Client (`libs/grpc-client/index.ts`)**

```ts
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const PROTO_PATH = '../../proto/event.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const eventProto: any = grpc.loadPackageDefinition(packageDefinition).event;

const eventClient = new eventProto.EventService(
  'event-service:50051',
  grpc.credentials.createInsecure()
);

export default eventClient;
```

---

## **8. Call gRPC Service in `notification-service`**

### **8.1 Fetch Event Data**

```ts
import eventClient from '../libs/grpc-client';

const sendNotification = async (eventId: string) => {
  eventClient.GetEvent({ event_id: eventId }, (error: any, response: any) => {
    if (error) {
      console.error('Error fetching event:', error.message);
      return;
    }
    console.log('Fetched event:', response);
  });
};
```

---

## **9. API Gateway with Kong & gRPC Support**

### **9.1 Update `docker-compose.yml`**

```yaml
version: '3.8'
services:
  kong:
    image: kong:latest
    environment:
      KONG_DATABASE: 'off'
      KONG_DECLARATIVE_CONFIG: '/etc/kong/kong.yaml'
    ports:
      - '8000:8000'
      - '8443:8443'
      - '8001:8001'
      - '9080:9080' # gRPC Port
    volumes:
      - ./kong.yaml:/etc/kong/kong.yaml
```

### **9.2 Kong Configuration (`kong.yaml`)**

```yaml
_format_version: '2.1'
services:
  - name: event-service
    protocol: grpc
    host: event-service
    port: 50051
    routes:
      - name: event-route
        paths:
          - /event
```

---

## **10. CI/CD Pipeline (Updated for Sequelize & gRPC)**

### **10.1 GitHub Actions Workflow**

```yaml
name: Backend CI/CD

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Install Dependencies
        run: npm install

      - name: Run Migrations
        run: npx sequelize-cli db:migrate

      - name: Run Tests
        run: npm test

  deploy:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl apply -f k8s/
```

---

## **11. Summary**

✅ **gRPC replaces Axios for low-latency inter-service communication**  
✅ **Sequelize ORM for database operations**  
✅ **Each service runs its own gRPC server & exposes RPC methods**  
✅ **Shared gRPC client in `libs/grpc-client`**  
✅ **Kong API Gateway supports gRPC routing**  
✅ **CI/CD includes DB migrations**

This **optimized ArcFit backend** ensures **scalability, efficient API calls, and cost-effective operations** with **gRPC & Sequelize**. 🚀
