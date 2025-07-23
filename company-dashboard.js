// Submission code for posting a job
document.getElementById("job-posting-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("job-title").value;
    const role = document.getElementById("role").value;
    const eligibility = document.getElementById("eligibility").value;
    const comp_id = localStorage.getItem("comp_id"); // Get the company ID from local storage

    fetch('http://localhost:3000/post-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: title,
            role: role,
            eligibility: eligibility,
            comp_id: comp_id // Send the company ID with the job details
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById("job-posting-form").reset();
    })
    .catch(error => console.error('Error:', error));
});

// Function to display student applications with 'Pending' decision
function displayApplications() {
    const compId = localStorage.getItem("comp_id");

    fetch(`http://localhost:3000/company-applications/${compId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Applications fetched:", data); // Log fetched data

            const applicationsContainer = document.getElementById("applications-container");
            applicationsContainer.innerHTML = ""; // Clear existing content

            data.forEach(application => {
                console.log("Application details:", application); // Log each application
                console.log("Decision status:", application.Decision); // Log Decision status
                
                // Check if the Decision status is "Pending"
                if (application.Decision === "Pending") {
                    const applicationItem = document.createElement("div");
                    applicationItem.classList.add("application-item");
                    applicationItem.setAttribute("id", `application-${application.Appl_id}`);
                    applicationItem.innerHTML = `
                        <h3>${application.JobTitle}</h3>
                        <p>Applicant: ${application.StudentName}</p>
                        <p>Skills: ${application.Skills}</p>
                        <button class="accept-button" data-appl-id="${application.Appl_id}">Accept</button>
                        <button class="reject-button" data-appl-id="${application.Appl_id}">Reject</button>
                    `;
                    applicationsContainer.appendChild(applicationItem);
                }
            });

            // Check if applicationsContainer was populated
            console.log("Applications displayed in dashboard:", applicationsContainer.innerHTML);

            // Add event listeners for accept and reject buttons
            document.querySelectorAll(".accept-button").forEach(button => {
                button.addEventListener("click", () => {
                    const appl_id = button.getAttribute("data-appl-id");
                    acceptApplication(appl_id);
                });
            });

            document.querySelectorAll(".reject-button").forEach(button => {
                button.addEventListener("click", () => {
                    const appl_id = button.getAttribute("data-appl-id");
                    rejectApplication(appl_id);
                });
            });
        })
        .catch(error => console.error('Error fetching applications:', error));
}


// Function to accept an application
function acceptApplication(appl_id) {
    fetch('http://localhost:3000/application/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appl_id })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById(`application-${appl_id}`).remove(); // Remove application from the list
    })
    .catch(error => console.error('Error accepting application:', error));
}

// Function to reject an application
function rejectApplication(appl_id) {
    fetch('http://localhost:3000/application/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appl_id })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById(`application-${appl_id}`).remove(); // Remove application from the list
    })
    .catch(error => console.error('Error rejecting application:', error));
}

// Call displayApplications to load applications on page load
displayApplications();
