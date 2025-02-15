import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);

    // useEffect(() => {
    //     const fetchJobs = async () => {
    //         try {
    //             // const response = await axios.get('https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=6042fd01&app_key=9a4b9f18e5d70bb0bd6ff9ed5bd61c9d&results_per_page=1000000');
    //             console.log("number of jobs returned:", response.data.results.length);
    //             setJobs(response.data.results);
    //         } catch (error) {
    //             console.error('Error fetching jobs:', error);
    //         }
    //     };
    //     fetchJobs();
    // }, []);

    return (
        <div>
            <h1>Job Listings</h1>
            <ul>
                {jobs.map((job, index) => (
                    <li key={index}>
                        <h2>{job?.title}</h2>
                        <p>{job?.description}</p>
                        <a href={job?.redirect_url} target="_blank" rel="noopener noreferrer">Apply</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Jobs;