import React from "react";

import Navbar from "./navbar";
import Hero from "./hero_section";
import About from "./about";
import MockInterview from "./mock_interview";
import AITools from "./ai_tools";
import Testimonial from "./testimonial";
import Contact from "./contact";
import Footer from "./footer";


const Home = () => {
   return (
     <>
       <Navbar/>
       <Hero/>
       <About/>
       <MockInterview/>
       <AITools/>
       <Testimonial/>
       <Contact/>
       <Footer/>
     </>
   );
 };
 
 export default Home;
 