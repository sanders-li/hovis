import React from 'react'
import { Slider } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
    XYPlot,
    FlexibleXYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    LineMarkSeriesCanvas,
    LineMarkSeries,
    LineSeriesCanvas,
    LineSeries,
    Crosshair
  } from 'react-vis';
import 'react-vis/dist/style.css';
import {styles} from './styles'
import { animationResponse } from '../../actions/animationResponse'
import './TimeSlider.css'

class TimeSlider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            collection_week: this.props.collection_week,
            weeks: this.props.weeks,
            week_idx: this.props.weeks.length-1,
            max_week_idx: this.props.weeks.length-1,
            stepDuration: 300,
            intervalSetter: null,
            isPlaying: false,
            playOrPause: 'play',
            value: false,
        }
        this._handleSliderChange = this._handleSliderChange.bind(this)
        this._resetSlider = this._resetSlider.bind(this)
        this._handleAnimation = this._handleAnimation.bind(this)
        this._animate = this._animate.bind(this)
        this._handlePlay = this._handlePlay.bind(this)
        this._handlePause = this._handlePause.bind(this)
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalSetter)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.collection_week !== this.props.collection_week) {
            this.setState({
                collection_week: this.props.collection_week
            })
        }
    }

    _handleSliderChange(t, idx) {
        this.setState({ 
            week_idx: idx,
            collection_week: this.state.weeks[idx]
        })
        this.props.animationResponse('animation-value', [idx, this.state.max_week_idx])
    }

    _resetSlider() {
        this.setState({ week_idx: 0 })
        this.props.animationResponse('animation-value', [0, this.state.max_week_idx])
    }

    _handleAnimation() {
        this.state.playOrPause === 'play' ? this._handlePlay() : this._handlePause();
    }

    _animate() {
        if (this.state.week_idx < this.state.max_week_idx) {
            this.setState({
                week_idx: this.state.week_idx + 1,
                isPlaying: true
            }, () => {
                this.props.animationResponse('animation-value', [this.state.week_idx, this.state.max_week_idx])
            })
        }
        if (this.state.week_idx === this.state.max_week_idx) {
            this._handlePause()
        }
    }

    _handlePlay() {
        this.setState({
            intervalSetter: setInterval(this._animate, this.state.stepDuration),
            playOrPause: 'pause'
        })
    }

    _handlePause() {
        clearInterval(this.state.intervalSetter)
        this.setState({
            isPlaying: false,
            playOrPause: 'play'
        })
    }

    render() {
        return (
            <div id="time-slider">
                <div className="controls">
                    <button onClick={this._resetSlider}>
                        <i className="fas fa-undo"></i>
                    </button>
                    <button onClick={this._handleAnimation}>
                        <i className={`fas fa-${this.state.playOrPause}`}></i>
                    </button>
                </div>
                <div className="slider-chart-container">
                    <div className="chart-container">
                        <FlexibleXYPlot
                            onMouseLeave={() => this.setState({value: false})}
                            yDomain={[0, 100]}
                        >
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <YAxis 
                                title="Capacity"
                            />
                            <LineMarkSeries
                                data={this.props.chartData}
                                curve={"curveMonotoneX"}
                                onNearestX= {d => this.setState({value: [d]})}
                                animation={true}
                            />
                            {this.state.value && 
                                <Crosshair 
                                    values={ this.state.value }
                                    titleFormat={ d => ({
                                        title: 'Week',
                                        value: this.state.weeks[d[0].x],
                                    })} 
                                    itemsFormat={ d => [{
                                        title: 'Capacity',
                                        value: `${d[0].y}%`,
                                    }]}
                                />
                            }
                        </FlexibleXYPlot>
                    </div>
                    <div className="slider-container">
                        <Slider 
                            className="slider"
                            value={this.state.week_idx}
                            onChange={this._handleSliderChange}
                            min={0}
                            max={this.state.max_week_idx}
                            step={1}
                            marks={ this.props.weeks.map((v,i) => {return {value: i, label: v}}) }
                            track={false}
                        />
                    </div>
                    {/*
                    <div className="slider-labels">
                        {this.props.weeks && this.props.weeks.map((v,i) => <div className="labels" key={`label-${i}`}>{v}</div>)}
                    </div>
                    */}
                </div>
            </div>
        )
    }
}

const matchDispatchToProps = dispatch => {
    return bindActionCreators({ animationResponse: animationResponse }, dispatch)
}
  
export default connect(null, matchDispatchToProps)(withStyles(styles)(TimeSlider))