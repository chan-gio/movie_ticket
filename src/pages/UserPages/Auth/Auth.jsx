import React, { useState } from "react";
import { Tabs, Row, Col, Input, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import LeftContainer from "../../../components/UserPages/AuthPage/LeftContainer/LeftContainer";
import AuthService from "../../../services/AuthService";
import styles from "./Auth.module.scss";
import { toastSuccess, toastError } from "../../../utils/toastNotifier";

const { TabPane } = Tabs;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // State for Sign In inputs
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // State for Sign Up inputs
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpFullName, setSignUpFullName] = useState("");
  const [signUpDob, setSignUpDob] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");

  // State for Forgot Password input
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  // Handle Sign Up submission
  const handleSignUpSubmit = async () => {
    setIsLoading(true);
    try {
      // Basic validation
      if (!signUpUsername || !signUpEmail || !signUpPassword || !signUpFullName || !signUpDob || !signUpPhone) {
        throw new Error("Please fill in all fields");
      }
      if (!/\S+@\S+\.\S+/.test(signUpEmail)) {
        throw new Error("Please enter a valid email");
      }
      if (signUpPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const values = {
        username: signUpUsername,
        email: signUpEmail,
        password: signUpPassword,
        full_name: signUpFullName,
        dob: signUpDob,
        phone: signUpPhone,
      };

      console.log("Attempting registration with values:", values); // Debug log
      const user = await AuthService.register(values);
      console.log("Registration successful:", user); // Debug log
      toastSuccess("Registration successful! Please sign in.");

      // Reset Sign Up fields
      setSignUpUsername("");
      setSignUpEmail("");
      setSignUpPassword("");
      setSignUpFullName("");
      setSignUpDob("");
      setSignUpPhone("");

      // Switch to Sign In tab
      navigate('/auth', { state: { activeTab: "signin" } });
    } catch (error) {
      console.error("Sign Up Error:", error);
      toastError(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign In submission
  const handleSignInSubmit = async (event) => {
    event.preventDefault(); // Ngăn hành vi mặc định nếu có
    setIsLoading(true);
    try {
      if (!signInEmail || !signInPassword) {
        throw new Error("Please fill in all fields");
      }
      if (!/\S+@\S+\.\S+/.test(signInEmail)) {
        throw new Error("Please enter a valid email");
      }
  
      const values = {
        email: signInEmail,
        password: signInPassword,
      };
  
      console.log("Attempting login with values:", values);
      const { token, user } = await AuthService.login(values);
      console.log("Login successful:", { token, user });
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_id', user.user_id);
      toastSuccess("Login successful!");
      navigate('/');
    } catch (error) {
      console.error("Sign In Error:", error);
      toastError(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password submission
  const handleForgotPasswordSubmit = async () => {
    setIsLoading(true);
    try {
      // Basic validation
      if (!forgotPasswordEmail) {
        throw new Error("Please enter your email");
      }
      if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
        throw new Error("Please enter a valid email");
      }

      console.log("Attempting forgot password with email:", forgotPasswordEmail); // Debug log
      // Placeholder: Replace with actual AuthService.forgotPassword when implemented
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async call
      toastSuccess("A reset link has been sent to your email.");
      setForgotPasswordVisible(false);
      setForgotPasswordEmail("");
    } catch (error) {
      console.error("Forgot Password Error:", error);
      toastError(error.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab change to clear fields
  const handleTabChange = () => {
    // Reset Sign In fields
    setSignInEmail("");
    setSignInPassword("");
    // Reset Sign Up fields
    setSignUpUsername("");
    setSignUpEmail("");
    setSignUpPassword("");
    setSignUpFullName("");
    setSignUpDob("");
    setSignUpPhone("");
    // Reset Forgot Password field
    setForgotPasswordEmail("");
  };

  return (
    <div className={styles.auth}>
      <Row>
        <Col xs={0} md={7}>
          <LeftContainer />
        </Col>
        <Col xs={24} md={17} className={styles.rightContainer}>
          <Tabs defaultActiveKey="signin" onChange={handleTabChange}>
            <TabPane tab="Sign In" key="signin">
              <div>
                <div className={styles.formItem}>
                  <label>Email</label>
                  <Input
                    placeholder="Email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                  />
                </div>
                <div className={styles.formItem}>
                  <label>Password</label>
                  <Input.Password
                    placeholder="Password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                  />
                </div>
                <div className={styles.formItem}>
                  <Button
                    type="primary"
                    onClick={handleSignInSubmit}
                    loading={isLoading}
                    block
                  >
                    Sign In
                  </Button>
                </div>
                <Button type="link" onClick={() => setForgotPasswordVisible(true)}>
                  Forgot Password?
                </Button>
                <Modal
                  title="Forgot Password"
                  open={forgotPasswordVisible}
                  onCancel={() => setForgotPasswordVisible(false)}
                  footer={null}
                >
                  <div className={styles.formItem}>
                    <label>Email</label>
                    <Input
                      placeholder="Enter your email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    />
                  </div>
                  <div className={styles.formItem}>
                    <Button
                      type="primary"
                      onClick={handleForgotPasswordSubmit}
                      loading={isLoading}
                      block
                    >
                      Send Reset Link
                    </Button>
                  </div>
                </Modal>
              </div>
            </TabPane>
            <TabPane tab="Sign Up" key="signup">
              <div>
                <div className={styles.formItem}>
                  <label>Username</label>
                  <Input
                    placeholder="Username"
                    value={signUpUsername}
                    onChange={(e) => setSignUpUsername(e.target.value)}
                  />
                </div>
                <div className={styles.formItem}>
                  <label>Email</label>
                  <Input
                    placeholder="Email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                  />
                </div>
                <div className={styles.formItem}>
                  <label>Password</label>
                  <Input.Password
                    placeholder="Password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                  />
                </div>
                <div className={styles.formItem}>
                  <label>Full Name</label>
                  <Input
                    placeholder="Full Name"
                    value={signUpFullName}
                    onChange={(e) => setSignUpFullName(e.target.value)}
                  />
                </div>
                <div className={styles.formItem}>
                  <label>Date of Birth</label>
                  <Input
                    type="date"
                    value={signUpDob}
                    onChange={(e) => setSignUpDob(e.target.value)}
                  />
                </div>
                <div className={styles.formItem}>
                  <label>Phone</label>
                  <Input
                    placeholder="Phone Number"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                  />
                </div>
                <div className={styles.formItem}>
                  <Button
                    type="primary"
                    onClick={handleSignUpSubmit}
                    loading={isLoading}
                    block
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default Auth;