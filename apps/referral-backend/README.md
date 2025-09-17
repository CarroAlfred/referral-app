# Referral Management API (Node.js + SQLite)

This is a **drop-in backend** for managing referrals with full CRUD operations. It stores data in a local SQLite file (`data.sqlite`) and provides a clean REST API for referral management.

## Quick start

```bash
# 1) Install deps
npm i

# 2) Copy env and customize if needed
cp .env.example .env

# 3) Initialize DB with schema + sample data
npm run seed

# 4) Start the server
npm run dev    # or: npm start
```

By default the API runs on **http://localhost:4000** and requires `Authorization: Bearer ${API_TOKEN}` on every request.

- Default token (from `.env.example`): `dev-token`
- Set your own in `.env` → `API_TOKEN=your-secret`

## Endpoints (CRUD Operations)

**Entity**

- `Referral` → `{ id, givenName, surname, email, phone, homeNameOrNumber, street, suburb, state, postcode, country, status, notes?, referredBy?, createdAt, updatedAt }`

**Routes**

- `GET /referrals` → list all referrals with optional filtering and pagination
  - Query params: `?status=pending&limit=20&offset=0`
  - Returns: `{ referrals: Referral[], pagination: { total, limit, offset, hasMore } }`
- `POST /referrals` → create new referral
- `GET /referrals/:id` → get single referral by ID
- `PATCH /referrals/:id` → update referral (partial updates supported)
- `DELETE /referrals/:id` → delete referral

### Referral Fields

**Required Fields:**

- `givenName` - First name
- `surname` - Last name
- `email` - Email address (unique)
- `phone` - Phone number
- `homeNameOrNumber` - House number or house name
- `street` - Street name
- `suburb` - Suburb/area
- `state` - State/province
- `postcode` - Postal/zip code

**Optional Fields:**

- `country` - Country (defaults to "Australia")
- `status` - Referral status: "pending" | "contacted" | "completed" | "declined" (defaults to "pending")
- `notes` - Additional notes
- `referredBy` - Who made the referral

### Status Workflow

Referrals progress through the following statuses:

- **pending** → Initial state when referral is created
- **contacted** → Referral has been contacted
- **completed** → Referral process completed successfully
- **declined** → Referral declined or not interested

### Examples

**Create a referral:**

```bash
POST /referrals
{
  "givenName": "John",
  "surname": "Smith",
  "email": "john.smith@example.com",
  "phone": "+61412345678",
  "homeNameOrNumber": "123",
  "street": "Collins Street",
  "suburb": "Melbourne",
  "state": "Victoria",
  "postcode": "3000",
  "notes": "Interested in web development course",
  "referredBy": "Sarah Johnson"
}
```

**List referrals with filtering:**

```bash
GET /referrals?status=pending&limit=10&offset=0
```

**Update referral status:**

```bash
PATCH /referrals/1
{
  "status": "contacted",
  "notes": "Called on Monday, very enthusiastic"
}
```

### Notes

- **Auth:** All routes require `Authorization: Bearer <API_TOKEN>`.
- **Email Uniqueness:** Email addresses must be unique across all referrals.
- **Partial Updates:** PATCH endpoint supports partial updates - only provided fields are updated.
- **Null Values:** You can explicitly set optional fields to `null` using PATCH.
- **Pagination:** List endpoint supports `limit` and `offset` query parameters.
- **Filtering:** Filter referrals by `status` using query parameters.
- **Validation:** Email format and status values are validated.
- **Timestamps:** `createdAt` and `updatedAt` are automatically managed.
- **Errors:** JSON errors with shape `{ error: string }` and proper HTTP status codes.

---

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

The test suite covers:

- All CRUD operations
- Authentication
- Validation scenarios
- Error handling
- Data integrity
- Edge cases

## Dev tips

- SQLite file is created at project root (`data.sqlite`).
- Re-run `npm run seed` to reset with sample referral data.
- Feel free to change the CORS origin in `src/server.js`.
- Database schema includes indexes for performance on common queries.
- Automatic timestamp updates via SQL triggers.

## Database Schema

The referrals table includes:

- Primary key auto-increment ID
- Unique constraint on email
- Check constraint on status values
- Indexes on email, status, and created_at for performance
- Automatic timestamp trigger for updates
