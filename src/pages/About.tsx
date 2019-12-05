import React from 'react'

export const About: React.FC = () => {
    return (
        <div>
         ABOUT COMPONENT
         <div
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width:"100%",
          height:"15%",
          background: "linear-gradient(60deg,#29323c 0%,#485563 100%)",
          color:"white",
          textAlign:"center"
        }}
      >
     <p style= {{marginTop:"4%"}}>Created by Sanel Pajic</p>
      </div>
        </div>
    )
}