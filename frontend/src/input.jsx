import { useState } from "react"


function Input({ onAddExpense }) {
    const [inputValue, setInputValue] = useState('');
    const [amountValue, setAmountValue] = useState('');

    const handleSubmit = (event) =>{
        event.preventDefault();

        if(inputValue.trim() === "" || amountValue === "" || Number(amountValue) <= 0) return;
        onAddExpense({name: inputValue, amount: Number(amountValue)});

        setInputValue("");
        setAmountValue("");
    }

    
    return(
        <>
            <form onSubmit={handleSubmit}>
                <p>Input expense name:</p>
                <input className="expenseName" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>

                <p>input expense amount:</p>
                <input className="expenseAmount" type="number" value={amountValue} onChange={(e) => setAmountValue(e.target.value)} />
                <div>
                    <button type="submit">Submit</button>
                </div>

                
            </form>
        </>
    )
}

export default Input