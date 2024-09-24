import React,{useState,useEffect} from 'react'
import "./LandingContent.css"
import { Autocomplete, TextField, Container, Box, Button, CircularProgress } from '@mui/material';
import Location from "../../../images/Location.svg"
import Message from "../../../images/Message.svg"
import Logo from "../../../images/Frame 25.svg"
import points1 from "../../../images/points1.svg"
import points2 from "../../../images/points2.svg"
import points3 from "../../../images/points3.svg"
import points4 from "../../../images/points4.svg"
import FAQ from "../../../images/FAQ.svg"
import Left1 from "../../../images/Left1.svg"
import Left2 from "../../../images/Left1.svg"
import Right1 from "../../../images/Right1.svg"
import Right2 from "../../../images/Right2.svg"
const data = [
    {
      image: points1,
      title: "AI-Driven Data Curation",
      content:
        "Data Integration: InfER can aggregate and analyze vast amounts of data from diverse sources, including scientific literature, clinical trials, and genomic databases, enabling researchers to access comprehensive information quickly.",
    },
    {
      image: points2,
      title: "Seamless Integration",
      content:
        "InfER easily connects with popular platforms, allowing real-time data sharing and automatic updates.",
    },
    {
      image: points3,
      title: "Advanced Analytics Engine",
      content:
        "InfER uses smart technology to provide insights through forecasts, live data displays, and in-depth analysis.",
    },
    {
      image: points4,
      title: "Collaborative Tools",
      content:
        "InfER’s Collaborative Tools make it easy for teams to share data, add comments, & give feedback in real time.",
    },
  ];

const LandingContent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
        }, 5000); // 3 seconds
    
        return () => clearInterval(interval); // Cleanup on unmount
      }, []);
    // Move to the next slide
    const nextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    };
  
    // Move to the previous slide
    const prevSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    };
    const goToSlide = (index) => {
        setCurrentIndex(index);
      };
    const [activeId, setActiveId] = useState(null);
           

    const toggleFAQ = (id) => {
        setActiveId(activeId === id ? null : id); // Toggle open/close
    };
  return (
    <>
     
          
    <Container maxWidth="xl"  id='Landing-Content-Container'>
        
        {/* <img className="left1" src={Left1}/> */}
        {/* <img className="left2" src={Left2}/>
          <img className="right1" src={Right1}/>
          <img className="right2" src={Right2}/> */}
        
    
        {/* <div className='WhyInfer' id="WhyInfer">
                <section className='WhyInfer-points'>
                    <div className="card">
                        <div className="number number-1"><img src={points1}/></div>
                        <h3 className='card-title'>AI-Driven Data Curation</h3>
                        <p className='card-content'><span className='infer'>InfER</span>’s system helps speed up research by organizing data, making it easy to connect with different data sources.</p>
                    </div>
                    <div className="card">
                        <div className="number number-2"><img src={points2}/></div>
                        <h3 className='card-title'>Seamless Integration</h3>
                        <p className='card-content'><span className='infer'>InfER</span> easily connects with popular platforms, allowing real-time data sharing and automatic updates.</p>
                    </div>
                    <div className="card">
                        <div className="number number-3"><img src={points3}/></div>
                        <h3 className='card-title'>Advanced Analytics Engine</h3>
                        <p className='card-content'><span className='infer'>InfER</span> uses smart technology to provide insights through forecasts, live data displays, and in-depth analysis.</p>
                    </div>
                    <div className="card">
                        <div className="number number-4"><img src={points4}/></div>
                        <h3 className='card-title'>Collaborative Tools</h3>
                        <p className='card-content'><span className='infer'>InfER</span>’s Collaborative Tools make it easy for teams to share data, add comments, & give feedback in real time.</p>
                    </div>
                </section>
            </div> */}
        <div className="carousel">
            <div style={{width:"100%"}}>
            <button className="carousel-button prev" onClick={prevSlide}>
            &#10094;
          </button>

          {/* Slide Content */}
          <div className="carousel-content">
            {data.map((item, index) => (
              <div
                key={index}
                className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
                style={{ display: index === currentIndex ? 'block' : 'none' }}
              >
                <div className="card">
                  <div className="number">
                    <img src={item.image} alt={`Slide ${index + 1}`} />
                  </div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-content">{item.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button className="carousel-button next" onClick={nextSlide}>
            &#10095;
          </button>

            </div>
          <div>
          <div className="carousel-indicators">
            {data.map((_, index) => (
              <span
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
          </div>
          {/* Indicators */}
          
        </div>




            <div className='Landing-footer'>
            
                <div className="footer-section contact-info">
                    <div style={{display:"flex",marginBottom:"3%"}}>
                        <img src={Logo} href="/"></img>
                       
                    </div>
                    
                    <div style={{display:"flex",marginBottom:"3%"}}>
                    <img src={Location} style={{marginRight:"10px"}}></img>
                    <p>4,390 US Highway 1, Suite 302, Princeton NJ 08540</p>
                    </div>
                    <div style={{display:"flex",marginBottom:"3%"}}>
                    <img src={Message} style={{marginRight:"10px"}}/>
                    <p><a href="mailto:admin@infersol.com">admin@infersol.com</a></p>
                    </div>
                </div>

                <div className="footer-section resources">
                    <h3 style={{marginBottom:"3%"}}>Resources</h3>
    
                        <a href="#" style={{marginBottom:"3%"}}>Search</a>
                        <a href="#" style={{marginBottom:"3%"}}>About Us</a>
                        <a href="#" style={{marginBottom:"3%"}}>Why Infer?</a>
    
                </div>

                {/* <div className="footer-section faqs">
                    <h3 style={{marginBottom:"3%"}}>FAQs</h3>
                    
                        <a href="#" style={{marginBottom:"3%"}}>Lorem Ipsum</a>
                        <a href="#" style={{marginBottom:"3%"}}>Lorem Ipsum</a>
                        <a href="#" style={{marginBottom:"3%"}}>Lorem Ipsum</a>
                    
                </div> */}

                <div className="footer-section newsletter">
                    <h3 style={{marginBottom:"3%"}}>Subscribe to Newsletter</h3>
                    <form style={{marginBottom:"3%"}}>
                        <input className="newsletter-input" type="email" placeholder="Enter Email" />
                        <button className="newsletter-submit" type="submit">Submit</button>
                    </form>
                    <div className="social-icons" style={{marginBottom:"3%"}}>
                        <a href="#" ><svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.1" fill-rule="evenodd" clip-rule="evenodd" d="M0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15Z" fill="#1A82FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.0007 7C12.8281 7 12.5554 7.0095 11.702 7.04833C10.8504 7.08733 10.269 7.22217 9.76036 7.42C9.23419 7.62434 8.78785 7.89768 8.34318 8.34251C7.89818 8.78719 7.62484 9.23352 7.41984 9.75953C7.2215 10.2684 7.0865 10.8499 7.04817 11.7012C7.01 12.5546 7 12.8274 7 15.0001C7 17.1728 7.00967 17.4446 7.04833 18.298C7.0875 19.1496 7.22234 19.731 7.42 20.2396C7.62451 20.7658 7.89784 21.2121 8.34268 21.6568C8.78719 22.1018 9.23352 22.3758 9.75936 22.5802C10.2684 22.778 10.8499 22.9128 11.7014 22.9518C12.5547 22.9907 12.8272 23.0002 14.9998 23.0002C17.1726 23.0002 17.4444 22.9907 18.2978 22.9518C19.1495 22.9128 19.7315 22.778 20.2405 22.5802C20.7665 22.3758 21.2121 22.1018 21.6567 21.6568C22.1017 21.2121 22.375 20.7658 22.58 20.2398C22.7767 19.731 22.9117 19.1495 22.9517 18.2981C22.99 17.4448 23 17.1728 23 15.0001C23 12.8274 22.99 12.5547 22.9517 11.7014C22.9117 10.8497 22.7767 10.2684 22.58 9.7597C22.375 9.23352 22.1017 8.78719 21.6567 8.34251C21.2116 7.89751 20.7666 7.62417 20.24 7.42C19.73 7.22217 19.1483 7.08733 18.2966 7.04833C17.4433 7.0095 17.1716 7 14.9982 7H15.0007ZM14.283 8.44166C14.496 8.44133 14.7337 8.44166 15.0007 8.44166C17.1367 8.44166 17.3899 8.44933 18.2334 8.48766C19.0134 8.52333 19.4368 8.65366 19.7188 8.76316C20.0921 8.90816 20.3583 9.0815 20.6381 9.3615C20.9181 9.64151 21.0914 9.90817 21.2368 10.2815C21.3463 10.5632 21.4768 10.9865 21.5123 11.7665C21.5506 12.6099 21.5589 12.8632 21.5589 14.9982C21.5589 17.1333 21.5506 17.3866 21.5123 18.2299C21.4766 19.0099 21.3463 19.4333 21.2368 19.7149C21.0918 20.0883 20.9181 20.3541 20.6381 20.634C20.3581 20.914 20.0923 21.0873 19.7188 21.2323C19.4371 21.3423 19.0134 21.4723 18.2334 21.508C17.3901 21.5463 17.1367 21.5546 15.0007 21.5546C12.8645 21.5546 12.6114 21.5463 11.768 21.508C10.988 21.472 10.5647 21.3416 10.2825 21.2321C9.90916 21.0871 9.64249 20.9138 9.36249 20.6338C9.08249 20.3538 8.90915 20.0878 8.76382 19.7143C8.65432 19.4326 8.52381 19.0093 8.48831 18.2293C8.44998 17.3859 8.44231 17.1326 8.44231 14.9962C8.44231 12.8599 8.44998 12.6079 8.48831 11.7645C8.52398 10.9845 8.65432 10.5612 8.76382 10.2792C8.90882 9.90584 9.08249 9.63917 9.36249 9.35917C9.64249 9.07917 9.90916 8.90583 10.2825 8.7605C10.5645 8.65049 10.988 8.52049 11.768 8.48466C12.506 8.45133 12.792 8.44133 14.283 8.43966V8.44166ZM19.2711 9.77001C18.7411 9.77001 18.3111 10.1995 18.3111 10.7297C18.3111 11.2597 18.7411 11.6897 19.2711 11.6897C19.8011 11.6897 20.2311 11.2597 20.2311 10.7297C20.2311 10.1997 19.8011 9.77001 19.2711 9.77001ZM15.0008 10.8917C12.7319 10.8917 10.8924 12.7312 10.8924 15.0001C10.8924 17.2689 12.7319 19.1076 15.0008 19.1076C17.2696 19.1076 19.1085 17.2689 19.1085 15.0001C19.1085 12.7312 17.2696 10.8917 15.0008 10.8917ZM15.0007 12.3334C16.4734 12.3334 17.6674 13.5272 17.6674 15.0001C17.6674 16.4727 16.4734 17.6668 15.0007 17.6668C13.5279 17.6668 12.334 16.4727 12.334 15.0001C12.334 13.5272 13.5279 12.3334 15.0007 12.3334Z" fill="#1A82FF"/>
</svg>
</a>
                        <a href="#"><svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.1" fill-rule="evenodd" clip-rule="evenodd" d="M-0.000244141 14.9999C-0.000244141 6.71567 6.71548 -6.10352e-05 14.9998 -6.10352e-05C23.284 -6.10352e-05 29.9998 6.71567 29.9998 14.9999C29.9998 23.2842 23.284 29.9999 14.9998 29.9999C6.71548 29.9999 -0.000244141 23.2842 -0.000244141 14.9999Z" fill="#1A82FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.5493 12.1921L14.5808 12.7111L14.0562 12.6475C12.1466 12.4039 10.4784 11.5777 9.06193 10.1901L8.36945 9.50156L8.19108 10.01C7.81336 11.1434 8.05468 12.3404 8.8416 13.1454C9.26128 13.5903 9.16685 13.6538 8.44289 13.389C8.19108 13.3043 7.97074 13.2407 7.94976 13.2725C7.87632 13.3467 8.12813 14.3106 8.32748 14.6919C8.60028 15.2215 9.15636 15.7406 9.76491 16.0477L10.279 16.2914L9.67048 16.302C9.08292 16.302 9.06193 16.3126 9.12489 16.535C9.33473 17.2235 10.1636 17.9544 11.0869 18.2722L11.7374 18.4946L11.1709 18.8336C10.3315 19.3208 9.34522 19.5962 8.35896 19.6174C7.88681 19.628 7.4986 19.6704 7.4986 19.7022C7.4986 19.8081 8.77864 20.4013 9.52359 20.6343C11.7584 21.3228 14.4129 21.0262 16.4065 19.8505C17.8229 19.0137 19.2394 17.3506 19.9004 15.7406C20.2571 14.8826 20.6138 13.3149 20.6138 12.5628C20.6138 12.0755 20.6453 12.012 21.2329 11.4294C21.5791 11.0904 21.9044 10.7197 21.9673 10.6138C22.0722 10.4125 22.0618 10.4125 21.5267 10.5926C20.6348 10.9104 20.5089 10.868 20.9496 10.3913C21.2748 10.0524 21.6631 9.43801 21.6631 9.25794C21.6631 9.22616 21.5057 9.27912 21.3273 9.37445C21.1384 9.48038 20.7188 9.63927 20.404 9.7346L19.8374 9.91467L19.3233 9.56512C19.04 9.37445 18.6413 9.1626 18.4315 9.09905C17.8964 8.95075 17.078 8.97194 16.5953 9.14142C15.2838 9.61808 14.4549 10.8468 14.5493 12.1921Z" fill="#1A82FF"/>
</svg></a>
                        <a href="#"><svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.1" fill-rule="evenodd" clip-rule="evenodd" d="M-0.000244141 14.9999C-0.000244141 6.71567 6.71548 -6.10352e-05 14.9998 -6.10352e-05C23.284 -6.10352e-05 29.9998 6.71567 29.9998 14.9999C29.9998 23.2842 23.284 29.9999 14.9998 29.9999C6.71548 29.9999 -0.000244141 23.2842 -0.000244141 14.9999Z" fill="#1A82FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.2508 9.84327C21.9392 10.0322 22.4814 10.5888 22.6654 11.2957C22.9998 12.5768 22.9998 15.2499 22.9998 15.2499C22.9998 15.2499 22.9998 17.9229 22.6654 19.2042C22.4814 19.9111 21.9392 20.4677 21.2508 20.6567C20.0031 20.9999 14.9998 20.9999 14.9998 20.9999C14.9998 20.9999 9.99639 20.9999 8.74866 20.6567C8.06021 20.4677 7.51803 19.9111 7.33403 19.2042C6.99976 17.9229 6.99976 15.2499 6.99976 15.2499C6.99976 15.2499 6.99976 12.5768 7.33403 11.2957C7.51803 10.5888 8.06021 10.0322 8.74866 9.84327C9.99639 9.49994 14.9998 9.49994 14.9998 9.49994C14.9998 9.49994 20.0031 9.49994 21.2508 9.84327ZM13.4998 12.9999V17.9999L17.4998 15.5L13.4998 12.9999Z" fill="#1A82FF"/>
</svg>
    </a>
                    </div>
                </div>
        </div>
        <div className="footer-trademark">
                <p className='footer-trademark-content'>Copyright © 2024, Infer Solutions, Inc. All Rights Reserved.</p>
            </div>
           
    </Container>
    </>

  )
}

export default LandingContent