/* eslint-disable react/no-unescaped-entities */
import "./SignUpForm.scss";
import CButton from "../../../../components/custom-button/CButton";
import CInput from "../../../../components/CInput/CInput";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../../assets/logo.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { useEffect, useState } from "react";
import {
  createUserAccount,
  selectCurrentUser,
  selectError,
  selectIsSigningIn,
  selectSignUpDone,
  signUpEnd,
} from "../../../../redux/users/userReducer";

// import { signUpStart, signUpEnd } from "../../../../redux/user/userReducer";
import { BarLoader } from "react-spinners";

interface InputsProps {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  country: string;
  accountType: string;
  pin: string;
  password: string;
  fixedDeposit: number;
  savingsAccount: number;
  checkingBalance: number;
  overDraft: number;
  withdrawals: any[];
  deposits: any[];
  approved: boolean;
  suspend: boolean;
}
const SignUp = () => {
  const [inputs, setInputs] = useState<InputsProps>({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    phone: "",
    country: "",
    accountType: "",
    pin: "",
    password: "",
    fixedDeposit: 0,
    savingsAccount: 0,
    checkingBalance: 0,
    overDraft: 0,
    withdrawals: [],
    deposits: [],
    approved: false,
    suspend: false,
  });
  console.log(inputs);
  const [passwordShown, setPasswordShown] = useState(false);

  const error = useAppSelector((state) => selectError(state));
  const user = useAppSelector((state) => selectCurrentUser(state));
  const navigate = useNavigate();
  const isLoading = useAppSelector((state) => selectIsSigningIn(state));
  const signUpDone = useAppSelector((state) => selectSignUpDone(state));
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log("tried");
    if (inputs.password.length < 8) {
      alert("passwords is too short");
      return;
    }
    dispatch(createUserAccount(inputs));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  function togglePassword() {
    setPasswordShown(!passwordShown);
  }

  useEffect(() => {
    user?.approved && navigate("/dashboard");
    window.localStorage.setItem("user", JSON.stringify(user));
    window.scrollTo(0, 0);
  }, [user, navigate]);

  useEffect(() => {
    if (signUpDone) {
      alert("your application has been recieved and is under consideration");
      setTimeout(() => {
        dispatch(signUpEnd());
        navigate("/");
      }, 4000);
    }
  });
  return (
    <div className="container">
      <div className="signup-page">
        <img className="image" src={logo} alt="logo" />
        <div className="signup_container">
          <div className="signup_content">
            <h1 className="title">Get Started</h1>
            <p className="subtitle"> Let's start the Journey.</p>
            <form className="form">
              <CInput
                type="text"
                handleChange={handleChange}
                name="firstName"
                value={inputs.firstName}
                required={true}
                id="firstName"
                label="firstname"
                placeholder="first name"
              />
              <CInput
                type="text"
                handleChange={handleChange}
                name="lastName"
                value={inputs.lastName}
                required={true}
                id="lastName"
                label="Lastname"
                placeholder="last name"
              />
              <CInput
                type="text"
                handleChange={handleChange}
                name="address"
                value={inputs.address}
                required={true}
                id="address"
                label="Home Address"
                placeholder="your address"
              />
              <CInput
                type="email"
                handleChange={handleChange}
                name="email"
                value={inputs.email}
                required={true}
                id="email"
                label="Email"
                placeholder="your email"
              />
              <CInput
                type="text"
                handleChange={handleChange}
                name="country"
                value={inputs.country}
                required={true}
                id="country"
                label="Country"
                placeholder="United States"
              />
              <CInput
                type="text"
                handleChange={handleChange}
                name="phone"
                value={inputs.phone}
                required={true}
                id="phone"
                label="Phone Number"
                placeholder="x-xxxx-xxxx-xxxx"
              />
              <CInput
                type="text"
                handleChange={handleChange}
                name="pin"
                value={inputs.pin}
                required={true}
                id="pin"
                label="4-Digit Transaction Pin"
                placeholder="X X X X"
              />
              <div className="password">
                <CInput
                  type={passwordShown ? "text" : "password"}
                  handleChange={handleChange}
                  name="password"
                  value={inputs.password}
                  required={true}
                  id="password"
                  label="Password"
                  placeholder="password"
                />
                {passwordShown ? (
                  <AiOutlineEyeInvisible
                    onClick={togglePassword}
                    className="password-toggle"
                  />
                ) : (
                  <AiOutlineEye
                    onClick={togglePassword}
                    className="password-toggle"
                  />
                )}
              </div>
              {isLoading ? (
                <div className="loader_con">
                  <BarLoader color="#000" height={5} width={80} />
                </div>
              ) : (
                <CButton onClick={handleSubmit}>Register Now</CButton>
              )}

              {error === "Firebase: Error (auth/email-already-in-use)." && (
                <h1 className="error">Email already in use!</h1>
              )}
              {error === "Firebase: Error (auth/network-request-failed)." && (
                <h1 className="error">
                  Check your internet connection and try agin!
                </h1>
              )}

              <div className="linker_cont">
                <span className="sub">Already have an account?</span>
                <Link to="/login" className="subtitle1">
                  Sign In!
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
