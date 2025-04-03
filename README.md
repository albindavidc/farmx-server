# 🌾 **FarmX - Clean Architecture Folder Structure**  

FarmX is a modern application designed using **Clean Architecture** principles, ensuring **scalability, maintainability, and separation of concerns**. The project is divided into:  

- 📌 **Frontend:** Built with **Angular**, using **NgRx** for state management.  
- 📌 **Backend:** Powered by **Node.js + Express.js**, following a structured Clean Architecture approach.  

---  


---

### 🖥️ **Backend (Node.js + Express.js)**  
The backend is structured based on **Clean Architecture**, dividing responsibilities into multiple layers.  

### 📂 **Backend Folder Structure**  

```
farmx-backend/
├── src/
│   ├── domain/                     # Pure Business Logic
│   │   ├── entities/               # Core business entities
│   │   │   ├── user.entity.ts      
│   │   │   ├── role.entity.ts      
│   │   │   ├── otp.entity.ts       
│   │   │   ├── article.entity.ts   
│   │   │   ├── event.entity.ts     
│   │   │   ├── course.entity.ts    
│   │   │   ├── certificate.entity.ts
│   │   │   ├── chat.entity.ts      
│   │   │   └── report.entity.ts    
│   │   ├── value-objects/          # Immutable domain primitives
│   │   │   ├── email.vo.ts
│   │   │   ├── password.vo.ts
│   │   │   └── uuid.vo.ts
│   │   ├── enums/                  # Domain enums
│   │   │   ├── user-role.enum.ts
│   │   │   └── event-status.enum.ts
│   │   ├── events/                 # Domain events
│   │   │   ├── user-created.event.ts
│   │   │   └── course-purchased.event.ts
│   │   ├── repositories/           # Repository interfaces (ports)
│   │   │   ├── user.repository.ts  
│   │   │   ├── article.repository.ts
│   │   │   └── ... (other interfaces)
│   │   └── services/               # Domain services
│   │       ├── auth.service.ts     
│   │       ├── otp.service.ts      
│   │       └── ... (other domain services)
│   │
│   ├── application/                # Application Business Rules
│   │   ├── use-cases/              # CQRS-style use cases
│   │   │   ├── auth/
│   │   │   │   ├── commands/
│   │   │   │   │   ├── login.command.ts
│   │   │   │   │   ├── register.command.ts
│   │   │   │   │   └── ...
│   │   │   │   └── queries/
│   │   │   │       ├── get-user.query.ts
│   │   │   │       └── ...
│   │   │   ├── user/
│   │   │   │   ├── commands/
│   │   │   │   └── queries/
│   │   │   └── ... (other domains)
│   │   ├── dto/                   # Data Transfer Objects
│   │   │   ├── auth/
│   │   │   │   ├── login.request.ts
│   │   │   │   └── login.response.ts
│   │   │   └── ... (other DTOs)
│   │   ├── mappers/               # Entity ↔ DTO transformations
│   │   │   ├── user.mapper.ts
│   │   │   └── ... (other mappers)
│   │   ├── interfaces/            # Application contracts
│   │   │   ├── crypto.service.ts
│   │   │   └── ... (other interfaces)
│   │   └── exceptions/            # Custom exceptions
│   │       ├── validation.error.ts
│   │       └── not-found.error.ts
│   │
│   ├── infrastructure/            # Frameworks & Drivers
│   │   ├── persistence/           # Database implementations
│   │   │   ├── mongodb/
│   │   │   │   ├── repositories/  # Concrete repositories
│   │   │   │   │   ├── user.repository.ts
│   │   │   │   │   └── ...
│   │   │   │   ├── models/        # ORM models
│   │   │   │   │   ├── user.model.ts
│   │   │   │   │   └── ...
│   │   │   │   └── migrations/
│   │   │   └── redis/
│   │   │       └── cache.repository.ts
│   │   ├── auth/                  # Authentication adapters
│   │   │   ├── jwt.service.ts     # Implements auth interface
│   │   │   └── google-auth.service.ts
│   │   ├── notification/          # Notification adapters
│   │   │   ├── email/
│   │   │   └── push/
│   │   ├── payment/               # Payment gateways
│   │   │   └── stripe.adapter.ts
│   │   └── server/               # Web server
│   │       ├── http/             # REST API
│   │       │   ├── controllers/
│   │       │   ├── middleware/
│   │       │   └── routes/
│   │       └── websocket/        # WebSocket
│   │           └── gateway.ts
│   │
│   ├── presentation/             # Delivery Mechanism (optional)
│   │   ├── rest/                 # REST API presentation
│   │   │   ├── controllers/      # Thin controllers
│   │   │   └── routes/
│   │   └── graphql/              # GraphQL presentation
│   │       ├── resolvers/
│   │       └── schemas/
│   │
│   ├── shared/                   # Cross-cutting concerns
│   │   ├── decorators/
│   │   ├── logger/
│   │   ├── utils/
│   │   └── config/               # Configuration
│   │       └── env.ts
│   └── main.ts                   # Composition Root
│
├── tests/
│   ├── unit/
│   │   ├── domain/
│   │   ├── application/
│   │   └── ...
│   └── integration/
│       ├── api/
│       └── ...
│
├── .env
├── package.json
└── README.md
```


---




## 🚀 **Key Features Implementation**  

### 🔒 **Backend Features**  
✅ **Authentication & Authorization**  
- JWT for secure **token-based authentication**.  
- OAuth2 for **Google login integration**.  
- **Role-Based Access Control (RBAC)** for managing user permissions.  

✅ **Real-Time Services**  
- **WebSockets** for live chat and notifications.  

✅ **Performance Optimization**  
- **Redis caching** for high-frequency data.  
- **Elasticsearch** for advanced search & filtering.  

✅ **Integrations**  
- **Payment Gateway** for secure transactions.  
- **Calendar API** for event scheduling.  

---

### 🎨 **Frontend Features**  
✅ **State Management**  
- **NgRx** for centralized, predictable state management.  

✅ **Styling & UI**  
- **Tailwind CSS** + **SASS** for flexible, utility-first styling.  
- **Reusable component library** for consistency across UI.  
- **Dynamic UI rendering** based on **user roles**.  

✅ **Offline & PWA**  
- **Angular PWA** for **offline functionality** and better performance.  
