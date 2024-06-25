import React from 'react'
import '../styles/why-section.css'
export const WhySection = () => {
  return (
    <div className='why-section-container'>
    <div className='why-section-contents'>
        <div className='why-section-left'>
            <h2 className="title">
                Why Join Us?
            </h2>
            <p>Cortaly is a completely free tool where you can create short links, which apart from being free, you get paid! So, now you can make money from home, when managing and protecting your links.</p>
            <a href="#0" className="custom-button">Create Your Account</a>
        </div>
        <div className='why-section-right-wrapper'>
            <div className='why-section-right'>
                <div className="choose-item">
                    <div className="choose-thumb">
                        <img src="https://pixner.net/cortaly/main/assets/images/why/01.png" alt="why"/>
                    </div>
                    <div className="choose-content">
                        <h5 className="title">JOIN OUR NETWORK</h5>
                        <p>Signup for an account in just one minute, shorten URLs and 
                            sharing your links to everywhere. And you'll be paid from any views.</p>
                    </div>
                </div>
                <div className="choose-item">
                    <div className="choose-thumb">
                        <img src="https://pixner.net/cortaly/main/assets/images/why/02.png" alt="why"/>
                    </div>
                    <div className="choose-content">
                        <h5 className="title">HIGHEST RATES</h5>
                        <p>Make the most out of your traffic with our always increasing rates. You are required to earn only $5.00 before you will be paid.</p>
                    </div>
                </div>
                <div className="choose-item">
                    <div className="choose-thumb">
                        <img src="https://pixner.net/cortaly/main/assets/images/why/03.png" alt="why"/>
                    </div>
                    <div className="choose-content">
                        <h5 className="title">PAYMENTS ON TIME</h5>
                        <p>We provide full mobile supports, you can even shorten the URL, control your account and view the stats on a mobile device.</p>
                    </div>
                </div>
                <div className="choose-item">
                    <div className="choose-thumb">
                        <img src="https://pixner.net/cortaly/main/assets/images/why/04.png" alt="why"/>
                    </div>
                    <div className="choose-content">
                        <h5 className="title">RESPONSIVE UI</h5>
                        <p>Request payments whenever you want and get your payments on 1st day and 15th day of every month. Enjoy you Spendings!!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}
