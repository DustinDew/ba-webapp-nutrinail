import React from "react"
import "../css/progress-bar.css"
import check from "../assets/check.svg"
import cross from "../assets/cancel.svg"
const ProgressBar = ({index}) => {
  
  return (
    <div className="progress-bar">
    <div className={`progress-square-1 ${index >= 1 ? "active" : "off"}`}>
      {index >= 1 ? (<><img className="progress-icon" src={check} alt="check" /></>) : (<><img className="progress-icon" src={cross} alt="cross" /></>)}
    </div>
    <div className="progress-line-off"></div>
    <div className={`progress-line ${index >= 2 ? "active" : "off"}`}></div>
    <div className={`progress-square ${index >= 2 ? "active" : "off"}`}>
      {index >= 2 ? (<><img className="progress-icon" src={check} alt="check" /></>) : (<><img className="progress-icon" src={cross} alt="cross" /></>)}
    </div>
    <div className="progress-line-off"></div>
    <div className={`progress-line ${index >= 3 ? "active" : "off"}`}></div>
    <div className={`progress-square ${index >= 3 ? "active" : "off"}`}>
      {index >= 3 ? (<><img className="progress-icon" src={check} alt="check" /></>) : (<><img className="progress-icon" src={cross} alt="cross" /></>)}
    </div>
    <div className="progress-line-off"></div>
    <div className={`progress-line ${index >= 4 ? "active" : "off"}`}></div>
    <div className={`progress-square ${index === 4 ? "active" : "off"}`}>
      {index === 4 ? (<><img className="progress-icon" src={check} alt="check" /></>) : (<><img className="progress-icon" src={cross} alt="cross" /></>)}
    </div>
  </div>
  )
}

export default ProgressBar