import { useState } from "react";

function Input({ onAddExpense }) {
    const [inputValue, setInputValue] = useState("");
    const [amountValue, setAmountValue] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if (inputValue.trim() === "" || amountValue === "" || Number(amountValue) <= 0) return;

        onAddExpense({ name: inputValue, amount: Number(amountValue) });

        setInputValue("");
        setAmountValue("");
    };

    return (
        <form className="expense-form" onSubmit={handleSubmit}>
            <div className="field grow">
                <label htmlFor="expense-name">What for</label>
                <input
                    id="expense-name"
                    type="text"
                    placeholder="Rent, airtime, lunch"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>

            <div className="field">
                <label htmlFor="expense-amount">Amount (Ksh)</label>
                <input
                    id="expense-amount"
                    type="number"
                    min="0"
                    placeholder="500"
                    value={amountValue}
                    onChange={(e) => setAmountValue(e.target.value)}
                />
            </div>

            <button className="btn" type="submit">Add expense</button>
        </form>
    );
}

export default Input;