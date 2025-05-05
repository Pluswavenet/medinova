    const form = document.getElementById("appointment-form");
    const statusMsg = document.getElementById("status");

    const doctorsByDepartment = {
      "Pediatrics": ["Dr. Vidya Sajan", "Dr. Sam Prakash"],
      "Orthopedics": ["Dr. Vimal Antony", "Dr. Tessa Rajan"],
      "Physician": ["Dr. Ance Joseph", "Dr. Joseph Joseph"]
    };

    const departmentDropdown = document.getElementById("department");
    const doctorDropdown = document.getElementById("doctor");

    // Reset all form fields after submission
    function resetForm() {
      form.reset(); // Reset all form fields
      departmentDropdown.selectedIndex = 0; // Reset department dropdown to first option
      doctorDropdown.innerHTML = '<option value="">Select Doctor</option>'; // Reset doctor dropdown
    }

    // Update doctor dropdown when department is selected
    departmentDropdown.addEventListener("change", function () {
      const selectedDept = departmentDropdown.value;
      doctorDropdown.innerHTML = '<option value="">Select Doctor</option>'; // Clear doctor options
      if (selectedDept && doctorsByDepartment[selectedDept]) {
        doctorsByDepartment[selectedDept].forEach(doctor => {
          const option = document.createElement("option");
          option.value = doctor;
          option.textContent = doctor;
          doctorDropdown.appendChild(option);
        });
      }
    });

    // Handle form submission
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent the form from submitting traditionally

      // Get the form data
      const name = document.getElementById("name").value;
      const address = document.getElementById("address").value;
      const age = document.getElementById("age").value;
      const phone = document.getElementById("phone").value;
      const department = document.getElementById("department").value;
      const doctor = document.getElementById("doctor").value;
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;
      const reason = document.getElementById("reason").value;

      // Save the appointment to Firestore
      firebase.firestore().collection("appointments").add({
        name,
        address,
        age,
        phone,
        department,
        doctor,
        date,
        time,
        reason,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        // Display success message
        statusMsg.innerText = "Appointment booked successfully!";
        
        // Reset the form after successful submission
        resetForm();
      }).catch((error) => {
        // Handle errors
        console.error("Error booking appointment:", error);
        statusMsg.innerText = "Error booking appointment.";
      });
    });