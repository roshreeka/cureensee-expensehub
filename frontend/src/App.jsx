import { useEffect, useState } from "react";
import "./App.css";
import ExpensePage from "./pages/ExpensePage";
import SnapshotPage from "./pages/SnapshotPage";

const API_URL = "http://localhost:5000";

function App() {
  const [page, setPage] = useState("expenses");

  const [homeCurrency, setHomeCurrency] = useState("NPR");
  const [expenses, setExpenses] = useState([]);
  const [convertedExpenses, setConvertedExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NPR");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [conversionLoading, setConversionLoading] = useState(false);
  const [conversionError, setConversionError] = useState("");

  // Load expenses from backend
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/expenses`);

      if (!response.ok) {
        throw new Error("Failed to load expenses.");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the expense server.");
    } finally {
      setLoading(false);
    }
  };

  // Add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!title.trim() || !amount || Number(amount) <= 0) {
      setError("Please enter a valid title and amount.");
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          amount: Number(amount),
          currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add expense.");
      }

      setExpenses((previousExpenses) => [
        ...previousExpenses,
        data,
      ]);

      setTitle("");
      setAmount("");
      setCurrency("NPR");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Delete expense
  const handleDelete = async (id) => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete expense.");
      }

      setExpenses((previousExpenses) =>
        previousExpenses.filter((expense) => expense.id !== id)
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Convert all expenses when going to ExpenseHub
  const handleGoToHub = async () => {
    if (expenses.length === 0) {
      setError("Please add at least one expense first.");
      return;
    }

    try {
      setConversionLoading(true);
      setConversionError("");
      setError("");

      const converted = await Promise.all(
        expenses.map(async (expense) => {
          // Optimization:
          // Same currency does not need an API call.
          if (expense.currency === homeCurrency) {
            return {
              ...expense,
              convertedAmount: expense.amount,
            };
          }

          const response = await fetch(
            `${API_URL}/convert?from=${expense.currency}&to=${homeCurrency}&amount=${expense.amount}`
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.error || `Failed to convert ${expense.title}.`
            );
          }

          return {
            ...expense,
            convertedAmount: data.convertedAmount,
          };
        })
      );

      setConvertedExpenses(converted);
      setPage("snapshot");
    } catch (err) {
      console.error(err);

      setConversionError(
        "Some expenses could not be converted. Please try again."
      );
    } finally {
      setConversionLoading(false);
    }
  };

  if (page === "snapshot") {
    return (
      <SnapshotPage
        expenses={expenses}
        convertedExpenses={convertedExpenses}
        homeCurrency={homeCurrency}
        conversionLoading={conversionLoading}
        conversionError={conversionError}
        onBack={() => setPage("expenses")}
      />
    );
  }

  return (
    <ExpensePage
      expenses={expenses}
      title={title}
      setTitle={setTitle}
      amount={amount}
      setAmount={setAmount}
      currency={currency}
      setCurrency={setCurrency}
      homeCurrency={homeCurrency}
      setHomeCurrency={setHomeCurrency}
      loading={loading}
      error={error}
      onAddExpense={handleAddExpense}
      onDelete={handleDelete}
      onGoToHub={handleGoToHub}
    />
  );
}

export default App;