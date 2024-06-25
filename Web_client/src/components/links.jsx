import { useState, useEffect} from 'react';
import '../styles/links.css'
import { CardStructure } from './linkCards';
import {Button} from 'antd';
import {useNavigate} from 'react-router-dom'
import { NavbarSec } from './navbar';


export const LinksPage = () => {
    // const navigate = useNavigate();
    // const [dbData, setDbData] = useState([]);

    // useEffect(() => {
    //   getData();
    // }, []);
    // async function refreshAccessToken() {
    //     try {
    //       const response = await axios.get(
    //         `http://localhost:3000/user/refresh`,{ withCredentials: true }
    //       );
    //       if (response.status === CONSTANTS.RESPONSE_STATUS.SUCCESS) {
    //         const responseData = response.data;
    //         return responseData.accessToken;
    //       } else {
    //         navigate("/login");
    //       }
    //     } catch (error) {
    //       throw error;
    //     }
    //   }
    // async function getData(){
    //     try {
    //       const accessToken = await refreshAccessToken()
    //       const response = await axios.get(
    //         `http://localhost:3000/url/links`,
    //         {
    //           headers: {
    //             Authorization: `Bearer ${accessToken}`,
    //             "Content-Type": "application/json",
    //           },
    //           withCredentials: true,
    //         }
    //       );
    //       if (response.status === CONSTANTS.RESPONSE_STATUS.SUCCESS) {
    //         const responseData = response.data
    //         setDbData(responseData)
    //       } else {
    //         throw new Error(CONSTANTS.RESPONSE_STATUS.FAILED);
    //       }
    //     } catch (error) {
    //         navigate("/dashboard")
    //       } 
    // }
    // const cardData = dbData.map(item => ({
    //     title: 'Title',
    //     link_id: item.id, 
    //     shortUrl: item.short_url, 
    //     actualUrl: item.url,
    //     clicks: item.clicks,
    //     created_time: new Date(item.createdAt).toLocaleTimeString([], {
    //         hour: "2-digit",
    //         minute: "2-digit",
    //       }), 
    //     created_date: new Date(item.createdAt).toLocaleDateString([], {
    //         year: "numeric",
    //         month: "long",
    //         day: "numeric",
    //         weekday: "long",
    //       })
    // }));

    return (
        <div className="link-page-container">
        <div className='link-contents'>
        <div className="navbar">
          <NavbarSec/>
        </div>
        <div className='banner-contents'>
            <div className='banner-heading-group'>
        <div className='head-1'>
            <h3>Shortern Urls and </h3>
        </div>
        <div className='head-2'>
            <h1>Earn Money</h1>
        </div>
        <div className='sub-head'>
            <p>Transforming long, ugly links into Shorten URLs and earn big money. Get paid by every person who visits your URLs.</p>
        </div>
        </div>
        <div className='banner-form-group'>
        <div className='headline'>
            <h3>Your URL's Are Here</h3>
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
        </div>
          
        </div>
      )
}