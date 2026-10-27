const API_URL = "http://localhost:8080/get-student/";

const params = new URLSearchParams(window.location.search);
const enrollment = params.get("enrollment");

const statusMessage = document.getElementById("statusMessage");
const studentDetails = document.getElementById("studentDetails");

async function loadStudentDetails() {
    if (!enrollment) {
        statusMessage.textContent = "No student enrollment number provided.";
        return;
    }

    try {
        const response = await fetch(
            API_URL + encodeURIComponent(enrollment)
        );

        if (response.status === 404) {
            statusMessage.textContent = "Student not found.";
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const student = await response.json();

        document.getElementById("enrollment").textContent =
            student.studentEnrollment ?? "";

        document.getElementById("name").textContent =
            student.studentName ?? "";

        document.getElementById("course").textContent =
            student.studentCourse ?? "";

        document.getElementById("batch").textContent =
            student.studentBatch ?? "";

        document.getElementById("email").textContent =
            student.studentEmail ?? "";

        document.getElementById("phone").textContent =
            student.studentPhone ?? "";

        document.getElementById("department").textContent =
            student.studentDepartment ?? "";

        document.getElementById("gender").textContent =
            student.studentGender ?? "";

        document.getElementById("cgpa").textContent =
            student.studentCgpa ?? "";

        studentDetails.hidden = false;
        statusMessage.textContent = "";

    } catch (error) {
        console.error("Error loading student details:", error);
        statusMessage.textContent =
            "Unable to load student details. Please try again.";
    }
}

loadStudentDetails();