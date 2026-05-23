import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function Attendance() {

    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);

   const storedUser = localStorage.getItem("user");

const user = storedUser
    ? JSON.parse(storedUser)
    : null;
    console.log(user);
    // Fetch Students
    const fetchStudents = () => {

        axios.get(
            "http://127.0.0.1:5000/students"
        )

        .then((response) => {

            setStudents(response.data);

        })

        .catch((error) => {

            console.log(error);

        });
    };

    // Fetch Attendance
    const fetchAttendance = () => {

        axios.get(
            "http://127.0.0.1:5000/get-attendance"
        )

        .then((response) => {

            setAttendance(response.data);

        })

        .catch((error) => {

            console.log(error);

        });
    };

    useEffect(() => {

        fetchStudents();
        fetchAttendance();

    }, []);

    // Mark Attendance
    const markAttendance = (student, status) => {

        axios.post(
            "http://127.0.0.1:5000/mark-attendance",
            {
                student: student.username,
                group: student.group,
                status: status,
                date: new Date().toLocaleDateString()
            }
        )

        .then((response) => {

            alert(response.data.message);

            fetchAttendance();

        })

        .catch((error) => {

            console.log(error);

        });
    };

    return (

        <div className="dashboard">

            <Sidebar />

            <div className="dashboard-content">

                <h1>Attendance Management</h1>

                <table className="attendance-table">

                    <thead>

                        <tr>

                            <th>Student</th>
                            <th>Group</th>
                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            students.map((student, index) => (

                                <tr key={index}>

                                    <td>{student.username}</td>

                                    <td>{student.group}</td>

                                    <td>

{
    user.role.toLowerCase() === "mentor" ||
    user.role.toLowerCase() === "admin"
    ? (

        <>

            <button
                className="present-btn"
                onClick={() =>
                    markAttendance(
                        student,
                        "Present"
                    )
                }
            >
                Present
            </button>

            <button
                className="absent-btn"
                onClick={() =>
                    markAttendance(
                        student,
                        "Absent"
                    )
                }
            >
                Absent
            </button>

        </>

    )

    : (

        <span className="view-only">
            View Only
        </span>

    )
}

</td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

                <h2 className="attendance-title">
                    Attendance Records
                </h2>

                <table className="attendance-table">

                    <thead>

                        <tr>

                            <th>Student</th>
                            <th>Group</th>
                            <th>Status</th>
                            <th>Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            attendance.map((item, index) => (

                                <tr key={index}>

                                    <td>{item.student}</td>

                                    <td>{item.group}</td>

                                    <td>

                                        <span
                                            className={
                                                item.status === "Present"
                                                ? "present"
                                                : "absent"
                                            }
                                        >
                                            {item.status}
                                        </span>

                                    </td>

                                    <td>{item.date}</td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Attendance;