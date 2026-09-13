# Fixed Frontend - Real Estate CRM

## What was fixed

1. **API Client** (`src/api/client.js`)
   - JWT token ab automatically har request ke sath `Authorization: Bearer <token>` header mein jata hai
   - 401 aane par auto logout

2. **Customers page**
   - List from API
   - Add Customer modal (full_name, email, phone, active)
   - Delete support

3. **Properties page**
   - List from API
   - Add Property modal (title, city, address, price, bedrooms, type, available)
   - Delete support

4. **Leads page**
   - List from API
   - Add Lead modal (customer dropdown, optional property, status, notes)
   - Delete support
   - Pehle customer create karo, phir lead banega

## How to run

### Backend
```bash
cd fast_api
# make sure PostgreSQL is running and .env is correct
pip install -r requirements.txt
# create tables / run migrations if needed
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd fast_api/frontend
npm install
npm run dev
```

Open http://localhost:5173

### First time
1. Register a user via API (or Swagger http://127.0.0.1:8000/docs):
   POST /api/v1/users/register
   ```json
   {
     "full_name": "Admin User",
     "email": "admin@test.com",
     "password": "password123",
     "role": "admin"
   }
   ```
2. Login from frontend with that email/password
3. Go to Customers → Add Customer
4. Go to Properties → Add Property
5. Go to Leads → Add Lead (select customer)

## Notes
- Customer delete requires **admin** role
- Lead create requires existing customer_id
- CORS already allows localhost:5173 and 5175
