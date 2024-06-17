import React from 'react'
import {useRef, useEffect } from "react";
import logo from '../assets/url-trim.png';
import { Link } from "react-router-dom";
import "../styles/navbar.css"
import { Image } from 'antd';

export const NavbarSec = () => {

const hamburgerRef = useRef();
  const navLinksRef = useRef();
  const contactsRef = useRef()

    useEffect(() => {
        const handleHamburgerClick = () => {
          const hamburgerElement = hamburgerRef.current;
          const navLinksElement = navLinksRef.current;
          const contactsElements = contactsRef.current;
    
          if (hamburgerElement && navLinksElement && contactsElements ) {
            const links = navLinksElement.querySelectorAll(".nav-links li");
            navLinksElement.classList.toggle("open");
            links.forEach(link => {
              link.classList.toggle("fade");
            });
            hamburgerElement.classList.toggle("toggle");
            contactsElements.classList.toggle("show");
          }
        };
    
        const hamburgerElement = hamburgerRef.current;
        if (hamburgerElement) {
          hamburgerElement.addEventListener('click', handleHamburgerClick);
        }
    
        return () => {
          if (hamburgerElement) {
            hamburgerElement.removeEventListener('click', handleHamburgerClick);
          }
        };
      }, []);
  return (
    <div className="navbarcontainer">
      <div className='logo'>
         <img src={logo} alt="image"></img>
        </div>
        <div className="hamburger" ref={hamburgerRef}>
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
        </div>
        <div className="nav-links-div">
        <ul className="nav-links" ref={navLinksRef}>
            <li><Link to="/">Home</Link></li>
            <li><Link to ="/about">About me</Link></li>
            <li><Link to ="/skills">Skills</Link></li>
            <li><Link to="/projects">Works</Link></li>
            {/* <li> <div className="navbar-text-div" ref={contactsRef} >
              <span className="navbar-text">
              <div className="social-icon">
                <a href="https://www.linkedin.com/in/sanjai-samson" target="_blank">
                  <img src={navIcon1} alt="" />
                </a>
                <a href="https://www.facebook.com/sanjai.samson.73?mibextid=ZbWKwL" target="_blank">
                  <img src={navIcon2} alt="" />
                </a>
                <a href="https://www.instagram.com/sanjai__samson?igsh=YmtzNGpueXdvd2Fz" target="_blank">
                  <img src={navIcon3} alt="" />
                </a>
              </div>
              <HashLink to="/footer">
                <button className="vvd">
                  <span>Let’s Connect</span>
                </button>
              </HashLink>
              </span>
            </div></li> */}
        </ul>
        </div>
        </div>
  )
}