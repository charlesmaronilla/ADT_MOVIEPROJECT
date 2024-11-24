import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, createEmail] = useState("");
  const [password, createPassword] = useState("");
  const [firstname, createFirstname] = useState("");
  const [middlename, createMiddlename] = useState("");
  const [lastname, createLastname] = useState("");
  const [phonenumber, createPhonenumber] = useState("");
  const [debounceState, setDebounceState] = useState(false);
  const userInputDebounce = useDebounce(
    { email, password, firstname, middlename, lastname, phonenumber },
    2000
  );
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [role, createRole] = useState("admin");
  const [status, setStatus] = useState("idle");

  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, []);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    switch (type) {
      case "email":
        createEmail(event.target.value);
        break;
      case "password":
        createPassword(event.target.value);
        break;
      case "firstname":
        createFirstname(event.target.value);
        break;
      case "middlename":
        createMiddlename(event.target.value);
        break;
      case "lastname":
        createLastname(event.target.value);
        break;
      case "phonenumber":
        createPhonenumber(event.target.value);
        break;
      case "role":
        createRole(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleRegister = async () => {
    if (
      !email ||
      !password ||
      !firstname ||
      !middlename ||
      !lastname ||
      !phonenumber
    ) {
      console.log("Please fill in all required fields");
      return;
    }

    const data = {
      email,
      password,
      firstName: firstname,
      middleName: middlename,
      lastName: lastname,
      contactNo: phonenumber,
      role,
    };

    setStatus("loading");

    try {
      const response = await axios.post("/admin/register", data);
      console.log(response.data);
      localStorage.setItem("accessToken", response.data.access_token);
      navigate("/main/dashboard");
      setStatus("idle");
    } catch (error) {
      console.error(
        "Registration error:",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.data.errors) {
        alert("Registration failed: " + error.response.data.errors.join(", "));
      } else {
        alert("Registration failed: " + error.message);
      }
      setStatus("idle");
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="Register">
      <div className="main-container">
        <h3>Register</h3>
        <form>
          <div className="form-container">
            <div>
              <div className="form-group">
                <label>E-mail:</label>
                <input
                  type="text"
                  name="email"
                  onChange={(e) => handleOnChange(e, "email")}
                />
              </div>
              {debounceState && isFieldsDirty && email === "" && (
                <span className="errors">This field is REQUIRED</span>
              )}
            </div>
            <div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type={isShowPassword ? "text" : "password"}
                  name="password"
                  onChange={(e) => handleOnChange(e, "password")}
                />
                {debounceState && isFieldsDirty && password === "" && (
                  <span className="errors">This field is required</span>
                )}
              </div>
              <div className="show-password" onClick={handleShowPassword}>
                {isShowPassword ? "Hide" : "Show"} Password
              </div>
            </div>
            <div>
              <div className="form-group">
                <label>Firstname:</label>
                <input
                  type="text"
                  name="firstname"
                  onChange={(e) => handleOnChange(e, "firstname")}
                />
              </div>
              {debounceState && isFieldsDirty && firstname === "" && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div>
              <div className="form-group">
                <label>Middlename:</label>
                <input
                  type="text"
                  name="middlename"
                  onChange={(e) => handleOnChange(e, "middlename")}
                />
              </div>
              {debounceState && isFieldsDirty && middlename === "" && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div>
              <div className="form-group">
                <label>Lastname:</label>
                <input
                  type="text"
                  name="lastname"
                  onChange={(e) => handleOnChange(e, "lastname")}
                />
              </div>
              {debounceState && isFieldsDirty && lastname === "" && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div>
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="text"
                  name="phonenumber"
                  onChange={(e) => handleOnChange(e, "phonenumber")}
                />
              </div>
              {debounceState && isFieldsDirty && phonenumber === "" && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div className="submit-container">
              <button
                type="button"
                disabled={status === "loading"}
                onClick={() => {
                  if (status === "loading") return;
                  handleRegister();
                }}
              >
                {status === "idle" ? "Register" : "Loading"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
