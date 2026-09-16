//#region DOM ELEMENTS Assignments
const addBtn = document.getElementById('addbtn');
const overlay1 = document.getElementById('overlay1');
const addIncomeBtn = document.getElementById('aibtn');
const addExpenseBtn = document.getElementById('aebtn');
const overlay2 = document.getElementById('overlay2');
const balanceamount = document.getElementById('balanceAmount');
const incomeamount = document.getElementById('incomeAmount');
const expensesamount = document.getElementById('expensesAmount');
const transactionList = document.getElementById('transactionList');
const toptext = document.getElementById("transactionh2");
const closeBtn1 = document.getElementById('closebtn1');
const closeBtn2 = document.getElementById('closebtn2');
const closeBtn3 = document.getElementById('closebtn3');
const saveBtn2 = document.getElementById('savebtn2');
const saveBtn3 = document.getElementById('savebtn3');
const overlay3 = document.getElementById('overlay3');
const expAmountInput = document.getElementById('expamount');
const incAmountInput = document.getElementById('incamount');
const expCategoryInput = document.getElementById('expcategory');
const incCategoryInput = document.getElementById('inccategory');
const expDescriptionInput = document.getElementById('expdescription');
const incDescriptionInput = document.getElementById('incdescription');
const expDateInput = document.getElementById('expdate');
const incDateInput = document.getElementById('incdate');
const deleteTransactionBtn = document.getElementById('deletebtn');
const noTransactionsText = document.getElementById('emptymsg');
const reportBtn = document.getElementById("reportBtn");
const reportPage = document.getElementById("reportPage");
const dashBtn = document.getElementById("dashBtn");
const largestCategory = document.getElementById("largestCategory");
const largestCategoryValue = document.getElementById("largestCategoryValue");
const percentSpentValue = document.getElementById("percentSpentValue");
const freqCategory = document.getElementById("freqCategory");
const freqCategoryValue = document.getElementById("freqCategoryValue");
const ltIncDes = document.getElementById("ltIncDes");
const ltIncVal = document.getElementById("ltIncVal");
const ltExpDes = document.getElementById("ltExpDes");
const ltExpVal = document.getElementById("ltExpVal");
const txtDiv = document.getElementById("txtDiv");
const onlyIncome = document.getElementById("onlyIncome"); 
const repDivs = document.querySelectorAll(".rep");
const onlyIncomeMsg = document.getElementById("oiMsg");
const ltOiDes = document.getElementById("ltOiDes");
const previousMonthBtn = document.getElementById("previousMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const selectedMonthText = document.getElementById("selectedMonthText");
//#endregion


//=========================
// INITIAL SETUP
//=========================

reportPage.style.display = "none"; // hides the report page initially, so that the user sees the main dashboard when they first open the application.
txtDiv.style.display = "none"; // hides the text div that displays messages in the report page, as it will only be shown when there are no transactions to report.

flatpickr("#expdate");
flatpickr("#incdate"); // initializes the date picker for the expense and income date input fields using the Flatpickr library, allowing users to easily select dates for their transactions.

let selectedMonth = new Date(); 
renderSelectedMonth(); // updates the UI to display the currently selected month, which is initialized to the current date when the application is first loaded.
updateNextMonthButton(); // disables the "Next Month" button if the currently selected month is the same as the current month, preventing users from navigating to future months.


const currency = "₹";
balanceamount.textContent = `${currency}0.00`;
incomeamount.textContent = `${currency}0.00`;
expensesamount.textContent = `${currency}0.00`;


let deleteMode = false;


const transactionobjects = []; //main array for storing all transactions.



fetchTransactions();  // fetches transactions from local storage and renders them on the UI, as well as updating the stats for the selected month.
checkNoTransactions(); // checks if there are any transactions for the selected month and shows or hides the "no transactions" message accordingly.




// ===============================
// transaction and stats functions
// ===============================


function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactionobjects));
}


function fetchTransactions() {

    const savedTransactions = localStorage.getItem('transactions');

    if (savedTransactions) {

        transactionobjects.push(...JSON.parse(savedTransactions));

        renderTransactions();

        updateAndRenderStats();
    }
} // also handles rendering and stats update

function getTotalExpenses(transactions) {

    let totalExpense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === 'expense') {

            const amount = parseFloat(transaction.amount);

            totalExpense += amount;
        }
    });

    return totalExpense;
}


function getTotalIncome(transactions) {

    let totalIncome = 0;

    transactions.forEach(transaction => {

        if (transaction.type === 'income') {

            const amount = parseFloat(transaction.amount);

            totalIncome += amount;
        }
    });

    return totalIncome;
}

function getStats(transactions) {

    const totalIncome = getTotalIncome(transactions);

    const totalExpense = getTotalExpenses(transactions);

    const currentBalance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, currentBalance };
} // returns an object with totalIncome, totalExpense, and currentBalance
    
function updateAndRenderStats() {

    const monthlyTransactions =
        getTransactionsForMonth(getSelectedMonth());

    const { totalIncome, totalExpense, currentBalance } =
        getStats(monthlyTransactions);

    balanceamount.textContent =
        `${currency}${currentBalance.toFixed(2)}`;

    incomeamount.textContent =
        `${currency}${totalIncome.toFixed(2)}`;

    expensesamount.textContent =
        `${currency}${totalExpense.toFixed(2)}`;
} 

function renderTransactions() {

    transactionList.innerHTML = '';

    const monthlyTransactions =
        getTransactionsForMonth(getSelectedMonth());

    const sortedTransactions = [...monthlyTransactions].sort(
        (a, b) => b.date.localeCompare(a.date)
    );

    sortedTransactions.forEach(transaction => {

        const transactionItem = document.createElement('div');

        transactionItem.classList.add('transactionItem');
        transactionItem.dataset.id = transaction.id;

        transactionItem.innerHTML = `
            <div class="transactionDetails">
                <div><p class="transactionCategory">${transaction.category}</p></div>
                <div><p class="transactionDescription">${transaction.description}</p></div>
                <div><p class="transactionDate">${transaction.date}</p></div>
                <div><p class="transactionAmount ${transaction.type === 'expense' ? 'expenseamount' : 'incomeamount'}">${transaction.type === 'expense' ? '-' : '+'}${currency}${parseFloat(transaction.amount).toFixed(2)}</p></div>
            </div>
        `;

        transactionList.appendChild(transactionItem);
    });
} // gets selected month from a function, gets transactions for that month using another function, sorts them by date, and renders them

function addTransaction(type, amountInput, categoryInput, descriptionInput, dateInput, overlay) {

    const amount = parseFloat(amountInput.value);

    const category = categoryInput.value;

    const description = descriptionInput.value;

    const date = dateInput.value;


    if (isNaN(amount) || !category || !description || !date) {

        alert("Please fill in all fields correctly.");

        return;
    }

    transactionobjects.push({
        id: crypto.randomUUID(),
        type: type,
        amount: amount,
        category: category,
        description: description,
        date: date
    });


    updateLocalStorage();
    updateAndRenderStats();
    renderTransactions();
    checkNoTransactions();

    amountInput.value = '';
    categoryInput.value = '';
    descriptionInput.value = '';
    dateInput.value = '';

    overlay.style.display = 'none';
} // extracts and validates input from forms, creates a transaction object, updates local storage, stats, and UI, resets the form, and closes the overlay.


function checkNoTransactions() {

    const monthlyTransactions =
        getTransactionsForMonth(getSelectedMonth());

    if (monthlyTransactions.length === 0) {
        noTransactionsText.style.display = 'flex';
    } else {
        noTransactionsText.style.display = 'none';
    }
} // checks if there are transactions for the selected month and shows or hides the "no transactions" message accordingly.




// =========================
// DELETE MODE FUNCTIONS
// =========================

function handleTransactionClick(event) {
    if (!deleteMode) return;

    const transactionItem = event.currentTarget;

    if (transactionItem.style.backgroundColor === 'rgb(223, 140, 140)') {
        transactionItem.style.backgroundColor = 'white';
    } else {
        transactionItem.style.backgroundColor = 'rgb(223, 140, 140)';
    }
} // when in delete mode, clicking a transaction toggles its background color to indicate selection for deletion.


function setupTransactionClickListeners() {
    const transactionItems =
        document.querySelectorAll('.transactionItem');

    transactionItems.forEach(item => {
        item.addEventListener('click', handleTransactionClick);
    });
} // adds click event listeners to all transaction items, enabling the selection of transactions for deletion when in delete mode.


function createDeleteControls() {
    const deleteContainer =
        document.getElementById("deleteTransaction");

    const confirmDeleteBtn =
        document.createElement('button');

    confirmDeleteBtn.textContent = "Confirm Delete";
    confirmDeleteBtn.id = "confirmDeleteBtn";

    const cancelDeleteBtn =
        document.createElement('button');

    cancelDeleteBtn.textContent = "Cancel";
    cancelDeleteBtn.id = "cancelDeleteBtn";

    deleteContainer.appendChild(confirmDeleteBtn);
    deleteContainer.appendChild(cancelDeleteBtn);

    confirmDeleteBtn.addEventListener(
        'click',
        deleteSelectedTransactions
    );

    cancelDeleteBtn.addEventListener(
        'click',
        cancelDeleteMode
    );
} // creates "Confirm Delete" and "Cancel" buttons and sets up their respective event listeners using fuctions defined below.


function enterDeleteMode() {
    deleteTransactionBtn.disabled = true;
    deleteMode = true;

    toptext.textContent =
        "Click on a transaction to delete it";

    toptext.style.color = "red";

    setupTransactionClickListeners();
    createDeleteControls();
} // disables the delete button, sets delete mode to true, updates tui for delete mode, and calls functions to set up click listeners and create delete controls.


function cancelDeleteMode() {
    const transactionItems =
        document.querySelectorAll('.transactionItem');

    transactionItems.forEach(item => {
        item.style.backgroundColor = 'white';

        item.removeEventListener(
            'click',
            handleTransactionClick
        );
    });

    deleteTransactionBtn.disabled = false;
    deleteMode = false;

    toptext.textContent = "Transactions";
    toptext.style.color = "black";

    document.getElementById("confirmDeleteBtn")?.remove();
    document.getElementById("cancelDeleteBtn")?.remove();
} // cancels delete mode, resets the background color of all transaction items, removes click event listeners, re-enables the delete button, removes delete mode ui and the confirm and cancel buttons.


function deleteSelectedTransactions() {
    const transactionItems =
        document.querySelectorAll('.transactionItem');

    transactionItems.forEach(item => {

        if (item.style.backgroundColor === 'rgb(223, 140, 140)') {

            const id = item.dataset.id;

            const index = transactionobjects.findIndex(
                transaction => transaction.id === id
            );

            if (index !== -1) {
                transactionobjects.splice(index, 1);
            }
        }
    });
    updateLocalStorage();
    renderTransactions();
    updateAndRenderStats();
    cancelDeleteMode();
    checkNoTransactions();
} // deletes all selected transactions, updates local storage, re-renders the transaction list and stats, cancels delete mode, and checks if there are any transactions left for the selected month to show or hide the "no transactions" message accordingly.





// =========================
// REPORT DATA HELPERS
// =========================

function getIncomeTransactions(transactions) {
    return transactions.filter(
        transaction => transaction.type === 'income'
    );
} // returns a list of all income transactions from the provided list of transactions.

function getExpenseTransactions(transactions) {
    return transactions.filter(
        transaction => transaction.type === 'expense'
    );
} // returns a list of all expense transactions from the provided list of transactions.

function getLargestTransaction(transactions) {

    let largestValue = 0;
    let largestDescription;

    transactions.forEach(transaction => {

        if (transaction.amount > largestValue) {
            largestValue = transaction.amount;
            largestDescription = transaction.description;
        }
    });

    return {
        value: largestValue,
        description: largestDescription
    };
} // returns an object containing the value and description of the largest transaction from the provided list of transactions.


function getCategoryFrequency(transactions) {

    const occurrence = {};

    transactions.forEach(transaction => {

        if (!occurrence[transaction.category]) {
            occurrence[transaction.category] = 0;
        }

        occurrence[transaction.category]++;
    });

    return occurrence;
} // returns an object where each key is a category and its value is the number of times that category appears in the provided list of transactions.


function getMostFrequentCategory(transactions) {

    const occurrence = getCategoryFrequency(transactions);

    let highestFrequency = 0;
    let mostFrequentCategory;

    for (const category in occurrence) {

        if (occurrence[category] > highestFrequency) {
            highestFrequency = occurrence[category];
            mostFrequentCategory = category;
        }
    }

    return {
        category: mostFrequentCategory,
        frequency: highestFrequency
    };
} // returns an object containing the category that appears most frequently in the provided list of transactions and its frequency count.


function getExpensesByCategory(transactions) {

    const totalExpenses = {};

    transactions.forEach(transaction => {

        if (!totalExpenses[transaction.category]) {
            totalExpenses[transaction.category] = 0;
        }

        totalExpenses[transaction.category] += transaction.amount;
    });

    return totalExpenses;
} // returns an object where each key is a category and its value is the total amount spent in that category from the provided list of transactions.


function getLargestExpenseCategory(expensesByCategory) {

    let highestTotal = 0;
    let highestCategory;

    for (const category in expensesByCategory) {

        if (expensesByCategory[category] > highestTotal) {
            highestTotal = expensesByCategory[category];
            highestCategory = category;
        }
    }

    return {
        category: highestCategory,
        value: highestTotal
    };
} // returns an object containing the category with the highest total expense and its corresponding value from the provided object of getExpensesByCategory.


function getPercentageSpent(transactions) {

    const totalIncome = getTotalIncome(transactions);
    const totalExpense = getTotalExpenses(transactions);

    if (totalIncome === 0) {
        return null;
    }

    return (totalExpense * 100) / totalIncome;
} // returns the percentage of income that has been spent based on the provided list of transactions. If there is no income, it returns null.





// =========================
// REPORT UI HELPERS
// =========================

function showEmptyReport() {

    repDivs.forEach(div => {
        div.style.display = "none";
    });

    txtDiv.textContent = "Add a transaction to get started";
    txtDiv.style.fontSize = "40px";
    txtDiv.style.height = "100%";
    txtDiv.style.width = "100%";
    txtDiv.style.textAlign = "center";
    txtDiv.style.marginTop = "10%";
    txtDiv.style.color = "gray";
    txtDiv.style.display = "block";
} // hides all report divs and displays a message prompting the user to add a transaction to get started with the report.


function showOnlyIncomeReport(transactions) {

    repDivs.forEach(div => {
        div.style.display = "none";
    });

    const incomeTransactions = getIncomeTransactions(transactions);

    const largestIncome =
        getLargestTransaction(incomeTransactions);

    const ltOi = document.getElementById("ltOi");
    const bal = document.getElementById("bal");

    ltOi.textContent =
        `${currency}${largestIncome.value.toFixed(2)}`;
    ltOiDes.textContent = largestIncome.description;
    bal.textContent = balanceamount.textContent;
    onlyIncomeMsg.style.display = "flex";
    onlyIncome.style.display = "flex";
} // hides all report divs, calculates the largest income transaction, and displays the largest income and current balance in a message indicating that there are only income transactions for the selected month.


function showNormalReport() {

    repDivs.forEach(div => {
        div.style.display = "flex";
    });
} // displays all report divs, indicating that there are both income and expense transactions for the selected month.


function renderLargestTransactions(
    largestIncome,
    largestExpense
) {

    ltExpDes.textContent = largestExpense.description;

    ltExpVal.textContent =
        `${currency}${largestExpense.value.toFixed(2)}`;

    ltIncDes.textContent = largestIncome.description;

    ltIncVal.textContent =
        `${currency}${largestIncome.value.toFixed(2)}`;
} // updates the report UI to display the description and value of the largest income and expense transactions for the selected month.


function renderMostFrequentCategory(transactions) {

    const expenseTransactions =
        getExpenseTransactions(transactions);

    const result =
        getMostFrequentCategory(expenseTransactions);

    freqCategory.textContent = result.category;
    freqCategoryValue.textContent = result.frequency;
} // updates the report UI to display the most frequent expense category and its frequency for the selected month.


function renderPercentageSpent(transactions) {

    const percentageSpent =
        getPercentageSpent(transactions);

    if (percentageSpent === null) {
        percentSpentValue.textContent = "No income yet";
        percentSpentValue.style.color = "gray";
        return;
    }

    percentSpentValue.style.color = "red";

    percentSpentValue.textContent =
        `${percentageSpent.toFixed(2)}%`;
} // updates the report UI to display the percentage of income that has been spent for the selected month. If there is no income, it displays a message indicating that there is no income yet and styles the text in gray.


function renderExpenseChart(transactions) {

    const expenseTransactions =
        getExpenseTransactions(transactions);

    const expensesByCategory =
        getExpensesByCategory(expenseTransactions);

    expenseChart.data.labels =
        Object.keys(expensesByCategory);

    expenseChart.data.datasets[0].data =
        Object.values(expensesByCategory);

    expenseChart.update();

    return expensesByCategory;
} // updates the expense chart in the report UI to display the total expenses by category for the selected month. It retrieves the expense transactions, calculates the total expenses by category, updates the chart's labels and data, and then refreshes the chart. It also returns the expenses by category for further use in other report functions.


function renderLargestExpenseCategory(expensesByCategory) {

    const result =
        getLargestExpenseCategory(expensesByCategory);

    largestCategory.textContent =
        result.category;

    largestCategoryValue.textContent =
        `${currency}${result.value.toFixed(2)}`;
} // updates the report UI to display the category with the highest total expense and its corresponding value for the selected month. It retrieves the largest expense category from the provided expenses by category object and updates the relevant UI elements with the category name and formatted value.




// =========================
// MAIN REPORT FUNCTION
// =========================

function renderReport() {

    const monthlyTransactions =
        getTransactionsForMonth(getSelectedMonth());

    const incomeTransactions =
        getIncomeTransactions(monthlyTransactions);

    const expenseTransactions =
        getExpenseTransactions(monthlyTransactions);


    // No transactions
    if (monthlyTransactions.length === 0) {

    showEmptyReport();

    return;
    }


    // Only income
    if (expenseTransactions.length === 0) {

    showOnlyIncomeReport(monthlyTransactions);
    
    return;
}


    // Income + expenses
    showNormalReport();


    const largestIncome =
        getLargestTransaction(incomeTransactions);

    const largestExpense =
        getLargestTransaction(expenseTransactions);


    renderLargestTransactions(
        largestIncome,
        largestExpense
    );

    renderMostFrequentCategory(monthlyTransactions);

    renderPercentageSpent(monthlyTransactions);

    const expensesByCategory =
    renderExpenseChart(monthlyTransactions);

    renderLargestExpenseCategory(
        expensesByCategory
    );
} // main function that retrieves the transaction for the selected month, check whether it's just income, or empty or normal and calls the appropriate functions to render the report UI accordingly.




// =========================
// MONTH SELECTION FUNCTIONS
// =========================

function renderSelectedMonth() {
    selectedMonthText.textContent =
        selectedMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });
} // updates the UI to display the currently selected month in a human-readable format.


function getSelectedMonth() {
    return `${selectedMonth.getFullYear()}-${String(
        selectedMonth.getMonth() + 1
    ).padStart(2, '0')}`;
} // returns the currently selected month in the format "YYYY-MM", which is used to filter transactions for that specific month.


function getTransactionsForMonth(month) {
    return transactionobjects.filter(transaction =>
        transaction.date.startsWith(month)
    );
} // returns a list of transactions that belong to the specified month.


function updateNextMonthButton() {
    const now = new Date();

    nextMonthBtn.disabled =
        selectedMonth.getFullYear() === now.getFullYear() &&
        selectedMonth.getMonth() === now.getMonth();
} // disables the "Next Month" button if the currently selected month is the same as the current month, preventing users from navigating to future months where no transactions can exist.







// =========================
// EVENT LISTENERS
// =========================


// add transaction overlay event listeners:

addBtn.addEventListener('click', () => {
    overlay1.style.display = 'flex';
}); // opens the first overlay when the "Add" button is clicked, allowing users to choose between adding an income or expense transaction.


closeBtn1.addEventListener('click', () => {
    overlay1.style.display = 'none';
}) // closes the first overlay when the close button is clicked, returning the user to the main dashboard without adding a transaction.


addExpenseBtn.addEventListener('click', () => {
    overlay1.style.display = 'none';
    overlay2.style.display = 'flex';
    overlay3.style.display = 'none';
}) // opens the second overlay for adding an expense transaction when the "Add Expense" button is clicked, while ensuring that the first and third overlays are hidden.


addIncomeBtn.addEventListener('click', () => {
    overlay1.style.display = 'none';
    overlay2.style.display = 'none';
    overlay3.style.display = 'flex';
}) // opens the third overlay for adding an income transaction when the "Add Income" button is clicked, while ensuring that the first and second overlays are hidden.


saveBtn2.addEventListener('click', () => {
    addTransaction(
        'expense',
        expAmountInput,
        expCategoryInput,
        expDescriptionInput,
        expDateInput,
        overlay2
    );
}); // saves the expense transaction when the "Save" button is clicked in the second overlay, calling the addTransaction function with the appropriate parameters and closing the overlay afterward.


closeBtn2.addEventListener('click', () => {
    overlay2.style.display = 'none';
}) // closes the second overlay when the close button is clicked, returning the user to the main dashboard without adding an expense transaction.


saveBtn3.addEventListener('click', () => {
    addTransaction(
        'income',
        incAmountInput,
        incCategoryInput,
        incDescriptionInput,
        incDateInput,
        overlay3
    );
}); // saves the income transaction when the "Save" button is clicked in the third overlay, calling the addTransaction function with the appropriate parameters and closing the overlay afterward.


closeBtn3.addEventListener('click', () => {
    overlay3.style.display = 'none';
}) // closes the third overlay when the close button is clicked, returning the user to the main dashboard without adding an income transaction.

//=========================




deleteTransactionBtn.addEventListener('click', () => {
    if (getTransactionsForMonth(getSelectedMonth()).length === 0) {
        alert("No transactions to delete.");
        return;
    }

    enterDeleteMode();
}); // enables delete mode when the "Delete Transaction" button is clicked, allowing users to select transactions for deletion. If there are no transactions, it alerts the user that there are no transactions to delete.


reportBtn.addEventListener("click", () => {

    reportPage.style.display = "flex";
    txtDiv.style.display = "none";
    onlyIncomeMsg.style.display = "none";
    onlyIncome.style.display = "none";
    renderReport();
}); // displays the report page when the "Report" button is clicked, hides unnecessary UI elements, and calls the renderReport function to generate the report based on the currently selected month and its transactions.


dashBtn.addEventListener("click", () => {
    reportPage.style.display = "none";
}); // hides the report page and returns to the main dashboard when the "Dashboard" button is clicked.


previousMonthBtn.addEventListener("click", () => {
    selectedMonth.setMonth(selectedMonth.getMonth() - 1);

    renderSelectedMonth();
    renderTransactions();
    updateAndRenderStats();
    checkNoTransactions();
    updateNextMonthButton();
}); // updates the selected month to the previous month when the "Previous Month" button is clicked, and calls functions to update the UI and data accordingly.


nextMonthBtn.addEventListener("click", () => {
    selectedMonth.setMonth(selectedMonth.getMonth() + 1);

    renderSelectedMonth();
    renderTransactions();
    updateAndRenderStats();
    checkNoTransactions();
    updateNextMonthButton();
}); // updates the selected month to the next month when the "Next Month" button is clicked, and calls functions to update the UI and data accordingly. It also calls a function to ensure that the "Next Month" button is disabled if the selected month is the current month.


//========================

//#region CHART SETUP
const ctx = document.getElementById("myChart");
Chart.register(ChartDataLabels);

let expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                "#ff6384",
                "#36a2eb",
                "#ffce56",
                "#4bc0c0",
                "#9966ff",
                "#ff9f40"
            ]
        }]
    },
    plugins: [ChartDataLabels],
    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            datalabels: {
                color: "white",
                font: {
                    weight: "bold",
                    size: 16
                },
                formatter: (value) => value
            }
        }
    }
});
//#endregion

//======================== 