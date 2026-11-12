function ExpenseList({ expenses, onDeleteExpense }) {
    const total = expenses.reduce((running, expense) => running + expense.amount, 0);

    // 25000 becomes "Ksh 25,000"
    const formatKsh = (amount) => `Ksh ${amount.toLocaleString()}`;

    return (
        <section>
            {expenses.length === 0 && (
                <p className="empty">No expenses yet. Add your first one above.</p>
            )}

            <ul className="expense-list">
                {expenses.map((expense) => (
                    <li key={expense.id} className="expense">
                        <span className="expense-name">{expense.name}</span>
                        <span className="leader" aria-hidden="true"></span>
                        <span className="expense-amount">{formatKsh(expense.amount)}</span>
                        <button
                            className="delete"
                            aria-label={`Delete ${expense.name}`}
                            onClick={() => onDeleteExpense(expense.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <div className="total">
                <span className="total-label">Total</span>
                <span className="total-amount">{formatKsh(total)}</span>
            </div>
        </section>
    );
}

export default ExpenseList;