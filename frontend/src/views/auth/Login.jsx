import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BaseHeader from '../partials/BaseHeader'
import BaseFooter from '../partials/BaseFooter'
import { Link } from 'react-router-dom'


function Login() {
  return (
    <>
      <BaseHeader />
      <section className="container vh-100 d-flex flex-column" style={{marginTop: "200px"}}>
      <div className="row align-items-center justify-content-center g-0 h-lg-100 p-10">
        <div className="card shadow p-10">
          <div className="card-body p-5">
            <h1>Sign In</h1>
          <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <div>
          <span>
              Don’t have an account?
              <Link to="/register/" className="ms-1">
                Sign up
              </Link>
          </span>
          </div>
        </Form>
      </div>
      </div>
      </div>
      </section>
      <BaseFooter />
    </>
  )
}

export default Login