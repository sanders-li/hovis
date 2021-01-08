import React from 'react'
import {
    FlexibleXYPlot,
    XAxis,
    YAxis,
    LineSeriesCanvas,
    LineSeries,
    Crosshair
  } from 'react-vis';
import './Tooltip.css'

const to_percent = (x) => {
    return Math.round(x * 10000) / 100
}

export default class Tooltip extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: false
        }
    }

    render() {
        return (
            <div id="tooltip" style={{left: this.props.x, top: this.props.y}}> 
                <h1>{this.props.object.hospital_name}</h1>
                <h2>{this.props.object.address}, {this.props.object.city}, {this.props.object.state}, {this.props.object.zip}</h2>
                <hr></hr>
                <h3>{this.props.chartData.title}</h3>
                <div className="chart-container">
                    <FlexibleXYPlot
                        onMouseLeave={() => this.setState({value: false})}
                        yDomain={[0, 100]}
                    >
                        <XAxis 
                            tickFormat={v => this.props.weeks[v].slice(5)}
                            tickLabelAngle={90}
                            tickPadding={30}
                        />
                        <YAxis 
                            title="Capacity"
                        />
                        <LineSeries
                            data={this.props.chartData.data}
                            getNull={(d) => d.y !== null}
                            curve={"curveMonotoneX"}
                            onNearestX= {d => this.setState({value: [d]})}
                        />
                        {this.state.value && 
                            <Crosshair 
                                values={ this.state.value }
                                titleFormat={ d => ({
                                    title: 'Week',
                                    value: this.props.weeks[d[0].x],
                                })} 
                                itemsFormat={ d => [{
                                    title: 'Capacity',
                                    value: `${d[0].y}%`,
                                }]}
                            />
                        }
                    </FlexibleXYPlot>
                </div>
                <hr></hr>
                <p className="coord">({this.props.object.lat}, {this.props.object.lng})</p>
            </div>
        )
    }
}