import React,{useState} from 'react'
import "./LandingContent.css"
import { Autocomplete, TextField, Container, Box, Button, CircularProgress } from '@mui/material';


const faqData = [
    { id: 1, number: '01', question: 'Lorem Ipsum', answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 2, number: '02', question: 'Lorem Ipsum', answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 3, number: '03', question: 'Lorem Ipsum', answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
    { id: 4, number: '04', question: 'Lorem Ipsum', answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
];
const LandingContent = () => {
    const [activeId, setActiveId] = useState(null);
    const toggleFAQ = (id) => {
        setActiveId(activeId === id ? null : id); // Toggle open/close
    };
  return (
    <>
    <Container maxWidth="xl"  id='Landing-Content-Container'>
        <div className='WhyInfer' id="WhyInfer">
                <h3 style={{ marginBottom: '5%',marginTop:0 }}>Why Infer?</h3>
                <section className='WhyInfer-points'>
                    <div className="card">
                        <div className="number number-1"><span>01</span></div>
                        <h3 className='card-title'>Lorem Ipsum</h3>
                        <p className='card-content'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.</p>
                    </div>
                    <div className="card">
                        <div className="number number-2"><span>02</span></div>
                        <h3 className='card-title'>Lorem Ipsum</h3>
                        <p className='card-content'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.</p>
                    </div>
                    <div className="card">
                        <div className="number number-3"><span>03</span></div>
                        <h3 className='card-title'>Lorem Ipsum</h3>
                        <p className='card-content'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.</p>
                    </div>
                    <div className="card">
                        <div className="number number-4"><span>04</span></div>
                        <h3 className='card-title'>Lorem Ipsum</h3>
                        <p className='card-content'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been.</p>
                    </div>
                </section>
            </div>
            <div className="faq-container" id="FAQ">
                <h2 className='faq-header'>Frequently Asked Questions</h2>
                <section className="faq">
                    {faqData.map(item => (
                        <div key={item.id} className={`faq-item ${activeId === item.id ? 'active' : ''}`} onClick={() => toggleFAQ(item.id)}>
                            <div className="faq-question">
                                <div className="faq-number"><span>{item.number}</span></div>
                                <h3 id="faq-number-h3">{item.question}</h3>
                                <div className="toggle-icon">{activeId === item.id ? '–' : '+'}</div>
                            </div>
                            <div className="faq-answer" style={{ display: activeId === item.id ? 'block' : 'none' }}>
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
            <div className='Landing-footer'>
                <div className="footer-content">
                    <p className="footer-trademark">Copyright © 2024, Infer Solutions, Inc. All Rights Reserved.</p>
                    <div className="social-icons">
                        <a href="#"><i className="fab fa-facebook"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.3333 10.85V14.2333H19.3667C19.6 14.2333 19.7167 14.4667 19.7167 14.7L19.25 16.9167C19.25 17.0333 19.0167 17.15 18.9 17.15H16.3333V25.6667H12.8333V17.2667H10.85C10.6167 17.2667 10.5 17.15 10.5 16.9167V14.7C10.5 14.4667 10.6167 14.35 10.85 14.35H12.8333V10.5C12.8333 8.51667 14.35 7 16.3333 7H19.4833C19.7167 7 19.8333 7.11667 19.8333 7.35V10.15C19.8333 10.3833 19.7167 10.5 19.4833 10.5H16.6833C16.45 10.5 16.3333 10.6167 16.3333 10.85Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/>
                            <path d="M17.5003 25.6668H10.5003C4.66695 25.6668 2.33362 23.3335 2.33362 17.5002V10.5002C2.33362 4.66683 4.66695 2.3335 10.5003 2.3335H17.5003C23.3336 2.3335 25.667 4.66683 25.667 10.5002V17.5002C25.667 23.3335 23.3336 25.6668 17.5003 25.6668Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg></i></a>
                        <a href="#"><i className="fab fa-youtube"><svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.3336 23.3332H8.66695C5.16695 23.3332 2.83362 20.9998 2.83362 17.4998V10.4998C2.83362 6.99984 5.16695 4.6665 8.66695 4.6665H20.3336C23.8336 4.6665 26.167 6.99984 26.167 10.4998V17.4998C26.167 20.9998 23.8336 23.3332 20.3336 23.3332Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M13.8 11.0834L16.7166 12.8334C17.7666 13.5334 17.7666 14.5834 16.7166 15.2834L13.8 17.0334C12.6333 17.7334 11.7 17.15 11.7 15.8667V12.3667C11.7 10.85 12.6333 10.3834 13.8 11.0834Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg></i></a>
                        <a href="#"><i className="fab fa-google"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25.2002 11.9002H14.2336V16.2168H20.6502C20.5336 17.2668 19.8336 18.9002 18.3169 19.9502C17.3836 20.6502 15.9836 21.1168 14.2336 21.1168C11.2002 21.1168 8.51689 19.1335 7.58356 16.2168C7.35023 15.5168 7.23356 14.7002 7.23356 13.8835C7.23356 13.0668 7.35023 12.2502 7.58356 11.5502C7.70023 11.3168 7.70023 11.0835 7.81689 10.9668C8.86689 8.51683 11.3169 6.76683 14.2336 6.76683C16.4502 6.76683 17.8502 7.70016 18.7836 8.51683L22.0502 5.25016C20.0669 3.50016 17.3836 2.3335 14.2336 2.3335C9.68356 2.3335 5.71689 4.90016 3.85023 8.75016C3.03356 10.3835 2.56689 12.1335 2.56689 14.0002C2.56689 15.8668 3.03356 17.6168 3.85023 19.2502C5.71689 23.1002 9.68356 25.6668 14.2336 25.6668C17.3836 25.6668 20.0669 24.6168 21.9336 22.8668C24.1502 20.8835 25.4336 17.8502 25.4336 14.2335C25.4336 13.3002 25.3169 12.6002 25.2002 11.9002Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg></i></a>
                    </div>
                </div>
            </div>
            {/* <footer className="footer" id="footer-container">
                <div className="footer-content">
                    <p className="footer-trademark">Copyright © 2024, Infer Solutions, Inc. All Rights Reserved.</p>
                    <div className="social-icons">
                        <a href="#"><i className="fab fa-facebook"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-youtube"></i></a>
                        <a href="#"><i className="fab fa-google"></i></a>
                    </div>
                </div>
            </footer> */}
    </Container>
    </>

  )
}

export default LandingContent