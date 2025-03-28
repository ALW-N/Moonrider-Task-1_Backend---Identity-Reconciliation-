# 📞 Contact Reconciliation Service  

A **Node.js**-based web service that processes JSON payloads containing `email` and `phoneNumber` fields, consolidating contact information across multiple purchases. It ensures that contacts are linked correctly, preventing duplicates and maintaining a **primary-secondary** relationship.

---

## 🚀 Features  

✔️ **Real-time Contact Reconciliation** – Identifies and consolidates duplicate contacts.  
✔️ **Primary-Secondary Contact Linking** – Maintains relationships dynamically.  
✔️ **PostgreSQL Database** – Stores and manages contact information.  
✔️ **Sequelize ORM** – Handles database interactions.  
✔️ **Docker Support** – Easy deployment in containerized environments.  
✔️ **API Testing with Postman** – Ready-to-use API for quick verification.  

---

## 📂 Project Structure  

```
contact-reconciliation/
│── config/
│   ├── config.json        # Database configurations for different environments
│── controllers/
│   ├── contactController.js # Handles API logic
│── models/
│   ├── index.js           # Sequelize setup
│   ├── contact.js         # Contact model definition
│── routes/
│   ├── contactRoutes.js   # Routes for contact API
│── migrations/
│   ├── <timestamp>-create-contacts.js # Sequelize migration file
│── seeders/
│   ├── <timestamp>-seed-contacts.js   # Sequelize seed file
│── Dockerfile              # Docker container setup
│── docker-compose.yml      # Docker Compose configuration
│── .gitignore              # Files to ignore in Git
│── package.json            # Dependencies and scripts
│── README.md               # Project documentation
│── server.js               # Express server setup
```

---

## 🛠️ Prerequisites  

Ensure you have the following installed:  

- **[Node.js](https://nodejs.org/) (v18 or later)**  
- **[PostgreSQL](https://www.postgresql.org/download/)**  
- **[Docker](https://www.docker.com/get-started) (optional, for containerized deployment)**  
- **[Git](https://git-scm.com/downloads)**  

---

## 📥 Installation  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/contact-reconciliation.git
cd contact-reconciliation
```

### **2️⃣ Install Dependencies**  
```sh
npm install
```

### **3️⃣ Configure Environment**  
```sh
DATABASE_URL=postgres://postgres:admin@localhost:5432/contacts_db
PORT=3000
```
Alternatively, modify `config/config.json` to match your PostgreSQL setup.

### **4️⃣ Setup Database**  

#### 🛠 Using Sequelize CLI:
```sh
npx sequelize-cli db:create      # Create the database
npx sequelize-cli db:migrate     # Run migrations
npx sequelize-cli db:seed:all    # Seed data (if needed)
```

#### 🐳 Using Docker (Recommended):
```sh
docker-compose up -d  # Starts PostgreSQL & API in a container
```

---

## 🏃 Running the Service  

### **1️⃣ Start the API Locally**  
```sh
npm start
```
Your API will be available at **`http://localhost:3000`**.

### **2️⃣ Run Inside Docker**  
```sh
docker-compose up --build
```

---

## 🔥 API Endpoints  

### **1️⃣ Identify Contact (`/identify`)**
- **Method**: `POST`
- **Request Body (JSON)**:
```json
{
  "email": "doc@example.com",
  "phoneNumber": "1234567890"
}

```
- **Response Example**:
```json
{
  "primaryContactId": 1,
  "emails": ["doc@example.com"],
  "phoneNumbers": ["1234567890"],
  "secondaryContactIds": []
}
```
![My Image](https://drive.google.com/uc?id=1ldOFzXpAEdGgO85KsOJCSPQMHWb8lnut)



---

## 📊 Testing with Postman  

1. Open **Postman**.
2. Set method to `POST`, and URL: `http://localhost:3000/identify`.
3. Select **Body** → **raw** → JSON and enter:
   ```json
   {
      "email": "doc2@example.com",
      "phoneNumber": "1234567890"
   }
   ```
4. Click **Send** and verify the response.

---

## 🐳 Docker Deployment  

### **1️⃣ Build & Run Containers**
```sh
docker-compose up --build
```
This starts both the **PostgreSQL** database and the **API service**.

### **2️⃣ Check Running Containers**
```sh
docker ps
```

### **3️⃣ Reset Database in Docker**
```sh
docker exec -it contact-reconciliation-api npx sequelize-cli db:migrate:undo:all
docker exec -it contact-reconciliation-api npx sequelize-cli db:migrate
```

---

## 📌 Resetting the Database  

If you need to **delete all contacts and restart**:
```sh
docker exec -it contact-reconciliation-api npx sequelize-cli db:migrate:undo:all
docker exec -it contact-reconciliation-api npx sequelize-cli db:migrate
```

---



