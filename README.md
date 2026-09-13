Fixed Frontend - Real Estate CRM
What was fixed
API Client (src/api/client.js)

JWT token ab automatically har request ke sath Authorization: Bearer <token> header mein jata hai
401 aane par auto logout
Customers page

List from API
Add Customer modal (full_name, email, phone, active)
Delete support
Properties page

List from API
Add Property modal (title, city, address, price, bedrooms, type, available)
Delete support
Leads page

List from API
Add Lead modal (customer dropdown, optional property, status, notes)
Delete support
Pehle customer create karo, phir lead banega
How to run
Backend
cd fast_api
# make sure PostgreSQL is running and .env is correct
pip install -r requirements.txt
# create tables / run migrations if needed
uvicorn app.main:app --reload --port 8000
Frontend
cd fast_api/frontend
npm install
npm run dev
Open http://localhost:5173

First time
Register a user via API (or Swagger http://127.0.0.1:8000/docs): POST /api/v1/users/register
{
  "full_name": "Admin User",
  "email": "admin@test.com",
  "password": "password123",
  "role": "admin"
}
Login from frontend with that email/password
Go to Customers → Add Customer
Go to Properties → Add Property
Go to Leads → Add Lead (select customer)
Notes
Customer delete requires admin role
Lead create requires existing customer_id
CORS already allows localhost:5173 and 5175
