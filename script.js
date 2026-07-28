/*==========================================
  MDP Assist Invoice System
==========================================*/

let invoiceCounter = Number(localStorage.getItem("invoiceCounter")) || 1;

window.onload = function () {

    const invoiceNo = document.getElementById("invoiceNo");

    if(invoiceNo){

        invoiceNo.value =
            "INV-" + String(invoiceCounter).padStart(6,"0");

    }

    const invoiceDate = document.getElementById("invoiceDate");

    if(invoiceDate){

        const today = new Date();

        invoiceDate.value =
            today.toISOString().substring(0,10);

    }

    if(document.getElementById("invoiceBody")){

        addRow();

    }

}

/*==========================================
  ADD ROW
==========================================*/

function addRow(){

    const tbody = document.getElementById("invoiceBody");

    if(!tbody) return;

    const row = document.createElement("tr");

    row.innerHTML = `

        <td>
            <input type="date">
        </td>

        <td>
            <input type="text" placeholder="Description">
        </td>

        <td>
            <input type="number"
                   class="qty"
                   value="1"
                   min="1"
                   onchange="calculateTotals()">
        </td>

        <td>
            <input type="number"
                   class="price"
                   value="0"
                   step="0.01"
                   onchange="calculateTotals()">
        </td>

        <td class="lineTotal">

            R0.00

        </td>

        <td>

            <button onclick="removeRow(this)">

                ✕

            </button>

        </td>

    `;

    tbody.appendChild(row);

    calculateTotals();

}

/*==========================================
  REMOVE ROW
==========================================*/

function removeRow(btn){

    btn.parentNode.parentNode.remove();

    calculateTotals();

}
/*==========================================
  CALCULATE TOTALS
==========================================*/

function calculateTotals(){

    let subtotal = 0;

    const rows = document.querySelectorAll("#invoiceBody tr");

    rows.forEach(row=>{

        const qty =
            Number(row.querySelector(".qty").value) || 0;

        const price =
            Number(row.querySelector(".price").value) || 0;

        const total = qty * price;

        row.querySelector(".lineTotal").innerHTML =
            "R " + total.toLocaleString("en-ZA",{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            });

        subtotal += total;

    });

    const vat = subtotal * 0.15;

    const grandTotal = subtotal + vat;

    document.getElementById("subtotal").innerHTML =
        "R " + subtotal.toLocaleString("en-ZA",{
            minimumFractionDigits:2
        });

    document.getElementById("vat").innerHTML =
        "R " + vat.toLocaleString("en-ZA",{
            minimumFractionDigits:2
        });

    document.getElementById("grandTotal").innerHTML =
        "R " + grandTotal.toLocaleString("en-ZA",{
            minimumFractionDigits:2
        });

}

/*==========================================
  AUTO UPDATE WHILE TYPING
==========================================*/

document.addEventListener("input",function(e){

    if(
        e.target.classList.contains("qty") ||
        e.target.classList.contains("price")
    ){

        calculateTotals();

    }

});

/*==========================================
  SAVE INVOICE NUMBER
==========================================*/

function nextInvoice(){

    invoiceCounter++;

    localStorage.setItem("invoiceCounter",invoiceCounter);

    const invoiceNo =
        document.getElementById("invoiceNo");

    if(invoiceNo){

        invoiceNo.value =
        "INV-" +
        String(invoiceCounter).padStart(6,"0");

    }

}

/*==========================================
  CLEAR INVOICE
==========================================*/

function clearInvoice(){

    document.querySelectorAll("input").forEach(input=>{

        if(
            input.type=="text" ||
            input.type=="number" ||
            input.type=="email"
        ){

            input.value="";

        }

    });

    document.querySelectorAll("textarea").forEach(t=>{

        t.value="";

    });

    document.getElementById("invoiceBody").innerHTML="";

    addRow();

}

/*==========================================
  SAVE BUTTON
==========================================*/

function saveInvoice(){

    alert("Invoice Saved Successfully");

    nextInvoice();

}
