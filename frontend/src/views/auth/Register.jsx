import React from 'react';
import {useState, useEffect} from "react";
import apiInstance from "../../utils/axios";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BaseHeader from '../partials/BaseHeader';
import BaseFooter from '../partials/BaseFooter';
import { Link, useNavigate } from 'react-router-dom';
import {register} from '../../utils/auth'


function Register() {
  const [fullName, setFullName] = useState(""); // start state with empty string
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_repeat, setPasswordRepeat] = useState("")
  const [isLoading, setIsLoading] = useState(false) // false by default, when sign up is clicked, loading to true
  const navigate = useNavigate()


  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true); // register new user
    const {error} = await register(fullName, email, password, password_repeat)
    if (error) {
      alert(error);
      setIsLoading(false);
    } else {
      navigate("/");
      alert("Registration successful, you have now been logged in");
      setIsLoading(false);
    }
  };

  return (
    <>
      <BaseHeader/>
      <section className="container vh-100 d-flex flex-column" style={{marginTop: "200px"}}>
      <div className="row align-items-center justify-content-center g-0 h-lg-100 p-10">
        <div className="card shadow p-10 align-items-center">
          <div className="card-body p-5">
          <h1 className="mb-3 fw-bold text-center">Sign Up</h1>
          <form className="needs-validation" noValidate="" onSubmit = {submitHandler}>
            <div className="mb-2">
              <label htmlFor="full_name" className = "form-label me-4">Full Name</label> <br />
              <input type="text" id = "full_name" placeholder = "Enter name" required="" onChange={(event)=> setFullName(event.target.value)}/>
            </div>
            <div className="mb-2">
              <label htmlFor="email" className = "form-label me-4">Email</label> <br />
              <input type="text" id = "email" placeholder = "Enter email" required="" onChange={(event)=> setEmail(event.target.value)}/>
            </div>
            <div className="mb-2">
              <label htmlFor="password" className = "form-label me-4">Password</label> <br />
              <input type="password" id = "password" placeholder = "Enter password" required="" onChange={(event)=> setPassword(event.target.value)}/>
            </div>
            <div className="mb-2">
              <label htmlFor="repeat_password" className = "form-label me-4">Repeat Password</label> <br />
              <input type="password" id = "repeat_password" placeholder = "Repeat password" required="" onChange={(event)=> setPasswordRepeat(event.target.value)}/>
            </div>
            <div className = "d-grid">
              {isLoading === true && (
                <button disabled type="submit" className="btn btn-primary my-2">
                Loading <i className="fas fa-spinner fa-spin"></i>
                </button>
               )}
              {isLoading === false && (
                <button type="submit" className="btn btn-primary my-2">
                Sign Up <i className="fas fa-user-plus"></i>
                </button>
               )}
            </div>
          </form>
          <div>
          <span>
              Have an account?
              <Link to="/login/" className="ms-1">
                Login
              </Link>
          </span>
          </div>

      </div>

      </div>
      </div>
      </section>
      <BaseFooter />
    </>
  )
}

export default Register