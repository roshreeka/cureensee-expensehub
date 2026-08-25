const currencies = ["NPR", "USD", "EUR", "GBP", "INR"];

function ExpensePage({
  expenses,
  title,
  setTitle,
  amount,
  setAmount,
  currency,
  setCurrency,
  homeCurrency,
  setHomeCurrency,
  loading,
  error,
  onAddExpense,
  onDelete,
  onGoToHub,
}) {
  return (
    <div className="app">
      <header className="header">
        <h1>CurrenSee ExpenseHub</h1>
      </header>

      <main className="container">

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <section className="expense-form-card">
          <div className="section-heading">
            <h2>Add Expense</h2>

            <p>
              Record each expense in the currency you originally
              spent.
            </p>
          </div>

          <form onSubmit={onAddExpense}>
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
                  {currencies.map((item) => (
                    <option key={item} value={item}>
                      {item}
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
              {loading
                ? "Loading expenses..."
                : expenses.length === 0
                ? "No expenses added yet."
                : `${expenses.length} expense${
                    expenses.length !== 1 ? "s" : ""
                  } recorded`}
            </p>
          </div>

          {loading ? (
            <div className="empty-state">
              <h3>Loading...</h3>
            </div>
          ) : expenses.length === 0 ? (
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
                        onClick={() => onDelete(expense.id)}
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
                  {currencies.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <button
                  className="hub-button"
                  onClick={onGoToHub}
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

export default ExpensePage;