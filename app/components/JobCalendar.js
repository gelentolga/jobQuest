// components/JobCalendar.js

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const JobCalendar = ({ jobs }) => {
  const events = jobs.map((job) => ({
    title: `${job.jobTitle} - ${job.company}`,
    start: new Date(job.startDate),
    end: new Date(job.endDate),
  }));

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Job Calendar
      </h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        className="bg-white border border-gray-200 p-6 rounded-lg shadow-md mb-6"
      />
    </div>
  );
};

export default JobCalendar;
