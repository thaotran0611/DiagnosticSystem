import React, { useEffect, useRef, useState } from "react";
import './LandingPage.css'
import logo from '../../img/logo.png';
import Submit_button from "../../components/Button/Submit-button";
import doctor from "../../img/LandingPage/doctor1.png";
import patient from "../../img/LandingPage/patient1.png";
import icu from "../../img/LandingPage/icu1.png";
import doctor_process from "../../img/LandingPage/process_of_doctor.png";
import bg1 from "../../img/LandingPage/bg1.png"
import doctor2 from "../../img/LandingPage/doctor2.png"
import bg2 from "../../img/LandingPage/bg2.png"
import medicine_process from "../../img/LandingPage/process_of_medicine.png"
import medicine_process2 from "../../img/LandingPage/process_of_medicine2.png"
import GoogleMapReact from 'google-map-react';
import phone from "../../img/LandingPage/phone.png";
import mail from "../../img/LandingPage/mail.png";
import facebook from "../../img/LandingPage/facebook.png";
import instagram from "../../img/LandingPage/instagram.png";
import linkedin from "../../img/LandingPage/linkedin.png";
import telegram from "../../img/LandingPage/telegram.png";
import axios from 'axios';
import { Pagination, ThemeProvider, createTheme} from "@mui/material";


const theme = createTheme();


const LandingPage = () => {
    const IcuRef = useRef(null);
    const IcuProcessRef = useRef(null);
    const MedicineProcessRef = useRef(null);
    const ContactRef = useRef(null);
    const myRef = [IcuRef, IcuProcessRef, MedicineProcessRef, ContactRef]
    const handleScroll = (id) => {
        myRef[id].current?.scrollIntoView({ behavior: 'smooth' });
    }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [data, setData] = useState([]);
    const options = {
        method: 'GET',
        url: 'https://community-healthcaregov.p.rapidapi.com/api/glossary.json',
        headers: {
            'X-RapidAPI-Key': '6a0e55ac50msh338ffb061b88fadp1a97ebjsn25f3793d2513',
            'X-RapidAPI-Host': 'community-healthcaregov.p.rapidapi.com'
        }
    };

    useEffect(() => {
        axios.request(options)
        .then(res => {
            setData(res.data['glossary']);
            setLoading(false);
            console.log(res.data['glossary']);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        });
    }, [])

    const defaultProps = {
        center: {
          lat: 10.773383705915252,
          lng: 106.66015233336253
        },
        zoom: 16
    };
    const [page, setPage] = useState(1);
    const pageSize = 3;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = data.slice(startIndex, endIndex);

    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };

    const AnyReactComponent = ({ text }) => <div style={{width: 'max-content', color: 'red', fontSize: '10pxpx'}}>{text}</div>;

    return(
        <div style={{height: 'max-content'}}>
            <div className="LandingPage_Header">
                <img style={{height: '120px', marginLeft: '10%'}} src={logo}/>
                <div style={{marginLeft: '80%', marginTop: '50px'}}>
                    <Submit_button text = 'Login'/>
                </div>
                <nav style={{position: 'absolute', marginTop: '40px', marginLeft: '44%'}} class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div style={{fontSize: '20px', fontWeight: '600', color: '#111'}} class="navbar-nav">
                            <a onClick={() => {handleScroll(0)}} style={{margin: '0 10px', color: '#111', cursor: 'pointer'}} className="nav-link">ICU information</a>
                            <a onClick={() => {handleScroll(1)}} style={{margin: '0 10px', color: '#111', cursor: 'pointer'}} className="nav-link">ICU process</a>
                            <a onClick={() => {handleScroll(2)}} style={{margin: '0 10px', color: '#111', cursor: 'pointer'}} class="nav-link">Medicine process</a>
                            <a onClick={() => {handleScroll(3)}} style={{margin: '0 10px', color: '#111', cursor: 'pointer'}} class="nav-link">Contact us</a>
                        </div>
                        </div>
                    </div>
                </nav>
            </div>

            <div className="LandingPage_Body">
                <div ref={IcuRef} id="ICU" className="LandingPage_icu">
                    <div className="LandingPage_icu_img">
                        <img style={{position: 'absolute'}} src={doctor} alt="no img" />
                        <img style={{position: 'absolute', left: '390px'}} src={patient} alt="no img" />
                        <img style={{position: 'absolute', left: '230px', top: '200px'}}src={icu} alt="no img" />
                    </div>
                    <div style={{paddingRight: '200px', fontSize: '18px'}} className="LandingPage_icu_content">
                        <p style={{fontSize: '26px', fontWeight: '800'}}>Khoa Hồi sức tích cực</p>
                        <ul style={{fontSize: '20px', fontWeight: '500'}}>
                            <li>Khoa Hồi sức tích cực là khoa lâm sàng có nhiệm vụ tiếp tục điều trị và chăm sóc tích cực những người bệnh của khoa Cấp cứu và của các khoa lâm sàng trong bệnh
                                viện chuyển đến.</li>
                            <li>Phối hợp với khoa Cấp cứu tham gia cấp cứu ngoài bệnh viện và tại bệnh viện trong
                                tình huống xảy ra cấp cứu hàng loạt, cấp cứu thảm hoạ.</li>
                            <li>Phối hợp cùng với khoa Cấp cứu hỗ trợ chuyên môn cho hệ thống cấp cứu tại các
                                khoa khác trong bệnh viện.</li>
                            <li>Trường hợp người bệnh nặng vượt quá khả năng chuyên môn thì hội chẩn, mời
                                tuyến trên hỗ trợ hoặc chuyển người bệnh.</li>
                        </ul>
                        <Submit_button text='Read more...' />
                    </div>
                </div>
                <div ref={IcuProcessRef} id="ICUProcess" style={{height: '800px'}} className="LandingPage_process_doctor">
                    <div style={{padding: '200px 100px'}} className="LandingPage_process_doctor_content">
                        <img style={{width: '1000px'}} src={doctor_process} alt="no img" />
                        <div style={{marginTop: '50px', paddingLeft: '500px'}}>
                            <Submit_button text = 'Read more...'/>
                        </div>
                    </div>
                    <div className="LandingPage_process_doctor_img">
                        <img style={{position: 'absolute', right: '0'}} src={bg1} alt="no img" />
                        <img style={{position: 'absolute', right: '20px', top: '140px'}} src={doctor2} alt="no img" />
                    </div>
                </div>
                <div ref={MedicineProcessRef} id="MedicineProcess" className="LandingPage_process_medicine">
                    <div className="LandingPage_process_medicine_img">
                        <img style={{position: 'absolute'}} src={bg2} alt="no img" />
                        <img style={{position: 'absolute', top: '80px', left: '20px'}} src={medicine_process} alt="no img" />
                    </div>
                    <div style={{padding: '100px 200px'}} className="LandingPage_process_medicine_content">
                        <p style={{fontSize: '26px', fontWeight: '800'}}>Quy trình nghiên cứu thuốc</p>
                        <img src={medicine_process2} alt="no img" />
                        <div style={{marginTop: '20px', paddingLeft: '500px'}}>
                            <Submit_button text = 'Read more...'/>
                        </div>
                    </div>
                </div>
                <div style={{padding: '50px 20px', position: "relative" }} className="LandingPage_more_infor">
                    <ThemeProvider theme={theme}>
                        {
                            error ? <p>{error}</p> :
                            loading ? <p>loading...</p> :
                            slicedData.map(infor => (
                                <div style={{backgroundColor: 'rgba(62,54,176,0.2)', height: '360px', borderRadius: '10px', padding: '20px'}}>
                                    <h5>{infor['title']}</h5>
                                    <h6>{infor['date']}</h6>
                                    <div dangerouslySetInnerHTML={{__html:infor['content']}} style={{backgroundColor:"#fff", borderRadius: '10px', padding: '10px', height: '70%', overflow: 'hidden'}}>
                                    </div>
                                </div>
                            ))
                        }
                        <div className="pagination-landing-container">
                            <Pagination
                                count={Math.ceil(data.length / pageSize)}
                                page={page}
                                onChange={handleChangePage}
                                shape="rounded"
                                showFirstButton
                                showLastButton
                            >
                            </Pagination>
                        </div>
                    </ThemeProvider>
                </div>
            </div>
            <div ref={ContactRef} className="Landingpage_Footer">
                <div style={{padding: '50px 20px', position: 'relative'}}>
                    <img src={logo} alt="no img" />
                </div>
                <div className="Landingpage_Footer_contact" style={{padding: '50px 100px'}}>
                    <div className="Landingpage_Footer_contact_parent">
                        <div className="Landingpage_Footer_contact_child" style={{color: '#fff', fontSize: '18px', borderRight: '1px solid #fff', padding: '20px 20px 0 20px',}}>
                            <div style={{marginTop: '8px'}}>
                                <img src={phone} alt="no img" />
                            </div>
                            <div>
                                <p style={{marginBottom: '0'}}>Call us: +84 794 763 040</p>
                                <p>Hotline: +84 372 767 808</p>
                            </div>
                        </div>
                        <div className="Landingpage_Footer_contact_child" style={{color: '#fff', fontSize: '18px', paddingTop: '20px', paddingLeft: '50px'}}>
                            <div style={{marginTop: '8px'}}>
                                <img src={mail} alt="no img" />
                            </div>
                            <div>
                                <p style={{marginBottom: '0'}}>anhducduonghuynh@gmail.com</p>
                                <p>duc.duong122@hcmut.edu.vn</p>
                            </div>
                        </div>
                    </div>
                    <div className="Landingpage_Footer_contact_link">
                        <a href="https://www.facebook.com/duc.duong.332345/"><img src={facebook} alt="no img" /></a>
                        <img src={instagram} alt="no img" />
                        <img src={linkedin} alt="no img" />
                        <img src={telegram} alt="no img" />
                    </div>
                </div>
                <div style={{ height: '100%', width: '100%', padding: '20px' }}>
                    <GoogleMapReact 
                        bootstrapURLKeys={{ key: "" }}
                        defaultCenter={defaultProps.center}
                        defaultZoom={defaultProps.zoom}
                    >
                    <AnyReactComponent
                        lat={10.773383705915252}
                        lng={106.66015233336253}
                        text="Đại học BK"
                    />
                    </GoogleMapReact>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;