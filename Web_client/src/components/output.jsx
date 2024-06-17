import { useState, useEffect} from 'react';
import '../styles/output.css'
import logo from '../assets/logo_.avif';
import CONSTANTS from '../constants/constants'
import {UserCircle2Icon} from "lucide-react"
import {Button, Flex, Card, Space, Form, Input } from 'antd';
import {useNavigate} from 'react-router-dom'


export const OutputPage = () => {
    const navigate = useNavigate();
    const [shortUrl, setShortUrl] = useState("");
    const [actualUrl, setActualUrl] = useState("");
    const [time, setTime] = useState('')
    const [date, setDate] = useState('')

    useEffect(() => {
      getData();
    }, []);
    async function getData(){
      try {
        const shortUrl = localStorage.getItem('shortUrl');
        const actualUrl = localStorage.getItem('actualUrl')
        setShortUrl(shortUrl)
        setActualUrl(actualUrl)
        const time = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
        const date = new Date().toLocaleDateString([], {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })
        setTime(time)
        setDate(date)
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
            <h4>Sanjai samson</h4>
            <UserCircle2Icon className='userIcon'/>
          </div>
        </div>
        <div className='output-contents'>
          <div className='text'>
            <h1>Hi sanjai</h1>
            <h3>Here is your short link</h3>
          </div>
          <div className='output-card'>
          <Card style={{ width: 550, height: 400, boxShadow: 20, backgroundColor:'#e6e6e6'}}>
            <h1>Your link</h1>
            <Card style={{ width: 500, height: 50, boxShadow: 20, backgroundColor:'white'}}>
            <p>{actualUrl}</p>
            </Card>
            <h1>New Link</h1>
            <Card style={{ width: 500, height: 50, boxShadow: 20, backgroundColor:'white'}}>
            <a href={shortUrl} target="_blank">{shortUrl}</a>
            </Card>
            <div className='output-card-time-div'>
            <p>{date},</p>
            <p>
              {time}
            </p>
            </div>
            <Button onClick={()=>{
              navigate('/dashboard')
            }} type='primary' style={{width : 100, alignSelf:'center'}}>Ok</Button>
        </Card>
          </div>
        </div>
      </div>
      )
}