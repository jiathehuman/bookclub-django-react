import {useState, useEffect} from "react";
import apiInstance from "../../utils/axios";
import BaseHeader from '../partials/BaseHeader';
import BaseFooter from '../partials/BaseFooter';
import {useNavigate, useSearchParams} from 'react-router-dom';

function CreateNewPassword() {
  const [password, setPassword] = useState("")
  const [password_repeat, setPasswordRepeat] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchParam] = useSearchParams();
  const otp = searchParam.get("otp");
  const uuidb64 = searchParam.get("uuidb64");
  const token = searchParam.get("token")
  const navigate = useNavigate()
  const CreatePasswordHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if(password != password_repeat){
      alert("Passwords do not match.");
      return
    } else {
      const form_data = new FormData();
      form_data.append("otp", otp); // key and value
      form_data.append("uuidb64", uuidb64);
      form_data.append("password", password);
      form_data.append("token", token);
      try {
        await apiInstance.post(`user/change-password/`,form_data).then((res)=>{
          console.log(res.data);
        })
        alert("Password changed successfuly")
        setIsLoading(false);
        navigate("/login/")
      } catch (error) {
        console.log(error);
        alert("Error!");
      }
    }
  }
  return (
    <>
      <BaseHeader />
      <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px" }}>
        <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
          <div className="col-lg-5 col-md-8 py-8 py-xl-0">
            <div className="card shadow">
              <div className="card-body p-6">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Create New Password</h1>
                  <span>
                    Choose a new password for your account
                  </span>
                </div>
                <form className="needs-validation" noValidate="" onSubmit={CreatePasswordHandler}>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Enter New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      name="password"
                      placeholder="**************"
                      required=""
                      onchange={(e)=> setPassword(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Please enter valid password.
                    </div>
                  </div>


                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      name="password"
                      placeholder="**************"
                      required=""
                      onchange={(e)=> setPasswordRepeat(e.target.value)}
                    />
                    <div className="invalid-feedback">
                      Please enter valid password.
                    </div>
                  </div>



                  <div>
                    <div className = "d-grid">
                    {isLoading === true && (
                      <button disabled type="submit" className="btn btn-primary my-2">
                      Processing <i className="fas fa-spinner fa-spin"></i>
                      </button>
                    )}
                    {isLoading === false && (
                      <button type="submit" className="btn btn-primary my-2">
                      Confirm new password <i className="fas fa-check-circle"></i>
                      </button>
                    )}
                  </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BaseFooter />
    </>
  )
}

export default CreateNewPassword