import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// Function to add a job
export const handleAddJob = async (jobData, setJobs, jobs) => {
  const user = auth.currentUser;

  if (user) {
    const job = {
      id: Date.now(),
      ...jobData,
    };

    const userRef = doc(db, "users", user.uid);

    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        await updateDoc(userRef, {
          jobs: arrayUnion(job),
        });
      } else {
        await setDoc(userRef, {
          jobs: [job],
        });
      }

      setJobs([...jobs, job]); // Update the state with the new job
      alert("Job added successfully!");
    } catch (error) {
      console.error("Error adding job:", error);
    }
  } else {
    alert("User is not logged in");
  }
};

// Function to fetch jobs
export const fetchJobs = async (setJobs) => {
  const user = auth.currentUser;

  if (user) {
    const userRef = doc(db, "users", user.uid);
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setJobs(userData.jobs || []); // Update jobs in state
      } else {
        console.log("No job records found!");
        setJobs([]); // If no document exists, set jobs to an empty array
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  } else {
    alert("User is not logged in");
  }
};

// Function to delete a job
export const handleDeleteJob = async (job, setJobs, jobs) => {
  const user = auth.currentUser;

  if (user) {
    const userRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userRef, {
        jobs: arrayRemove(job),
      });

      const updatedJobs = jobs.filter((j) => j.id !== job.id);
      setJobs(updatedJobs); // Update the state to remove the deleted job
      alert("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  } else {
    alert("User is not logged in");
  }
};
