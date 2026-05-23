import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

function Profile() {

    const [user, setUser] = useState({});

    useEffect(() => {

        const loggedUser = JSON.parse(
            localStorage.getItem("user")
        );

        axios.get(
            `http://127.0.0.1:5000/profile/${loggedUser.email}`
        )

        .then((response) => {
            setUser(response.data);
        });

    }, []);

    return (

        <div className="dashboard">

            <Sidebar />

            <div className="dashboard-content">

                <h1>Profile</h1>

                <div className="profile-card">

                    <div className="profile-header">

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            alt="profile"
                        />

                        <div>

                            <h2>{user.username}</h2>

                            <p>{user.role}</p>

                        </div>

                    </div>

                    <div className="profile-details">

                        <div className="detail-box">
                            <h4>Email</h4>
                            <p>{user.email}</p>
                        </div>

                        <div className="detail-box">
                            <h4>Role</h4>
                            <p>{user.role}</p>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;