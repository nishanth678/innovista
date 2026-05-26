import React from 'react';
import { Link } from 'react-router-dom';

function Home() {

  return (

    <div className="home">

      <h1>ProjectHub</h1>

      <p>Smart Student Project Monitoring System</p>

      <div className="home-buttons">

        <Link to="/login">
          <button>Login</button>
        </Link>

        <Link to="/register">
          <button>Register</button>
        </Link>

        <Link to="/student-dashboard">
          <button>Student Dashboard</button>
        </Link>

        <Link to="/mentor-dashboard">
          <button>Mentor Dashboard</button>
        </Link>

        <Link to="/admin-dashboard">
          <button>Admin Dashboard</button>
        </Link>

      </div>

    </div>
  );
}

export default Home;