import React from 'react';
import SwitchSelector from 'react-switch-selector'
import { Modal, Backdrop, Grow } from '@material-ui/core'

import About from '../About/About'
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
                <button id="color-toggle" className={this.props.highContrast ? "enabled" : "disabled"} onClick={this.props.handleContrast}>
                    <i className="fas fa-adjust"></i>
                </button>
                <button id="about-button" onClick={this._handleOpen}>About</button>
                <Modal
                    open={this.state.showAbout}
                    className="modal"
                    onClose={this._handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{timeout: 500}}
                >
                    <Grow in={this.state.showAbout}>
                        <About weeks={this.props.weeks} hospitals={this.props.hospitals} />
                    </Grow>
                </Modal>
                <div id="bed-label" className="switch-label">
                    Bed Type: 
                </div>
                <div id="icu" className="switch">
                    <SwitchSelector
                        onChange={this.props.handleICUSwitch}
                        options={[{label: 'Inpatient', value: false}, {label: 'ICU', value: true}]}
                        backgroundColor={"#353b48"}
                        fontColor={"#f5f6fa"}
                    />
                </div>
                <div id="patient-label" className="switch-label">
                    Patients: 
                </div>
                <div id="covid" className="switch">
                    <SwitchSelector 
                        onChange={this.props.handleCovidSwitch}
                        options={[{label: 'All', value: false}, {label: 'COVID-19 Only', value: true}]}
                        backgroundColor={"#353b48"}
                        fontColor={"#f5f6fa"}
                    />
                </div>
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