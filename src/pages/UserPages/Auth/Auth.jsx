import React, { useState } from "react";
import { Tabs, Form, Row, Col } from "antd";
import LeftContainer from "../../../components/UserPages/AuthPage/LeftContainer/LeftContainer";
import SignIn from "../../../components/UserPages/AuthPage/SignIn/SignIn";
import SignUp from "../../../components/UserPages/AuthPage/SignUp/SignUp";
import styles from "./Auth.module.scss";

const { TabPane } = Tabs;

const Auth = () => {
  const [form] = Form.useForm();
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  const handleSubmit = (values) => {
    setIsLoading(true);
    setTimeout(() => {
      setAlert({
        show: true,
        type: "success",
        message: "Submission successful! You can now log in.",
      });
      setIsLoading(false);
      form.resetFields();
    }, 1000);
  };

  const handleForgotPasswordSubmit = (values) => {
    setIsLoading(true);
    setTimeout(() => {
      setAlert({
        show: true,
        type: "success",
        message: "A reset link has been sent to your email.",
      });
      setIsLoading(false);
      setForgotPasswordVisible(false);
    }, 1000);
  };

  return (
    <div className={styles.auth}>
      <Row>
        <Col xs={0} md={7}>
          <LeftContainer />
        </Col>
        <Col xs={24} md={17} className={styles.rightContainer}>
          <Tabs defaultActiveKey="signin">
            <TabPane tab="Sign In" key="signin">
              <SignIn
                form={form}
                alert={alert}
                setAlert={setAlert}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                forgotPasswordVisible={forgotPasswordVisible}
                setForgotPasswordVisible={setForgotPasswordVisible}
                handleSubmit={handleSubmit}
                handleForgotPasswordSubmit={handleForgotPasswordSubmit}
              />
            </TabPane>
            <TabPane tab="Sign Up" key="signup">
              <SignUp
                form={form}
                alert={alert}
                setAlert={setAlert}
                isLoading={isLoading}
                handleSubmit={handleSubmit}
              />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default Auth;
