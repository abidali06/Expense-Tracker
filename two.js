const addBtn = document.getElementById('addbtn');
const overlay1 = document.getElementById('overlay1');
const addIncomeBtn = document.getElementById('aibtn');
const addExpenseBtn = document.getElementById('aebtn');
const overlay2 = document.getElementById('overlay2');
const addExpenseWindow = document.getElementById('addexpensewindow');
const addIncomeWindow = document.getElementById('addincomewindow');
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
const previousMonthBtn = document.getElementById("previousMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const selectedMonthText = document.getElementById("selectedMonthText");


reportPage.style.display = "none";
txtDiv.style.display = "none";

flatpickr("#expdate");
flatpickr("#incdate");


const transactionobjects = [];


const currency = "₹";
balanceamount.textContent = `${currency}0.00`;
incomeamount.textContent = `${currency}0.00`;
expensesamount.textContent = `${currency}0.00`;


let deleteMode = false;
let selectedMonth = new Date();



fetchTransactions();  // also handles rendering and stats update
checkNoTransactions();



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
}

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

function getStats() {

    const totalIncome = getTotalIncome();

    const totalExpense = getTotalExpenses();

    const currentBalance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, currentBalance };

}
    
function updateAndRenderStats() {

    const { totalIncome, totalExpense, currentBalance } = getStats();

    balanceamount.textContent = `${currency}${currentBalance.toFixed(2)}`;

    incomeamount.textContent = `${currency}${totalIncome.toFixed(2)}`;

    expensesamount.textContent = `${currency}${totalExpense.toFixed(2)}`;
}

function renderTransactions() {

    transactionList.innerHTML = '';

    const sortedTransactions = [...transactionobjects].sort(
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
}

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
}


function checkNoTransactions() {

    if (transactionobjects.length === 0) {

        noTransactionsText.style.display = 'flex';

    } else {

        noTransactionsText.style.display = 'none';
    }
}

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
}


function setupTransactionClickListeners() {
    const transactionItems =
        document.querySelectorAll('.transactionItem');

    transactionItems.forEach(item => {
        item.addEventListener('click', handleTransactionClick);
    });
}


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
}


function enterDeleteMode() {
    deleteTransactionBtn.disabled = true;
    deleteMode = true;

    toptext.textContent =
        "Click on a transaction to delete it";

    toptext.style.color = "red";

    setupTransactionClickListeners();
    createDeleteControls();
}


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
}


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
}


// =========================
// REPORT DATA HELPERS
// =========================

function getIncomeTransactions() {

    return transactionobjects.filter(
        transaction => transaction.type === 'income'
    );
}


function getExpenseTransactions() {

    return transactionobjects.filter(
        transaction => transaction.type === 'expense'
    );
}


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
}


function getCategoryFrequency(transactions) {

    const occurrence = {};

    transactions.forEach(transaction => {

        if (!occurrence[transaction.category]) {
            occurrence[transaction.category] = 0;
        }

        occurrence[transaction.category]++;
    });

    return occurrence;
}


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
}


function getExpensesByCategory(transactions) {

    const totalExpenses = {};

    transactions.forEach(transaction => {

        if (!totalExpenses[transaction.category]) {
            totalExpenses[transaction.category] = 0;
        }

        totalExpenses[transaction.category] += transaction.amount;
    });

    return totalExpenses;
}


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
}


function getPercentageSpent() {

    const totalIncome = getTotalIncome();
    const totalExpense = getTotalExpenses();

    if (totalIncome === 0) {
        return null;
    }

    return (totalExpense * 100) / totalIncome;
}


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
}


function showOnlyIncomeReport() {

    repDivs.forEach(div => {
        div.style.display = "none";
    });

    const incomeTransactions = getIncomeTransactions();
    const largestIncome =
        getLargestTransaction(incomeTransactions);

    const ltOi = document.getElementById("ltOi");
    const bal = document.getElementById("bal");

    ltOi.textContent =
        `${currency}${largestIncome.value.toFixed(2)}`;

    bal.textContent = balanceamount.textContent;
    onlyIncomeMsg.style.display = "flex";
    onlyIncome.style.display = "flex";
}


function showNormalReport() {

    repDivs.forEach(div => {
        div.style.display = "flex";
    });
}


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
}


function renderMostFrequentCategory() {

    const expenseTransactions = getExpenseTransactions();

    const result =
        getMostFrequentCategory(expenseTransactions);

    freqCategory.textContent = result.category;
    freqCategoryValue.textContent = result.frequency;
}


function renderPercentageSpent() {

    const percentageSpent = getPercentageSpent();

    if (percentageSpent === null) {

        percentSpentValue.textContent = "No income yet";
        percentSpentValue.style.color = "gray";

        return;
    }

    percentSpentValue.style.color = "red";

    percentSpentValue.textContent =
        `${percentageSpent.toFixed(2)}%`;
}


function renderExpenseChart() {

    const expenseTransactions = getExpenseTransactions();

    const expensesByCategory =
        getExpensesByCategory(expenseTransactions);

    expenseChart.data.labels =
        Object.keys(expensesByCategory);

    expenseChart.data.datasets[0].data =
        Object.values(expensesByCategory);

    expenseChart.update();

    return expensesByCategory;
}


function renderLargestExpenseCategory(expensesByCategory) {

    const result =
        getLargestExpenseCategory(expensesByCategory);

    largestCategory.textContent =
        result.category;

    largestCategoryValue.textContent =
        `${currency}${result.value.toFixed(2)}`;
}


// =========================
// MAIN REPORT FUNCTION
// =========================

function renderReport() {

    const incomeTransactions =
        getIncomeTransactions();

    const expenseTransactions =
        getExpenseTransactions();


    // No transactions
    if (transactionobjects.length === 0) {

        showEmptyReport();

        return;
    }


    // Only income
    if (expenseTransactions.length === 0) {

        showOnlyIncomeReport();

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

    renderMostFrequentCategory();

    renderPercentageSpent();

    const expensesByCategory =
        renderExpenseChart();

    renderLargestExpenseCategory(
        expensesByCategory
    );
}


// =========================
// MONTH SELECTION FUNCTIONS
// =========================
function renderSelectedMonth() {
    selectedMonthText.textContent =
        selectedMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });
}


function getSelectedMonth() {
    return `${selectedMonth.getFullYear()}-${String(
        selectedMonth.getMonth() + 1
    ).padStart(2, '0')}`;
}


function getTransactionsForMonth(month) {
    return transactionobjects.filter(transaction =>
        transaction.date.startsWith(month)
    );
}



// =========================
// EVENT LISTENERS
// =========================

addBtn.addEventListener('click', () => {
    overlay1.style.display = 'flex';
});


closeBtn1.addEventListener('click', () => {
    overlay1.style.display = 'none';
})


closeBtn2.addEventListener('click', () => {
    overlay2.style.display = 'none';
})


closeBtn3.addEventListener('click', () => {
    overlay3.style.display = 'none';
})


addExpenseBtn.addEventListener('click', () => {
    overlay1.style.display = 'none';
    overlay2.style.display = 'flex';
    overlay3.style.display = 'none';
})


addIncomeBtn.addEventListener('click', () => {
    overlay1.style.display = 'none';
    overlay2.style.display = 'none';
    overlay3.style.display = 'flex';
})

saveBtn2.addEventListener('click', () => {
    addTransaction(
        'expense',
        expAmountInput,
        expCategoryInput,
        expDescriptionInput,
        expDateInput,
        overlay2
    );
});

saveBtn3.addEventListener('click', () => {
    addTransaction(
        'income',
        incAmountInput,
        incCategoryInput,
        incDescriptionInput,
        incDateInput,
        overlay3
    );
});


deleteTransactionBtn.addEventListener('click', () => {
    if (transactionobjects.length === 0) {
        alert("No transactions to delete.");
        return;
    }

    enterDeleteMode();
});


reportBtn.addEventListener("click", () => {

    reportPage.style.display = "flex";
    txtDiv.style.display = "none";
    onlyIncomeMsg.style.display = "none";
    onlyIncome.style.display = "none";
    renderReport();
});

dashBtn.addEventListener("click", () => {
    reportPage.style.display = "none";
});

// =========================
// MONTH SELECTION EVENT LISTENERS
// =========================

previousMonthBtn.addEventListener("click", () => {
    selectedMonth.setMonth(selectedMonth.getMonth() - 1);

    renderSelectedMonth();
});

nextMonthBtn.addEventListener("click", () => {
    selectedMonth.setMonth(selectedMonth.getMonth() + 1);

    renderSelectedMonth();
});

renderSelectedMonth();




// Key-value pairs
const expenses = {
    Food: 250,
    Rent: 900,
    Transport: 120,
    Entertainment: 180
};

// Separate keys and values
const labels = Object.keys(expenses);
const values = Object.values(expenses);

// Draw chart
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


// add sorting of transactions, date features, handle tie in report stats

     <div id="monthSelector">
        <button id="previousMonthBtn">&lt;</button>

        <span id="selectedMonthText">September 2026</span>

        <button id="nextMonthBtn">&gt;</button>
     </div>

     #monthSelector {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    margin-left: 10px;
    font-size: larger;
}