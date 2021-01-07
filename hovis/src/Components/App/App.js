import React from 'react'
import axios from 'axios'
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';
import { StaticMap } from 'react-map-gl';
import { CircularProgress, Slide } from '@material-ui/core';
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import chroma from 'chroma-js'

import Controls from '../Controls/Controls'
import Tooltip from '../Tooltip/Tooltip'
import TimeSlider from '../TimeSlider/TimeSlider'

import './App.css'

const key = require('./keys.json').mapbox

// Viewport settings
const INITIAL_VIEW_STATE = {
    longitude: -94,
    latitude: 37,
    zoom: 3.5,
    pitch: 0,
    bearing: 0
};

class App extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      sourceData: {},
      collection_week: '',
      weeks: [],
      num_hospitals: 0,
      highContrast: false,
      gradient: chroma.scale(['00ff00', 'ffff00', 'ff0000']).mode('hsl'),
      showDashboard: true,
      icu: false,
      covid: false,
      metric: 'inpatient_occupancy',
      metricAvgs: {
        'inpatient_occupancy': 0, 
        'icu_occupancy': 0, 
        'inpatient_covid_occupancy': 0, 
        'icu_covid_occupancy': 0
      },
      hoverInfo: {},
      scatterLayer: true,
      heatmapLayer: false,
      hexagonLayer: false
    }
    this.getData = this.getData.bind(this)
    this.setHoverInfo = this.setHoverInfo.bind(this)
    this.aggregateMetricAvgs = this.aggregateMetricAvgs.bind(this)
    this.handleDashboard = this.handleDashboard.bind(this)
    this.handleContrast = this.handleContrast.bind(this)
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
    axios.get('./reported_hospital_capacity_admissions_facility_level_weekly_average_timeseries_20210103_metrics_grouped.json')
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
        hospitals_total.push(hospitals)
        metric_avg.push({ x: i, y: Math.round(total/n * 10**4) / (10**2) })
      }
      metric_avgs[metric] = metric_avg
    }
    const hospitals_avg = Math.round(hospitals_total.reduce((acc, c) => acc + c) / hospitals_total.length)
    this.setState({
      metricAvgs: metric_avgs,
      num_hospitals: hospitals_avg
    })
  }
  
  handleDashboard() {
    this.setState({ showDashboard: !this.state.showDashboard })
  }

  handleContrast() {
    const {highContrast} = this.state
    this.setState({
      highContrast: !highContrast,
      gradient: !highContrast ? chroma.scale(['0f2080', 'a95aa1', 'ffff00']).mode('hsl') : chroma.scale(['00ff00', 'ffff00', 'ff0000']).mode('hsl')
    })
  }

  setHoverInfo(info) {
    console.log(info)
    this.setState({hoverInfo: info})
  }

  getTooltipData(obj) {
    const data = []
    let estimate = false
    const {hospital_name, address} = obj
    for (let i=0;i<this.state.weeks.length;i++) {
      const data_point = this.state.sourceData[this.state.weeks[i]].reduce((arr, v) => {
          if (v.hospital_name === hospital_name && v.address === address) {
            if (v[this.state.metric + "_estimate"]) {
              estimate = true
            }
            arr.push({ x: i, y: Math.round(v[this.state.metric] * 10**4) / (10**2) });
          }
          return arr
        }, []).shift()
      data.push(data_point ? data_point : {x: i, y: 0})
    }
    const title = (this.state.icu ? 'ICU Bed ' : 'Inpatient Bed ') + 'Capacity, ' + (this.state.covid ? 'COVID-19' : 'Total') + (estimate ? '*' : '')
    return {data: data, title: title}
  }

  handleICUSwitch(val) {
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
    console.log(`metric is now ${metric}occupancy`)
  }

  render() {
    if (!this.state.collection_week || !this.state.sourceData) {
      return (
        <div id='loading'>
          <CircularProgress size="5rem"/>
          <h3>Loading 🏥 datapoints . . . </h3>
        </div>
      )
    } else {
      console.log('Update layers')
      const layers = [
        (this.state.scatterLayer && new ScatterplotLayer({
          id: 'scatter',
          data: this.state.sourceData[this.state.collection_week],
          colorFormat: 'RGB',
          opacity: 0.6,
          filled: true,
          radiusMinPixels: 3,
          radiusMaxPixels: 10,
          radiusScale: 3000,
          getPosition: d => [d.lng, d.lat],
          getFillColor: d => this.state.gradient(Math.min(Math.max(d[this.state.metric], 0), 1)).rgb(),
          pickable: true,
          onHover: info => this.setHoverInfo(info),
          updateTriggers: {
            getPosition: this.state.metric,
            getFillColor: [this.state.metric, this.state.gradient]
          }
        })),
        (this.state.heatmapLayer && new HeatmapLayer({
          id: 'heatmap',
          data: this.state.sourceData[this.state.collection_week],
          getPosition: d => [d.lng, d.lat],
          getWeight: d => d[this.state.metric],
          radiusPixels: 50,
          opacity: 0.4,
          updateTriggers: {
            getPosition: this.state.metric,
            getWeight: this.state.metric
          }
        })),
        (this.state.hexagonLayer && new HexagonLayer({
          id: 'hexagon',
          data: this.state.sourceData[this.state.collection_week],
          getPosition: d => [d.lng, d.lat],
          getElevationWeight: d => d[this.state.metric], //weight should be occupied/all for sum of all hospitals in hex
          elevationScale: 1000,
          extruded: true,
          radius: 16090,
          opacity: 0.6,
          updateTriggers: {
            getPosition: this.state.metric,
            getElevationWeight: this.state.metric
          }
        }))
      ];
      return (
        <div className="app">
          <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            layers={layers}
          >
            <StaticMap mapboxApiAccessToken={key} mapStyle="mapbox://styles/mapbox/dark-v10" />
          </DeckGL>
          {this.state.hoverInfo.object && (
            <Tooltip 
              object={this.state.hoverInfo.object}
              weeks={this.state.weeks}
              chartData={this.getTooltipData(this.state.hoverInfo.object)}
              x={this.state.hoverInfo.x} 
              y={this.state.hoverInfo.y} 
            />
          )}
          <div id="test">
            <div>{this.state.collection_week}</div>
            <div>{this.state.icu ? 'icu' : 'inpatient'}</div>
            <div>{this.state.covid ? 'covid' : 'all' }</div>
            <div>{layers.map(e => e.id).indexOf('scatter')}</div>
            <div>{layers.map(e => e.id).indexOf('heatmap')}</div>
            <div>{layers.map(e => e.id).indexOf('hexagon')}</div>
          </div>
          <div id="dashboard-container">
            <Controls 
              highContrast={this.state.highContrast}
              handleContrast={this.handleContrast}
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
            <div id="dashboard">
              <button className="toggle-dashboard" onClick={this.handleDashboard}>
                <i className={"fas fa-chevron-"+(this.state.showDashboard ? "down" : "up")}></i>
              </button>
              <Slide direction="up" in={this.state.showDashboard} mountOnEnter unmountOnExit>
                  <div id="timeslider-container">
                    <TimeSlider 
                      weeks={this.state.weeks} 
                      collection_week={this.state.collection_week} 
                      chartData={this.state.metricAvgs[this.state.metric]} 
                    />
                  </div>
              </Slide>
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