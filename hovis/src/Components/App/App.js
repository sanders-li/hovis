import React from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';
import {StaticMap} from 'react-map-gl';
import Controls from '../Controls/Controls'

import './App.css'
// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoic2FuZGVyc2wiLCJhIjoiY2tpeHRrMzBsMmVzczJ6bHJ6cHE5ODA1bCJ9.BBuObr2tGBkIXpVlQwJX2w';

const sourceData = './reported_hospital_capacity_admissions_facility_level_weekly_average_timeseries_20201215_metrics.json'

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -95,
  latitude: 37,
  zoom: 4,
  pitch: 0,
  bearing: 0
};


const rg_gradient = (percent) => {
  let percent_clamped = Math.min(Math.max(percent, 0), 1);
  let r, g;
  if (percent_clamped < 0.5) {
  	r = (percent_clamped)/0.5; g = 1;
  } else if (percent_clamped > 0.5) {
  	r = 1; g = (percent_clamped-0.5)/0.5
  } else {
  	r = 1; g = 1;
  }
  return [255 * r, 255 * g, 0]
}

const to_percent = (x) => {
  return Math.round(x * 10000) / 100
}

//const [hoverInfo, setHoverInfo] = useState;
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
      el.innerHTML = `
        <h1>${object.hospital_name}</h1>
        <h2>${object.address}, ${object.city}, ${object.state}, ${object.zip}</h2>
        <div class="table">
          <div class="stats">
            <strong class='left'>Category</strong>
            <strong>All</strong>
            <strong>COVID</strong>
            <strong class='left'>Inpatient</strong>
            <p>${to_percent(object.inpatient_occupancy)}%</p>
            <p>${to_percent(object.inpatient_covid_occupancy)}%</p>
            <strong class='left'>ICU</strong>
            <p>${to_percent(object.icu_occupancy)}%</p>
            <p>${to_percent(object.icu_covid_occupancy)}%</p>
          </div>
        </div>
        <hr>
        <p class="coord">(${object.lat}, ${object.lng})</p>
      `
      el.style.display = 'block';
      el.style.opacity = 0.9;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    } else {
      el.style.display = 'none'
    }
  }
})

const heatmap = new HeatmapLayer({
  id: 'heat',
  data: sourceData,
  getPosition: d => [d.lng, d.lat],
  getWeight: d => d.inpatient_occupancy,
  radiusPixel: 30,
})

export default class App extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {}
    this.layers = [
      scatterplot
    ];
  }
  
  render() {
    return (
      <div className="app">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={this.layers}
        >
          <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
        </DeckGL>
        <div id="tooltip"></div>
        <Controls />
      </div>
    );
  }
}
