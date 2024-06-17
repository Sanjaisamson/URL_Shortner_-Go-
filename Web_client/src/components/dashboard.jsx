import '../styles/dashboard.css'
import create_link_img from '../assets/dashboard_links.png'
import Links_img from '../assets/dashboard_qrcs.png'
import CONSTANTS from '../constants/constants'
import axios from 'axios';
import {UserCircle2Icon} from "lucide-react"
import {Button,Card} from 'antd';
import {useNavigate} from 'react-router-dom'
import {NavbarSec} from "./navbar"



export const Dashboard = () => {
  const navigate = useNavigate();

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

  async function handleLogout(){
    try {
      const accessToken = await refreshAccessToken()
      const response = await axios.post(
        `${CONSTANTS.API_URL}/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === CONSTANTS.RESPONSE_STATUS.SUCCESS) {
        navigate("/")
      } else {
        throw new Error(CONSTANTS.RESPONSE_STATUS.FAILED);
      }
    } catch (error) {
      }
  }
  return (
    <div className='hompage-Container'>
          <NavbarSec/>
    </div>
  )
}

