import React from 'react'
import {
    FlexibleXYPlot,
    XAxis,
    YAxis,
    LineSeriesCanvas,
    Crosshair
  } from 'react-vis';
import './Tooltip.css'

export default class Tooltip extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: false,
            x: 0,
            y: 0,
            name: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lat: '',
            lng: '',
            chartData: {}
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.hoverInfo.object) {
            const chartData = nextProps.getTooltipData(nextProps.hoverInfo.object)
            return {
                x: nextProps.hoverInfo.x,
                y: nextProps.hoverInfo.y,
                name: nextProps.hoverInfo.object.hospital_name,
                address: nextProps.hoverInfo.object.address,
                city: nextProps.hoverInfo.object.city,
                state: nextProps.hoverInfo.object.state,
                zip: nextProps.hoverInfo.object.zip,
                lat: nextProps.hoverInfo.object.lat,
                lng: nextProps.hoverInfo.object.lng,
                title: chartData.title,
                data: chartData.data
            }
        } else {
            return null
        }
    }
    
    render() {
        return (
            <div 
                id="tooltip" 
                style={{
                    left: this.state.x, 
                    top: this.state.y, 
                    opacity: this.props.show ? 0.9 : 0,
                    pointerEvents: this.props.show ? 'auto' : 'none'
                }}
            > 
                <h1>{this.state.hospital_name}</h1>
                <h2>{this.state.address}, {this.state.city}, {this.state.state}, {this.state.zip}</h2>
                <hr></hr>
                <h3>{this.state.title}</h3>
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
                        <LineSeriesCanvas
                            data={this.state.data}
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
                <p className="coord">({this.state.lat}, {this.state.lng})</p>
            </div>
        )
    }
}