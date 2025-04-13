import React from "react"
import "../css/progress-bar.css"

const ProgressBar = ({index}) => {
  
  return (
    <div className="progress-bar">
    <div className={`progress-square-1 ${index >= 1 ? "active" : "off"}`}>
      {index >= 1 ? (<>&#10003;</>) : (<>&#10008;</>)}
    </div>
    <div className="progress-line-off"></div>
    <div className={`progress-line ${index >= 2 ? "active" : "off"}`}></div>
    <div className={`progress-square ${index >= 2 ? "active" : "off"}`}>
      {index >= 2 ? (<>&#10003;</>) : (<>&#10008;</>)}
    </div>
    <div className="progress-line-off"></div>
    <div className={`progress-line ${index >= 3 ? "active" : "off"}`}></div>
    <div className={`progress-square ${index >= 3 ? "active" : "off"}`}>
      {index >= 3 ? (<>&#10003;</>) : (<>&#10008;</>)}
    </div>
    <div className="progress-line-off"></div>
    <div className={`progress-line ${index >= 4 ? "active" : "off"}`}></div>
    <div className={`progress-square ${index === 4 ? "active" : "off"}`}>
      {index === 4 ? (<>&#10003;</>) : (<>&#10008;</>)}
    </div>
  </div>
  )
}

export default ProgressBar