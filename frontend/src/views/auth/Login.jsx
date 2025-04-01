import React from 'react'
import {useState, useEffect} from "react"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'
import { Link, useNavigate} from 'react-router-dom'
import apiInstance from '../../utils/axios'
import {login} from '../../utils/auth'


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false) // false by default, when sign up is clicked, loading to true

  const submitHandler = async (event) => {
      event.preventDefault();
      setIsLoading(true); // loading new user
      const {error} = await login(email, password) // login api
      if (error) {
        alert(error);
        setIsLoading(false);
      } else {
        navigate("/");
        setIsLoading(false);
      }

    };

  return (
    <>
      <BaseHeader />
      <section className="container vh-100 d-flex flex-column" style={{marginTop: "200px"}}>
            <div className="row align-items-center justify-content-center g-0 h-lg-100 p-10">
              <div className="card shadow p-10 align-items-center">
                <div className="card-body p-5">
                <h1 className="mb-3 fw-bold text-center">Log In</h1>
                <form className="needs-validation" noValidate="" onSubmit = {submitHandler}>
                  <div className="mb-2">
                    <label htmlFor="email" className = "form-label me-4">Email</label> <br />
                    <input type="text" id = "email" placeholder = "Enter email" required="" onChange={(event)=> setEmail(event.target.value)}/>
                  </div>
                  <div className="mb-2">
                    <label htmlFor="password" className = "form-label me-4">Password</label> <br />
                    <input type="password" id = "password" placeholder = "Enter password" required="" onChange={(event)=> setPassword(event.target.value)}/>
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

export default Login