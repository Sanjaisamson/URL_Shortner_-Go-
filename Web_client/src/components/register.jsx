import { useState } from 'react';
import '../styles/register.css'
import axios from 'axios';
import CONSTANTS from '../constants/constants'
import {Button, Card, Input, Form } from 'antd';
import {useNavigate} from 'react-router-dom'


export const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registerStatus, setRegisterStatus] = useState("");


    const handleLogin = () => {
      navigate('/');
    };
  const handleRegister = async () => {
    try {
      const requestData = JSON.stringify({
        userName:username,
        mailId: email,
        password: password,
      });
      const response = await axios.post(
        `${CONSTANTS.API_URL}/user/signup`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === CONSTANTS.RESPONSE_STATUS.SUCCESS) {
        setRegisterStatus(CONSTANTS.STATUS_CONSTANTS.COMPLETED);
        navigate("/")
      } else {
        throw new Error(CONSTANTS.RESPONSE_STATUS.FAILED);
      }
    } catch (error) {
        setRegisterStatus(CONSTANTS.STATUS_CONSTANTS.FAILED);
      }
}  

  return (
      <div className="reg-Container">
            <div className='reg-card'>
            <Card>
                <Form>
                <div className='reg-card-header'>
                  <h2>Let's Get Started.......</h2>
                  </div>
                  <h4>Enter your Name</h4>
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                  >
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      style={{ width: 350, height: 50}}
                    />
                  </Form.Item>
                  <h4>Enter your Email</h4>
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
                      style={{ width: 350, height: 50}}
                    />
                  </Form.Item>
                  <div className='reg-button'>
                  <Button onClick={handleRegister} type="submit">
                    <div className='reg-button-content'>
                    Try It Now
                    </div>
                  </Button>
                  </div>
                  <div style={{display:"flex", justifyContent:"center"}} >
                  <p>----------------------------- or ------------------------------</p>
                  </div>
                  <div className='reg-card-already-account-section'>
                  <div className='already-account-section'>
                  <p>Already Have an account?</p>
                  <Button onClick={handleLogin} type="submit">
                    <div className='create-button-content'>
                    Sign In
                    </div>
                  </Button>
                  </div>
                  </div>
              </Form>
              {registerStatus === CONSTANTS.STATUS_CONSTANTS.COMPLETED && (
                <p style={{color:"green"}}>Registration Successful!</p>
              )}
              {registerStatus === CONSTANTS.STATUS_CONSTANTS.FAILED && (
                <p style={{color:"red"}}>
                  Registration Failed. Please try again.
                </p>
              )}
            </Card>
        </div>
      </div>
  )
}