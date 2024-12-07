import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Line, Doughnut } from "react-chartjs-2";
import styles from "/src/styles/AdminDash.module.css";
import Header from "/src/components/AdminDashHeader.jsx";

// Chart.js 
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

function EnrollmentOfficerDashboard() {
  const [SideBar, setSideBar] = useState(false);
  const [accName, setAccName] = useState("");
  const [CScount, setCScount] = useState(0);
  const [ITcount, setITcount] = useState(0);
  const [pendingAcc, setPendingAcc] = useState(0);


  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [SideBar]);

  //FETCH TOTAL NUMBER OF PENDING ACCOUNT REQUESTS
  useEffect(() => {
    axios.get("http://localhost:8080/pendingAccounts")
    .then((res) => {
      const totalPendingAcc = res.data.studentCount + res.data.socOfficerCount + res.data.employeeCount
      setPendingAcc(totalPendingAcc);
    })
    .catch((err) => {
      alert("Error occurred: " + err);
    })
  })

  //Reuse in other pages that requires logging in
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  //RETURNING ACCOUNT NAME IF LOGGED IN
  useEffect(() => {
    axios
      .get("http://localhost:8080")
      .then((res) => {
        if (res.data.valid) {
          setAccName(res.data.name);
        } else {
          navigate("/LoginPage");
        }
      })
      //RETURNING ERROR IF NOT
      .catch((err) => {
        console.error("Error validating user session:", err);
      });
  }, []);
  //Reuse in other pages that requires logging in

  // LINE CHART 
  const lineData = useMemo(
    () => ({
      labels: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
      datasets: [
        {
          label: "Yearly Student Population",
          data: [10, 30, 50, 70, 100, 150, 180],
          fill: true,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    }),
    []
  );

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { beginAtZero: true },
        y: { beginAtZero: true },
      },
      plugins: {
        legend: { display: true, position: "top" },
      },
    }),
    []
  );

  // BILOG NA ANO
  const doughnutData = useMemo(
    () => ({
      labels: ["Alliance of Computer Science", "Information Technology Society"],
      datasets: [
        {
          label: "DCS CHARTS",
          data: [CScount, ITcount],
          backgroundColor: ["#d9534f", "#5cb85c"],
          hoverBackgroundColor: ["#c9302c", "#4cae4c"],
          borderWidth: 2,
        },
      ],
    }),
    [CScount, ITcount]
  );

  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
      },
    }),
    []
  );

  //GET NUMBER OF REGULAR STUDENTS ENROLLED IN BSCS
  useEffect (() => {
    axios.get("http://localhost:8080/getCS")
    .then((res) => {
      setCScount(res.data.CScount);
    })
    .catch((err) => {
      alert("Error: " + err);
      console.error("ERROR FETCHING DATA: " + err);
    });
  }, []);

  //GET NUMBER OF REGULAR STUDENTS ENROLLED IN BSIT
  useEffect (() => {
    axios.get("http://localhost:8080/getIT")
    .then((res) => {
      setITcount(res.data.ITcount);
    })
    .catch((err) => {
      alert("Error: " + err);
      console.error("ERROR FETCHING DATA: " + err);
    });
  }, []);

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
      <div className={`${styles.dashboard} container`}>
        <h1 className={styles.greeting}>Hi {accName || "Loading..."}</h1>

        {/* CONTENT */}
        <div className={`${styles.content} container`}>

        <div className={styles.dashboardCards}>
  <div className={styles.dashboardCard}>
    <h3>Total Enrolled</h3>
    <p className={styles.cardNumber}>{ITcount + CScount}</p>
    <p className={styles.cardDetails}>
      +18% <span>+3.8k this week</span>
    </p>
  </div>
  <div className={styles.dashboardCard}>
    <h3>Visitor</h3>
    <p className={styles.cardNumber}>1.234</p>
    <p className={styles.cardDetails}>
      +18% <span>+2.8k this week</span>
    </p>
  </div>
  <div className={styles.dashboardCard}>
    <h3>Pending Accounts</h3>
    <p className={styles.cardNumber}>{pendingAcc}</p>
    <p className={styles.cardDetails}>
      +18% <span>+7.8k this week</span>
    </p>
  </div>
  <div className={styles.dashboardCard}>
    <h3>Registered Student</h3>
    <p className={styles.cardNumber}>123</p>
    <p className={styles.cardDetails}>
      +18% <span>+1.2k this week</span>
    </p>
  </div>
</div>
          
          {/* STYATS */}
          <div className={styles.statCards}>
            <div className={`${styles.statCard} ${styles.computerScience}`}>
              <h3>Computer Science</h3>
              <p>{CScount}</p>
            </div>
            <div className={`${styles.statCard} ${styles.informationTechnology}`}>
              <h3>Information Technology</h3>
              <p>{ITcount}</p>
            </div>
          </div>

          {/* CHARTS */}
<div className={styles.charts}>
  {/* LINE CHART */}
  <div className={styles.chart}>
    <h3>DCS Yearly Student Population</h3>
    <div className={styles.chartContainer}>
      <Line data={lineData} options={lineOptions} />
    </div>
  </div>

  {/* BILOG NA ANO */}
  <div className={styles.chart}>
    <h3>DCS Population Per Course</h3>
    <div className={styles.chartContainer}>
      <Doughnut data={doughnutData} options={doughnutOptions} />
    </div>
  </div>
</div>
</div>
</div>
    </>
  );
}

export default EnrollmentOfficerDashboard;
