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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [convertedExpenses, setConvertedExpenses] = useState([]);
  const [conversionLoading, setConversionLoading] = useState(false);
  const [conversionError, setConversionError] = useState("");

  // ------------------------------------
  // GET /expenses
  // ------------------------------------

  useEffect(() => {
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
      } catch (error) {
        console.error(error);
        setError(
          "Unable to load expenses. Please check the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // ------------------------------------
  // POST /expenses
  // ------------------------------------

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
        throw new Error(
          data.error || "Failed to add expense."
        );
      }

      setExpenses((previousExpenses) => [
        ...previousExpenses,
        data,
      ]);

      setTitle("");
      setAmount("");
      setCurrency("NPR");

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // ------------------------------------
  // DELETE /expenses/:id
  // ------------------------------------

  const handleDelete = async (id) => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/expenses/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete expense."
        );
      }

      setExpenses((previousExpenses) =>
        previousExpenses.filter(
          (expense) => expense.id !== id
        )
      );

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // ------------------------------------
  // Currency conversion
  // ------------------------------------

  const convertExpenses = async () => {
    try {
      setConversionLoading(true);
      setConversionError("");

      const results = await Promise.all(
        expenses.map(async (expense) => {

          // Same currency = no API call
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
              data.error || "Currency conversion failed."
            );
          }

          return {
            ...expense,
            convertedAmount: data.convertedAmount,
          };
        })
      );

      setConvertedExpenses(results);
      setPage("snapshot");

    } catch (error) {
      console.error(error);

      setConversionError(
        "Unable to convert expenses right now. Please try again."
      );

    } finally {
      setConversionLoading(false);
    }
  };

  // ------------------------------------
  // Navigation
  // ------------------------------------

  const handleGoToExpenseHub = () => {
    if (expenses.length === 0) {
      setError("Add at least one expense first.");
      return;
    }

    setError("");
    convertExpenses();
  };

  const handleBack = () => {
    setPage("expenses");
  };

  // ------------------------------------
  // Render pages
  // ------------------------------------

  if (page === "snapshot") {
    return (
      <SnapshotPage
        convertedExpenses={convertedExpenses}
        homeCurrency={homeCurrency}
        conversionLoading={conversionLoading}
        conversionError={conversionError}
        onBack={handleBack}
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
      onGoToHub={handleGoToExpenseHub}
    />
  );
}

export default App;