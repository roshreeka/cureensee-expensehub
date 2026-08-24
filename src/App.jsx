import { useState } from "react";
import "./App.css";

const currencies = ["NPR", "USD", "EUR", "GBP", "INR"];

function App() {
  const [page, setPage] = useState("expenses");

  const [homeCurrency, setHomeCurrency] = useState("NPR");

  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NPR");

  const handleAddExpense = (e) => {
    e.preventDefault();

    if (!title.trim() || !amount || Number(amount) <= 0) {
      return;
    }

    const newExpense = {
      id: Date.now(),
      title: title.trim(),
      amount: Number(amount),
      currency,
    };

    setExpenses([...expenses, newExpense]);

    setTitle("");
    setAmount("");
    setCurrency("NPR");
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleGoToExpenseHub = () => {
    if (expenses.length === 0) {
      return;
    }

    setPage("snapshot");
  };

  const total = expenses.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);

  if (page === "snapshot") {
    return (
      <div className="app">
        <header className="header">
          <h1>CurrenSee ExpenseHub</h1>

          <button
            className="back-button"
            onClick={() => setPage("expenses")}
          >
            ← Back to Expenses
          </button>
        </header>

        <main className="container snapshot-container">

          <div className="home-currency-display">
            <span>Home Currency</span>
            <strong>{homeCurrency}</strong>
          </div>

          <section className="total-card">
            <div>
              <p className="total-label">Running Total</p>

              <h2>
                {homeCurrency} {total.toFixed(2)}
              </h2>
            </div>

            <span className="total-icon">↗</span>
          </section>

          <section className="snapshot-card">
            <div className="section-heading">
              <h2>Expense Snapshot</h2>

              <p>
                Your expenses converted into your home currency.
              </p>
            </div>

            <div className="expense-table">
              <div className="table-header">
                <span>Title</span>
                <span>Original</span>
                <span>Converted</span>
              </div>

              {expenses.map((expense) => (
                <div className="table-row" key={expense.id}>
                  <span className="expense-title">
                    {expense.title}
                  </span>

                  <span>
                    {expense.currency}{" "}
                    {expense.amount.toFixed(2)}
                  </span>

                  <span className="converted-value">
                    Conversion coming soon
                  </span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>CurrenSee ExpenseHub</h1>
      </header>

      <main className="container">

        <section className="expense-form-card">
          <div className="section-heading">
            <h2>Add Expense</h2>

            <p>
              Record each expense in the currency you originally
              spent.
            </p>
          </div>

          <form onSubmit={handleAddExpense}>
            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="title">
                  Expense Title
                </label>

                <input
                  id="title"
                  type="text"
                  placeholder="e.g. Lunch, Transport"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">
                  Amount
                </label>

                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="currency">
                  Currency
                </label>

                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <button type="submit" className="add-button">
              + Add Expense
            </button>
          </form>
        </section>

        <section className="expenses-section">

          <div className="section-heading">
            <h2>Expenses</h2>

            <p>
              {expenses.length === 0
                ? "No expenses added yet."
                : `${expenses.length} expense${
                    expenses.length !== 1 ? "s" : ""
                  } recorded`}
            </p>
          </div>

          {expenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">+</div>

              <h3>No expenses yet</h3>

              <p>
                Add your first expense to start tracking your
                spending.
              </p>
            </div>
          ) : (
            <>
              <div className="expense-list">

                {expenses.map((expense) => (
                  <div
                    className="expense-item"
                    key={expense.id}
                  >
                    <div className="expense-info">
                      <h3>{expense.title}</h3>

                      <p>
                        {expense.currency} expense
                      </p>
                    </div>

                    <div className="expense-right">

                      <div className="expense-amount">
                        {expense.currency}{" "}
                        {expense.amount.toFixed(2)}
                      </div>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(expense.id)
                        }
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                ))}

              </div>

              <div className="continue-area">

                <label htmlFor="homeCurrency">
                  Choose your home currency
                </label>

                <select
                  id="homeCurrency"
                  value={homeCurrency}
                  onChange={(e) =>
                    setHomeCurrency(e.target.value)
                  }
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>

                <button
                  className="hub-button"
                  onClick={handleGoToExpenseHub}
                >
                  Go to ExpenseHub →
                </button>

              </div>
            </>
          )}

        </section>

      </main>
    </div>
  );
}

export default App;