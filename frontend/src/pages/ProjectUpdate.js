import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function ProjectUpdate() {

    const [projects, setProjects] = useState([]);

    useEffect(() => {

        axios.get(
            "http://127.0.0.1:5000/student-projects"
        )

        .then((response) => {

            setProjects(response.data);

        })

        .catch((error) => {

            console.log(error);

        });

    }, []);

    return (

        <div className="dashboard">

            <Sidebar />

            <div className="dashboard-content">

                <h1>Project Updates</h1>

                {
                    projects.length === 0

                    ? (

                        <p>No Projects Found</p>

                    )

                    : (

                        projects.map((project, index) => (

                            <div
                                className="project-card"
                                key={index}
                            >

                                <h2>
                                    {project.title}
                                </h2>

                                <p>
                                    {project.description}
                                </p>

                                <h4>
                                    Status: {project.status}
                                </h4>

                            </div>

                        ))

                    )
                }

            </div>

        </div>
    );
}

export default ProjectUpdate;