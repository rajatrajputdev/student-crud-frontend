const API_BASE_URL = "http://localhost:8080";

const studentForm = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTableBody");
const statusMessage = document.getElementById("statusMessage");
const addStudentButton = document.getElementById("addStudentButton");
const refreshButton = document.getElementById("refreshButton");

function showMessage(message, type = "success") {
    statusMessage.textContent = message;
    statusMessage.className = `alert alert-${type}`;
}

function clearMessage() {
    statusMessage.textContent = "";
    statusMessage.className = "alert d-none";
}

async function readErrorMessage(response) {
    const text = await response.text();
    if (!text) return `Request failed with status ${response.status}`;

    try {
        const data = JSON.parse(text);
        if (typeof data === "string") return data;
        return Object.values(data).join(" | ") || text;
    } catch {
        return text;
    }
}

async function loadStudents() {
    tableBody.replaceChildren();

    const loadingRow = document.createElement("tr");
    const loadingCell = document.createElement("td");
    loadingCell.colSpan = 5;
    loadingCell.className = "text-center";
    loadingCell.textContent = "Loading students...";
    loadingRow.appendChild(loadingCell);
    tableBody.appendChild(loadingRow);

    try {
        const response = await fetch(`${API_BASE_URL}/get-students`);
        if (!response.ok) {
            throw new Error(await readErrorMessage(response));
        }

        const students = await response.json();
        tableBody.replaceChildren();

        if (!students.length) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 5;
            cell.className = "text-center";
            cell.textContent = "No students found.";
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        students.forEach(student => {
            const row = document.createElement("tr");

            [student.studentEnrollment, student.studentName,
             student.studentCourse, student.studentBatch].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value ?? "";
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "btn btn-danger btn-sm";
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteStudent(student.studentEnrollment));
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Unable to load students:", error);
        tableBody.replaceChildren();
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.className = "text-center text-danger";
        cell.textContent = "Unable to load students. Check the backend and CORS settings.";
        row.appendChild(cell);
        tableBody.appendChild(row);
        showMessage(error.message, "danger");
    }
}

studentForm.addEventListener("submit", async event => {
    event.preventDefault();
    clearMessage();

    const formData = new FormData(studentForm);
    const student = {
        studentEnrollment: String(formData.get("studentEnrollment")).trim(),
        studentName: String(formData.get("studentName")).trim(),
        studentCourse: String(formData.get("studentCourse")).trim(),
        studentBatch: Number(formData.get("studentBatch")),
        studentEmail: String(formData.get("studentEmail")).trim(),
        studentPhone: String(formData.get("studentPhone")).trim(),
        studentDepartment: String(formData.get("studentDepartment")).trim(),
        studentGender: String(formData.get("studentGender")),
        studentCgpa: Number(formData.get("studentCgpa"))
    };

    addStudentButton.disabled = true;
    addStudentButton.textContent = "Adding...";

    try {
        const response = await fetch(`${API_BASE_URL}/create-student`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });

        if (!response.ok) {
            throw new Error(await readErrorMessage(response));
        }

        const message = await response.text();
        showMessage(message || "Student added successfully.", "success");
        studentForm.reset();
        await loadStudents();
    } catch (error) {
        console.error("Unable to add student:", error);
        showMessage(error.message || "Unable to add student.", "danger");
    } finally {
        addStudentButton.disabled = false;
        addStudentButton.textContent = "Add Student";
    }
});

async function deleteStudent(enrollment) {
    if (!confirm(`Are you sure you want to delete student ${enrollment}?`)) {
        return;
    }

    clearMessage();

    try {
        const response = await fetch(
            `${API_BASE_URL}/delete-student/${encodeURIComponent(enrollment)}`,
            { method: "DELETE" }
        );

        if (!response.ok) {
            throw new Error(await readErrorMessage(response));
        }

        const message = await response.text();
        showMessage(message || "Student deleted successfully.", "success");
        await loadStudents();
    } catch (error) {
        console.error("Unable to delete student:", error);
        showMessage(error.message || "Unable to delete student.", "danger");
    }
}

refreshButton.addEventListener("click", loadStudents);
loadStudents();