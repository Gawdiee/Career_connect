// Function to fetch job listings from the server
function fetchJobListings() {
  const studId = localStorage.getItem("student_id");

  fetch(`http://localhost:3000/job-posting/${studId}`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(jobs => {
          if (Array.isArray(jobs)) {
              displayJobListings(jobs);
          } else {
              console.error("Unexpected response format:", jobs);
          }
      })
      .catch(error => console.error('Error fetching job listings:', error));
}


// Function to display job listings
function displayJobListings(jobs) {
  const jobListingsContainer = document.getElementById("job-listings-container");
  jobListingsContainer.innerHTML = '';

  jobs.forEach(job => {
    const jobItem = document.createElement("div");
    jobItem.classList.add("job-item");
    jobItem.innerHTML = `
      <h3>${job.Title}</h3>
      <p>Company: ${job.CompanyName}</p>
      <p>Role: ${job.Role}</p>
      <p>Eligibility: ${job.Eligibility}</p>
      <button class="btn-apply" onclick="applyToJob(${job.Job_id})">Apply</button>
    `;
    jobListingsContainer.appendChild(jobItem);
  });
}

// Function to handle job application
function applyToJob(jobId) {
  const studId = localStorage.getItem("student_id");

  if (!studId) {
    alert("Student ID not found. Please log in again.");
    return;
  }

  fetch('http://localhost:3000/apply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ stud_id: studId, job_id: jobId })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);
      fetchApplications();
    })
    .catch(error => console.error('Error applying for job:', error));
}

// Function to fetch and display applications
function fetchApplications() {
  const studId = localStorage.getItem("student_id");

  if (!studId) {
    console.error("Student ID not found. Unable to fetch applications.");
    return;
  }

  fetch(`http://localhost:3000/student-applications/${studId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(applications => {
      displayApplications(applications);
    })
    .catch(error => console.error('Error fetching applications:', error));
}

// Function to display applications
function displayApplications(applications) {
  const applicationsContainer = document.getElementById("applications-container");
  applicationsContainer.innerHTML = '';

  applications.forEach(application => {
    const applicationItem = document.createElement("div");
    applicationItem.classList.add("application-item");
    applicationItem.innerHTML = `
      <h3>${application.CompanyName}</h3>
      <p>Job Title: ${application.JobTitle}</p>
      <p>Status: ${application.Status}</p>
    `;
    applicationsContainer.appendChild(applicationItem);
  });
}

// Fetch and display job listings and applications when the page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchJobListings();
  fetchApplications();
});
