// Empty records array to start
const records = [];
let editingIndex = null; // Tracks the index of the record being edited

document.addEventListener("DOMContentLoaded", () => {
    loadTableData();
});

// Function to load records into the table
function loadTableData() {
    const tableBody = document.querySelector("#hospital-table tbody");
    tableBody.innerHTML = ""; // Clear existing rows
    records.forEach((record, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${record.opNo}</td>
            <td>${record.name}</td>
            <td>${record.fatherName}</td>
            <td>${record.address}</td>
            <td>${record.age}</td>
            <td>${record.sex}</td>
            <td>${record.dob}</td>
            <td>${record.phone}</td>
            <td>${record.registrationDate}</td>
            <td>${record.religion}</td>
            <td>
                <button onclick="editRecord(${index})">Edit</button>
                <button onclick="deleteRecord(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to calculate age from DOB
function calculateAge() {
    const dobInput = document.getElementById("dob").value;
    const ageInput = document.getElementById("age");

    if (dobInput) {
        const dob = new Date(dobInput);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        ageInput.value = age;
    } else {
        ageInput.value = "";
    }
}

// Function to add or update a record
function addRecord() {
    const opNo = document.getElementById("op-no").value.trim();
    const name = document.getElementById("name").value.trim();
    const fatherName = document.getElementById("father-name").value.trim();
    const address = document.getElementById("address").value.trim();
    const dob = document.getElementById("dob").value;
    const age = document.getElementById("age").value;
    const sex = document.getElementById("sex").value;
    const phone = document.getElementById("phone").value.trim();
    const registrationDate = document.getElementById("registration-date").value;
    const religion = document.getElementById("religion").value.trim();

    if (opNo && name && fatherName && address && dob && age && sex && phone && registrationDate && religion) {
        const newRecord = { opNo, name, fatherName, address, dob, age, sex, phone, registrationDate, religion };

        if (editingIndex !== null) {
            records[editingIndex] = newRecord; // Update the record
            editingIndex = null; // Reset editing index
            alert("Record updated successfully!");
        } else {
            records.push(newRecord); // Add new record
            alert("Record added successfully!");
        }

        loadTableData();
        document.getElementById("add-record-form").reset();
    } else {
        alert("Please fill out all fields.");
    }
}

// Function to edit a record
function editRecord(index) {
    const record = records[index];
    document.getElementById("op-no").value = record.opNo;
    document.getElementById("name").value = record.name;
    document.getElementById("father-name").value = record.fatherName;
    document.getElementById("address").value = record.address;
    document.getElementById("dob").value = record.dob;
    calculateAge(); // Auto-update age
    document.getElementById("sex").value = record.sex;
    document.getElementById("phone").value = record.phone;
    document.getElementById("registration-date").value = record.registrationDate;
    document.getElementById("religion").value = record.religion;

    editingIndex = index; // Set editing index
}

// Function to delete a record
function deleteRecord(index) {
    if (confirm("Are you sure you want to delete this record?")) {
        records.splice(index, 1);
        loadTableData();
    }
}

// Function to search for a record by OP No
function searchRecord() {
    const searchOpNo = document.getElementById("search-op-no").value.trim();
    const tableBody = document.querySelector("#hospital-table tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    const filteredRecords = records.filter(record => record.opNo === searchOpNo);

    if (filteredRecords.length > 0) {
        filteredRecords.forEach((record, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${record.opNo}</td>
                <td>${record.name}</td>
                <td>${record.fatherName}</td>
                <td>${record.address}</td>
                <td>${record.age}</td>
                <td>${record.sex}</td>
                <td>${record.dob}</td>
                <td>${record.phone}</td>
                <td>${record.registrationDate}</td>
                <td>${record.religion}</td>
                <td>
                    <button onclick="editRecord(${index})">Edit</button>
                    <button onclick="deleteRecord(${index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        alert("No records found with the given OP No.");
    }
}
function displayAllRecords() {
    loadTableData(); // Reload all records into the table
    document.getElementById("search-op-no").value = ""; // Clear the search input
}
function downloadExcel() {
    const ws = XLSX.utils.json_to_sheet(records); // Convert records array to worksheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "HospitalRecords"); // Add worksheet to workbook
    XLSX.writeFile(wb, "HospitalRecords.xlsx"); // Save the file
}

function importExcel(event) {
    const file = event.target.files[0]; // Get the selected file

    if (!file) {
        alert("Please select a file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const sheet = workbook.Sheets[sheetName];
        const importedData = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON

        // Add imported data to the records array
        importedData.forEach(record => {
            records.push(record);
        });

        loadTableData(); // Reload the table with the imported data
        alert("Records imported successfully!");
    };

    reader.readAsArrayBuffer(file); // Read the file
}

