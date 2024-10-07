document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmountEl = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");
    const clearExpensesBtn = document.getElementById("clear-expenses");
    const exportCsvBtn = document.getElementById("export-csv");

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // Function to display expenses
    const displayExpenses = (expenseArray) => {
        expenseList.innerHTML = "";
        let totalAmount = 0;

        expenseArray.forEach((expense, index) => {
            const expenseRow = document.createElement("tr");

            expenseRow.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </td>
            `;

            expenseList.appendChild(expenseRow);
            totalAmount += parseFloat(expense.amount);
        });

        totalAmountEl.textContent = totalAmount.toFixed(2);

        // Save expenses to localStorage
        localStorage.setItem("expenses", JSON.stringify(expenseArray));
    };

    // Add Expense
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value.trim();
        const amount = parseFloat(document.getElementById("expense-amount").value.trim());
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        if (name && amount > 0 && category && date) {
            expenses.push({ name, amount, category, date });
            displayExpenses(expenses);

            // Clear form inputs after submission
            form.reset();
        } else {
            alert("Please enter valid data for all fields.");
        }
    });

    // Delete Expense
    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const index = e.target.getAttribute("data-index");
            expenses.splice(index, 1);
            displayExpenses(expenses);
        }
    });

    // Clear All Expenses
    clearExpensesBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all expenses?")) {
            expenses = [];
            displayExpenses(expenses);
        }
    });

    // Filter by Category
    filterCategory.addEventListener("change", (e) => {
        const selectedCategory = e.target.value;

        if (selectedCategory === "All") {
            displayExpenses(expenses);
        } else {
            const filteredExpenses = expenses.filter(expense => expense.category === selectedCategory);
            displayExpenses(filteredExpenses);
        }
    });

    // Export Expenses to CSV
    exportCsvBtn.addEventListener("click", () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Expense Name,Amount,Category,Date\n";

        expenses.forEach(expense => {
            csvContent += `${expense.name},${expense.amount},${expense.category},${expense.date}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "expenses.csv");
        document.body.appendChild(link);
        link.click();
    });

    // Initialize display
    displayExpenses(expenses);
});
