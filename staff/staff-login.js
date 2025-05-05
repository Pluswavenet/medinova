const auth = firebase.auth();
const db = firebase.firestore();

const loginForm = document.getElementById("staff-login-form");
const loginSection = document.getElementById("login-section");
const patientDetails = document.getElementById("patient-details");
const tableBody = document.querySelector("#patient-table tbody");
const statusDiv = document.getElementById("status");

let unsubscribeAppointments = null;
let isSearchMode = false;

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      statusDiv.innerHTML = `<p style="font-weight: bold; color: green;">Welcome, ${user.email}</p>`;
      loginSection.style.display = "none";
      patientDetails.style.display = "block";
      loadAppointments();
    })
    .catch((error) => {
      alert("Login Failed: " + error.message);
    });
});

document.getElementById("logout-btn").addEventListener("click", () => {
  if (unsubscribeAppointments) unsubscribeAppointments();
  auth.signOut().then(() => {
    location.reload();
  });
});

function loadAppointments() {
  isSearchMode = false;
  if (unsubscribeAppointments) unsubscribeAppointments();

  unsubscribeAppointments = db.collection("appointments")
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot => {
      if (isSearchMode) return; // Avoid updating when in search mode
      tableBody.innerHTML = "";
      snapshot.forEach(doc => {
        tableBody.innerHTML += generateTableRow(doc.id, doc.data());
      });
    });
}

function saveNotes(id) {
  const notes = document.getElementById(`notes-input-${id}`).value.trim();
  db.collection("appointments").doc(id).update({ notes })
    .then(() => {
      document.getElementById(`notes-display-${id}`).innerText = notes;
      alert("Notes updated successfully.");
    })
    .catch(error => {
      console.error("Error saving notes: ", error);
      alert("Failed to save notes.");
    });
}

document.getElementById("search-btn").addEventListener("click", () => {
  const name = document.getElementById("search-name").value.trim().toLowerCase();
  if (!name) return;

  isSearchMode = true;
  if (unsubscribeAppointments) unsubscribeAppointments();

  db.collection("appointments")
    .orderBy("name")
    .get()
    .then(snapshot => {
      tableBody.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.name.toLowerCase().includes(name)) {
          tableBody.innerHTML += generateTableRow(doc.id, data);
        }
      });
    });
});

document.getElementById("show-all-btn").addEventListener("click", () => {
  document.getElementById("search-name").value = "";
  loadAppointments();
});

function generateTableRow(id, data) {
  return `
    <tr>
      <td>${data.name}</td>
      <td>${data.address}</td>
      <td>${data.age}</td>
      <td>${data.phone}</td>
      <td>${data.department}</td>
      <td>${data.doctor}</td>
      <td>${data.date}</td>
      <td>${data.time}</td>
      <td>${data.reason}</td>
      <td data-label="Notes" id="notes-display-${id}" style="font-weight:bold; font-size: 16px;">${data.notes || ''}</td>
          <td data-label="Edit Notes">
            <textarea id="notes-input-${id}" rows="8" cols="35">${data.notes || `Doctor Prescription:\n++++++++++++++++++++++\n\n\n++++++++++++++++++++++\nScan:\n++++++++++++++++++++++\n\n\n++++++++++++++++++++++\nPharmacy:\n++++++++++++++++++++++\n\n\n++++++++++++++++++++++\nBill Total:\n++++++++++++++++++++++\n\n++++++++++++++++++++++`}</textarea>
            <br/>
            <button onclick="saveNotes('${id}')">Save</button>
          </td>
    </tr>
  `;
}
