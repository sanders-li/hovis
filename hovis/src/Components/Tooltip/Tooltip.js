import React from 'react'
import {
    FlexibleXYPlot,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    LineMarkSeriesCanvas,
    LineMarkSeries,
    Crosshair
  } from 'react-vis';
import './Tooltip.css'

const to_percent = (x) => {
    return Math.round(x * 10000) / 100
}

export default class Tooltip extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="tooltip" style={{left: this.props.x, top: this.props.y}}>
                <h1>{this.props.object.hospital_name}</h1>
                <h2>{this.props.object.address}, {this.props.object.city}, {this.props.object.state}, {this.props.object.zip}</h2>
                <div className="table">
                    <div className="stats">
                        <strong class='left'>Category</strong>
                        <strong>All</strong>
                        <strong>With COVID-19</strong>
                        <strong className='left'>Inpatient</strong>
                        <p>{to_percent(this.props.object.inpatient_occupancy)}%</p>
                        <p>{to_percent(this.props.object.inpatient_covid_occupancy)}%</p>
                        <strong className='left'>ICU</strong>
                        <p>{to_percent(this.props.object.icu_occupancy)}%</p>
                        <p>{to_percent(this.props.object.icu_covid_occupancy)}%</p>
                    </div>
                </div>
                <hr></hr>
                <p className="coord">({this.props.object.lat}, {this.props.object.lng})</p>
            </div>
        )
    }
}