import { useState, useEffect } from "react";
import Input from "./input";
import ExpenseList from "./List";

const API = "http://127.0.0.1:5000/api/expenses";

function App() {
    const [expenses, setExpenses] = useState([]);
    const [serverDown, setServerDown] = useState(false);

    useEffect(() => {
        async function loadExpenses() {
            try {
                const response = await fetch(API);
                const data = await response.json();
                setExpenses(data);
            } catch (err) {
                console.log("Couldn't reach the server", err);
                setServerDown(true);
            }
        }
        loadExpenses();
    }, []);

    async function addExpense(newExpense) {
        try {
            const response = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExpense)
            });
            if (!response.ok) throw new Error("Add failed");
            const savedExpense = await response.json();
            setExpenses([...expenses, savedExpense]);
        } catch (err) {
            console.log("Couldn't add expense", err);
        }
    }

    async function deleteExpense(id) {
        try {
            const response = await fetch(`${API}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            setExpenses(expenses.filter((expense) => expense.id !== id));
        } catch (err) {
            console.log("Couldn't delete expense", err);
        }
    }

    return (
        <main className="app">
            <header>
                <h1 className="wordmark">banana</h1>
                <p className="tagline">Track what you spend.</p>
            </header>

            {serverDown && (
                <p className="notice">
                    Can't reach the server. Start Flask with python app.py, then refresh.
                </p>
            )}

            <Input onAddExpense={addExpense} />
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
        </main>
    );
}

export default App;