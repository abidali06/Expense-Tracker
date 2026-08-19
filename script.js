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
const noTransactionsText = document.getElementById('noTransactions');
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
reportPage.style.display = "none";
txtDiv.style.display = "none";

flatpickr("#expdate");
flatpickr("#incdate");

const currency = "₹";
balanceamount.textContent = `${currency}0.00`;
incomeamount.textContent = `${currency}0.00`;
expensesamount.textContent = `${currency}0.00`;

const expenseobjects = [];
const incomeobjects = [];
let noTransaction = true;

const savedExpenses = localStorage.getItem('expenses');
if (savedExpenses) {
    expenseobjects.push(...JSON.parse(savedExpenses));
    expenseobjects.forEach(expense => {
        const transactionItem = document.createElement('div');
        transactionItem.classList.add('transactionItem');
        transactionItem.innerHTML = `
            <div class="transactionDetails">
                <div><p class="transactionCategory">${expense.category}</p></div>
                <div><p class="transactionDescription">${expense.description}</p></div>
                <div><p class="transactionDate">${expense.date}</p></div>
                <div><p class="transactionAmount expenseamount">-${currency}${expense.amount.toFixed(2)}</p></div>
            </div>
        `;
        noTransaction = false;
        noTransactionsText.style.display = 'none';
        transactionList.appendChild(transactionItem);

        // Update balance and expense
        const currentBalance = parseFloat(balanceamount.textContent.replace(currency, ''));
        const currentExpense = parseFloat(expensesamount.textContent.replace(currency, ''));
        balanceamount.textContent = `${currency}${(currentBalance - expense.amount).toFixed(2)}`;
        expensesamount.textContent = `${currency}${(currentExpense + expense.amount).toFixed(2)}`;
    });
}

const savedIncome = localStorage.getItem('incomeobjects');
if (savedIncome) {
    incomeobjects.push(...JSON.parse(savedIncome));
    incomeobjects.forEach(income => {
        const transactionItem = document.createElement('div');
        transactionItem.classList.add('transactionItem');
        transactionItem.innerHTML = `
            <div class="transactionDetails">
                <div><p class="transactionCategory">${income.category}</p></div>
                <div><p class="transactionDescription">${income.description}</p></div>
                <div><p class="transactionDate">${income.date}</p></div>
                <div><p class="transactionAmount incomeamount">+${currency}${income.amount.toFixed(2)}</p></div>
            </div>
        `;
        noTransaction = false;
        noTransactionsText.style.display = 'none';
        transactionList.appendChild(transactionItem);

        // Update balance and income
        const currentBalance = parseFloat(balanceamount.textContent.replace(currency, ''));
        const currentIncome = parseFloat(incomeamount.textContent.replace(currency, ''));
        balanceamount.textContent = `${currency}${(currentBalance + income.amount).toFixed(2)}`;
        incomeamount.textContent = `${currency}${(currentIncome + income.amount).toFixed(2)}`;
    });
}

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
addIncomeBtn.addEventListener('click', () => {
    overlay1.style.display = 'none';
    overlay3.style.display = 'flex';
    addIncomeWindow.style.display = 'flex';
    addExpenseWindow.style.display = 'none';
})
addExpenseBtn.addEventListener('click', () => {
    overlay1.style.display = 'none';
    overlay2.style.display = 'flex';
    addExpenseWindow.style.display = 'flex';
    addIncomeWindow.style.display = 'none';
})
saveBtn2.addEventListener('click', () => {
    const amount = parseFloat(expAmountInput.value);
    const category = expCategoryInput.value;
    const description = expDescriptionInput.value;
    const date = expDateInput.value;

    if (isNaN(amount) || !category || !description || !date) {
        alert("Please fill in all fields correctly.");
        return;
    }

    expenseobjects.push({
        amount: amount,
        category: category,
        description: description,
        date: date
    });

    localStorage.setItem('expenses', JSON.stringify(expenseobjects));

    const transactionItem = document.createElement('div');
    transactionItem.classList.add('transactionItem');
    transactionItem.innerHTML = `
        <div class="transactionDetails">
            <div><p class="transactionCategory">${category}</p></div>
            <div><p class="transactionDescription">${description}</p></div>
            <div><p class="transactionDate">${date}</p></div>
            <div><p class="transactionAmount expenseamount">-${currency}${amount.toFixed(2)}</p></div>
        </div>
    `;
    noTransaction = false;
    noTransactionsText.style.display = 'none';
    transactionList.prepend(transactionItem);

    // Update balance and expense
    const currentBalance = parseFloat(balanceamount.textContent.replace(currency, ''));
    const currentExpense = parseFloat(expensesamount.textContent.replace(currency, ''));
    balanceamount.textContent = `${currency}${(currentBalance - amount).toFixed(2)}`;
    expensesamount.textContent = `${currency}${(currentExpense + amount).toFixed(2)}`;

    // Clear input fields
    expAmountInput.value = '';
    expCategoryInput.value = '';
    expDescriptionInput.value = '';
    expDateInput.value = '';

    overlay2.style.display = 'none';
});
saveBtn3.addEventListener('click', () => {
    const amount = parseFloat(incAmountInput.value);
    const category = incCategoryInput.value;
    const description = incDescriptionInput.value;
    const date = incDateInput.value;

    if (isNaN(amount) || !category || !description || !date) {
        alert("Please fill in all fields correctly.");
        return;
    }

    incomeobjects.push({
        amount: amount,
        category: category,
        description: description,
        date: date
    });
    localStorage.setItem('incomeobjects', JSON.stringify(incomeobjects));

    const transactionItem = document.createElement('div');
    transactionItem.classList.add('transactionItem');
    transactionItem.innerHTML = `
        <div class="transactionDetails">
            <div><p class="transactionCategory">${category}</p></div>
            <div><p class="transactionDescription">${description}</p></div>
            <div><p class="transactionDate">${date}</p></div>
            <div><p class="transactionAmount incomeamount">+${currency}${amount.toFixed(2)}</p></div>
        </div>
    `;
    noTransaction = false;
    noTransactionsText.style.display = 'none';
    transactionList.prepend(transactionItem);

    // Update balance and income
    const currentBalance = parseFloat(balanceamount.textContent.replace(currency, ''));
    const currentIncome = parseFloat(incomeamount.textContent.replace(currency, ''));
    balanceamount.textContent = `${currency}${(currentBalance + amount).toFixed(2)}`;
    incomeamount.textContent = `${currency}${(currentIncome + amount).toFixed(2)}`;

    // Clear input fields
    incAmountInput.value = '';
    incCategoryInput.value = '';
    incDescriptionInput.value = '';
    incDateInput.value = '';

    overlay3.style.display = 'none';
});
let deleteMode = false;
deleteTransactionBtn.addEventListener('click', () => {
    if (noTransaction) {
        alert("No transactions to delete.");
        return;
    }
    deleteTransactionBtn.disabled = true;
    deleteMode = true;
    const toptext = document.getElementById("transactionh2");
    toptext.textContent = "Click on a transaction to delete it";
    toptext.style.color = "red";
    function handleTransactionClick(event) {
        if (deleteMode) {
            const transactionItem = event.currentTarget;
            if (transactionItem.style.backgroundColor === 'rgb(223, 140, 140)') {
                transactionItem.style.backgroundColor = 'white';
            } else {
                transactionItem.style.backgroundColor = 'rgb(223, 140, 140)';
            }
        }
    }
    const transactionItems = document.querySelectorAll('.transactionItem');
    transactionItems.forEach(item => {
        item.addEventListener('click', handleTransactionClick);       
    });
    const confirmDeleteBtn = document.createElement('button');
    confirmDeleteBtn.textContent = "Confirm Delete";
    confirmDeleteBtn.id = "confirmDeleteBtn";
    document.getElementById("deleteTransaction").appendChild(confirmDeleteBtn);
    const cancelDeleteBtn = document.createElement('button');
    cancelDeleteBtn.textContent = "Cancel";
    cancelDeleteBtn.id = "cancelDeleteBtn";
    document.getElementById("deleteTransaction").appendChild(cancelDeleteBtn);
    cancelDeleteBtn.addEventListener('click', () => {
        deleteTransactionBtn.disabled = false;
        toptext.textContent = "Transactions";
        toptext.style.color = "black";
        const transactionItems = document.querySelectorAll('.transactionItem');
        transactionItems.forEach(item => {
            item.style.backgroundColor = 'white';
        });
        confirmDeleteBtn.remove();
        cancelDeleteBtn.remove();
        deleteMode = false;
        transactionItems.forEach(item => {
            item.removeEventListener('click', handleTransactionClick);
        });
    });
    confirmDeleteBtn.addEventListener('click', () => {
        const transactionItems = document.querySelectorAll('.transactionItem');
        transactionItems.forEach(item => {
            if(item.style.backgroundColor === 'rgb(223, 140, 140)') {
                const category = item.querySelector('.transactionCategory').textContent;
                const description = item.querySelector('.transactionDescription').textContent;
                const date = item.querySelector('.transactionDate').textContent;
                const amountText = item.querySelector('.transactionAmount').textContent;
                const amount = parseFloat(amountText.replace(currency, '').replace('+', '').replace('-', ''));
                if(amountText.includes('-')) {
                    // It's an expense
                    const index = expenseobjects.findIndex(expense => expense.category === category && expense.description === description && expense.date === date && expense.amount === amount);
                    if(index !== -1) {
                        expenseobjects.splice(index, 1);
                        localStorage.setItem('expenses', JSON.stringify(expenseobjects));
                        const currentBalance = parseFloat(balanceamount.textContent.replace(currency, ''));
                        const currentExpense = parseFloat(expensesamount.textContent.replace(currency, ''));
                        balanceamount.textContent = `${currency}${(currentBalance + amount).toFixed(2)}`;
                        expensesamount.textContent = `${currency}${(currentExpense - amount).toFixed(2)}`;
                    }
                } else {
                    // It's an income
                    const index = incomeobjects.findIndex(income => income.category === category && income.description === description && income.date === date && income.amount === amount);
                    if(index !== -1) {
                        incomeobjects.splice(index, 1);
                        localStorage.setItem('incomeobjects', JSON.stringify(incomeobjects));
                        const currentBalance = parseFloat(balanceamount.textContent.replace(currency, ''));
                        const currentIncome = parseFloat(incomeamount.textContent.replace(currency, ''));
                        balanceamount.textContent = `${currency}${(currentBalance - amount).toFixed(2)}`;
                        incomeamount.textContent = `${currency}${(currentIncome - amount).toFixed(2)}`;
                    }
                }
                item.remove();
            }
        });
        if(transactionList.children.length === 0) {
            noTransaction = true;
            noTransactionsText.style.display = 'block';
        }
        deleteTransactionBtn.disabled = false;
        toptext.textContent = "Transactions";
        toptext.style.color = "black";
        confirmDeleteBtn.remove();
        cancelDeleteBtn.remove();
        transactionItems.forEach(item => {
            item.removeEventListener('click', handleTransactionClick);
        });
        deleteMode = false;
    });
});

reportBtn.addEventListener("click", () => {
    let largestIncVal = 0;
    let largestInc;
    incomeobjects.forEach(object => {
        if (object.amount > largestIncVal) {
            largestIncVal = object.amount;
            largestInc = object.description;
        }
    })

    let largestExpVal = 0;
    let largestExp;
    expenseobjects.forEach(object => {
        if (object.amount > largestExpVal) {
            largestExpVal = object.amount;
            largestExp = object.description;
        }
    })
    reportPage.style.display = "flex";
    if (expenseobjects.length === 0 && incomeobjects.length === 0) {
        repDivs.forEach(div => {
            div.style.display = "none";
        })
        
        txtDiv.textContent = "Add a transaction to get started";
        txtDiv.style.fontSize = "40px";
        txtDiv.style.height = "100%";
        txtDiv.style.width = "100%";
        txtDiv.style.textAlign = "center";
        txtDiv.style.marginTop = "10%";
        txtDiv.style.color = "gray";
        txtDiv.style.display = "block";
        return;
    }
    else if (expenseobjects.length == 0 && incomeobjects.length !== 0) {
        repDivs.forEach(div => {
            div.style.display = "none";
        })
        const ltOi = document.getElementById("ltOi");
        const bal = document.getElementById("bal");
        ltOi.textContent = `${currency}${largestIncVal}`;
        bal.textContent = balanceamount.textContent;
        onlyIncome.style.display = "flex";
    }

    else {
        repDivs.forEach(div => {
            div.style.display = "flex";
        })
        ltExpDes.textContent = largestExp;
    ltExpVal.textContent = `${currency}${largestExpVal.toFixed(2)}`;

    
    ltIncDes.textContent = largestInc;
    ltIncVal.textContent = `${currency}${largestIncVal.toFixed(2)}`;


    let occurence = {};
    expenseobjects.forEach(object => {
        occurence[`${object.category}`] = 0;
    })
    expenseobjects.forEach(object => {
        occurence[`${object.category}`] +=1;
    })

    let freqcat;
    let freq = 0;

    for (const property in occurence) {
        if (occurence[property] > freq) {
            freq = occurence[property];
            freqcat = property;
        }
    }
    freqCategory.textContent = freqcat;
    freqCategoryValue.textContent = freq;


    let income = Number(parseFloat(incomeamount.textContent.replace(currency, '')));
    let expense = Number(parseFloat(expensesamount.textContent.replace(currency, '')));
    if (income == 0) {
        percentSpentValue.textContent = "No income yet"
        percentSpentValue.style.color = "gray"
    }
    else {
        percentSpentValue.style.color = "red"
        let percentagespent = expense * 100 / income;
        percentSpentValue.textContent = `${percentagespent.toFixed(2)}%`;
    }
    


    let totalexp = {};
    expenseobjects.forEach(object => {
        totalexp[`${object.category}`] = 0;
    })
    expenseobjects.forEach(object => {
        totalexp[`${object.category}`] += object.amount;
    })
    expenseChart.data.labels = Object.keys(totalexp);
    expenseChart.data.datasets[0].data = Object.values(totalexp);

    expenseChart.update();
    let highestcat;
    let highesttotalexp = 0;
    for (const property in totalexp) {
        if (totalexp[property] > highesttotalexp) {
            highesttotalexp = totalexp[property];
            highestcat = property;
        }
    }
    largestCategory.textContent = highestcat;
    largestCategoryValue.textContent = `${currency}${highesttotalexp.toFixed(2)}`;
    }
})

dashBtn.addEventListener("click", () => {
    repDivs.forEach(div => {
        div.style.display = "none";
    })
    onlyIncome.style.display = "none";
    txtDiv.style.display = "none";
        repDivs.forEach(div => {
            div.style.display = "none";
        });
    reportPage.style.display = "none";

})


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

     