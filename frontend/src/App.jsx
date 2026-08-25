import { useEffect, useState } from "react";
import "./App.css";
import ExpensePage from "./pages/ExpensePage";
import SnapshotPage from "./pages/SnapshotPage";

const API_URL = "http://localhost:5000";

function App() {
  const [page, setPage] = useState("expenses");

  const [homeCurrency, setHomeCurrency] = useState("NPR");
  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NPR");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load expenses from backend when the app starts
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

  // Add expense through backend
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

      // Add the expense returned by the backend
      setExpenses((previousExpenses) => [
        ...previousExpenses,
        data,
      ]);

      // Clear form
      setTitle("");
      setAmount("");
      setCurrency("NPR");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Delete expense through backend
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

      // Remove deleted expense from UI
      setExpenses((previousExpenses) =>
        previousExpenses.filter((expense) => expense.id !== id)
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleGoToHub = () => {
    if (expenses.length === 0) {
      setError("Please add at least one expense first.");
      return;
    }

    setError("");
    setPage("snapshot");
  };

  if (page === "snapshot") {
    return (
      <SnapshotPage
        expenses={expenses}
        homeCurrency={homeCurrency}
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