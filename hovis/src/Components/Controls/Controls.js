import React from 'react';
import SwitchSelector from 'react-switch-selector'
import { Modal, Backdrop, Grow } from '@material-ui/core'
import './Controls.css'

export default class Controls extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showAbout: false
        }
        this._handleOpen = this._handleOpen.bind(this)
        this._handleClose = this._handleClose.bind(this)
    }

    _handleOpen() {
        this.setState({showAbout: true})
    }

    _handleClose() {
        this.setState({showAbout: false})
    }

    render() {
        return (
            <div id="controls">
                    <div id="icu" className="switch">
                        <SwitchSelector
                            onChange={this.props.handleICUSwitch}
                            options={[{label: 'Inpatient', value: false}, {label: 'ICU', value: true}]}
                            backgroundColor={"#353b48"}
                            fontColor={"#f5f6fa"}
                        />
                    </div>
                    <div id="covid" className="switch">
                        <SwitchSelector 
                            onChange={this.props.handleCovidSwitch}
                            options={[{label: 'All', value: false}, {label: 'COVID-19', value: true}]}
                            backgroundColor={"#353b48"}
                            fontColor={"#f5f6fa"}
                        />
                    </div>
                    <button id="about-button" onClick={this._handleOpen}>About</button>
                    <Modal
                        open={this.state.showAbout}
                        className="modal"
                        onClose={this._handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{timeout: 500,}}
                    >
                        <Grow in={this.state.showAbout}>
                            <div id="about">
                                <h2 id="about-title">About</h2>
                                <p>
                                    This map contains <b>{this.props.weeks.length} weeks</b> of hospital capacity data, 
                                    ranging from <b>{this.props.weeks[0]}</b> to <b>{this.props.weeks[this.props.weeks.length-1]}</b> over 
                                    an average of <b>{this.props.hospitals} hospitals</b> in the US.
                                </p>
                                <p>
                                    Data is sourced from <a href="https://healthdata.gov/dataset/covid-19-reported-patient-impact-and-hospital-capacity-facility" target="_blank">
                                        <b>COVID-19 Report Patient Impact and Hospital Capacity by Facility</b>
                                    </a> published by the US Department of Health and Human Services.
                                    More information can be found on the <a href="https://github.com/CareSet/COVID_Hospital_PUF"  target="_blank">CareSet Github.</a>
                                </p>
                                <p>
                                    For information regarding how these metrics were calculated, 
                                    please visit my <a href="https://github.com/sanders-li/hovis" target="_blank">Github</a>.
                                </p>
                                
                                <b>🏥 Enjoy!</b>
                                <hr></hr>
                                <p>
                                    Thanks to Jeff Delaney at <a href="https://fireship.io/" target="_blank">fireship.io</a> for project inspiration 
                                    and <a href="https://github.com/AdriSolid">AdriSolid</a> for React/Redux timeslider implementation. 
                                </p>
                                <p>
                                    Designed by <a href="https://github.com/sanders-li" target="_blank">Sanders Li</a> with 
                                    React, Redux, deck.gl, Mapbox, react-vis, and Material-UI
                                </p>
                            </div>
                        </Grow>
                    </Modal>
                    <button id='facilities' className={this.props.scatterLayer ? 'enabled' : 'disabled'} onClick={this.props.handleScatterToggle}>
                        <p className="emoji">🏥</p>
                        <p className="button-text">Facilities</p>
                    </button>
                    <button id='heatmap' className={this.props.heatmapLayer ? 'enabled' : 'disabled'} onClick={this.props.handleHeatmapToggle}>
                        <p className="emoji">🌡️</p>
                        <p className="button-text">Heatmap</p>
                    </button>
                    <button id='hexagon' className={this.props.hexagonLayer ? 'enabled' : 'disabled'} onClick={this.props.handleHexagonToggle}>
                        <p className="emoji">📊</p>
                        <p className="button-text">Hexagons</p>
                    </button>
            </div>
        )
    }
}