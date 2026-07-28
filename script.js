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
