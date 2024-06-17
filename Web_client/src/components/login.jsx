import { useState } from 'react';
import '../styles/login.css'
import axios from 'axios';
import CONSTANTS from '../constants/constants'
import {Button, Card, Input, Form } from 'antd';
import {useNavigate} from 'react-router-dom'


export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState("");

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = async () => {
    try {
      const requestData = JSON.stringify({
        mailId: email,
        password: password,
      });
      const response = await axios.post(
        `${CONSTANTS.API_URL}/user/login`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === CONSTANTS.RESPONSE_STATUS.SUCCESS) {
        setLoginStatus(CONSTANTS.STATUS_CONSTANTS.COMPLETED);
        navigate("/dashboard")
      } else {
        throw new Error(CONSTANTS.RESPONSE_STATUS.FAILED);
      }
    } catch (error) {
        setLoginStatus(CONSTANTS.STATUS_CONSTANTS.FAILED);
      }
}  

  return (
      <div className="loginContainer">
            <div className='login-card'>
            <Card>
                <Form>
                  <h2>Welcome back</h2>
                  <h4>Enter your email</h4>
                  <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                  >
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      style={{ width: 350, height: 50}}
                    />
                  </Form.Item>
                  <h4>Enter your Password</h4>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                  >
                    <Input.Password
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      style={{  width: 350, height: 50 }}
                    />
                  </Form.Item>
                  <div className='login-button'>
                  <Button onClick={handleLogin} type="submit">
                    <div className='login-button-content'>
                    Sign in
                    </div>
                  </Button>
                  </div>
                  <div style={{display:"flex", justifyContent:"center"}} >
                  <p>----------------------------- or ------------------------------</p>
                  </div>
                  <div className='login-card-new-account-section'>
                  <div className='new-account-section'>
                  <p>Don't Have an account?</p>
                  <Button onClick={handleRegister} type="submit">
                    <div className='create-button-content'>
                    Sign Up Here
                    </div>
                  </Button>
                  </div>
                  </div>
              </Form>
              {loginStatus === CONSTANTS.STATUS_CONSTANTS.COMPLETED && (
                <p style={{color:"green"}}>Login Successful!</p>
              )}
              {loginStatus === CONSTANTS.STATUS_CONSTANTS.FAILED && (
                <p style={{color:"red"}}>
                  Login Failed. Please try again.
                </p>
              )}
            </Card>
        </div>
      </div>
  )
}