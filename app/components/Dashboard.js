import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchJobs } from "../../src/jobFunctions";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28EFF",
  "#FF6699",
];

const RADIAN = Math.PI / 180;
// Custom Label for PieChart
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    fetchJobs(setJobs);
  }, []);

  useEffect(() => {
    const statusCount = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.keys(statusCount).map((status) => ({
      name: status,
      value: statusCount[status],
    }));

    setStatusData(statusData);

    // Process weekly data
    const weeklyCount = {};
    jobs.forEach((job) => {
      const date = new Date(job.startDate);
      const week = `${date.getFullYear()}-W${getWeekNumber(date)}`;
      weeklyCount[week] = (weeklyCount[week] || 0) + 1;
    });

    const sortedWeeks = Object.keys(weeklyCount).sort();

    const weeklyData = sortedWeeks.map((week) => ({
      week,
      applications: weeklyCount[week],
    }));

    setWeeklyData(weeklyData);
  }, [jobs]);

  // Function to get ISO week number
  const getWeekNumber = (date) => {
    const tempDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const dayNum = tempDate.getUTCDay() || 7;
    tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
    return Math.ceil(((tempDate - yearStart) / 86400000 + 1) / 7);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Dashboard
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">
            Job Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={150}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">
            Applications per Week
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={weeklyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="week" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#333333",
                  borderRadius: "10px",
                  border: "none",
                }}
                itemStyle={{ color: "#ffffff" }}
              />
              <Legend />
              <Bar
                dataKey="applications"
                fill="#ffffff"
                barSize={50}
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
