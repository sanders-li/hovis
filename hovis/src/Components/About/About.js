import React from 'react'

import './About.css'

export default function About(props) {
    return (
        <div id="about">
            <h2 id="about-title">About</h2>
            <p>
                This map contains <b>{props.weeks.length} weeks</b> of hospital capacity data, 
                beginning from <b>{props.weeks[0]}</b> and ending on <b>{props.weeks[props.weeks.length-1]}</b>. 
                The dataset presents the weekly data of <b>{props.hospitals} hospitals</b> in the US.
            </p>
            <p>
                Data is sourced from <a href="https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-facility" target="_blank" rel="noreferrer">
                    <b>COVID-19 Report Patient Impact and Hospital Capacity by Facility</b>
                </a> published by the US Department of Health and Human Services.
                More information can be found on the <a href="https://github.com/CareSet/COVID_Hospital_PUF"  target="_blank" rel="noreferrer">CareSet Github.</a>
            </p>
            <p>
                The two metrics presented are:
                <ul>
                    <li><b>Total capacity</b>: All Occupied Beds vs. All Staffed and Available Beds</li>
                    <li><b>COVID-19 occupancy proportion</b>: All Beds with Confirmed or Suspected COVID-19 Patients vs. All Occupied Beds</li>
                </ul>
                Metrics are separated between <b>inpatient</b> and <b>ICU</b> departments for each facility.
                No data is outlined but not colored. Metric calculations series requiring an estimate are marked with an asterisks (*).
            </p>
            <p>
                To view a specific week, click on the week label on the <b>Aggregated Nationwide Capacity</b> chart.
            </p>
            <p>
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