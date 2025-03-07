import React from "react";
import { useState, useEffect } from "react";
import styles from "/src/styles/CreateAcc.module.css";
import Header from "/src/components/Header.jsx";
import AOS from "aos";
import axios from "axios";
import "aos/dist/aos.css";
import checkmark from '/src/assets/checkmark.png';
import errormark from '/src/assets/errormark.png';

function CreateAcc() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

  const [signUpPrompt, setsignUpPrompt] = useState(false); //success
  const [signUpMsg, setsignUpMsg] = useState("");
  const [errorPrompt, setErrorPrompt] = useState(false); //errors
  const [errorMsg, setErrorMsg] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [SideBar, setSideBar] = useState(false);
  const [programs, setPrograms] = useState("");
  const [values, setValues] = useState({
    applicantCategory: "Regular/Irregular", // default value
    firstname: "",
    middlename: "",
    lastname: "",
    studentID: "",
    employeeID: "",
    email: "",
    contactnum: "",
    program: "",
    regIrreg: "",
    position: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const showPopupTerms = () => {
    setShowTerms(true);
  };

  const closeTerms = () => {
    setShowTerms(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting data:", values);

    const isCertified = document.getElementById("certify").checked;

    if (!isCertified) {
      setErrorMsg(
        "You must certify that the information provided is correct before submitting."
      );
      setErrorPrompt(true);
      return;
    }

    setIsLoading(true);

    axios
      .post(`${backendUrl}/CreateAcc`, values)
      .then((res) => {
        if (
          res.data.message ===
          "Sign up successful. Wait for your temporary account to be sent through your email."
        ) {
          setsignUpPrompt(true);
          setsignUpMsg(res.data.message);
          setValues({
            applicantCategory: "Regular/Irregular", // default value
            firstname: "",
            middlename: "",
            lastname: "",
            studentID: "",
            employeeID: "",
            email: "",
            contactnum: "",
            program: "",
            regIrreg: "",
            position: "",
          });

          setIsLoading(false);
        } else {
          setsignUpPrompt(false);
          setErrorPrompt(true);
          setErrorMsg(res.data.message);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setErrorMsg("Error: " + err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    document.body.style.overflow = SideBar ? "hidden" : "auto";
  }, [SideBar]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    axios
      .get(`${backendUrl}/programs`)
      .then((res) => {
        setPrograms(res.data);
      })
      .catch((err) => {
        setErrorMsg("Error: " + err);
      });
  }, []);

  const handleApplicantCategoryChange = (category) => {
    setValues({ ...values, applicantCategory: category });
  };

  return (
    <>
      <Header SideBar={SideBar} setSideBar={setSideBar} />

      {/* Parallax Section */}
      <div
        className={`${styles.parallaxSection} ${styles.parallax1}`}
        data-testid="parallax-section"
      >
        <h2>CAVITE STATE UNIVERSITY</h2>
        <h1>DEPARTMENT OF COMPUTER STUDIES</h1>
      </div>

      {/* SIGN UP PROMPT */}
      {/* SUCCESS PROMPT */}
      {signUpPrompt && (
        <div
          data-aos="zoom-out"
          data-aos-duration="500"
          className={styles.popup}
        >
          <div className={styles.popupContent}>
            <button
              className={styles.closeButton}
              onClick={() => setsignUpPrompt(false)}
            >
              &times;
            </button>
            <div className={styles.popupHeader}>
              <h2>Success</h2>
            </div>
            <div className={styles.Message}>
              <img
                src={checkmark}
                alt="Success Icon"
                className={styles.messageImage}
              />
            </div>
            <p className={styles.popupText}>{signUpMsg}</p>
          </div>
        </div>
      )}

      {/* ERROR PROMPT */}
      {errorPrompt && (
        <div
          data-aos="zoom-out"
          data-aos-duration="500"
          className={styles.popupError}
        >
          <div className={styles.popupContentError}>
            <button
              className={styles.closeButton}
              onClick={() => setErrorPrompt(false)}
            >
              &times;
            </button>
            <div className={styles.popupHeaderError}>
              <h2>Error</h2>
            </div>
            <div className={styles.MessageError}>
              <img
                src={errormark}
                alt="Error Icon"
                className={styles.messageImage}
              />
            </div>
            <p className={styles.popupTextError}>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* SHOW TERMS AND CONDITION */}
      {showTerms && (
        <div
          data-aos="zoom-out"
          data-aos-duration="500"
          className={styles.popup}
        >
          <div className={styles.popupContentTerms}>
            <button
              className={styles.closeButton}
              onClick={() => closeTerms(false)}
            >
              &times;
            </button>
            <div className={styles.popupHeader}>
              <h2 style={{ color: "#3d8c4b" }}>Terms and Conditions</h2>
            </div>

            <p className={styles.popupTextTerms}>
              Welcome to Cavite State University - Bacoor Campus! These Terms
              and Conditions govern your use of our services. By accessing or
              using our website, you agree to comply with these terms.
            </p>

            <h3 className={styles.popupTextTerms} style={{ color: "black" }}>
              1. Acceptance of Terms
            </h3>
            <p className={styles.popupTextTerms}>
              By accessing or using our services, you acknowledge that you have
              read, understood, and agree to be bound by these Terms and
              Conditions.
            </p>

            <h3 className={styles.popupTextTerms} style={{ color: "black" }}>
              2. Eligibility and Use of Services
            </h3>
            <p className={styles.popupTextTerms}>
              You must be at least 18 years old or have parental consent to use
              our services. You agree to use our services for lawful purposes
              only.
            </p>

            <h3 className={styles.popupTextTerms} style={{ color: "black" }}>
              3. Intellectual Property Rights
            </h3>
            <p className={styles.popupTextTerms}>
              All content is the intellectual property of Cavite State
              University - Bacoor Campus unless otherwise stated.
            </p>

            <h3 className={styles.popupTextTerms} style={{ color: "black" }}>
              4. Privacy Policy
            </h3>
            <p className={styles.popupTextTerms}>
              Your data will be handled in accordance with the Data Privacy Act
              of 2012 RA 10173.
            </p>

            <h3 className={styles.popupTextTerms} style={{ color: "black" }}>
              5. Governing Law
            </h3>
            <p className={styles.popupTextTerms}>
              These Terms and Conditions are governed by the laws of the
              Republic of the Philippines.
            </p>
          </div>
        </div>
      )}

      {/* Create Account Form */}
      <div data-aos="fade-up" className={styles.contentSection}>
        <div
          className={styles.PageTitle}
          data-aos="fade-up"
          data-aos-offset="200"
          data-aos-delay="0"
        >
          Create Account
        </div>

        <form onSubmit={handleSubmit}>
          {/* Account Type */}
          <div data-aos="fade-up" className={styles.radioGroup}>
            <label>
              Account Type <span className={styles.required}>*</span>
            </label>
            <label>
              <input
                type="radio"
                name="applicantCategory"
                value="Regular/Irregular"
                checked={values.applicantCategory === "Regular/Irregular"}
                onChange={() =>
                  handleApplicantCategoryChange("Regular/Irregular")
                }
              />
              Regular/Irregular
            </label>
            <label>
              <input
                type="radio"
                name="applicantCategory"
                value="Society Officer"
                checked={values.applicantCategory === "Society Officer"}
                onChange={() =>
                  handleApplicantCategoryChange("Society Officer")
                }
              />
              Society Officer
            </label>
            <label>
              <input
                type="radio"
                name="applicantCategory"
                value="Employee"
                checked={values.applicantCategory === "Employee"}
                onChange={() => handleApplicantCategoryChange("Employee")}
              />
              Employee
            </label>
          </div>

          {/* CONDITION FOR ACCOUNT TYPE */}
          {values.applicantCategory === "Regular/Irregular" && (
            <div data-aos="fade-up" className={styles.formGroup}>
              <label>
                Given Name <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="ri-firstname"
                type="text"
                name="firstname"
                value={values.firstname}
                onChange={(e) =>
                  setValues({ ...values, firstname: e.target.value })
                }
                required
              />

              <label>Middle Name</label>
              <input
                data-testid="ri-middlename"
                type="text"
                placeholder="if applicable"
                name="middlename"
                value={values.middlename}
                onChange={(e) =>
                  setValues({ ...values, middlename: e.target.value })
                }
              />

              <label>
                Last Name <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="ri-lastname"
                type="text"
                name="lastname"
                value={values.lastname}
                onChange={(e) =>
                  setValues({ ...values, lastname: e.target.value })
                }
                required
              />

              <label>
                Student ID <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="ri-stdID"
                type="text"
                name="studentID"
                value={values.studentID}
                onChange={(e) =>
                  setValues({ ...values, studentID: e.target.value })
                }
                required
              />

              <label>
                CvSU Email <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="ri-email"
                type="email"
                name="email"
                value={values.email}
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
                required
              />

              <label>
                Phone Number <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="ri-contactnum"
                type="text"
                name="contactnum"
                value={values.contactnum}
                onChange={(e) =>
                  setValues({ ...values, contactnum: e.target.value })
                }
                required
              />

              <label>
                Program <span className={styles.required}>*</span>
              </label>
              <select
                data-testid="ri-program"
                name="program"
                value={values.program}
                onChange={(e) =>
                  console.log(e.target.value) ||
                  setValues({ ...values, program: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Select your program
                </option>
                {programs.length > 0
                  ? programs.map((row) => (
                      <option key={row.programID} value={row.programID}>
                        {row.programName}
                      </option>
                    ))
                  : ""}
              </select>

              <label>
                Regular or Irregular <span className={styles.required}>*</span>
              </label>
              <select
                data-testid="ri-regIrreg"
                name="regIrreg"
                value={values.regIrreg}
                onChange={(e) =>
                  console.log(e.target.value) ||
                  setValues({ ...values, regIrreg: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Select here
                </option>
                <option value="Regular">Regular</option>
                <option value="Irregular">Irregular</option>
              </select>
            </div>
          )}

          {values.applicantCategory === "Society Officer" && (
            <div data-aos="fade-up" className={styles.formGroup}>
              <label>
                Given Name <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="s-firstname"
                type="text"
                name="firstname"
                value={values.firstname}
                onChange={(e) =>
                  setValues({ ...values, firstname: e.target.value })
                }
                required
              />

              <label>Middle Name</label>
              <input
                data-testid="s-middlename"
                type="text"
                placeholder="if applicable"
                name="middlename"
                value={values.middlename}
                onChange={(e) =>
                  setValues({ ...values, middlename: e.target.value })
                }
              />

              <label>
                Last Name <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="s-lastname"
                type="text"
                name="lastname"
                value={values.lastname}
                onChange={(e) =>
                  setValues({ ...values, lastname: e.target.value })
                }
                required
              />

              <label>
                Personal Email <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="s-email"
                type="email"
                name="email"
                value={values.email}
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
                required
              />

              <label>
                Phone Number <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="s-contactnum"
                type="tel"
                name="contactnum"
                value={values.contactnum}
                onChange={(e) =>
                  setValues({ ...values, contactnum: e.target.value })
                }
                required
              />

              <label>
                Program <span className={styles.required}>*</span>
              </label>
              <select
                data-testid="s-program"
                name="program"
                value={values.program}
                onChange={(e) =>
                  setValues({ ...values, program: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Select your program
                </option>
                {programs.length > 0
                  ? programs.map((row) => (
                      <option key={row.programID} value={row.programID}>
                        {row.programName}
                      </option>
                    ))
                  : ""}
              </select>

              {/* POSITION PER PROGRAM */}
              {values.program === "2" && (
                <>
                  <label>
                    Position <span className={styles.required}>*</span>
                  </label>
                  <select
                    data-testid="s-position2"
                    name="position"
                    value={values.position}
                    onChange={(e) =>
                      setValues({ ...values, position: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select Position
                    </option>
                    <option value="President">President</option>
                    <option value="Vice President">Vice President</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Assistant Secretary">
                      Assistant Secretary
                    </option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Assistant Treasurer">
                      Assistant Treasurer
                    </option>
                    <option value="Business Manager">Business Manager</option>
                    <option value="Auditor">Auditor</option>
                    <option value="P.R.O.">P.R.O.</option>
                    <option value="GAD Representative">
                      GAD Representative
                    </option>
                    <option value="1st Year Senator">1st Year Senator</option>
                    <option value="2nd Year Senator">2nd Year Senator</option>
                    <option value="3rd Year Senator">3rd Year Senator</option>
                    <option value="4th Year Senator">4th Year Senator</option>
                  </select>
                </>
              )}

              {values.program === "1" && (
                <>
                  <label>
                    Position <span className={styles.required}>*</span>
                  </label>
                  <select
                    data-testid="s-position1"
                    name="position"
                    value={values.position}
                    onChange={(e) =>
                      setValues({ ...values, position: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select Position
                    </option>
                    <option value="President">President</option>
                    <option value="Vice President">Vice President</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Assistant Secretary">
                      Assistant Secretary
                    </option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Auditor">Auditor</option>
                    <option value="P.R.O.">P.R.O.</option>
                    <option value="Assistant P.R.O.">Assistant P.R.O.</option>
                    <option value="1st Year Chairperson">
                      1st Year Chairperson
                    </option>
                    <option value="2nd Year Chairperson">
                      2nd Year Chairperson
                    </option>
                    <option value="3rd Year Chairperson">
                      3rd Year Chairperson
                    </option>
                    <option value="4th Year Chairperson">
                      4th Year Chairperson
                    </option>
                  </select>
                </>
              )}
            </div>
          )}

          {values.applicantCategory === "Employee" && (
            <div data-aos="fade-up" className={styles.formGroup}>
              <label>
                Given Name <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="e-firstname"
                type="text"
                name="firstname"
                value={values.firstname}
                onChange={(e) =>
                  setValues({ ...values, firstname: e.target.value })
                }
                required
              />

              <label>Middle Name</label>
              <input
                data-testid="e-middlename"
                type="text"
                placeholder="if applicable"
                name="middlename"
                value={values.middlename}
                onChange={(e) =>
                  setValues({ ...values, middlename: e.target.value })
                }
              />

              <label>
                Last Name <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="e-lastname"
                type="text"
                name="lastname"
                value={values.lastname}
                onChange={(e) =>
                  setValues({ ...values, lastname: e.target.value })
                }
                required
              />

              <label>
                Employee ID <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="e-empID"
                type="tel"
                name="employeeID"
                value={values.employeeID}
                onChange={(e) =>
                  setValues({ ...values, employeeID: e.target.value })
                }
                required
              />

              <label>
                CvSU Email <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="e-email"
                type="email"
                name="email"
                value={values.email}
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
                required
              />

              <label>
                Phone Number <span className={styles.required}>*</span>
              </label>
              <input
                data-testid="e-contactnum"
                type="tel"
                name="contactnum"
                value={values.contactnum}
                onChange={(e) =>
                  setValues({ ...values, contactnum: e.target.value })
                }
                required
              />

              <label>
                Role <span className={styles.required}>*</span>
              </label>
              <select
                data-testid="e-position"
                name="position"
                value={values.position}
                onChange={(e) =>
                  setValues({ ...values, position: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="Enrollment Officer">Enrollment Officer</option>
                <option value="Adviser">Adviser</option>
                <option value="DCS Head">DCS Head</option>
                <option value="School Head">School Head</option>
              </select>

              {values.position === "DCS Head" && (
                <>
                  <label>
                    Program <span className={styles.required}>*</span>
                  </label>
                  <select
                    data-testid="e-program"
                    name="program"
                    value={values.program}
                    onChange={(e) =>
                      setValues({ ...values, program: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select your program
                    </option>
                    {programs.length > 0
                      ? programs.map((row) => (
                          <option key={row.programID} value={row.programID}>
                            {row.programName}
                          </option>
                        ))
                      : ""}
                  </select>
                </>
              )}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                name="certify"
                id="certify"
                required
              />
              I agree to the{" "}
              <span onClick={showPopupTerms}>Terms and Conditions</span>
            </label>
          </div>

          {/* Register Button */}
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={styles.registerButton}
              data-testid="register-button"
            >
              <span>{isLoading ? "Loading..." : "Register"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className={styles.footer} data-testid="footer-copyright">
        <div className={styles.footerCopyright}>
          <p>
            © Copyright <span>Cavite State University</span>. All Rights
            Reserved.
          </p>
          <p>
            Designed by{" "}
            <span className={styles.highlighted}>BSCS 3-5 Group 4</span>
          </p>
        </div>
      </footer>
    </>
  );
}

export default CreateAcc;
