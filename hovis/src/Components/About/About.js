import React from 'react'

import './About.css'

export default function About(props) {
    return (
        <div id="about">
            <h2 id="about-title">About</h2>
            <p>
                This map contains <b>{props.weeks.length} weeks</b> of hospital capacity data, 
                beginning from <b>{props.weeks[0]}</b> and ending on <b>{props.weeks[props.weeks.length-1]}</b>. 
                The dataset presents a total of <b>{props.hospitals} hospitals</b> in the US.
            </p>
            <p>
                Data is sourced from <a href="https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-facility" target="_blank" rel="noreferrer">
                    <b>COVID-19 Report Patient Impact and Hospital Capacity by Facility</b>
                </a> published by the US Department of Health and Human Services.
                More information can be found on the <a href="https://github.com/CareSet/COVID_Hospital_PUF"  target="_blank" rel="noreferrer">CareSet Github.</a>
            </p>
            <p>
                Metric calculations requiring an estimate are marked with an asterisks (*).
                For information regarding how these metrics were calculated, 
                please visit my <a href="https://github.com/sanders-li/hovis" target="_blank" rel="noreferrer">Github</a>.
            </p>
            
            <b>🏥 Enjoy!</b>
            <hr></hr>
            <p>
                Designed by <a href="https://github.com/sanders-li" target="_blank" rel="noreferrer">Sanders Li</a> with 
                Python, React, Redux, deck.gl, react-vis, and Material-UI
            </p>
        </div>
    )
}