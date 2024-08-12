// __tests__/Home.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Home from "../app/page";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { handleAddJob, fetchJobs, handleDeleteJob } from "../src/jobFunctions";

// Mock the necessary Firebase and job functions
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("../src/jobFunctions", () => ({
  handleAddJob: jest.fn(),
  fetchJobs: jest.fn(),
  handleDeleteJob: jest.fn(),
}));

describe("Home Component", () => {
  beforeEach(() => {
    // Mock the onAuthStateChanged to simulate a logged-in user
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: "test-user" });
    });

    // Mock fetchJobs to provide an initial list of jobs
    fetchJobs.mockImplementation((setJobs) => {
      setJobs([
        {
          id: 1,
          userName: "John Doe",
          jobTitle: "Frontend Developer",
          company: "TechCorp",
          status: "Applied",
          description: "Developing frontend applications",
        },
      ]);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Home component with job entries", async () => {
    render(<Home />);

    expect(screen.getByText(/Job Tracking Application/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Frontend Developer at TechCorp/i)
    ).toBeInTheDocument();
  });

  it("allows a user to add a job", () => {
    render(<Home />);

    fireEvent.change(screen.getByLabelText(/Enter Your Name:/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Job Title/i), {
      target: { value: "Backend Developer" },
    });
    fireEvent.change(screen.getByLabelText(/Company/i), {
      target: { value: "Innovate LLC" },
    });

    fireEvent.click(screen.getByText(/Add Job/i));

    expect(handleAddJob).toHaveBeenCalledWith(
      {
        userName: "Jane Doe",
        jobTitle: "Backend Developer",
        company: "Innovate LLC",
        status: "Applied",
        description: "",
      },
      expect.any(Function),
      expect.any(Array)
    );
  });

  it("allows a user to delete a job", () => {
    render(<Home />);

    fireEvent.click(screen.getByText(/Delete/i));

    expect(handleDeleteJob).toHaveBeenCalledWith(
      {
        id: 1,
        userName: "John Doe",
        jobTitle: "Frontend Developer",
        company: "TechCorp",
        status: "Applied",
        description: "Developing frontend applications",
      },
      expect.any(Function),
      expect.any(Array)
    );
  });

  it("signs out the user when the Sign Out button is clicked", () => {
    render(<Home />);

    fireEvent.click(screen.getByText(/Sign Out/i));

    expect(signOut).toHaveBeenCalled();
  });
});
