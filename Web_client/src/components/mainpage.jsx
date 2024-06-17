import { useState } from 'react';
import '../styles/mainPage.css'
import logo from '../assets/logo_.avif';
import {UserCircle2Icon} from "lucide-react"
import axios from 'axios';
import {Button,Card, Form, Input } from 'antd';
import CONSTANTS from '../constants/constants';
import {useNavigate} from 'react-router-dom'


export const MainPage = () => {
    const navigate = useNavigate();
    const [url, setUrl] = useState("");
    const [customBackhalf, setCustomBackHalf] = useState("");

    async function refreshAccessToken() {
        try {
          const response = await axios.get(
            `${CONSTANTS.API_URL}/user/refresh`,{ withCredentials: true }
          );
          if (response.status === CONSTANTS.RESPONSE_STATUS.SUCCESS) {
            const responseData = response.data;
            return responseData.accessToken;
          } else {
            navigate("/login");
          }
        } catch (error) {
          throw error;
        }
      }

    const handleCreateLink = async () => {
        try {
            const accessToken = await refreshAccessToken()
          const requestData = JSON.stringify({
            url: url,
            customBackHalf: customBackhalf,
          });
          localStorage.setItem('actualUrl',url);
          const response = await axios.post(
            `${CONSTANTS.API_URL}/url/create`,
            requestData,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          if (response.status === CONSTANTS.RESPONSE_STATUS.SUCCESS) {
            localStorage.setItem('shortUrl',response.data);
            navigate("/output")
          } else {
            throw new Error(CONSTANTS.RESPONSE_STATUS.FAILED);
          }
        } catch (error) {
            navigate("/dashboard")
          }
    }  

    return (
        <div className="container">
        <div className="navbar">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="navbar-content">
            <h3>User</h3>
            <UserCircle2Icon className='userIcon'/>
          </div>
        </div>
        <div className='url-page-contents'>
          <div className='url-page-text'>
          <div>
            <h1>Hi User</h1>
            <h3>Here is your Links</h3>
            </div>
            <div>
            <Button onClick={()=>{
              navigate('/links')
            }} type='primary' style={{width : 150, alignSelf:'center'}}>Go to Links</Button>
            </div>
            <div>
            <Button onClick={()=>{
              navigate('/dashboard')
            }} type='primary' style={{width : 150, alignSelf:'center'}}>Back to Home</Button>
            </div>
          </div>
          <div className='url-page-card'>
          <Card style={{ width: 550, height: 400, boxShadow: 20, backgroundColor:'#e6e6e6'}}>
          <Form>
            <div className='url-page-card-title'>
                <h2>Here Give Your Link And Create Your Own</h2>
                </div>
                  <h4>Destination</h4>
                  <Form.Item
                    name="url"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                  >
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="place your Link here"
                      style={{ width: 500 }}
                    />
                  </Form.Item>
                  <div className="url-page-input-title">
                  <h4>Custom Back Half</h4>
                  <p>(Optional)</p>
                    </div>
                  <Form.Item
                    name="customBackHalf"
                  >
                    <Input
                      value={customBackhalf}
                      onChange={(e) => setCustomBackHalf(e.target.value)}
                      placeholder="Custom Back Half"
                      style={{ width: 250 }}
                    />
                  </Form.Item>
                  <Button onClick={handleCreateLink} type="primary">
                    Create Link
                  </Button>
              </Form>
              </Card>
          </div>
        </div>
      </div>
      )
}