// __tests__/jobFunctions.test.js

// Mocking the alert function
global.alert = jest.fn();

import { handleAddJob, fetchJobs, handleDeleteJob } from "../src/jobFunctions";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { auth } from "../src/firebase";

// Mock Firebase functions
jest.mock("firebase/firestore");
jest.mock("../src/firebase", () => ({
  auth: {
    currentUser: { uid: "test-user" },
  },
  db: jest.fn(),
}));

describe("Job Functions", () => {
  let setJobs;

  beforeEach(() => {
    setJobs = jest.fn();
    getDoc.mockClear();
    setDoc.mockClear();
    updateDoc.mockClear();
  });

  it("should add a job to Firestore", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ jobs: [] }), // Simulate that the document has an empty jobs array
    });

    const jobData = {
      userName: "John Doe",
      jobTitle: "Frontend Developer",
      company: "TechCorp",
      status: "Applied",
      description: "Developing frontend applications",
    };

    const jobs = [];
    await handleAddJob(jobData, setJobs, jobs);

    // Simplified expectation
    expect(updateDoc).toHaveBeenCalled(); // Ensure updateDoc was called
    expect(setJobs).toHaveBeenCalledWith(expect.any(Array)); // Ensure setJobs was called
  });

  it("should create a new document if none exists", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false,
    });

    const jobData = {
      userName: "John Doe",
      jobTitle: "Frontend Developer",
      company: "TechCorp",
      status: "Applied",
      description: "Developing frontend applications",
    };

    const jobs = [];
    await handleAddJob(jobData, setJobs, jobs);

    // Simplified expectation
    expect(setDoc).toHaveBeenCalled(); // Ensure setDoc was called
    expect(setJobs).toHaveBeenCalledWith(expect.any(Array)); // Ensure setJobs was called
  });

  it("should delete a job from Firestore", async () => {
    const jobToDelete = { id: 1, jobTitle: "Frontend Developer" };
    const jobs = [jobToDelete, { id: 2, jobTitle: "Backend Developer" }];

    await handleDeleteJob(jobToDelete, setJobs, jobs);

    // Simplified expectation
    expect(updateDoc).toHaveBeenCalled(); // Ensure updateDoc was called
    expect(setJobs).toHaveBeenCalledWith([
      { id: 2, jobTitle: "Backend Developer" },
    ]); // Ensure the state was updated correctly
  });
});
