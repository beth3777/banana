function ExpenseList({expenses, onDeleteExpense}){
    const total = expenses.reduce((running, expense) => running + expense.amount, 0);

    return (
        <>
            <ol>
                {expenses.map((expense) => (
                    <li key={expense.id}>
                        {expense.name}: {expense.amount}
                        <button onClick={() => onDeleteExpense(expense.id)}>Delete</button>
                    </li>
                ))}
            </ol>
            <p>Total: {total}</p>
        </>
    )
}
export default ExpenseList;