/* =========================================================
   OUR LITTLE FUND
   SCRIPT.JS
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const TARGET_NIKAH = 120000000;

const ACCOUNTS = {

    asthila: {
        name: "Asthila Ayu khinanthi",
        shortName: "Asthila",
        initial: "A",
        pin: "081203",
        
    },

    dicky: {
        name: "Dicky Prasetyo",
        shortName: "Dicky",
        initial: "D",
        pin: "120502",
        
    }

};


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let selectedAccount = null;

let enteredPin = "";

let uploadedProof = null;

let pendingTransaction = null;


/* =========================================================
   TRANSACTIONS
========================================================= */

let transactions = JSON.parse(
    localStorage.getItem(
        "ourLittleFundTransactions"
    )
) || [];


/* =========================================================
   DOM
========================================================= */

const loginPage =
    document.getElementById("loginPage");

const dashboard =
    document.getElementById("dashboard");

const accountList =
    document.getElementById("accountList");

const pinSection =
    document.getElementById("pinSection");

const selectedName =
    document.getElementById("selectedName");

const selectedRole =
    document.getElementById("selectedRole");

const selectedInitial =
    document.getElementById("selectedInitial");

const pinDots =
    document.querySelectorAll("#pinDots span");

const pinHint =
    document.getElementById("pinHint");

const deletePin =
    document.getElementById("deletePin");

const backAccount =
    document.getElementById("backAccount");

const currentUserName =
    document.getElementById("currentUserName");

const currentUserRole =
    document.getElementById("currentUserRole");

const currentUserAvatar =
    document.getElementById("currentUserAvatar");

const logoutButton =
    document.getElementById("logoutButton");

const totalSaved =
    document.getElementById("totalSaved");

const targetAmount =
    document.getElementById("targetAmount");

const remainingAmount =
    document.getElementById("remainingAmount");

const progressBar =
    document.getElementById("progressBar");

const progressPercent =
    document.getElementById("progressPercent");

const totalIncome =
    document.getElementById("totalIncome");

const totalExpense =
    document.getElementById("totalExpense");

const asthilaAmount =
    document.getElementById("asthilaAmount");

const dickyAmount =
    document.getElementById("dickyAmount");

const asthilaProgress =
    document.getElementById("asthilaProgress");

const dickyProgress =
    document.getElementById("dickyProgress");

const asthilaPercent =
    document.getElementById("asthilaPercent");

const dickyPercent =
    document.getElementById("dickyPercent");

const chart =
    document.getElementById("chart");

    const chartTitle =
    document.getElementById("chartTitle");

const categoryCard =
    document.getElementById("categoryCard");

const achievementGrid =
    document.getElementById("achievementGrid");

const transactionList =
    document.getElementById("transactionList");

const addMoneyButton =
    document.getElementById("addMoneyButton");

const spendMoneyButton =
    document.getElementById("spendMoneyButton");

const transactionModal =
    document.getElementById("transactionModal");

const confirmModal =
    document.getElementById("confirmModal");

const transactionForm =
    document.getElementById("transactionForm");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById("modalDescription");

const transactionType =
    document.getElementById("transactionType");

const moneyInput =
    document.getElementById("moneyInput");

const categoryInput =
    document.getElementById("categoryInput");

const noteInput =
    document.getElementById("noteInput");

const proofInput =
    document.getElementById("proofInput");
const bankInfo =
    document.getElementById("bankInfo");

const bankAccountNumber =
    document.getElementById("bankAccountNumber");

const copyBankButton =
    document.getElementById("copyBankButton");

const copyBankMessage =
    document.getElementById("copyBankMessage");

const proofPreview =
    document.getElementById("proofPreview");

const confirmAmount =
    document.getElementById("confirmAmount");

const confirmType =
    document.getElementById("confirmType");

const confirmCategory =
    document.getElementById("confirmCategory");

const confirmUser =
    document.getElementById("confirmUser");

const confirmNote =
    document.getElementById("confirmNote");

const confirmTransactionButton =
    document.getElementById(
        "confirmTransactionButton"
    );

const cancelConfirmButton =
    document.getElementById(
        "cancelConfirmButton"
    );


/* =========================================================
   RUPIAH
========================================================= */

function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number || 0);

}


/* =========================================================
   CLEAN NUMBER
========================================================= */

function cleanNumber(value) {

    return Number(
        String(value)
            .replace(/[^\d]/g, "")
    ) || 0;

}


/* =========================================================
   SAVE
========================================================= */

function saveTransactions() {

    localStorage.setItem(
        "ourLittleFundTransactions",
        JSON.stringify(transactions)
    );

}


/* =========================================================
   SELECT ACCOUNT
========================================================= */

function selectAccount(accountKey) {

    const account =
        ACCOUNTS[accountKey];

    if (!account) return;

    selectedAccount =
        accountKey;

    accountList.classList.add(
        "hidden"
    );

    pinSection.classList.remove(
        "hidden"
    );

    selectedName.textContent =
        account.name;

    selectedRole.textContent =
        account.type;

    selectedInitial.textContent =
        account.initial;

    selectedInitial.className =
        `profile-avatar ${accountKey}`;

    resetPin();

}


/* =========================================================
   PIN DOTS
========================================================= */

function updatePinDots() {

    pinDots.forEach(
        (dot, index) => {

            if (
                index <
                enteredPin.length
            ) {

                dot.classList.add(
                    "filled"
                );

            } else {

                dot.classList.remove(
                    "filled"
                );

            }

        }
    );

}


/* =========================================================
   RESET PIN
========================================================= */

function resetPin() {

    enteredPin = "";

    updatePinDots();

    if (pinHint) {

        pinHint.textContent =
            "Masukkan 6 digit PIN";

        pinHint.classList.remove(
            "error"
        );

    }

}


/* =========================================================
   CHECK PIN
========================================================= */

function checkPin() {

    if (!selectedAccount) {
        return;
    }

    const account =
        ACCOUNTS[selectedAccount];


    if (
        enteredPin ===
        account.pin
    ) {

        pinHint.textContent =
            "PIN benar ♡";

        setTimeout(
            () => {

                currentUser =
                    selectedAccount;

                sessionStorage.setItem(
                    "ourLittleFundUser",
                    selectedAccount
                );

                showDashboard();

            },
            250
        );


    } else {

        pinHint.textContent =
            "PIN salah, coba lagi ♡";

        pinHint.classList.add(
            "error"
        );


        setTimeout(
            () => {

                resetPin();

            },
            700
        );

    }

}


/* =========================================================
   KEYPAD
========================================================= */

document
    .querySelectorAll(
        ".pin-key[data-number]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    if (
                        enteredPin.length >= 6
                    ) {
                        return;
                    }

                    enteredPin +=
                        this.dataset.number;

                    updatePinDots();


                    if (
                        enteredPin.length === 6
                    ) {

                        setTimeout(
                            checkPin,
                            180
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   DELETE PIN
========================================================= */

if (deletePin) {

    deletePin.addEventListener(
        "click",
        function () {

            enteredPin =
                enteredPin.slice(
                    0,
                    -1
                );

            updatePinDots();

        }
    );

}


/* =========================================================
   ACCOUNT BUTTON
========================================================= */

document
    .querySelectorAll(
        ".account-card"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    selectAccount(
                        this.dataset.account
                    );

                }
            );

        }
    );


/* =========================================================
   BACK ACCOUNT
========================================================= */

if (backAccount) {

    backAccount.addEventListener(
        "click",
        function () {

            resetPin();

            selectedAccount =
                null;

            pinSection.classList.add(
                "hidden"
            );

            accountList.classList.remove(
                "hidden"
            );

        }
    );

}


/* =========================================================
   SHOW DASHBOARD
========================================================= */

function showDashboard() {

    loginPage.classList.add(
        "hidden"
    );

    dashboard.classList.remove(
        "hidden"
    );


    const account =
        ACCOUNTS[currentUser];


    currentUserName.textContent =
        account.shortName;

    currentUserRole.textContent =
        account.type;

    currentUserAvatar.textContent =
        account.initial;

    currentUserAvatar.className =
        `header-avatar ${currentUser}`;


    updateDashboard();

}


/* =========================================================
   LOGOUT
========================================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            currentUser =
                null;

            selectedAccount =
                null;

            sessionStorage.removeItem(
                "ourLittleFundUser"
            );

            dashboard.classList.add(
                "hidden"
            );

            loginPage.classList.remove(
                "hidden"
            );

            accountList.classList.remove(
                "hidden"
            );

            pinSection.classList.add(
                "hidden"
            );

            resetPin();

        }
    );

}


/* =========================================================
   CHECK SESSION
========================================================= */

function checkSession() {

    const savedUser =
        sessionStorage.getItem(
            "ourLittleFundUser"
        );


    if (
        savedUser &&
        ACCOUNTS[savedUser]
    ) {

        currentUser =
            savedUser;

        showDashboard();

    } else {

        loginPage.classList.remove(
            "hidden"
        );

        dashboard.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   TOTAL
========================================================= */

function calculateTotals() {

    let income = 0;

    let expense = 0;


    transactions.forEach(
        transaction => {

            if (
                transaction.type ===
                "income"
            ) {

                income +=
                    transaction.amount;

            }


            if (
                transaction.type ===
                "expense"
            ) {

                expense +=
                    transaction.amount;

            }

        }
    );


    return {

        income,

        expense,

        balance:
            income - expense

    };

}


/* =========================================================
   USER BALANCE
========================================================= */

function getUserBalance(
    accountKey
) {

    let total = 0;


    transactions.forEach(
        transaction => {

            if (
                transaction.user !==
                accountKey
            ) {
                return;
            }


            if (
                transaction.type ===
                "income"
            ) {

                total +=
                    transaction.amount;

            }


            if (
                transaction.type ===
                "expense"
            ) {

                total -=
                    transaction.amount;

            }

        }
    );


    return total;

}


/* =========================================================
   UPDATE DASHBOARD
========================================================= */

function updateDashboard() {

    const totals =
        calculateTotals();


    const total =
        Math.max(
            0,
            totals.balance
        );


    const remaining =
        Math.max(
            0,
            TARGET_NIKAH - total
        );


    const percent =
        Math.min(
            100,
            (total /
                TARGET_NIKAH) *
                100
        );


    totalSaved.textContent =
        formatRupiah(total);

    targetAmount.textContent =
        formatRupiah(
            TARGET_NIKAH
        );

    remainingAmount.textContent =
        formatRupiah(
            remaining
        );


    progressBar.style.width =
        `${percent}%`;

    progressPercent.textContent =
        `${percent.toFixed(1)}%`;


    totalIncome.textContent =
        formatRupiah(
            totals.income
        );

    totalExpense.textContent =
        formatRupiah(
            totals.expense
        );


    const asthilaTotal =
        getUserBalance(
            "asthila"
        );

    const dickyTotal =
        getUserBalance(
            "dicky"
        );


    asthilaAmount.textContent =
        formatRupiah(
            asthilaTotal
        );

    dickyAmount.textContent =
        formatRupiah(
            dickyTotal
        );


    const asthilaPercentValue =
        Math.min(
            100,
            (Math.max(
                0,
                asthilaTotal
            ) /
                TARGET_NIKAH) *
                100
        );


    const dickyPercentValue =
        Math.min(
            100,
            (Math.max(
                0,
                dickyTotal
            ) /
                TARGET_NIKAH) *
                100
        );


    asthilaProgress.style.width =
        `${asthilaPercentValue}%`;

    dickyProgress.style.width =
        `${dickyPercentValue}%`;


    asthilaPercent.textContent =
        `${asthilaPercentValue.toFixed(1)}%`;

    dickyPercent.textContent =
        `${dickyPercentValue.toFixed(1)}%`;


    renderTransactions();

    renderChart();

    renderCategories();

    renderAchievements();

}


/* =========================================================
   OPEN ADD
========================================================= */

if (addMoneyButton) {

    addMoneyButton.addEventListener(
        "click",
        openAddMoney
    );

}


function openAddMoney() {

    transactionType.value =
        "income";

    modalTitle.textContent =
        "Tambah Tabungan";

    modalDescription.textContent =
        "Catat uang yang kamu masukkan ke tabungan nikah.";

    bankInfo.classList.remove("hidden");

    categoryInput.innerHTML = `

        <option value="Tabungan">
            Tabungan
        </option>

        <option value="Gaji">
            Gaji
        </option>

        <option value="Bonus">
            Bonus
        </option>

        <option value="Hadiah">
            Hadiah
        </option>

        <option value="Lainnya">
            Lainnya
        </option>

    `;

    openTransactionModal();

}

/* =========================================================
   OPEN SPEND
========================================================= */

if (spendMoneyButton) {

    spendMoneyButton.addEventListener(
        "click",
        openSpendMoney
    );

}


function openSpendMoney() {

    transactionType.value =
        "expense";

    modalTitle.textContent =
        "Gunakan Tabungan";

    modalDescription.textContent =
        "Catat penggunaan uang dari tabungan bersama.";

    bankInfo.classList.add("hidden");

    categoryInput.innerHTML = `

        <option value="Keperluan Darurat">
            🚨 Keperluan Darurat
        </option>

        <option value="Liburan">
            ✈️ Liburan
        </option>

        <option value="Dinner">
            🍽️ Dinner
        </option>

        <option value="Jalan-jalan">
            🚗 Jalan-jalan
        </option>

        <option value="Hadiah">
            🎁 Hadiah
        </option>

        <option value="Lainnya">
            ♡ Lainnya
        </option>

    `;

    openTransactionModal();

}

/* =========================================================
   MODAL
========================================================= */

function openTransactionModal() {

    transactionModal.classList.remove(
        "hidden"
    );

    transactionForm.reset();

    uploadedProof =
        null;

    proofPreview.textContent =
        "";

}


function closeTransactionModal() {

    transactionModal.classList.add(
        "hidden"
    );

    transactionForm.reset();

    uploadedProof =
        null;

    proofPreview.textContent =
        "";

}


/* =========================================================
   PROOF
========================================================= */

if (proofInput) {

    proofInput.addEventListener(
        "change",
        function () {

            const file = this.files[0];

            if (!file) {

                uploadedProof = null;

                proofPreview.textContent = "";

                return;

            }

            // Batas 5 MB
            if (file.size > 5 * 1024 * 1024) {

                alert(
                    "Ukuran bukti transaksi maksimal 5 MB ya 🤍"
                );

                this.value = "";

                uploadedProof = null;

                proofPreview.textContent = "";

                return;

            }

            const reader = new FileReader();

            reader.onload = function () {

                uploadedProof = {

                    name: file.name,

                    type: file.type,

                    data: reader.result

                };

                proofPreview.textContent =
                    `✓ Bukti dipilih: ${file.name}`;

            };

            reader.onerror = function () {

                uploadedProof = null;

                proofPreview.textContent =
                    "Gagal membaca file.";

            };

            reader.readAsDataURL(file);

        }
    );

}

/* =========================================================
   MONEY INPUT
========================================================= */

if (moneyInput) {

    moneyInput.addEventListener(
        "input",
        function () {

            const number =
                cleanNumber(
                    this.value
                );


            if (!number) {

                this.value =
                    "";

                return;

            }


            this.value =
                new Intl.NumberFormat(
                    "id-ID"
                ).format(number);

        }
    );

}


/* =========================================================
   FORM SUBMIT
========================================================= */

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const amount =
                cleanNumber(
                    moneyInput.value
                );


            const type =
                transactionType.value;


            const category =
                categoryInput.value;


            const note =
                noteInput.value.trim();


            if (
                amount <= 0
            ) {

                alert(
                    "Masukkan nominal terlebih dahulu ya 🤍"
                );

                return;

            }


            const totals =
                calculateTotals();


            if (
                type === "expense" &&
                amount >
                totals.balance
            ) {

                alert(
                    "Nominal pengeluaran lebih besar dari saldo tabungan saat ini."
                );

                return;

            }


            if (
                type === "income" &&
                totals.balance +
                amount >
                TARGET_NIKAH
            ) {

                const lanjut =
                    confirm(
                        "Tabungan akan melewati target Rp120.000.000. Tetap lanjut?"
                    );


                if (!lanjut) {
                    return;
                }

            }


            confirmAmount.textContent =
                formatRupiah(
                    amount
                );


            confirmType.textContent =
                type === "income"
                    ? "Menambah tabungan"
                    : "Menggunakan tabungan";


            confirmCategory.textContent =
                category;


            confirmUser.textContent =
                ACCOUNTS[
                    currentUser
                ].name;


            confirmNote.textContent =
                note || "-";


            pendingTransaction = {

    amount,

    type,

    category,

    note,

    proof:
        uploadedProof
            ? {
                name: uploadedProof.name,
                type: uploadedProof.type,
                data: uploadedProof.data
            }
            : null

};


            closeTransactionModal();


            confirmModal.classList.remove(
                "hidden"
            );

        }
    );

}


/* =========================================================
   CONFIRM
========================================================= */

if (confirmTransactionButton) {

    confirmTransactionButton.addEventListener(
        "click",
        function () {

            if (
                !pendingTransaction
            ) {
                return;
            }


            const transaction = {

    id:
        Date.now(),

    user:
        currentUser,

    amount:
        pendingTransaction.amount,

    type:
        pendingTransaction.type,

    category:
        pendingTransaction.category,

    note:
        pendingTransaction.note,

    proof:
        pendingTransaction.proof,

    date:
        new Date().toISOString()

};


            transactions.unshift(
                transaction
            );


            saveTransactions();


            pendingTransaction =
                null;


            confirmModal.classList.add(
                "hidden"
            );


            updateDashboard();


            alert(
                transaction.type ===
                    "income"
                    ? "Tabungan berhasil ditambahkan 🤍"
                    : "Pengeluaran berhasil dicatat 🤍"
            );

        }
    );

}


/* =========================================================
   CANCEL CONFIRM
========================================================= */

if (cancelConfirmButton) {

    cancelConfirmButton.addEventListener(
        "click",
        function () {

            confirmModal.classList.add(
                "hidden"
            );

            pendingTransaction =
                null;

        }
    );

}


/* =========================================================
   TRANSACTIONS
========================================================= */

function renderTransactions() {

    if (!transactionList) {
        return;
    }


    if (
        transactions.length === 0
    ) {

        transactionList.innerHTML = `

            <div class="transaction-empty">

                Belum ada transaksi.
                <br>

                Yuk mulai isi tabungan
                nikah kalian 🤍

            </div>

        `;

        return;

    }


    const sorted =
        [...transactions]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );


    transactionList.innerHTML =
        sorted
            .slice(0, 20)
            .map(
                transaction => {

                    const account =
                        ACCOUNTS[
                            transaction.user
                        ];


                    const isIncome =
                        transaction.type ===
                        "income";


                    return `

                        <div
                            class="transaction-item"
                        >

                            <div
                                class="
                                transaction-icon
                                ${isIncome
                                    ? "income"
                                    : "expense"}
                                "
                            >
                                ${isIncome
                                    ? "♡"
                                    : "−"}
                            </div>


                            <div
                                class="transaction-info"
                            >

                                <strong>
                                    ${escapeHTML(
                                        transaction.category
                                    )}
                                </strong>


                                <span>
                                    ${escapeHTML(
                                        account.shortName
                                    )}
                                    •
                                    ${formatDate(
                                        transaction.date
                                    )}

                                    ${
                                        transaction.note
                                            ? ` • ${escapeHTML(
                                                transaction.note
                                            )}`
                                            : ""
                                    }
                                </span>


                               ${
    transaction.proof
        ? `
            <button
                type="button"
                class="proof-link"
                onclick="viewProof('${transaction.id}')"
            >
                📎 Lihat Bukti
            </button>
        `
        : ""
}

                            </div>


                            <div
                                class="transaction-money"
                            >

                                <strong
                                    class="
                                    ${isIncome
                                        ? "income"
                                        : "expense"}
                                    "
                                >
                                    ${isIncome
                                        ? "+"
                                        : "-"}
                                    ${formatRupiah(
                                        transaction.amount
                                    )}
                                </strong>


                                <span>
                                    ${isIncome
                                        ? "Masuk"
                                        : "Keluar"}
                                </span>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}
/* =========================================================
   VIEW PROOF
========================================================= */

function viewProof(transactionId) {

    const transaction =
        transactions.find(
            item =>
                String(item.id) ===
                String(transactionId)
        );

    if (
        !transaction ||
        !transaction.proof ||
        !transaction.proof.data
    ) {

        alert(
            "Bukti transaksi tidak ditemukan."
        );

        return;

    }

    const proof =
        transaction.proof;

    const newWindow =
        window.open(
            "",
            "_blank"
        );

    if (!newWindow) {

        alert(
            "Browser memblokir jendela baru. Izinkan pop-up untuk melihat bukti."
        );

        return;

    }

    newWindow.document.write(`

        <!DOCTYPE html>

        <html lang="id">

        <head>

            <meta charset="UTF-8">

            <title>
                Bukti Transaksi
            </title>

            <style>

                body {
                    margin: 0;
                    padding: 30px;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #f8f5f2;
                    font-family: Arial, sans-serif;
                }

                h2 {
                    margin-bottom: 20px;
                }

                img {
                    max-width: 90vw;
                    max-height: 80vh;
                    object-fit: contain;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,.12);
                }

                iframe {
                    width: 90vw;
                    height: 80vh;
                    border: none;
                    border-radius: 12px;
                    background: white;
                }

                .filename {
                    margin-top: 15px;
                    color: #777;
                }

            </style>

        </head>

        <body>

            <h2>
                📎 Bukti Transaksi
            </h2>

            ${
                proof.type.startsWith("image/")
                    ? `
                        <img
                            src="${proof.data}"
                            alt="Bukti transaksi"
                        >
                    `
                    : proof.type === "application/pdf"
                        ? `
                            <iframe
                                src="${proof.data}"
                            ></iframe>
                        `
                        : `
                            <p>
                                File ini tidak dapat ditampilkan langsung.
                            </p>

                            <a
                                href="${proof.data}"
                                download="${escapeHTML(proof.name)}"
                            >
                                Buka / Download File
                            </a>
                        `
            }

            <div class="filename">
                ${escapeHTML(proof.name)}
            </div>

        </body>

        </html>

    `);

    newWindow.document.close();

}

/* =========================================================
   DATE
========================================================= */

function formatDate(date) {

    return new Intl.DateTimeFormat(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    ).format(
        new Date(date)
    );

}


/* =========================================================
   ESCAPE
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value ?? "";

    return div.innerHTML;

}


/* =========================================================
   CHART FILTER
========================================================= */

let currentChartPeriod = "daily";


document
    .querySelectorAll(".chart-filter-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                document
                    .querySelectorAll(
                        ".chart-filter-button"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                this.classList.add(
                    "active"
                );


                currentChartPeriod =
                    this.dataset.period;


                renderChart();

            }
        );

    });


/* =========================================================
   CHART
========================================================= */

function renderChart() {

    if (!chart) {
        return;
    }


    if (
        transactions.length === 0
    ) {

        chart.innerHTML = `

            <div class="chart-empty">

                Grafik akan muncul
                setelah ada transaksi 🤍

            </div>

        `;

        return;

    }


    const now = new Date();

    let periods = [];


    /* =====================================================
       HARIAN
    ===================================================== */

    if (currentChartPeriod === "daily") {

    for (let i = 6; i >= 0; i--) {

        const date = new Date(now);

        date.setHours(0, 0, 0, 0);

        date.setDate(
            date.getDate() - i
        );

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        periods.push({

            key:
                `${year}-${month}-${day}`,

            label:
                date.toLocaleDateString(
                    "id-ID",
                    {
                        weekday: "short"
                    }
                ),

            income: 0,

            expense: 0

        });

    }

}

    /* =====================================================
       MINGGUAN
    ===================================================== */

    if (
        currentChartPeriod === "weekly"
    ) {

        for (
            let i = 5;
            i >= 0;
            i--
        ) {

            const endDate =
                new Date(now);

            endDate.setHours(
                23,
                59,
                59,
                999
            );

            endDate.setDate(
                endDate.getDate() -
                (i * 7)
            );


            const startDate =
                new Date(endDate);

            startDate.setDate(
                startDate.getDate() - 6
            );

            startDate.setHours(
                0,
                0,
                0,
                0
            );


            periods.push({

                start:
                    startDate,

                end:
                    endDate,

                label:
                    `${startDate.getDate()}-${endDate.getDate()}`,

                income: 0,

                expense: 0

            });

        }

    }


    /* =====================================================
       BULANAN
    ===================================================== */

    if (
        currentChartPeriod === "monthly"
    ) {

        for (
            let i = 5;
            i >= 0;
            i--
        ) {

            const date =
                new Date(
                    now.getFullYear(),
                    now.getMonth() - i,
                    1
                );


            periods.push({

                key:
                    `${date.getFullYear()}-${date.getMonth()}`,

                label:
                    date.toLocaleDateString(
                        "id-ID",
                        {
                            month: "short"
                        }
                    ),

                income: 0,

                expense: 0

            });

        }

    }


    /* =====================================================
       MASUKKAN TRANSAKSI
    ===================================================== */

    transactions.forEach(
        transaction => {

            const transactionDate =
                new Date(
                    transaction.date
                );


            periods.forEach(
                period => {

                    let match = false;


                    /* HARIAN */

                    if (
                        currentChartPeriod ===
                        "daily"
                    ) {

                        const key =
                            transactionDate
                                .toISOString()
                                .split("T")[0];


                        match =
                            key ===
                            period.key;

                    }


                    /* MINGGUAN */

                    if (
                        currentChartPeriod ===
                        "weekly"
                    ) {

                        match =
                            transactionDate >=
                                period.start &&
                            transactionDate <=
                                period.end;

                    }


                    /* BULANAN */

                    if (
                        currentChartPeriod ===
                        "monthly"
                    ) {

                        const key =
                            `${transactionDate.getFullYear()}-${transactionDate.getMonth()}`;


                        match =
                            key ===
                            period.key;

                    }


                    if (!match) {
                        return;
                    }


                    if (
                        transaction.type ===
                        "income"
                    ) {

                        period.income +=
                            transaction.amount;

                    }


                    if (
                        transaction.type ===
                        "expense"
                    ) {

                        period.expense +=
                            transaction.amount;

                    }

                }
            );

        }
    );


    /* =====================================================
       UPDATE JUDUL
    ===================================================== */

    if (chartTitle) {

        if (
            currentChartPeriod ===
            "daily"
        ) {

            chartTitle.textContent =
                "Aktivitas 7 hari terakhir";

        }

        if (
            currentChartPeriod ===
            "weekly"
        ) {

            chartTitle.textContent =
                "Aktivitas 6 minggu terakhir";

        }

        if (
            currentChartPeriod ===
            "monthly"
        ) {

            chartTitle.textContent =
                "Aktivitas 6 bulan terakhir";

        }

    }


    /* =====================================================
       SKALA GRAFIK
    ===================================================== */

    const highest =
        Math.max(
            ...periods.map(
                period =>
                    Math.max(
                        period.income,
                        period.expense
                    )
            ),
            1
        );


    /* =====================================================
       RENDER
    ===================================================== */

    chart.innerHTML =
        periods
            .map(
                period => {

                    const incomeHeight =
                        (
                            period.income /
                            highest
                        ) * 100;


                    const expenseHeight =
                        (
                            period.expense /
                            highest
                        ) * 100;


                    return `

                        <div
                            class="chart-column"
                        >

                            <div
                                class="chart-bars"
                            >

                                <div
                                    class="
                                    chart-bar
                                    income
                                    "
                                    style="
                                        height:
                                        ${incomeHeight}%
                                    "
                                    title="
                                        Masuk:
                                        ${formatRupiah(
                                            period.income
                                        )}
                                    "
                                ></div>


                                <div
                                    class="
                                    chart-bar
                                    expense
                                    "
                                    style="
                                        height:
                                        ${expenseHeight}%
                                    "
                                    title="
                                        Keluar:
                                        ${formatRupiah(
                                            period.expense
                                        )}
                                    "
                                ></div>

                            </div>


                            <div
                                class="chart-label"
                            >
                                ${period.label}
                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}

/* =========================================================
   CATEGORY
========================================================= */

function renderCategories() {

    if (!categoryCard) {
        return;
    }


    const expenses =
        transactions.filter(
            transaction =>
                transaction.type ===
                "expense"
        );


    if (
        expenses.length === 0
    ) {

        categoryCard.innerHTML = `

            <div class="category-empty">

                Belum ada pengeluaran.
                <br>

                Fokus kita tetap
                untuk wedding 🤍

            </div>

        `;

        return;

    }


    const categories = {};


    expenses.forEach(
        transaction => {

            if (
                !categories[
                    transaction.category
                ]
            ) {

                categories[
                    transaction.category
                ] = 0;

            }


            categories[
                transaction.category
            ] +=
                transaction.amount;

        }
    );


    const icons = {

        "Keperluan Darurat":
            "🚨",

        "Liburan":
            "✈️",

        "Dinner":
            "🍽️",

        "Jalan-jalan":
            "🚗",

        "Hadiah":
            "🎁",

        "Lainnya":
            "♡"

    };


    categoryCard.innerHTML =
        Object.entries(
            categories
        )
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .map(
            ([category, amount]) => `

                <div
                    class="category-item"
                >

                    <div
                        class="category-icon"
                    >
                        ${
                            icons[
                                category
                            ] || "♡"
                        }
                    </div>


                    <strong>
                        ${escapeHTML(
                            category
                        )}
                    </strong>


                    <span>
                        ${formatRupiah(
                            amount
                        )}
                    </span>

                </div>

            `
        )
        .join("");

}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function renderAchievements() {

    if (!achievementGrid) {
        return;
    }


    const total =
        Math.max(
            0,
            calculateTotals().balance
        );


    const milestones = [

        {
            amount: 1000000,
            title: "Langkah Pertama",
            description: "Rp1 juta pertama",
            icon: "♡"
        },

        {
            amount: 5000000,
            title: "Makin Serius",
            description: "Rp5 juta terkumpul",
            icon: "♥"
        },

        {
            amount: 10000000,
            title: "Love Saver",
            description: "Rp10 juta terkumpul",
            icon: "✦"
        },

        {
            amount: 50000000,
            title: "Halfway Love",
            description: "Rp50 juta terkumpul",
            icon: "♢"
        },

        {
            amount: 120000000,
            title: "Wedding Fund",
            description: "Target tercapai!",
            icon: "💍"
        }

    ];


    achievementGrid.innerHTML =
        milestones
            .map(
                milestone => {

                    const unlocked =
                        total >=
                        milestone.amount;


                    return `

                        <div
                            class="
                            achievement-card
                            ${
                                unlocked
                                    ? "unlocked"
                                    : ""
                            }
                            "
                        >

                            <div
                                class="
                                achievement-icon
                                "
                            >
                                ${milestone.icon}
                            </div>


                            <div>

                                <strong>
                                    ${milestone.title}
                                </strong>

                                <span>
                                    ${milestone.description}
                                </span>

                            </div>


                            <b>
                                ${
                                    unlocked
                                        ? "✓"
                                        : "🔒"
                                }
                            </b>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   CLOSE MODALS
========================================================= */

document
    .querySelectorAll(
        ".close-modal"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    transactionModal.classList.add(
                        "hidden"
                    );

                    confirmModal.classList.add(
                        "hidden"
                    );

                }
            );

        }
    );


/* =========================================================
   CLICK BACKGROUND
========================================================= */

document
    .querySelectorAll(
        ".modal-background"
    )
    .forEach(
        background => {

            background.addEventListener(
                "click",
                function () {

                    const modal =
                        this.closest(
                            ".modal"
                        );


                    if (modal) {

                        modal.classList.add(
                            "hidden"
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   START
========================================================= */
/* =========================================================
   COPY BANK ACCOUNT
========================================================= */

if (copyBankButton) {

    copyBankButton.addEventListener(
        "click",
        async function () {

            const accountNumber =
                bankAccountNumber.textContent.trim();

            try {

                await navigator.clipboard.writeText(
                    accountNumber
                );

                copyBankMessage.textContent =
                    "✓ Nomor rekening berhasil disalin";

                copyBankButton.textContent =
                    "Tersalin";

                setTimeout(
                    () => {

                        copyBankMessage.textContent =
                            "";

                        copyBankButton.textContent =
                            "Salin";

                    },
                    2000
                );

            } catch (error) {

                copyBankMessage.textContent =
                    "Nomor: " + accountNumber;

            }

        }
    );

}
checkSession();