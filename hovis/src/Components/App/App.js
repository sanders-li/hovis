import React from 'react'

import Map from '../Map/Map'
import Controls from '../Controls/Controls'

import './App.css'
// Set your mapbox access token here

const sourceData = './reported_hospital_capacity_admissions_facility_level_weekly_average_timeseries_20201215_metrics.json'

/*
const scatterplot = new ScatterplotLayer({
  id: 'scatter',
  data: sourceData,
  opacity: 0.8,
  filled: true,
  radiusMinPixels: 3,
  radiusMaxPixels: 5,
  getPosition: d => [d.lng, d.lat],
  getFillColor: d => rg_gradient(d.inpatient_occupancy),

  pickable: true,
  onHover: ({object, x, y}) => {
    const el = document.getElementById('tooltip')
    if (object) {
      el.style.display = 'block';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    } else {
      el.style.display = 'none'
    }
  }
})
*/

export default class App extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {}
  }

  render() {
    return (
      <div className="app">
        <Map />
        <Controls />
      </div>
    );
  }
}
