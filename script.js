/* =========================================================
   TABUNGAN BERSAMA
   SCRIPT.JS
========================================================= */


/* =========================================================
   TANGGAL
========================================================= */

const currentDate =
    document.getElementById("currentDate");


const today = new Date();


currentDate.textContent =
    today.toLocaleDateString(
        "id-ID",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );



/* =========================================================
   CHART
========================================================= */

const chart =
    document.getElementById("weddingChart");


if (chart) {

    new Chart(
        chart,
        {

            type: "line",

            data: {

                labels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "Mei",
                    "Jun",
                    "Jul",
                    "Agu"
                ],

                datasets: [

                    {
                        label:
                            "Tabungan Wedding",

                        data: [
                            1200000,
                            2500000,
                            3800000,
                            5200000,
                            7000000,
                            8500000,
                            10500000,
                            12500000
                        ],

                        borderColor:
                            "#d35d86",

                        backgroundColor:
                            "rgba(211,93,134,.08)",

                        borderWidth: 2,

                        fill: true,

                        tension: .4,

                        pointRadius: 3,

                        pointBackgroundColor:
                            "#d35d86"
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    x: {

                        grid: {
                            display: false
                        },

                        ticks: {
                            color: "#aaa",
                            font: {
                                size: 8
                            }
                        }

                    },

                    y: {

                        beginAtZero: true,

                        grid: {
                            color:
                                "rgba(0,0,0,.05)"
                        },

                        ticks: {

                            color: "#aaa",

                            font: {
                                size: 7
                            },

                            callback:
                                function(value) {

                                    if (
                                        value >=
                                        1000000
                                    ) {

                                        return (
                                            value /
                                            1000000
                                        ) +
                                        " jt";

                                    }

                                    return value;

                                }

                        }

                    }

                }

            }

        }
    );

}



/* =========================================================
   MODAL
========================================================= */

const transactionModal =
    document.getElementById(
        "transactionModal"
    );


const confirmModal =
    document.getElementById(
        "confirmModal"
    );


const openTransaction =
    document.getElementById(
        "openTransaction"
    );


const closeTransaction =
    document.getElementById(
        "closeTransaction"
    );


const backConfirm =
    document.getElementById(
        "backConfirm"
    );


openTransaction.addEventListener(
    "click",
    function() {

        transactionModal.classList.add(
            "show"
        );

    }
);


closeTransaction.addEventListener(
    "click",
    function() {

        transactionModal.classList.remove(
            "show"
        );

    }
);



/* =========================================================
   ACCOUNT
========================================================= */

const accounts = {

    dicky: {

        name:
            "Dicky Prasetyo",

        pin:
            "120502"

    },

    asthila: {

        name:
            "Asthila Ayu Khinanthi",

        pin:
            "081203"

    }

};


let selectedAccount =
    null;


const accountOptions =
    document.querySelectorAll(
        ".account-option"
    );


const pinArea =
    document.getElementById(
        "pinArea"
    );


const pinInput =
    document.getElementById(
        "pinInput"
    );


const pinError =
    document.getElementById(
        "pinError"
    );


const transactionForm =
    document.getElementById(
        "transactionForm"
    );


accountOptions.forEach(
    function(option) {

        option.addEventListener(
            "click",
            function() {

                accountOptions.forEach(
                    function(item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                option.classList.add(
                    "selected"
                );


                selectedAccount =
                    option.dataset.account;


                pinArea.classList.remove(
                    "hidden"
                );


                transactionForm.classList.add(
                    "hidden"
                );


                pinInput.value =
                    "";

                pinError.textContent =
                    "";

                pinInput.focus();

            }
        );

    }
);



/* =========================================================
   PIN
========================================================= */

pinInput.addEventListener(
    "input",
    function() {

        pinError.textContent =
            "";

        transactionForm.classList.add(
            "hidden"
        );


        if (
            pinInput.value.length ===
            6
        ) {

            if (
                pinInput.value ===
                accounts[
                    selectedAccount
                ].pin
            ) {

                transactionForm.classList.remove(
                    "hidden"
                );

            }

            else {

                pinError.textContent =
                    "PIN salah. Silakan coba lagi.";

            }

        }

    }
);



/* =========================================================
   TYPE
========================================================= */

let transactionType =
    "income";


const typeOptions =
    document.querySelectorAll(
        ".type-option"
    );


typeOptions.forEach(
    function(option) {

        option.addEventListener(
            "click",
            function() {

                typeOptions.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                option.classList.add(
                    "active"
                );


                transactionType =
                    option.dataset.type;

            }
        );

    }
);



/* =========================================================
   NOMINAL
========================================================= */

const amountInput =
    document.getElementById(
        "amountInput"
    );


amountInput.addEventListener(
    "input",
    function() {

        let value =
            amountInput.value.replace(
                /\D/g,
                ""
            );


        if (!value) {

            amountInput.value =
                "";

            return;

        }


        amountInput.value =
            Number(value)
                .toLocaleString(
                    "id-ID"
                );

    }
);



/* =========================================================
   FILE
========================================================= */

const proofInput =
    document.getElementById(
        "proofInput"
    );


const fileName =
    document.getElementById(
        "fileName"
    );


proofInput.addEventListener(
    "change",
    function() {

        if (
            proofInput.files.length
        ) {

            fileName.textContent =
                "📎 " +
                proofInput.files[0].name;

        }

        else {

            fileName.textContent =
                "";

        }

    }
);



/* =========================================================
   CONFIRM TRANSACTION
========================================================= */

const continueButton =
    document.getElementById(
        "continueButton"
    );


const transactionError =
    document.getElementById(
        "transactionError"
    );


continueButton.addEventListener(
    "click",
    function() {


        transactionError.textContent =
            "";


        if (!selectedAccount) {

            transactionError.textContent =
                "Pilih akun terlebih dahulu.";

            return;

        }


        if (
            pinInput.value !==
            accounts[
                selectedAccount
            ].pin
        ) {

            pinError.textContent =
                "PIN belum benar.";

            return;

        }


        const rawAmount =
            amountInput.value.replace(
                /\D/g,
                ""
            );


        const amount =
            Number(rawAmount);


        if (
            !amount ||
            amount <= 0
        ) {

            transactionError.textContent =
                "Masukkan nominal.";

            return;

        }


        const category =
            document.getElementById(
                "categoryInput"
            );


        const categoryText =
            category.options[
                category.selectedIndex
            ].text;


        const note =
            document.getElementById(
                "noteInput"
            ).value.trim();


        document.getElementById(
            "confirmAccount"
        ).textContent =
            accounts[
                selectedAccount
            ].name;


        document.getElementById(
            "confirmType"
        ).textContent =
            transactionType === "income"
                ? "Pemasukan"
                : "Pengeluaran";


        document.getElementById(
            "confirmCategory"
        ).textContent =
            categoryText;


        document.getElementById(
            "confirmAmount"
        ).textContent =
            (
                transactionType === "income"
                    ? "+"
                    : "-"
            ) +
            "Rp" +
            amount.toLocaleString(
                "id-ID"
            );


        document.getElementById(
            "confirmNote"
        ).textContent =
            note ||
            "Tidak ada catatan";


        confirmModal.classList.add(
            "show"
        );

    }
);



/* =========================================================
   BACK
========================================================= */

backConfirm.addEventListener(
    "click",
    function() {

        confirmModal.classList.remove(
            "show"
        );

    }
);



/* =========================================================
   SAVE
========================================================= */

const saveConfirm =
    document.getElementById(
        "saveConfirm"
    );


saveConfirm.addEventListener(
    "click",
    function() {

        confirmModal.classList.remove(
            "show"
        );


        transactionModal.classList.remove(
            "show"
        );


        alert(
            "Transaksi berhasil dicatat sementara.\n\n" +
            "Database akan kita hubungkan pada tahap berikutnya."
        );

    }
);



/* =========================================================
   SIDEBAR
========================================================= */

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );


navItems.forEach(
    function(item) {

        item.addEventListener(
            "click",
            function() {

                navItems.forEach(
                    function(nav) {

                        nav.classList.remove(
                            "active"
                        );

                    }
                );


                item.classList.add(
                    "active"
                );

            }
        );

    }
);