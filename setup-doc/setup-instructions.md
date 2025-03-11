Here is a detailed step-by-step guide for creating a **Cloud-Agnostic Roster Management Service Setup** that includes API Gateway, Authentication, Backend Services, Database Infrastructure, Notification Service, and more. This setup is built on technologies that are cloud-agnostic and can be deployed across any cloud (AWS, GCP, Azure, or on-premise infrastructure).

---

### **1. API Gateway Setup**

#### 1.1. **Set Up Kong API Gateway (Cloud-Agnostic)**

Kong is an open-source API Gateway that can be deployed in any cloud platform or on-premise.

**Steps**:

- **Install Docker & Docker-Compose** on your machine or server.
- **Pull Kong Docker Image**:
  ```bash
  docker pull kong:latest
  ```
- **Deploy Kong with PostgreSQL (for database storage)**:

  ```bash
  docker network create kong-net

  # Start Kong's Postgres container
  docker run -d --name kong-database \
    --network kong-net \
    -e "KONG_DATABASE=postgres" \
    -e "KONG_PG_HOST=kong-database" \
    postgres:13

  # Migrate the Kong database schema
  docker run --rm --network kong-net \
    -e "KONG_DATABASE=postgres" \
    -e "KONG_PG_HOST=kong-database" \
    kong:latest kong reload -g

  # Start Kong Gateway
  docker run -d --name kong --network kong-net \
    -p 8000:8000 -p 8443:8443 \
    -e "KONG_DATABASE=postgres" \
    -e "KONG_PG_HOST=kong-database" \
    kong:latest
  ```

- **Configure Routes**:
  - Expose routes to your services (Authentication, Booking, etc.) by configuring APIs and routes in Kong.

#### 1.2. **Configure OAuth2 Authentication for API Gateway**

- Use **OAuth2** with **JWT** tokens for securing your APIs.
- Integrate Kong with **Keycloak** for OAuth2-based authentication.

---

### **2. Authentication & Authorization**

#### 2.1. **Install and Configure Keycloak**

Keycloak provides centralized authentication and authorization management.

**Steps**:

- **Install Keycloak using Docker**:

  ```bash
  docker run -d --name keycloak \
    -e KEYCLOAK_USER=admin \
    -e KEYCLOAK_PASSWORD=admin \
    -p 8080:8080 \
    quay.io/keycloak/keycloak:latest
  ```

- **Configure Realms**:

  - Create a **Realm** for your application.
  - Create roles like **Admin**, **Member**, **Trainer**, etc.

- **Create Clients** for your APIs (Kong, Backend Services):

  - Configure these clients with **client secrets** and **redirect URIs** for your APIs.

- **Configure OAuth2 / JWT**:
  - Ensure that your API Gateway (Kong) uses JWT tokens for authentication by integrating it with Keycloak.
  - Set up Keycloak to generate and verify JWT tokens.

#### 2.2. **Integrate Keycloak with Kong**

- **Configure Kong to accept JWT tokens** issued by Keycloak.
  - Kong will verify these tokens before allowing access to the backend services.

---

### **3. Backend Services Setup**

#### 3.1. **Containerize Backend Services**

We will use **Docker** to containerize the backend services.

**Steps**:

- **Create a Dockerfile** for each backend service (e.g., Authentication Service, Booking Service, Notification Service):

  ```dockerfile
  FROM node:14

  WORKDIR /app

  COPY . .

  RUN npm install

  EXPOSE 3000

  CMD ["npm", "start"]
  ```

- **Build Docker Images**:

  ```bash
  docker build -t backend-service .
  ```

- **Run the Docker Containers**:
  ```bash
  docker run -d -p 3000:3000 backend-service
  ```

#### 3.2. **Deploy Services on Kubernetes (Optional)**

If you prefer to deploy on Kubernetes:

- **Create Kubernetes Deployment YAML** for each service.
- Use **Helm** to deploy services if using a Kubernetes cluster.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend-service
  template:
    metadata:
      labels:
        app: backend-service
    spec:
      containers:
        - name: backend-service
          image: backend-service:latest
          ports:
            - containerPort: 3000
```

- **Use Horizontal Pod Autoscaler (HPA)** to scale backend services based on traffic.

---

### **4. Database Infrastructure Setup**

#### 4.1. **PostgreSQL Database**

PostgreSQL will store relational data like events, bookings, users, etc.

**Steps**:

- **Install PostgreSQL in Docker**:

  ```bash
  docker run -d --name postgres \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -p 5432:5432 \
    postgres:13
  ```

- **Connect Backend Services to PostgreSQL**:

  - Configure your backend services to connect to PostgreSQL using environment variables (`DB_HOST`, `DB_PORT`, etc.).

- **Deploy PostgreSQL in Kubernetes (Optional)**:
  Use **Helm** to deploy PostgreSQL in a Kubernetes cluster for better scalability and high availability.

#### 4.2. **Set Up Cassandra or MongoDB (Optional)**

If you need a NoSQL database for certain services, deploy **Cassandra** or **MongoDB** similarly using Docker or Kubernetes.

---

### **5. Notification Service Setup**

#### 5.1. **Set Up SendGrid (Email Notifications)**

- **Sign up** for SendGrid and obtain API keys.
- **Install SendGrid Node.js SDK**:

  ```bash
  npm install @sendgrid/mail
  ```

- **Configure SendGrid in your service**:

  ```javascript
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: 'recipient@example.com',
    from: 'sender@example.com',
    subject: 'Event Notification',
    text: 'You have a new event scheduled!',
  };

  sgMail.send(msg);
  ```

#### 5.2. **Set Up Twilio (SMS Notifications)**

- **Sign up** for Twilio and get your API keys.
- **Install Twilio Node.js SDK**:

  ```bash
  npm install twilio
  ```

- **Configure Twilio in your service**:

  ```javascript
  const twilio = require('twilio');
  const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  client.messages.create({
    body: 'You have a new event booked!',
    from: '+1234567890',
    to: '+0987654321',
  });
  ```

#### 5.3. **Push Notifications (FCM)**

- **Set up Firebase Cloud Messaging (FCM)**:
  - Sign up for Firebase and integrate FCM SDK into your mobile/web app.

---

### **6. Monitoring & Logging Setup**

#### 6.1. **Prometheus and Grafana for Monitoring**

- **Install Prometheus and Grafana using Docker**:

  ```bash
  docker run -d -p 9090:9090 prom/prometheus
  docker run -d -p 3000:3000 grafana/grafana
  ```

- **Set Up Metrics Collection** in your backend services and expose them via `/metrics` endpoints.
- **Configure Grafana** to pull data from Prometheus and create dashboards.

#### 6.2. **ELK Stack for Logging**

- **Install Elasticsearch**:

  ```bash
  docker run -d -p 9200:9200 elasticsearch:7.10.0
  ```

- **Install Logstash**:

  ```bash
  docker run -d -p 5044:5044 logstash:7.10.0
  ```

- **Configure Logstash** to parse logs from your services and forward them to Elasticsearch.
- **Install Kibana**:
  ```bash
  docker run -d -p 5601:5601 kibana:7.10.0
  ```

#### 6.3. **Set Up Distributed Tracing with Jaeger**

- **Install Jaeger** using Docker:
  ```bash
  docker run -d --name jaeger \
    -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
    -p 5775:5775 -p 6831:6831 -p 6832:6832 \
    jaegertracing/all-in-one:1.22
  ```

---

### **7. Cost Optimization**

- **Use Kubernetes autoscaling** to ensure resources scale based on demand.
- Use **Spot Instances** or **Preemptible VMs** for non-critical services to reduce costs.

---

### **8. Testing & Deployment**

- **Test locally** using Docker and Docker Compose.
- **Deploy to Kubernetes** using Helm or YAML configurations.
- Monitor scaling and ensure all services interact properly in a distributed environment.

---

By following these steps, you will have a fully cloud-agnostic **Roster Management Service** setup that can be deployed across any cloud platform or on-premise infrastructure. The use of open-source tools and containerized services ensures flexibility, scalability, and cost efficiency.
