import { useState } from "react";

function ExpenseList({ expenses, onDeleteExpense, onUpdateExpense }) {
    const [editingId, setEditingId] = useState(null);
    const [draftName, setDraftName] = useState("");
    const [draftAmount, setDraftAmount] = useState("");

    const total = expenses.reduce((running, expense) => running + expense.amount, 0);
    const formatKsh = (amount) => `Ksh ${amount.toLocaleString()}`;

    function startEdit(expense) {
        setEditingId(expense.id);
        setDraftName(expense.name);
        setDraftAmount(String(expense.amount));
    }

    function cancelEdit() {
        setEditingId(null);
    }

    async function saveEdit(id) {
        if (draftName.trim() === "" || Number(draftAmount) <= 0) return;

        const ok = await onUpdateExpense(id, {
            name: draftName,
            amount: Number(draftAmount)
        });
        if (ok) setEditingId(null);
    }

    function handleEditKeyDown(event, id) {
        if (event.key === "Enter") saveEdit(id);
        if (event.key === "Escape") cancelEdit();
    }

    return (
        <section>
            {expenses.length === 0 && (
                <p className="empty">Nothing spent yet. Add your first expense above.</p>
            )}

            <ul className="expense-list">
                {expenses.map((expense) =>
                    editingId === expense.id ? (
                        <li key={expense.id} className="expense">
                            <input
                                className="edit-input edit-name"
                                type="text"
                                aria-label="Expense name"
                                value={draftName}
                                onChange={(e) => setDraftName(e.target.value)}
                                onKeyDown={(e) => handleEditKeyDown(e, expense.id)}
                            />
                            <input
                                className="edit-input edit-amount"
                                type="number"
                                min="0"
                                aria-label="Expense amount"
                                value={draftAmount}
                                onChange={(e) => setDraftAmount(e.target.value)}
                                onKeyDown={(e) => handleEditKeyDown(e, expense.id)}
                            />
                            <button className="delete" onClick={() => saveEdit(expense.id)}>Save</button>
                            <button className="delete" onClick={cancelEdit}>Cancel</button>
                        </li>
                    ) : (
                        <li key={expense.id} className="expense">
                            <span className="expense-name">{expense.name}</span>
                            <span className="expense-amount">{formatKsh(expense.amount)}</span>
                            <button className="delete" onClick={() => startEdit(expense)}>Edit</button>
                            <button
                                className="delete"
                                aria-label={`Delete ${expense.name}`}
                                onClick={() => onDeleteExpense(expense.id)}
                            >
                                Delete
                            </button>
                        </li>
                    )
                )}
            </ul>

            <div className="total-row">
                <div className="total">
                    <span className="total-label">Total</span>
                    <span className="total-amount">{formatKsh(total)}</span>
                </div>
            </div>
        </section>
    );
}

export default ExpenseList;