import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '/src/components/AdminDashHeader.jsx';
import styles from '/src/styles/AccountRequest.module.css';
import { useNavigate } from 'react-router-dom';
import checkmark from "/src/assets/checkmark.png";
import errormark from "/src/assets/errormark.png";

function Requirements() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
  const [SideBar, setSideBar] = useState(false);
  const [accName, setAccName] = useState("");
  const [accountRequests, setAccountRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState(accountRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [approvalPrompt, setApprovalPrompt] = useState(false);
  const [approvalMsg, setApprovalMsg] = useState('');
  const [rejectionPrompt, setRejectionPrompt] = useState(false);
  const [rejectionMsg, setRejectionMsg] = useState('');
  const [errorPrompt, setErrorPrompt] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [cog, setCOG] = useState(null);
  const [checklist, setChecklist] = useState([]);  

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  //RETURNING ACCOUNT NAME IF LOGGED IN
  useEffect(() => {
    axios
      .get(`${backendUrl}/session`)
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

  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [SideBar]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // FETCH ACCOUNT REQUESTS
  useEffect(() => {
    axios.get(`${backendUrl}/getReqsForSocOff`)
        .then((res) => {
            setAccountRequests(res.data.students);
            setFilteredRequests(res.data.students);
        })
        .catch((err) => {
            console.warn("Error fetching account requests:", err);
            setFilteredRequests([]);
        });
}, []);


  // Request
const handleApprove = async (request) => {

  setLoading(true);

  if (!request?.StudentID) {
      setErrorPrompt(true);
      setErrorMsg('StudentID is required.');
      return;
  }

  try {
    const res = await axios.post(`${backendUrl}/socfeeVerifyChecklist`, {studentID: request.StudentID}); 
    console.log('Response:', res.data);
    setApprovalPrompt(true);
      setApprovalMsg(`Verification successful for Student ID: ${request.CvSUStudentID}`);
      setErrorPrompt(false);
      setPopUpVisible(false);
      setLoading(false);
  } catch (err) {
    setErrorPrompt(true);
      setErrorMsg(`Failed to verify requirements:  ${err.response?.data?.message || err.message}`);
      setLoading(false);
  }
};

const handleReject = async (request) => {

  setLoading(true);

  if (!request?.StudentID) {
      setErrorPrompt(true);
      setErrorMsg('StudentID is required.');
      return;
  }

  try {
    const res = await axios.post(`${backendUrl}/socfeeRejectChecklist`, {studentID: request.StudentID}); 
    console.log('Response:', res.data);
    setApprovalPrompt(true);
      setApprovalMsg(`Rejection successful for Student ID: ${request.CvSUStudentID}`);
      setErrorPrompt(false);
      setPopUpVisible(false);
      setLoading(false);
  } catch (err) {
    setErrorPrompt(true);
      setErrorMsg(`Failed to reject requirements:  ${err.response?.data?.message || err.message}`);
      setLoading(false);
  }
};

const closePrompt = () => {
  setApprovalPrompt(false);
  setRejectionPrompt(false);
  window.location.reload();
};


  //show popup
  const handleRowClick = (request) => {
    setSelectedRequest(request);
    setPopUpVisible(true);
    
    Promise.all([
      axios.post(`${backendUrl}/getCOGForSocOff`, {studentID: request.StudentID}),
      axios.post(`${backendUrl}/getChecklistForSocOff`, {studentID: request.StudentID}),
    ])
    .then((res) => {
      if(res[0].data.message === "Success" && res[1].data.message === "Success"){
        setCOG(`${backendUrl}/${res[0].data.cogPath}`);
        setChecklist(res[1].data.checklistData);
      } else{
        setCOG(null);
        setChecklist([]);
        alert("Failed to fetch COG and Checklist data.");
      }
    })
    .catch((err) => {
      console.error(err);
      setCOG(null);
      setChecklist([]);
    });
  };

  const groupedByYearAndSemester = checklist.reduce((acc, course) => {
    const { yearLevel, semester } = course;

    // Initialize year level object if it doesn't exist
    if (!acc[yearLevel]) {
      acc[yearLevel] = {};
    }

    // Initialize semester array if it doesn't exist for the year level
    if (!acc[yearLevel][semester]) {
      acc[yearLevel][semester] = [];
    }

    // Add the course to the corresponding year level and semester
    acc[yearLevel][semester].push(course);
    return acc;
  }, {});

  //close popup
  const closePopup = () => {
    setPopUpVisible(false);
    setSelectedRequest(null);
  };


  useEffect(() => {
    const timeoutId = setTimeout(() => {
        const query = searchQuery.toLowerCase();
        if (!query) {
            setFilteredRequests(accountRequests);
        } else {
            setFilteredRequests(
                accountRequests.filter((request) =>
                    request.Firstname.toLowerCase().includes(query) ||
                    request.Lastname.toLowerCase().includes(query) ||
                    request.CvSUStudentID.toString().includes(query) ||
                    request.SocFeePayment.toLowerCase().includes(query) ||
                    `${request.Year === "First Year" ? 1
                        : request.Year === "Second Year" ? 2
                        : request.Year === "Third Year" ? 3
                        : request.Year === "Fourth Year" ? 4
                        : "N/A"
                    } - ${request.Section?.toString().toLowerCase() || ""}`.includes(query) ||
                    `${request.Year === "First Year" ? 1
                        : request.Year === "Second Year" ? 2
                        : request.Year === "Third Year" ? 3
                        : request.Year === "Fourth Year" ? 4
                        : "N/A"
                    }-${request.Section?.toString().toLowerCase() || ""}`.includes(query)
                )
            );
        }
    }, 300);

    return () => clearTimeout(timeoutId);
}, [searchQuery, accountRequests]);




  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />
{/* PROMPTS */}
      {/* APPROVAL PROMPT */}
{approvalPrompt && (
    <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupPrompt}>
        <div className={styles.popupPromptContent}>
            <button
                className={styles.popupPromptcloseButton}
                onClick={() => setApprovalPrompt(false)}
            >
                &times;
            </button>
            <div className={styles.popupPromptHeader}>
                <h2>Approval Success</h2>
            </div>
            <div className={styles.popupPromptMessage}>
                <img
                    src={checkmark}
                    alt="Success Icon"
                    className={styles.popupPromptmessageImage}
                />
            </div>
            <p className={styles.popupPromptText}>{approvalMsg}</p>
            <div className={styles.buttonContainer}>
            <button
  className={styles.OKButton}
  onClick={closePrompt} 
>
  <span>OK</span>
</button>
</div>

        </div>
    </div>
)}

{/* REJECTION PROMPT */}
{rejectionPrompt && (
    <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupPrompt}>
        <div className={styles.popupPromptContent}>
            <button
                className={styles.popupPromptcloseButton}
                onClick={closePrompt}
            >
                &times;
            </button>
            <div className={styles.popupPromptHeader}>
                <h2>Rejection Success</h2>
            </div>
            <div className={styles.popupPromptMessage}>
                <img
                    src={checkmark}
                    alt="Success Icon"
                    className={styles.popupPromptmessageImage}
                />
            </div>
            <p className={styles.popupPromptText}>{rejectionMsg}</p>
        </div>
    </div>
)}

{/* ERROR PROMPT */}
{errorPrompt && (
    <div data-aos="zoom-out" data-aos-duration="500" className={styles.popupPromptError}>
        <div className={styles.popupPromptContentError}>
            <button
                className={styles.popupPromptcloseButton}
                onClick={() => setErrorPrompt(false)}
            >
                &times;
            </button>
            <div className={styles.popupPromptHeaderError}>
                <h2>Error</h2>
            </div>
            <div className={styles.popupPromptMessageError}>
                <img
                    src={errormark}
                    alt="Error Icon"
                    className={styles.popupPromptmessageImage}
                />
            </div>
            <p className={styles.popupPromptTextError}>{errorMsg}</p>
        </div>
    </div>
)}


      <div className={styles.contentSection}>
        <div className={styles.PageTitle} data-aos="fade-up">
          Requirements Submission
        </div>

        <div className={styles.searchBar} data-aos="fade-up">
                  
        <input
                    type="text"
                    id="search"
                    placeholder="Search by name or student ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />

                </div>

        {/* Table */}
        <div className={styles.tableContainer} data-aos="fade-up">
          <table className={styles.requestsTable}>
            <thead>
              <tr>
              <th>Student ID</th>
                <th>Name</th>
                <th>Year - Section</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id} onClick={() => handleRowClick(request)}>
                    <td data-label="Student ID">{request.CvSUStudentID}</td>
                    <td data-label="Student ID">{request.Firstname} {request.Lastname}</td>
                    <td data-label="Year and Section">{request.Year === "First Year" ? 1
                    : request.Year === "Second Year" ? 2
                    : request.Year === "Third Year" ? 3
                    : 4} - {request.Section}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noData}>
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>


          </table>
        </div>
      </div>



     {/* PopUp */}
{popUpVisible && selectedRequest && (
  <div
    data-aos="zoom-out"
    data-aos-duration="500"
    className={`${styles.popup} ${popUpVisible ? styles.visible : ""}`}
  >
    <div className={styles.popupContentReq}>
      {/* Popup Header */}
      <div className={styles.popupHeader}>
                    <button onClick={closePopup} className={styles.closeButton}>✖</button>
                    <h2>Requirement</h2>
                  </div>
                  <div data-aos="fade-up" className={styles.studentType}>
                    <span>DETAILS</span>
                  </div>
      

        {/* Submission Details */}
       <div className={styles.popupTextReq}>
      
          <p><strong>Name:</strong> {selectedRequest.Firstname} {selectedRequest.Lastname}</p>
          <p><strong>Student ID:</strong> {selectedRequest.CvSUStudentID}</p>
          <p><strong>Student Type:</strong> {selectedRequest.StudentType}</p>
          
        </div>



{/* Details Section */}
<div data-aos="fade-up" className={styles.detailsSection}>
        {/* Document Image */}
        <div className={styles.documentImage}>
          <img
            src={cog}
            alt="Document"
            className={styles.imageStyle}
          />
        </div>
        </div>

      {/* Checklist Table */}
      {Object.keys(groupedByYearAndSemester).map((yearLevel) => (
              <div className={styles.Contentt} key={yearLevel}>
                <h4>{yearLevel}</h4>
                {Object.keys(groupedByYearAndSemester[yearLevel]).map((semester) => (
                  <div className={styles.Contentt} key={semester}>
                    <h5>{semester || ""}</h5>
                    <table className={styles.checklistTable}>
                      <thead>
                        <tr>
                          <th colSpan="2">COURSE</th>
                          <th colSpan="2">CREDIT UNIT</th>
                          <th colSpan="2">CONTACT HRS.</th>
                          <th rowSpan="2">PRE-REQUISITE</th>
                          <th rowSpan="2">SY TAKEN</th>
                          <th rowSpan="2">FINAL GRADE</th>
                          <th rowSpan="2">INSTRUCTOR</th>
                        </tr>
                        <tr>
                          <th>CODE</th>
                          <th>TITLE</th>
                          <th>Lec</th>
                          <th>Lab</th>
                          <th>Lec</th>
                          <th>Lab</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedByYearAndSemester[yearLevel][semester].map((course, index) => (
                          <tr key={index}>
                            <td>{course.courseDetails.code}</td>
                            <td>{course.courseDetails.title}</td>
                            <td>{course.courseDetails.creditLec === 0 ? '' : course.courseDetails.creditLec}</td>
                            <td>{course.courseDetails.creditLab === 0 ? '' : course.courseDetails.creditLab}</td>
                            <td>{course.courseDetails.contactHrsLec === 0 ? '' : course.courseDetails.contactHrsLec}</td>
                            <td>{course.courseDetails.contactHrsLab === 0 ? '' : course.courseDetails.contactHrsLab}</td>
                            <td>{course.courseDetails.preReq || ''}</td>
                            <td>{course.syTaken}</td>
                            <td>{course.finalGrade}</td>
                            <td>{course.instructor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ))}
            <div className={styles.popupButtons}>
      <button className={styles.approveButton} onClick={() => handleApprove(selectedRequest)}><span>Verify</span></button>
          <button className={styles.rejectButton} onClick={() => handleReject(selectedRequest)}><span>Reject</span></button>
    </div>
    </div>
  </div>
)}


    </>
  );
}

export default Requirements;
