# CurrenSee ExpenseHub

CurrenSee ExpenseHub is a small full-stack expense tracking application that allows users to record expenses in different currencies and view them converted into a selected home currency.
## Lore to the name "CurrenSee ExpenseHub"

I named the application **CurrenSee ExpenseHub** by combining "Currency" and "See". The idea is to make expenses across different currencies easier to see, understand, and track in one place. "ExpenseHub" represents the central space where expenses can be recorded, converted, and viewed together in a chosen home currency.

The application calculates a running total of all expenses in the selected home currency.

## Features

- Add expenses with a title, amount, and currency
- View all recorded expenses
- Delete expenses
- Select a home currency
- Convert expenses into the selected home currency
- View a running total of converted expenses
- Loading and error states for currency conversion
- Backend validation for expense data
- Same-currency conversion optimization
- In-memory expense storage

## Tech Stack

### Frontend
- React
- Vite
- Plain CSS

### Backend
- Node.js
- Express
- CORS
- In-memory storage

### Currency Conversion
- ExchangeRate-API

The React frontend communicates with the Express backend for currency conversion. The frontend does not call the external exchange-rate API directly.

## Supported Currencies

- NPR
- USD
- EUR
- GBP
- INR

## Project Structure

```text
currensee expensehub/
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── pages/
│           ├── ExpensePage.jsx
│           └── SnapshotPage.jsx
│
├── .gitignore
└── README.md
