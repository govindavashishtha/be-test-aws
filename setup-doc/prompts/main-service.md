---

### 1. **Authentication Module - GPT Prompt**

**Prompt:**
```text
Generate a service that handles user authentication and authorization in a fitness class management system for residential societies. The service should support multiple roles such as members, trainers, and society admins. Implement JWT-based authentication and integrate OTP verification for phone number authentication. Include functions for user registration, login, and role validation. Make sure the service ensures secure password handling (hashing) and allows role-based access control.

Requirements:
- JWT-based token generation
- Phone number OTP-based authentication
- Password hashing and verification
- Role-based access control (Member, Trainer, SocietyAdmin)
- User registration and login functionality
- Integration with a PostgreSQL database for storing user credentials and roles
```

---

### 2. **Society Management Module - GPT Prompt**

**Prompt:**

```text
Develop a service for managing society profiles and configurations in a fitness class management system. The service should allow the creation of societies, assignment of society-specific configurations (such as max members per event), and update of society information. Provide functionality for society admins to view their society details, manage events, and access revenue and analytics.

Requirements:
- Create and update society profiles
- Configure maximum members per event
- Implement API endpoints to retrieve society data
- Implement logic for managing multiple societies in a scalable manner
- Track revenue details for each society
- Provide analytics for the number of events and member engagement
- Store society data in PostgreSQL
```

---

### 3. **Member Management Module - GPT Prompt**

**Prompt:**

```text
Create a Member Management service for handling member onboarding, approval processes, profile updates, and subscription management. Implement a maker-checker flow for approving or rejecting member applications. Ensure the service provides functionality to track and manage active members and their status (pending, approved, rejected). Integrate with the Subscription and Payment module to handle member subscriptions.

Requirements:
- Member onboarding and approval process
- Implement maker-checker flow for member approval
- Track member status (approved, pending, rejected)
- Provide functionality to manage member profiles and update personal information
- Integrate with the Subscription module for managing member subscriptions
- Implement API endpoints for member management (CRUD operations)
```

---

### 4. **Trainer Management Module - GPT Prompt**

**Prompt:**

```text
Develop a service for managing trainer profiles, availability, and event assignments in a fitness class management system. The service should allow trainers to set their availability, view assigned events, and receive class assignments based on location. Implement logic for ensuring that trainers are not overbooked and have a limited number of classes per day.

Requirements:
- Trainer profile management (Create, Read, Update, Delete)
- Set trainer availability for events
- Implement a system for assigning trainers to events based on location
- Ensure that trainers are not assigned more than 3 classes per day
- Provide functionality for trainers to view upcoming events and their schedule
- Integrate with the Event Management module for assigning trainers to events
- Implement APIs for trainer CRUD operations and availability management
```

---

### 5. **Event Management Module - GPT Prompt**

**Prompt:**

```text
Create an Event Management service to handle the creation, scheduling, and booking of fitness events for a residential society. The service should generate weekly event schedules, assign trainers to events, and ensure that events are within the maximum capacity. Integrate with the Booking and Trainer Management services to handle event bookings and trainer assignments.

Requirements:
- Event creation and scheduling functionality
- Automatic generation of weekly event schedules
- Assign trainers to events based on availability and location
- Enforce event capacity limits
- Track event attendance and class statistics
- Provide APIs to create, update, and retrieve events
- Ensure scalability to manage multiple societies and growing member bases
```

---

### 6. **Subscription & Payment Module - GPT Prompt**

**Prompt:**

```text
Develop a service to manage subscription plans and payment processing for members in the fitness class management system. Implement logic to create, update, and delete subscription plans. The service should integrate with a payment gateway to process payments and track payment statuses. Provide functionality to store transaction details and support recurring billing if necessary.

Requirements:
- Subscription plan management (create, update, delete)
- Integration with a payment gateway for processing payments
- Track payment statuses (pending, completed, failed)
- Manage transaction details (amount, transaction ID, payment date)
- Implement logic for recurring subscriptions
- Integrate with the Member Management module to manage member subscriptions
- Provide API endpoints for creating and retrieving subscription plans
```

---

### 7. **Booking Module - GPT Prompt**

**Prompt:**

```text
Build a Booking service that allows members to reserve and cancel spots for fitness events. The service should implement real-time availability tracking, limit bookings per member (e.g., maximum 5 classes per week), and support a waitlist. Members should be able to view available classes, book events, and cancel bookings. Ensure a 1-hour cancellation policy is enforced.

Requirements:
- Real-time availability tracking for event bookings
- Implement booking limits (maximum 5 bookings per week)
- Provide waitlist functionality for fully booked events
- Implement booking cancellation logic with 1-hour notice restriction
- Integrate with the Event Management system to retrieve event availability
- Track member bookings and cancellations
- Implement APIs for booking, canceling, and viewing bookings
```

---

### 8. **Notification Module - GPT Prompt**

**Prompt:**

```text
Create a Notification service that sends notifications to members for event bookings, cancellations, reminders, and new event announcements. The service should support SMS, email, and push notifications. Ensure notifications are sent in a timely manner (e.g., reminders for upcoming events, booking confirmations). Implement logic to schedule notifications and track their delivery status.

Requirements:
- Send booking confirmation notifications to members
- Send event reminders and new event notifications
- Support for SMS, email, and push notifications
- Ensure notifications are sent based on event schedules and booking status
- Track notification delivery statuses (sent, pending, failed)
- Integrate with the Booking and Event Management modules for notification scheduling
- Provide APIs to schedule and manage notifications
```

---

### Instructions for Use:

For each of the prompts above, you can ask GPT to generate:

1. **Service architecture**: High-level architecture and responsibilities of each service.
2. **Database schema**: Tables, columns, and relationships required for each service.
3. **Business logic**: Detailed explanation of the core functionality for each service.
4. **API documentation**: Endpoints, HTTP methods, request/response bodies, and authentication details.
5. **Error handling and validation**: Common errors, validation logic, and how the system should respond.
6. **Integration points**: How the service integrates with other modules, external services, or APIs.
