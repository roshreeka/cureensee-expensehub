const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory expense storage
let expenses = [];
let nextId = 1;

// Supported currencies
const validCurrencies = ["NPR", "USD", "EUR", "GBP", "INR"];

// ------------------------------------
// GET /expenses
// Return all expenses
// ------------------------------------

app.get("/expenses", (req, res) => {
  res.status(200).json(expenses);
});

// ------------------------------------
// POST /expenses
// Add a new expense
// ------------------------------------

app.post("/expenses", (req, res) => {
  const { title, amount, currency } = req.body;

  // Validate title
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "Title is required.",
    });
  }

  // Validate amount
  if (
    amount === undefined ||
    amount === null ||
    amount === "" ||
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return res.status(400).json({
      error: "A valid amount greater than 0 is required.",
    });
  }

  // Validate currency
  if (!currency || !validCurrencies.includes(currency)) {
    return res.status(400).json({
      error: `Invalid currency. Supported currencies: ${validCurrencies.join(
        ", "
      )}`,
    });
  }

  const expense = {
    id: nextId++,
    title: title.trim(),
    amount,
    currency,
    date: new Date().toISOString(),
  };

  expenses.push(expense);

  res.status(201).json(expense);
});

// ------------------------------------
// DELETE /expenses/:id
// Delete an expense
// ------------------------------------

app.delete("/expenses/:id", (req, res) => {
  const id = Number(req.params.id);

  const expenseIndex = expenses.findIndex(
    (expense) => expense.id === id
  );

  if (expenseIndex === -1) {
    return res.status(404).json({
      error: "Expense not found.",
    });
  }

  const deletedExpense = expenses.splice(expenseIndex, 1)[0];

  res.status(200).json({
    message: "Expense deleted successfully.",
    expense: deletedExpense,
  });
});

// ------------------------------------
// GET /convert
// Example:
// /convert?from=USD&to=NPR&amount=100
// ------------------------------------

app.get("/convert", async (req, res) => {
  const { from, to, amount } = req.query;

  // Validate currencies
  if (
    !from ||
    !to ||
    !validCurrencies.includes(from) ||
    !validCurrencies.includes(to)
  ) {
    return res.status(400).json({
      error: "Invalid or missing currency code.",
    });
  }

  // Validate amount
  const numericAmount = Number(amount);

  if (
    amount === undefined ||
    amount === "" ||
    !Number.isFinite(numericAmount) ||
    numericAmount < 0
  ) {
    return res.status(400).json({
      error: "A valid amount is required.",
    });
  }

  // Optimization:
  // If currencies are the same, no external API call is needed.
  if (from === to) {
    return res.status(200).json({
      from,
      to,
      amount: numericAmount,
      convertedAmount: numericAmount,
    });
  }

  try {
    // Get exchange rates based on the source currency
    const response = await fetch(
      `https://open.er-api.com/v6/latest/${from}`
    );

    if (!response.ok) {
      throw new Error("Currency API request failed.");
    }

    const data = await response.json();

    if (data.result !== "success") {
      throw new Error("Currency API returned an error.");
    }

    const rate = data.rates[to];

    if (rate === undefined) {
      throw new Error("Conversion rate unavailable.");
    }

    const convertedAmount = numericAmount * rate;

    res.status(200).json({
      from,
      to,
      amount: numericAmount,
      rate,
      convertedAmount,
    });
  } catch (error) {
    console.error("Conversion error:", error.message);

    res.status(502).json({
      error:
        "Currency conversion service is currently unavailable. Please try again.",
    });
  }
});

// ------------------------------------
// Health check
// ------------------------------------

app.get("/", (req, res) => {
  res.json({
    message: "CurrenSee ExpenseHub API is running.",
  });
});

// ------------------------------------
// Start server
// ------------------------------------

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});