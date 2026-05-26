import React, { useState } from 'react';
import axios from 'axios';

function Register() {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "Student"
    });

    const registerUser = async () => {

        const response = await axios.post(
            "http://127.0.0.1:5000/register",
            formData
        );

        alert(response.data.message);
    };

    return (

        <div className="form-container">

            <h2>Register</h2>

            <input
                type="text"
                placeholder="Username"
                onChange={(e)=>setFormData({
                    ...formData,
                    username:e.target.value
                })}
            />

            <input
                type="email"
                placeholder="Email"
                onChange={(e)=>setFormData({
                    ...formData,
                    email:e.target.value
                })}
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e)=>setFormData({
                    ...formData,
                    password:e.target.value
                })}
            />

            <select
                onChange={(e)=>setFormData({
                    ...formData,
                    role:e.target.value
                })}
            >
                <option>Student</option>
                <option>Mentor</option>
                <option>Admin</option>
            </select>

            <button onClick={registerUser}>
                Register
            </button>

        </div>
    );
}

export default Register;