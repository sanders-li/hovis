import React from 'react'
import axios from 'axios'
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';
import {StaticMap} from 'react-map-gl';
import { CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux'

import Controls from '../Controls/Controls'
import Tooltip from '../Tooltip/Tooltip'
import TimeSlider from '../TimeSlider/TimeSlider'

import './App.css'

const key = require('./keys.json').mapbox

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

class App extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      sourceData: {},
      collection_week: '',
      weeks: [],
      num_hospitals: 0,
      hoverInfo: {},
      icu: false,
      covid: false,
      metric: 'inpatient_occupancy',
      metricAvgs: {
        'inpatient_occupancy': 0, 
        'icu_occupancy': 0, 
        'inpatient_covid_occupancy': 0, 
        'icu_covid_occupancy': 0
      },
      scatterLayer: true,
      heatmapLayer: false,
      hexagonLayer: false
    }
    this.getData = this.getData.bind(this)
    this.setHoverInfo = this.setHoverInfo.bind(this)
    this.aggregateMetricAvgs = this.aggregateMetricAvgs.bind(this)
    this.handleICUSwitch = this.handleICUSwitch.bind(this)
    this.handleCovidSwitch = this.handleCovidSwitch.bind(this)
    this.handleMetricChange = this.handleMetricChange.bind(this)
    this.handleScatterToggle = this.handleScatterToggle.bind(this)
    this.handleHeatmapToggle = this.handleHeatmapToggle.bind(this)
    this.handleHexagonToggle = this.handleHexagonToggle.bind(this)
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate(prevProps) {
    console.log('App Updated:')
    console.log(this.state)
    if (prevProps.animationValue !== this.props.animationValue) {
      this.setState({ 
        collection_week: this.state.weeks[this.props.animationValue[0]] 
      })
    }
  }

  getData() {
    axios.get('./reported_hospital_capacity_admissions_facility_level_weekly_average_timeseries_20201215_metrics_grouped.json')
    .then(results => {
      this.setState({
        sourceData: results.data,
        weeks: Object.getOwnPropertyNames(results.data)
      }, () => {
        this.setState({
          collection_week: this.state.weeks[this.state.weeks.length - 1]
        })
        this.aggregateMetricAvgs()
      })
    })
  }

  aggregateMetricAvgs() {
    const metric_avgs = {}
    const hospitals_total = []
    for (const metric in this.state.metricAvgs) {
      const metric_avg = []
      let hospitals = 0
      for (let i=0;i<this.state.weeks.length;i++) {
        let n = 0;
        const total = this.state.sourceData[this.state.weeks[i]].reduce((acc, curr) => {
          hospitals++
          if (curr !== null) {
            n++
            return acc + curr[metric]
          } else {
            return acc
          }
        }, 0)
        metric_avg.push({ x: i, y: Math.round(total/n * 10 ** 4)/(10**2) })
      }
      hospitals_total.push(hospitals)
      metric_avgs[metric] = metric_avg
    }
    const hospitals_avg = Math.round(hospitals_total.reduce((acc, c) => acc + c) / hospitals_total.length)
    this.setState({
      metricAvgs: metric_avgs,
      num_hospitals: hospitals_avg
    })
  }

  setHoverInfo(info) {
    console.log(info)
    this.setState({hoverInfo: info})
  }

  handleICUSwitch(val) {
    console.log(val)
    this.setState({
      icu: val
    }, this.handleMetricChange)
  }

  handleCovidSwitch(val) {
    this.setState({
      covid: val
    }, this.handleMetricChange)
  }

  handleScatterToggle() {
    this.setState({ scatterLayer: !this.state.scatterLayer })
  }

  handleHeatmapToggle() {
    this.setState({ heatmapLayer: !this.state.heatmapLayer })
  }

  handleHexagonToggle() {
    this.setState({ hexagonLayer: !this.state.hexagonLayer })
  }

  handleMetricChange() {
    let metric = this.state.icu ? 'icu_' : 'inpatient_'
    metric += this.state.covid ? 'covid_' : ''
    this.setState({ metric: (metric + 'occupancy') })
  }

  render() {
    if (!this.state.collection_week || !this.state.sourceData) {
      return <div id='loading'><CircularProgress /></div>
    } else {
      const layers = [
        new ScatterplotLayer({
            id: 'scatter',
            data: this.state.sourceData[this.state.collection_week],
            opacity: 0.8,
            filled: true,
            radiusMinPixels: 3,
            radiusMaxPixels: 100,
            radiusScale: 100,
            getPosition: d => [d.lng, d.lat],
            getFillColor: d => rg_gradient(d.inpatient_occupancy),
          
            pickable: true,
            onHover: info => this.setHoverInfo(info)
        })
    ];
      return (
        <div className="app">
          {/*
          <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            layers={layers}
          >
            <StaticMap mapboxApiAccessToken={key} mapStyle="mapbox://styles/mapbox/dark-v10" />
          </DeckGL>
          {this.state.hoverInfo.object && (
            <Tooltip object={this.state.hoverInfo.object} x={this.state.hoverInfo.x} y={this.state.hoverInfo.y} />
          )}
          */}
          <div id="test">
            <div>{this.state.collection_week}</div>
            <div>{this.state.icu ? 'icu' : 'inpatient'}</div>
            <div>{this.state.covid ? 'covid' : 'all' }</div>
          </div>
          <div id="dashboard-container">
            <button className="toggle-dashboard" onClick={this.handleDashboard}>
              <icon className="fas fa-chevron-down"></icon>
            </button>
            <div id="dashboard">
              <Controls 
                handleICUSwitch={this.handleICUSwitch} 
                handleCovidSwitch={this.handleCovidSwitch} 
                handleScatterToggle={this.handleScatterToggle}
                handleHeatmapToggle={this.handleHeatmapToggle}
                handleHexagonToggle={this.handleHexagonToggle}
                scatterLayer={this.state.scatterLayer}
                heatmapLayer={this.state.heatmapLayer}
                hexagonLayer={this.state.hexagonLayer}
                weeks={this.state.weeks}
                hospitals={this.state.num_hospitals}
              />
              <TimeSlider 
                weeks={this.state.weeks} 
                collection_week={this.state.collection_week} 
                chartData={this.state.metricAvgs[this.state.metric]} 
              />
          </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    animationValue: state.animationPlayingReducer.value
  };
};

export default connect(mapStateToProps)(App);