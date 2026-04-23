# Expense Tracker

Minimal full-stack Expense Tracker built with:
- Backend: Express + JSON file persistence
- Frontend: React (Vite)

## Features

### Backend
- Create expense with `amount`, `category`, `description`, `date`
- Retry-safe `POST /expenses` using `Idempotency-Key`
- List expenses with category filter and newest-first sort
- Case-insensitive, partial category filtering support
- JSON file persistence that survives restarts

### Frontend
- Add expense form with amount/date validation
- Expense list with category filter and newest-first sort toggle
- Loading and error states for API operations
- Total amount display for currently visible rows
- Summary totals by category
- Form draft persistence on refresh

## Why JSON file persistence

A JSON file is used for persistence to keep local setup friction-free and avoid native database module compatibility issues across Node versions. Data survives backend restarts and browser refreshes.

## Project Structure

- `backend` - Express API + file-based persistence
- `frontend` - React UI

## API

### `POST /expenses`

Creates an expense.

Headers:
- `Idempotency-Key` (optional but recommended): prevents duplicate entries when retries happen

Body:
```json
{
  "amount": 250.75,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-04-23"
}
```

### `GET /expenses`

Returns list of expenses.

Query params:
- `category`: case-insensitive partial match filter by category
- `sort=date`: sort by newest date first

## Run Locally

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Runs on `http://localhost:4000`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173` and calls backend at `http://localhost:4000` by default.

You can override API base URL:

```bash
# frontend/.env
VITE_API_BASE_URL=http://localhost:4000
```

## Reliability Notes

- API is idempotent for retried creates when the same `Idempotency-Key` is sent.
- Form draft is stored in `localStorage` to reduce data loss on refresh.
- UI exposes loading and error states for fetch and submit flows.