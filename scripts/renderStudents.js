const API_URL = "http://localhost:8080/get-students";

const tableBody = document.getElementById("studentTableBody");
const statusMessage = document.getElementById("statusMessage");

async function renderStudents() {
    statusMessage.textContent = "Loading students...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const students = await response.json();

        tableBody.replaceChildren();

        if (students.length === 0) {
            statusMessage.textContent = "No students found.";
            return;
        }

        students.forEach(student => {
            const row = document.createElement("tr");

            const enrollmentCell = document.createElement("td");
            enrollmentCell.textContent = student.studentEnrollment ?? "";

            const nameCell = document.createElement("td");
            nameCell.textContent = student.studentName ?? "";

            const courseCell = document.createElement("td");
            courseCell.textContent = student.studentCourse ?? "";

            const batchCell = document.createElement("td");
            batchCell.textContent = student.studentBatch ?? "";

            const infoCell = document.createElement("td");
            const infoLink = document.createElement("a");
            infoLink.textContent = "More Info";
            infoLink.href = `student-details.html?enrollment=${encodeURIComponent(student.studentEnrollment)}`;
            infoCell.appendChild(infoLink);


            row.append(
                enrollmentCell,
                nameCell,
                courseCell,
                batchCell,
                infoCell
            );

            tableBody.appendChild(row);
        });

        statusMessage.textContent = `Total students: ${students.length}`;

    } catch (error) {
        console.error("Error fetching students:", error);
        statusMessage.textContent =
            "Unable to load students. Please check whether the backend is running.";
    }
}

renderStudents();