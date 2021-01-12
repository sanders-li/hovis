import React from 'react'
import axios from 'axios'
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';
import { StaticMap } from 'react-map-gl';
import { CircularProgress, Slide } from '@material-ui/core';
import { connect } from 'react-redux'
import chroma from 'chroma-js'

import { BASEMAP } from '@deck.gl/carto'

import Controls from '../Controls/Controls'
import Tooltip from '../Tooltip/Tooltip'
import TimeSlider from '../TimeSlider/TimeSlider'

import './App.css'

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
    this.getTooltipData = this.getTooltipData.bind(this)
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate(prevProps) {
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
    const all_metric_avgs = {}
    for (const metric in this.state.metricAvgs) {
      const metric_avgs = []
      for (let i=0;i<this.state.weeks.length;i++) {
        const n_d = this.state.sourceData[this.state.weeks[i]].reduce((acc, curr) => {
          return [acc[0]+curr[metric+'_n'], acc[1]+curr[metric+'_d']]
        }, [0,0])
        metric_avgs.push({ x: i, y: Math.round((n_d[0]/n_d[1]) * 10**4) / (10**2) })
      }
      all_metric_avgs[metric] = metric_avgs
    }
    
    this.setState({
      metricAvgs: all_metric_avgs,
      num_hospitals: this.state.sourceData[this.state.weeks[this.state.weeks.length-1]].length
    })
  }
  
  handleDashboard() {
    this.setState({ showDashboard: !this.state.showDashboard })
  }

  handleContrast() {
    const {highContrast} = this.state
    this.setState({
      highContrast: !highContrast,
      gradient: !highContrast ? chroma.scale(['0a2080', 'a95aa1', 'ffff00']).mode('hsl') : chroma.scale(['00ff00', 'ffff00', 'ff0000']).mode('hsl')
    })
  }

  setHoverInfo(info) {
    this.setState({hoverInfo: info})
  }

  getTooltipData(obj) {
    const data_series = []
    let estimated = false
    const {hospital_name, address} = obj
    for (let i=0;i<this.state.weeks.length;i++) {
      // Try to find hospital data for specific week
      const hospital = this.state.sourceData[this.state.weeks[i]].find(el => (el.hospital_name === hospital_name && el.address === address))
      let capacity = null
      if (hospital) {
        const estimate = hospital[this.state.metric + "_estimate"]
        let n = hospital[this.state.metric+'_n']
        let d = hospital[this.state.metric+'_d']
        if (estimate !== 'no_data' && n !== null && d !== null) {
          estimated = estimate ? true : false
          capacity = Math.round((n/d) * 10**4) / (10**2)
        }
      } 
      data_series.push({x: i, y: capacity})
    }
    const title = (this.state.icu ? 'ICU Bed ' : 'Inpatient Bed ') + 'Capacity, ' + (this.state.covid ? 'COVID-19' : 'Total') + (estimated ? '*' : '')
    return {data: data_series, title: title}
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
      const layers = [
        new ScatterplotLayer({
          id: 'scatter',
          data: this.state.sourceData[this.state.collection_week],
          stroked: true,
          filled: true,
          radiusMinPixels: 3,
          radiusMaxPixels: 10,
          radiusScale: 4000,
          getPosition: d => [d.lng, d.lat],
          lineWidthMinPixels: 1,
          lineWidthMaxPixels: 5,
          lineWidthScale: 1000,
          getLineColor: d => {
            if (d[this.state.metric+'_estimate'] !== 'no_data' && (d[this.state.metric+'_n'] !== null) && (d[this.state.metric+'_d'] !== null)) {
              return this.state.gradient(Math.min(Math.max((d[this.state.metric+'_n']/d[this.state.metric+'_d']), 0), 1)).rgb()
                .concat([255 * (Math.min(Math.max((d[this.state.metric+'_n']/d[this.state.metric+'_d']), 0), 1) * 0.8 + 0.2 )])
            } else {
              return [255,255,255,50]
            }
          },
          getFillColor: d => {
            if (d[this.state.metric+'_estimate'] !== 'no_data' && (d[this.state.metric+'_n'] !== null) && (d[this.state.metric+'_d'] !== null)) {
              return this.state.gradient(Math.min(Math.max((d[this.state.metric+'_n']/d[this.state.metric+'_d']), 0), 1)).rgb()
                .concat([255 * (Math.min(Math.max((d[this.state.metric+'_n']/d[this.state.metric+'_d']), 0), 1) * 0.8 + 0.2 )])
            } else {
              return [0,0,0,0]
            }
          },
          pickable: true,
          autoHighlight: true,
          highlightColor: [255,255,255,150],
          onHover: info => this.setHoverInfo(info),
          updateTriggers: {
            getPosition: this.state.metric,
            getLineColor: [this.state.metric, this.state.gradient],
            getFillColor: [this.state.metric, this.state.gradient]
          },
          /*
          // Following code prevents z-index fighting but disables highlighting
          parameters: {
            depthTest: false
          },
          */
          visible: this.state.scatterLayer,
        }),
        new HeatmapLayer({
          id: 'heatmap',
          data: this.state.sourceData[this.state.collection_week],
          getPosition: d => [d.lng, d.lat],
          getWeight: d => d[this.state.metric+'_n'] / d[this.state.metric+'_d'],
          radiusPixels: 40,
          opacity: 0.3,
          updateTriggers: {
            getPosition: this.state.metric,
            getWeight: this.state.metric
          },
          visible: this.state.heatmapLayer
        }),
        new HexagonLayer({
          id: 'hexagon',
          data: this.state.sourceData[this.state.collection_week],
          getPosition: d => [d.lng, d.lat],
          getElevationValue: d => {
            const n_d = d.reduce((acc, curr) => {
              let n = curr[this.state.metric+'_n']
              const d = curr[this.state.metric+'_d']
              if (n && d) {
                return [acc[0] + curr[this.state.metric+'_n'], acc[1] + curr[this.state.metric+'_d']]
              }
              return acc
            },[0,0])
            const metric = n_d[0]/n_d[1] || 0
            return Math.min(Math.max(metric, 0), 1)
          }, 
          getColorValue: d => {
            const n_d = d.reduce((acc, curr) => {
              const n = curr[this.state.metric+'_n']
              const d = curr[this.state.metric+'_d']
              if (n && d) {
                return [acc[0] + curr[this.state.metric+'_n'], acc[1] + curr[this.state.metric+'_d']]
              }
              return acc
            },[0,0])
            const metric = n_d[0]/n_d[1] || 0
            return Math.min(Math.max(metric, 0), 1)
          }, 
          elevationScale: 1000,
          extruded: true,
          radius: 16090*5,
          opacity: 0.4,
          updateTriggers: {
            getPosition: this.state.metric,
            getElevationWeight: this.state.metric
          },
          visible: this.state.hexagonLayer
        })
      ];
      return (
        <div className="app" onContextMenu={(e)=> e.preventDefault()}>
          <DeckGL
            initialViewState={INITIAL_VIEW_STATE}
            controller={true}
            layers={layers}
            getCursor={({isDragging}) => isDragging ? 'grabbing' : 'crosshair'}
            pickingRadius={10}
          >
            <StaticMap mapStyle={this.state.highContrast ? BASEMAP.VOYAGER : BASEMAP.DARK_MATTER} />
            {/*<StaticMap 
              mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} 
              mapStyle="mapbox://styles/mapbox/dark-v10" 
            />*/}
          </DeckGL>
            <Tooltip 
              show={(this.state.hoverInfo || {}).picked}
              hoverInfo={this.state.hoverInfo}
              weeks={this.state.weeks}
              collection_week={this.state.collection_week}
              getTooltipData={this.getTooltipData}
            />
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