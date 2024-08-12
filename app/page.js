"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { handleAddJob, fetchJobs, handleDeleteJob } from "../src/jobFunctions";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";

export default function Home() {
  const [user, setUser] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("Applied");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchJobs(setJobs); // Fetch jobs from Firestore and update state
      } else {
        setUser(null);
        setJobs([]); // Clear jobs if the user logs out
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth);
  };

  const handleAdd = () => {
    if (!date || !jobTitle || !company || !status) {
      alert("Please fill in all required fields!");
      return;
    }

    const jobData = {
      date,
      jobTitle,
      company,
      status,
      description,
    };

    handleAddJob(jobData, setJobs, jobs); // Pass the state updater and current state

    setJobTitle("");
    setCompany("");
    setDescription("");
    setDate("");
  };

  const handleEditJob = (id) => {
    const job = jobs.find((job) => job.id === id);

    if (job) {
      setDate(job.date);
      setJobTitle(job.jobTitle);
      setCompany(job.company);
      setStatus(job.status);
      setDescription(job.description);

      handleDeleteJob(job, setJobs, jobs); // Delete job from Firestore before editing
    }
  };

  const handleDeleteJobCall = (job) => {
    handleDeleteJob(job, setJobs, jobs); // Pass the state updater and current state
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      (job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "All" || job.status === filterStatus) &&
      (filterDate === "" || job.date === filterDate)
    );
  });

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg mt-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Job Tracking Application
        </h1>
        {!user ? (
          <div className="flex flex-col items-center">
            {showSignUp ? (
              <>
                <SignUp />
                <p className="mt-4">
                  Already have an account?{" "}
                  <button
                    onClick={() => setShowSignUp(false)}
                    className="text-blue-600 hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </>
            ) : (
              <>
                <SignIn />
                <p className="mt-4">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 text-white p-3 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 mt-4"
            >
              Sign Out
            </button>
            <div id="home" className="mt-8">
              <div className="mb-6">
                <label
                  htmlFor="date"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Date of Application:
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="job-form mt-8">
              <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                Add Job Details
              </h2>
              <div className="mb-6">
                <input
                  type="text"
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Job Title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-6">
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="mb-6">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Job Description"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                onClick={handleAdd}
                className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Add Job
              </button>
            </div>

            <div className="search-filter mt-8 flex flex-col md:flex-row items-center md:justify-between">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Job Title or Company"
                className="w-full md:w-2/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg mt-4 md:mt-0 md:ml-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="All">All</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg mt-4 md:mt-0 md:ml-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div id="jobs" className="job-list mt-8">
              <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                Your Job Entries
              </h2>
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-gray-200 p-6 rounded-lg shadow-md mb-6"
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    {job.jobTitle} at {job.company}
                  </h3>
                  <p className="mb-2 text-gray-700">
                    <strong>Status:</strong> {job.status}
                  </p>
                  <p className="mb-2 text-gray-700">
                    <strong>Date of Application:</strong> {job.date}
                  </p>
                  <p className="mb-2 text-gray-700">
                    <strong>Description:</strong> {job.description}
                  </p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => handleEditJob(job.id)}
                      className="bg-green-500 text-white p-2 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJobCall(job)}
                      className="bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
