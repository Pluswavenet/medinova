let records = [];
let editIndex = -1; // To track which record is being edited

// Format current time in 12-hour format
function getCurrentTime12Hour() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert 0 to 12
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${formattedMinutes} ${ampm}`;
}

// Auto set the admission time on page load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("ad-time").value = getCurrentTime12Hour();
    displayAllRecords(); // Load existing records if needed
});

// Add or update a record
function addRecord() {
    const opNo = document.getElementById("op-no").value.trim();
    const disease = document.getElementById("disease").value.trim();
    const doctorName = document.getElementById("doctor-name").value.trim();
    const dept = document.getElementById("dept").value.trim();
    const adDate = document.getElementById("ad-date").value;
    const adTime = document.getElementById("ad-time").value || getCurrentTime12Hour();
    const room = document.getElementById("room").value;
    const adRoomNo = document.getElementById("ad-room-no").value.trim();
    const dischargeDate = document.getElementById("discharge-date").value;
    const doctorNote = document.getElementById("doctor-note").value.trim();

    // Validate required fields
    if (!opNo || !disease || !doctorName || !dept || !doctorNote) {
        alert("Please fill in all required fields.");
        return;
    }

    const record = {
        opNo, disease, doctorName, dept, adDate, adTime, room,
        adRoomNo, dischargeDate, doctorNote
    };

    if (editIndex === -1) {
        // Add mode
        records.push(record);
    } else {
        // Edit mode
        records[editIndex] = record;
        editIndex = -1;
    }

    document.getElementById("add-record-form").reset();
    document.getElementById("ad-time").value = getCurrentTime12Hour(); // Reset auto time
    loadTableData();
}

// Load data to the table
function loadTableData(filtered = records) {
    const tbody = document.querySelector("#hospital-table tbody");
    tbody.innerHTML = "";

    filtered.forEach((record, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${record.opNo}</td>
            <td>${record.disease}</td>
            <td>${record.doctorName}</td>
            <td>${record.dept}</td>
            <td>${record.adDate || "N/A"}</td>
            <td>${record.adTime || "N/A"}</td>
            <td>${record.room || "N/A"}</td>
            <td>${record.adRoomNo || "N/A"}</td>
            <td>${record.dischargeDate || "N/A"}</td>
            <td>${record.doctorNote}</td>
            <td class="actions">
                <button class="edit-btn" onclick="editRecord(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteRecord(${index})">Delete</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// Edit a record
function editRecord(index) {
    const record = records[index];
    document.getElementById("op-no").value = record.opNo;
    document.getElementById("disease").value = record.disease;
    document.getElementById("doctor-name").value = record.doctorName;
    document.getElementById("dept").value = record.dept;
    document.getElementById("ad-date").value = record.adDate;
    document.getElementById("ad-time").value = record.adTime;
    document.getElementById("room").value = record.room;
    document.getElementById("ad-room-no").value = record.adRoomNo;
    document.getElementById("discharge-date").value = record.dischargeDate;
    document.getElementById("doctor-note").value = record.doctorNote;

    editIndex = index;
}

// Delete a record
function deleteRecord(index) {
    if (confirm("Are you sure you want to delete this record?")) {
        records.splice(index, 1);
        loadTableData();
    }
}

// Search by OP No
function searchRecord() {
    const searchValue = document.getElementById("search-op-no").value.trim();
    if (!searchValue) return;

    const filtered = records.filter(record => record.opNo.includes(searchValue));
    loadTableData(filtered);
}

// Display all records
function displayAllRecords() {
    loadTableData();
}

// Download as Excel
function downloadExcel() {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Patients");
    XLSX.writeFile(wb, "patients_records.xlsx");
}

// Import from Excel
function importExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const importedData = XLSX.utils.sheet_to_json(sheet);

        records = importedData.map(item => ({
            opNo: item.opNo || "",
            disease: item.disease || "",
            doctorName: item.doctorName || "",
            dept: item.dept || "",
            adDate: item.adDate || "",
            adTime: item.adTime || "",
            room: item.room || "",
            adRoomNo: item.adRoomNo || "",
            dischargeDate: item.dischargeDate || "",
            doctorNote: item.doctorNote || ""
        }));

        loadTableData();
    };

    reader.readAsArrayBuffer(file);
}
