function SnapshotPage({
  expenses,
  convertedExpenses,
  homeCurrency,
  conversionLoading,
  conversionError,
  onBack,
}) {
  const total = convertedExpenses.reduce(
    (sum, expense) => sum + expense.convertedAmount,
    0
  );

  return (
    <div className="app">
      <header className="header">
        <h1>CurrenSee ExpenseHub</h1>

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Expenses
        </button>
      </header>

      <main className="container snapshot-container">

        <div className="home-currency-display">
          <span>Home Currency</span>
          <strong>{homeCurrency}</strong>
        </div>

        {conversionLoading && (
          <div className="empty-state">
            <h3>Converting expenses...</h3>

            <p>
              Please wait while we calculate your expenses
              in {homeCurrency}.
            </p>
          </div>
        )}

        {conversionError && (
          <div className="error-message">
            {conversionError}
          </div>
        )}

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

            {convertedExpenses.map((expense) => (
              <div
                className="table-row"
                key={expense.id}
              >
                <span className="expense-title">
                  {expense.title}
                </span>

                <span>
                  {expense.currency}{" "}
                  {expense.amount.toFixed(2)}
                </span>

                <span className="converted-value">
                  {homeCurrency}{" "}
                  {expense.convertedAmount.toFixed(2)}
                </span>
              </div>
            ))}

          </div>
        </section>

      </main>
    </div>
  );
}

export default SnapshotPage;