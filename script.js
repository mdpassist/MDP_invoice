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
/*==========================================
  PRINT INVOICE
==========================================*/

function printInvoice(){

    window.print();

}

/*==========================================
  EXPORT PDF
==========================================*/

function exportPDF(){

    window.print();

}

/*==========================================
  EXPORT WORD
==========================================*/

function exportWord(){

    const invoice=document.querySelector(".invoiceContainer");

    const html=`

    <html>

    <head>

    <meta charset="UTF-8">

    <style>

    body{

        font-family:Segoe UI,Arial,sans-serif;

        margin:25px;

    }

    table{

        width:100%;

        border-collapse:collapse;

    }

    table td,
    table th{

        border:1px solid #cccccc;

        padding:8px;

    }

    </style>

    </head>

    <body>

    ${invoice.outerHTML}

    </body>

    </html>

    `;

    const blob=new Blob([html],{

        type:"application/msword"

    });

    const link=document.createElement("a");

    link.href=URL.createObjectURL(blob);

    link.download=document.getElementById("invoiceNo").value+".doc";

    link.click();

}

/*==========================================
  SAVE DRAFT
==========================================*/

function saveDraft(){

    const data={};

    document.querySelectorAll("input,textarea").forEach(input=>{

        data[input.placeholder||input.id]=input.value;

    });

    localStorage.setItem("draftInvoice",JSON.stringify(data));

    alert("Draft Saved");

}

/*==========================================
  LOAD DRAFT
==========================================*/

function loadDraft(){

    const draft=JSON.parse(localStorage.getItem("draftInvoice"));

    if(!draft) return;

    document.querySelectorAll("input,textarea").forEach(input=>{

        const key=input.placeholder||input.id;

        if(draft[key]!==undefined){

            input.value=draft[key];

        }

    });

    calculateTotals();

}

/*==========================================
  NEW INVOICE
==========================================*/

function newInvoice(){

    if(confirm("Create a new invoice?")){

        clearInvoice();

        nextInvoice();
          }
  /*==========================================
  PART 4
  COMPANY SETTINGS & CLIENT STORAGE
==========================================*/

const COMPANY={

    name:"MDP Assist",

    slogan:"Credit Checks Local & International",

    phone:"+27 XX XXX XXXX",

    email:"info@mdpassist.co.za",

    website:"www.mdpassist.co.za",

    vat:"",

    regNo:"",

    bank:"",

    accountName:"",

    accountNumber:"",

    branch:"",

    branchCode:""

};

/*==========================================
  LOAD COMPANY DETAILS
==========================================*/

function loadCompany(){

    const company=document.getElementById("companyName");
    if(company) company.value=COMPANY.name;

    const phone=document.getElementById("companyPhone");
    if(phone) phone.value=COMPANY.phone;

    const email=document.getElementById("companyEmail");
    if(email) email.value=COMPANY.email;

    const vat=document.getElementById("companyVAT");
    if(vat) vat.value=COMPANY.vat;

    const reg=document.getElementById("companyReg");
    if(reg) reg.value=COMPANY.regNo;

    const bank=document.getElementById("bankName");
    if(bank) bank.value=COMPANY.bank;

    const acc=document.getElementById("accountNumber");
    if(acc) acc.value=COMPANY.accountNumber;

    const accName=document.getElementById("accountName");
    if(accName) accName.value=COMPANY.accountName;

    const branch=document.getElementById("branchName");
    if(branch) branch.value=COMPANY.branch;

    const branchCode=document.getElementById("branchCode");
    if(branchCode) branchCode.value=COMPANY.branchCode;

}

/*==========================================
  SAVE CLIENT
==========================================*/

function saveClient(){

    const client={

        company:document.getElementById("clientCompany")?.value||"",

        contact:document.getElementById("clientContact")?.value||"",

        phone:document.getElementById("clientPhone")?.value||"",

        email:document.getElementById("clientEmail")?.value||"",

        address:document.getElementById("clientAddress")?.value||""

    };

    let clients=
        JSON.parse(localStorage.getItem("clients"))||[];

    clients.push(client);

    localStorage.setItem(
        "clients",
        JSON.stringify(clients)
    );

}

/*==========================================
  LOAD CLIENTS
==========================================*/

function loadClients(){

    return JSON.parse(
        localStorage.getItem("clients")
    )||[];

}

/*==========================================
  FILL CLIENT
==========================================*/

function fillClient(index){

    const clients=loadClients();

    if(!clients[index]) return;

    const c=clients[index];

    document.getElementById("clientCompany").value=c.company;

    document.getElementById("clientContact").value=c.contact;

    document.getElementById("clientPhone").value=c.phone;

    document.getElementById("clientEmail").value=c.email;

    document.getElementById("clientAddress").value=c.address;

}

/*==========================================
  SAVE COMPLETE INVOICE
==========================================*/

function saveInvoiceHistory(){

    const invoices=
        JSON.parse(localStorage.getItem("invoiceHistory"))||[];

    invoices.push({

        invoice:document.getElementById("invoiceNo").value,

        date:document.getElementById("invoiceDate").value,

        client:document.getElementById("clientCompany")?.value||"",

        total:document.getElementById("grandTotal").innerText

    });

    localStorage.setItem(
        "invoiceHistory",
        JSON.stringify(invoices)
    );

}

/*==========================================
  IMPROVED SAVE
==========================================*/

function saveInvoice(){

    saveClient();

    saveInvoiceHistory();

    nextInvoice();

    alert("Invoice saved successfully.");

      }

    
    
}

    }

}
/*==========================================
  PART 5
  DASHBOARD STATISTICS
==========================================*/

function getInvoiceHistory(){

    return JSON.parse(
        localStorage.getItem("invoiceHistory")
    ) || [];

}

/*==========================================
  TOTAL INVOICES
==========================================*/

function totalInvoices(){

    return getInvoiceHistory().length;

}

/*==========================================
  TOTAL SALES
==========================================*/

function totalSales(){

    let invoices=getInvoiceHistory();

    let total=0;

    invoices.forEach(inv=>{

        let value=String(inv.total)
            .replace("R","")
            .replace(/,/g,"")
            .trim();

        total+=Number(value)||0;

    });

    return total;

}

/*==========================================
  TOTAL CLIENTS
==========================================*/

function totalClients(){

    const clients=
        JSON.parse(localStorage.getItem("clients")) || [];

    return clients.length;

}

/*==========================================
  OUTSTANDING INVOICES
==========================================*/

function outstandingInvoices(){

    const invoices=getInvoiceHistory();

    return invoices.filter(i=>i.status==="Outstanding").length;

}

/*==========================================
  MARK AS PAID
==========================================*/

function markPaid(invoiceNumber){

    let invoices=getInvoiceHistory();

    invoices.forEach(inv=>{

        if(inv.invoice===invoiceNumber){

            inv.status="Paid";

        }

    });

    localStorage.setItem(
        "invoiceHistory",
        JSON.stringify(invoices)
    );

}

/*==========================================
  MARK AS OUTSTANDING
==========================================*/

function markOutstanding(invoiceNumber){

    let invoices=getInvoiceHistory();

    invoices.forEach(inv=>{

        if(inv.invoice===invoiceNumber){

            inv.status="Outstanding";

        }

    });

    localStorage.setItem(
        "invoiceHistory",
        JSON.stringify(invoices)
    );

}

/*==========================================
  UPDATE DASHBOARD
==========================================*/

function updateDashboard(){

    const inv=document.getElementById("statInvoices");
    if(inv)
        inv.innerText=totalInvoices();

    const cli=document.getElementById("statClients");
    if(cli)
        cli.innerText=totalClients();

    const sales=document.getElementById("statSales");
    if(sales)
        sales.innerText=
            "R "+
            totalSales().toLocaleString("en-ZA",{
                minimumFractionDigits:2,
                maximumFractionDigits:2
            });

    const outstanding=document.getElementById("statOutstanding");
    if(outstanding)
        outstanding.innerText=
            outstandingInvoices();

}

/*==========================================
  AUTO LOAD DASHBOARD
==========================================*/

window.addEventListener("load",function(){

    updateDashboard();
/*==========================================
  PART 6
  INVOICE HISTORY MANAGER
==========================================*/

function getHistory(){

    return JSON.parse(
        localStorage.getItem("invoiceHistory")
    ) || [];

}

function renderHistory(search=""){

    const table=document.getElementById("historyTable");

    if(!table) return;

    table.innerHTML="";

    const invoices=getHistory();

    invoices.forEach((inv,index)=>{

        const client=(inv.client||"").toLowerCase();
        const invoice=(inv.invoice||"").toLowerCase();

        if(
            client.includes(search.toLowerCase()) ||
            invoice.includes(search.toLowerCase())
        ){

            const row=document.createElement("tr");

            row.innerHTML=`

                <td>${inv.invoice}</td>

                <td>${inv.date}</td>

                <td>${inv.client}</td>

                <td>${inv.total}</td>

                <td>${inv.status || "Outstanding"}</td>

                <td>

                    <button
                        onclick="markPaid('${inv.invoice}')">

                        Paid

                    </button>

                    <button
                        onclick="deleteInvoice(${index})">

                        Delete

                    </button>

                </td>

            `;

            table.appendChild(row);

        }

    });

}

/*==========================================
  DELETE INVOICE
==========================================*/

function deleteInvoice(index){

    if(!confirm("Delete this invoice?"))
        return;

    let invoices=getHistory();

    invoices.splice(index,1);

    localStorage.setItem(

        "invoiceHistory",

        JSON.stringify(invoices)

    );

    renderHistory();

    updateDashboard();

}

/*==========================================
  SEARCH HISTORY
==========================================*/

function searchHistory(){

    const box=document.getElementById("historySearch");

    if(!box) return;

    renderHistory(box.value);

}

/*==========================================
  EXPORT HISTORY
==========================================*/

function exportHistory(){

    const data=getHistory();

    const blob=new Blob(

        [JSON.stringify(data,null,4)],

        {type:"application/json"}

    );

    const link=document.createElement("a");

    link.href=URL.createObjectURL(blob);

    link.download="InvoiceHistory.json";

    link.click();

}

/*==========================================
  IMPORT HISTORY
==========================================*/

function importHistory(file){

    const reader=new FileReader();

    reader.onload=function(e){

        localStorage.setItem(

            "invoiceHistory",

            e.target.result

        );

        renderHistory();

        updateDashboard();

        alert("Invoice history imported.");

    };

    reader.readAsText(file);

}

/*==========================================
  AUTO LOAD HISTORY
==========================================*/

window.addEventListener("load",function(){

    renderHistory();
/*==========================================
  PART 7
  CLIENT MANAGER
==========================================*/

function getClients(){

    return JSON.parse(

        localStorage.getItem("clients")

    ) || [];

}

function saveClients(clients){

    localStorage.setItem(

        "clients",

        JSON.stringify(clients)

    );

}

/*==========================================
  RENDER CLIENTS
==========================================*/

function renderClients(search=""){

    const table=document.getElementById("clientTable");

    if(!table) return;

    table.innerHTML="";

    const clients=getClients();

    clients.forEach((client,index)=>{

        const company=(client.company||"").toLowerCase();

        const contact=(client.contact||"").toLowerCase();

        if(

            company.includes(search.toLowerCase()) ||

            contact.includes(search.toLowerCase())

        ){

            const row=document.createElement("tr");

            row.innerHTML=`

            <td>${client.company}</td>

            <td>${client.contact}</td>

            <td>${client.phone}</td>

            <td>${client.email}</td>

            <td>

                <button onclick="selectClient(${index})">

                    Use

                </button>

                <button onclick="editClient(${index})">

                    Edit

                </button>

                <button onclick="deleteClient(${index})">

                    Delete

                </button>

            </td>

            `;

            table.appendChild(row);

        }

    });

}

/*==========================================
  SELECT CLIENT
==========================================*/

function selectClient(index){

    const clients=getClients();

    const c=clients[index];

    if(!c) return;

    document.getElementById("clientCompany").value=c.company;

    document.getElementById("clientContact").value=c.contact;

    document.getElementById("clientPhone").value=c.phone;

    document.getElementById("clientEmail").value=c.email;

    document.getElementById("clientAddress").value=c.address;

}

/*==========================================
  DELETE CLIENT
==========================================*/

function deleteClient(index){

    if(!confirm("Delete this client?"))

        return;

    const clients=getClients();

    clients.splice(index,1);

    saveClients(clients);

    renderClients();

    updateDashboard();

}

/*==========================================
  EDIT CLIENT
==========================================*/

function editClient(index){

    const clients=getClients();

    const c=clients[index];

    if(!c) return;

    document.getElementById("clientCompany").value=c.company;

    document.getElementById("clientContact").value=c.contact;

    document.getElementById("clientPhone").value=c.phone;

    document.getElementById("clientEmail").value=c.email;

    document.getElementById("clientAddress").value=c.address;

    deleteClient(index);

}

/*==========================================
  SEARCH CLIENTS
==========================================*/

function searchClients(){

    const box=document.getElementById("clientSearch");

    if(!box) return;

    renderClients(box.value);

}

/*==========================================
  EXPORT CLIENTS
==========================================*/

function exportClients(){

    const blob=new Blob(

        [

            JSON.stringify(

                getClients(),

                null,

                4

            )

        ],

        {

            type:"application/json"

        }

    );

    const link=document.createElement("a");

    link.href=URL.createObjectURL(blob);

    link.download="Clients.json";

    link.click();

}

/*==========================================
  IMPORT CLIENTS
==========================================*/

function importClients(file){

    const reader=new FileReader();

    reader.onload=function(e){

        localStorage.setItem(

            "clients",

            e.target.result

        );

        renderClients();

        updateDashboard();

        alert("Clients imported successfully.");

    };

    reader.readAsText(file);

}

/*==========================================
  LOAD CLIENTS
==========================================*/

window.addEventListener(

    "load",

    function(){

        renderClients();
/*==========================================
  PART 8
  COMPANY SETTINGS
==========================================*/

const DEFAULT_COMPANY={

    companyName:"MDP Assist",

    slogan:"Credit Checks Local & International",

    registrationNo:"",

    vatNumber:"",

    phone:"",

    mobile:"",

    email:"",

    website:"",

    address:"",

    city:"",

    province:"",

    postalCode:"",

    bank:"",

    accountName:"",

    accountNumber:"",

    branch:"",

    branchCode:""

};

/*==========================================
  LOAD COMPANY SETTINGS
==========================================*/

function getCompanySettings(){

    return JSON.parse(

        localStorage.getItem("companySettings")

    ) || DEFAULT_COMPANY;

}

/*==========================================
  SAVE COMPANY SETTINGS
==========================================*/

function saveCompanySettings(){

    const company={

        companyName:document.getElementById("companyName")?.value||"",

        slogan:document.getElementById("companySlogan")?.value||"",

        registrationNo:document.getElementById("registrationNo")?.value||"",

        vatNumber:document.getElementById("vatNumber")?.value||"",

        phone:document.getElementById("companyPhone")?.value||"",

        mobile:document.getElementById("companyMobile")?.value||"",

        email:document.getElementById("companyEmail")?.value||"",

        website:document.getElementById("companyWebsite")?.value||"",

        address:document.getElementById("companyAddress")?.value||"",

        city:document.getElementById("companyCity")?.value||"",

        province:document.getElementById("companyProvince")?.value||"",

        postalCode:document.getElementById("companyPostal")?.value||"",

        bank:document.getElementById("bankName")?.value||"",

        accountName:document.getElementById("accountName")?.value||"",

        accountNumber:document.getElementById("accountNumber")?.value||"",

        branch:document.getElementById("branchName")?.value||"",

        branchCode:document.getElementById("branchCode")?.value||""

    };

    localStorage.setItem(

        "companySettings",

        JSON.stringify(company)

    );

    alert("Company settings saved.");

}

/*==========================================
  APPLY COMPANY SETTINGS
==========================================*/

function applyCompanySettings(){

    const c=getCompanySettings();

    Object.keys(c).forEach(key=>{

        const el=document.getElementById(key);

        if(el){

            el.value=c[key];

        }

    });

}

/*==========================================
  EXPORT BACKUP
==========================================*/

function exportBackup(){

    const backup={

        company:getCompanySettings(),

        clients:getClients(),

        invoices:getHistory()

    };

    const blob=new Blob(

        [

            JSON.stringify(

                backup,

                null,

                4

            )

        ],

        {

            type:"application/json"

        }

    );

    const link=document.createElement("a");

    link.href=URL.createObjectURL(blob);

    link.download="MDP_Assist_Backup.json";

    link.click();

}

/*==========================================
  IMPORT BACKUP
==========================================*/

function importBackup(file){

    const reader=new FileReader();

    reader.onload=function(e){

        const backup=JSON.parse(e.target.result);

        if(backup.company)

            localStorage.setItem(

                "companySettings",

                JSON.stringify(backup.company)

            );

        if(backup.clients)

            localStorage.setItem(

                "clients",

                JSON.stringify(backup.clients)

            );

        if(backup.invoices)

            localStorage.setItem(

                "invoiceHistory",

                JSON.stringify(backup.invoices)

            );

        applyCompanySettings();

        renderClients();

        renderHistory();

        updateDashboard();

        alert("Backup restored successfully.");

    };

    reader.readAsText(file);

}

/*==========================================
  AUTO LOAD SETTINGS
==========================================*/

window.addEventListener(

    "load",

    function(){

        applyCompanySettings();
/*==========================================
  PART 9
  VALIDATION & PRODUCTIVITY
==========================================*/

/*==========================================
  SHOW NOTIFICATION
==========================================*/

function notify(message,type="success"){

    const old=document.getElementById("notifyBox");

    if(old) old.remove();

    const box=document.createElement("div");

    box.id="notifyBox";

    box.innerHTML=message;

    box.style.position="fixed";
    box.style.top="20px";
    box.style.right="20px";
    box.style.padding="15px 25px";
    box.style.borderRadius="8px";
    box.style.color="white";
    box.style.fontWeight="bold";
    box.style.zIndex="99999";
    box.style.boxShadow="0 10px 25px rgba(0,0,0,.35)";

    if(type=="success")
        box.style.background="#4CAF50";

    if(type=="error")
        box.style.background="#d32f2f";

    if(type=="warning")
        box.style.background="#ff9800";

    document.body.appendChild(box);

    setTimeout(function(){

        box.remove();

    },3000);

}

/*==========================================
  VALIDATE INVOICE
==========================================*/

function validateInvoice(){

    const company=document.getElementById("clientCompany");

    if(company && company.value.trim()==""){

        notify("Please enter a client company.","error");

        return false;

    }

    const rows=document.querySelectorAll("#invoiceBody tr");

    if(rows.length==0){

        notify("Please add at least one invoice item.","warning");

        return false;

    }

    return true;

}

/*==========================================
  AUTO DUE DATE
==========================================*/

function setDueDate(days=30){

    const due=document.getElementById("dueDate");

    if(!due) return;

    const date=new Date();

    date.setDate(date.getDate()+days);

    due.value=date.toISOString().substring(0,10);

}

/*==========================================
  PAYMENT STATUS
==========================================*/

function paymentStatus(){

    const total=document.getElementById("grandTotal");

    const status=document.getElementById("paymentStatus");

    if(!total || !status) return;

    if(total.innerText=="R 0.00"){

        status.innerText="Draft";

        return;

    }

    status.innerText="Outstanding";

}

/*==========================================
  DUPLICATE INVOICE
==========================================*/

function duplicateInvoice(){

    nextInvoice();

    notify("Invoice duplicated.");

}

/*==========================================
  KEYBOARD SHORTCUTS
==========================================*/

document.addEventListener("keydown",function(e){

    if(e.ctrlKey && e.key==="s"){

        e.preventDefault();

        if(validateInvoice()){

            saveInvoice();

            notify("Invoice saved.");

        }

    }

    if(e.ctrlKey && e.key==="p"){

        e.preventDefault();

        printInvoice();

    }

    if(e.ctrlKey && e.key==="n"){

        e.preventDefault();

        newInvoice();

    }

});

/*==========================================
  AUTO START
==========================================*/

window.addEventListener("load",function(){

    setDueDate();

    paymentStatus();
/*==========================================
  PART 10
  FINAL POLISH
==========================================*/

/*==========================================
  GENERATE UNIQUE INVOICE NUMBER
==========================================*/

function generateInvoiceNumber(){

    const now=new Date();

    const year=now.getFullYear();

    const month=String(now.getMonth()+1).padStart(2,"0");

    const day=String(now.getDate()).padStart(2,"0");

    const number=String(invoiceCounter).padStart(5,"0");

    return "MDP-"+year+month+day+"-"+number;

}

/*==========================================
  START NEW INVOICE
==========================================*/

function startNewInvoice(){

    clearInvoice();

    invoiceCounter++;

    localStorage.setItem(

        "invoiceCounter",

        invoiceCounter

    );

    const invoice=document.getElementById("invoiceNo");

    if(invoice){

        invoice.value=generateInvoiceNumber();

    }

    const today=document.getElementById("invoiceDate");

    if(today){

        today.valueAsDate=new Date();

    }

    setDueDate();

}

/*==========================================
  DOWNLOAD JSON COPY
==========================================*/

function downloadInvoice(){

    const invoice={

        number:document.getElementById("invoiceNo")?.value,

        date:document.getElementById("invoiceDate")?.value,

        client:document.getElementById("clientCompany")?.value,

        total:document.getElementById("grandTotal")?.innerText

    };

    const blob=new Blob(

        [

            JSON.stringify(

                invoice,

                null,

                4

            )

        ],

        {

            type:"application/json"

        }

    );

    const link=document.createElement("a");

    link.href=URL.createObjectURL(blob);

    link.download=invoice.number+".json";

    link.click();

}

/*==========================================
  PRINT & SAVE
==========================================*/

function finishInvoice(){

    if(!validateInvoice())

        return;

    saveInvoiceHistory();

    saveClient();

    window.print();

    notify(

        "Invoice completed successfully."

    );

}

/*==========================================
  AUTO SAVE EVERY 60 SECONDS
==========================================*/

setInterval(function(){

    saveDraft();

},60000);

/*==========================================
  BEFORE LEAVING PAGE
==========================================*/

window.addEventListener(

    "beforeunload",

    function(){

        saveDraft();

    }

);

/*==========================================
  QUICK SEARCH CLIENT
==========================================*/

function quickClientSearch(name){

    const clients=getClients();

    return clients.filter(c=>

        c.company

        .toLowerCase()

        .includes(

            name.toLowerCase()

        )

    );

}

/*==========================================
  RESET DATABASE
==========================================*/

function resetSystem(){

    if(

        !confirm(

            "Delete ALL invoices, clients and settings?"

        )

    ) return;

    localStorage.clear();

    alert(

        "System reset completed."

    );

    location.reload();

}

/*==========================================
  STARTUP
==========================================*/

window.addEventListener(

    "load",

    function(){

        loadDraft();

        updateDashboard();

        renderClients();

        renderHistory();

        paymentStatus();

    }

);
});
    }

);
    }

);
});
});
