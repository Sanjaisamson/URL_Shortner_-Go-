import { useState, useEffect} from 'react';
import '../styles/links.css'
import logo from '../assets/logo_.avif';
import CONSTANTS from '../constants/constants'
import {UserCircle2Icon} from "lucide-react"
import axios from 'axios';
import { CardStructure } from './linkCards';
import {Button} from 'antd';
import {useNavigate} from 'react-router-dom'


export const LinksPage = () => {
    const navigate = useNavigate();
    const [dbData, setDbData] = useState([]);

    useEffect(() => {
      getData();
    }, []);
    async function refreshAccessToken() {
        try {
          const response = await axios.get(
            `http://localhost:3000/user/refresh`,{ withCredentials: true }
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
    async function getData(){
        try {
          const accessToken = await refreshAccessToken()
          const response = await axios.get(
            `http://localhost:3000/url/links`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          if (response.status === CONSTANTS.RESPONSE_STATUS.SUCCESS) {
            const responseData = response.data
            setDbData(responseData)
          } else {
            throw new Error(CONSTANTS.RESPONSE_STATUS.FAILED);
          }
        } catch (error) {
            navigate("/dashboard")
          } 
    }
    const cardData = dbData.map(item => ({
        title: 'Title',
        link_id: item.id, 
        shortUrl: item.short_url, 
        actualUrl: item.url,
        clicks: item.clicks,
        created_time: new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }), 
        created_date: new Date(item.createdAt).toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })
    }));

    return (
        <div className="container">
        <div className="navbar">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="navbar-content">
            <h4>Sanjai samson</h4>
            <UserCircle2Icon className='userIcon'/>
          </div>
        </div>
        <div className='link-contents'>
          <div className='link-text'>
            <div>
            <h1>Hi User</h1>
            <h3>Here is your Links</h3>
            </div>
            <div>
            <Button onClick={()=>{
              navigate('/url')
            }} type='primary' style={{width : 150, alignSelf:'center'}}>Create New Link</Button>
            </div>
            <div>
            <Button onClick={()=>{
              navigate('/dashboard')
            }} type='primary' style={{width : 150, alignSelf:'center'}}>Back to Home</Button>
            </div>
          </div>
          <div className='link-card'>
          {cardData.map((card, index) => (
        <CardStructure
          key={index}
          title={card.title}
          shortUrl={`${card.shortUrl}/${card.link_id}`}
          actualUrl={card.actualUrl}
          clicks={card.clicks}
          created_time={card.created_time}
          created_date={card.created_date}
        />
      ))}
          </div>
        </div>
      </div>
      )
}