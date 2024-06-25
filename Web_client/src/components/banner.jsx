import React, { useEffect, useRef, useState } from 'react';
import "../styles/banner.css"


export const Banner = () => {
    const [counters, setCounters] = useState([
        { target: 1200000, current: 0 },
        { target: 348000000, current: 0 },
        { target: 1180000, current: 0 }
    ]);

    useEffect(() => {
        const speed = 200; // The lower the slower

        const updateCounters = () => {
            setCounters(prevCounters => 
                prevCounters.map(counter => {
                    if (counter.current < counter.target) {
                        const increment = Math.ceil(counter.target / speed);
                        return {
                            ...counter,
                            current: Math.min(counter.current + increment, counter.target)
                        };
                    }
                    return counter;
                })
            );
        };

        const timer = setInterval(updateCounters, 1);

        return () => clearInterval(timer);
    }, []);

  return (
    <div className='banner-container'>
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
            <h3>Shorten URL Is Just Simple</h3>
        </div>
        <div className='input-section'>
        <input type="text" placeholder="Your URL here" name="url" required=""/>
        <button type="submit" fdprocessedid="aj3d5v">Shorten <i className="flaticon-startup"></i></button>
        </div>
        <div className="banner-counter">
                {counters.map((counter, index) => (
                    <div className="counter-item" key={index}>
                        <h2 className="counter-title">
                            <span className="counter">{counter.current.toLocaleString()}+</span>
                        </h2>
                        <p>{index === 0 ? "Links clicked per day" : 
                            index === 1 ? "Shortened links in total" : 
                            "Happy users registered"}</p>
                    </div>
                ))}
            </div>
        </div>
        </div>
    </div>
  )
}
