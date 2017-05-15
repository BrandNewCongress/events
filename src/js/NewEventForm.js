// @flow

import React from 'react'
import Api from './api'

type Props = {
  candidate: string,
  onRequestClose: () => void
}

type State = {
  details: {
    name: string,
    intro: string,
    hostName: string,
    hostEmail: string,
    hostPhone: string,
    date: Date,
    startTime: Date,
    endTime: Date
  },
  venue: {
    name: string,
    address: string,
    city: string,
    state: string
  }
}

const initialState: State = {
  candidateOptions: [],
  candidate: 'General Brand New Congress',
  details: {
    name: undefined,
    intro: undefined,
    hostName: undefined,
    hostEmail: undefined,
    hostPhone: undefined,
    date: undefined,
    startTime: undefined,
    endTime: undefined
  },
  venue: {
    name: undefined,
    address: undefined,
    city: undefined,
    state: undefined
  },
  submitStatus: ''
}

export default class NewEventForm extends React.Component<void, Props, State> {
  render() {
    return (
      <div
        ref={el => (this.container = el)}
        className="newEventModal"
        onClick={e => {
          if (e.target === this.container) {
            this.props.onRequestClose()
          }
        }}
      >
        <form className="newEventForm">
          <div className="newEventInputs">
            <div className="newEventDetails">
              <h3>Event Details</h3>
              <div className="form-element">
                <label className="label"> Candidate </label>
                <select
                  style={{
                    marginBottom: 10
                  }}
                  className="btn dropdown-toggle"
                  value={this.state.candidate}
                  onChange={ev => this.setState({ candidate: ev.target.value })}
                >
                  {this.state.candidateOptions.map(c => (
                    <option value={c}>{c}</option>
                  ))}
                </select>
              </div>
              {this.renderDetailsInput(
                'text',
                'Event Name',
                'name',
                'What is the name of the event?'
              )}
              {this.renderDetailsInput(
                'textarea',
                'Description',
                'intro',
                'What should people know about the event?'
              )}
              {this.renderDetailsInput(
                'text',
                'Host Name',
                'hostName',
                'Who is hosting the event?'
              )}
              {this.renderDetailsInput(
                'text',
                'Host Email',
                'hostEmail',
                'Where can we contact the host by email?'
              )}
              {this.renderDetailsInput(
                'text',
                'Host Phone',
                'hostPhone',
                'Where can we contact the host by phone?'
              )}
              {this.renderDetailsInput('date', 'Event Date', 'date', '')}
              <div className="timeFields">
                {this.renderDetailsInput('time', 'Start Time', 'startTime', '')}
                {this.renderDetailsInput('time', 'End Time', 'endTime', '')}
              </div>
              <div className="form-element">
                <label className="label"> Time Zone </label>
                <select
                  style={{
                    marginBottom: 10
                  }}
                  className="btn dropdown-toggle"
                  value={this.state.details.time_zone}
                  onChange={ev =>
                    this.setState({
                      details: {
                        ...this.state.details,
                        time_zone: ev.target.value
                      }
                    })}
                >
                  {[
                    'Pacific Time (US & Canada)',
                    'Mountain Time (US & Canada)',
                    'Central Time (US & Canada)',
                    'Eastern Time (US & Canada)'
                  ].map(c => <option value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="newEventVenue">
              <h3>Venue Details</h3>
              {this.renderVenueInput(
                'Venue Name',
                'name',
                'What is the name of the venue?'
              )}
              {this.renderVenueInput(
                'Address',
                'address',
                'What is the venue address?'
              )}
              {this.renderVenueInput(
                'City',
                'city',
                'In what city is the venue located?'
              )}
              {this.renderVenueInput(
                'State',
                'state',
                'In what state is the venue located?'
              )}
            </div>
          </div>

          <div className="newEventActions">
            <div className="buttonContainer">
              <button
                className="btn btn-default"
                onClick={() => this.props.onRequestClose()}
              >
                Cancel
              </button>
            </div>
            <div className="buttonContainer">
              <button className="btn btn-primary" onClick={this.submit}>
                Submit
              </button>
            </div>
          </div>

          <div style={{
              textAlign: 'center',
              fontSize: 'larger'
            }}
          >
            {this.state.submitStatus}
          </div>
        </form>
      </div>
    )
  }

  componentDidMount() {
    Api.get
      .candidates()
      .then(candidateOptions => this.setState({ candidateOptions }))
  }

  state = initialState

  container: ?HTMLElement

  reset = () => {
    this.setState(initialState)
  }

  updateDetails = (property: string) => (ev: Event) => {
    this.setState({
      details: { ...this.state.details, [property]: ev.target.value }
    })
  }

  updateVenue = (property: string) => (ev: Event) => {
    this.setState({
      venue: { ...this.state.venue, [property]: ev.target.value }
    })
  }

  submit = (event: Event) => {
    event.preventDefault()

    Api.create
      .event(this.state.candidate, {
        name: this.state.details.name,
        intro: this.state.details.intro,
        host_name: this.state.details.hostName,
        host_email: this.state.details.hostEmail,
        host_phone: this.state.details.hostPhone,
        start_time: this.state.details.date +
          ' ' +
          this.state.details.startTime,
        end_time: this.state.details.date + ' ' + this.state.details.endTime,
        time_zone: this.state.details.time_zone,
        venue: this.state.venue
      })
      .then(body => {
        this.setState({ submitStatus: 'Success' })
        setTimeout(() => this.props.onRequestClose(), 1000)
      })
      .catch(err => {
        this.setState({ submitStatus: err.message })
      })
  }

  renderDetailsInput(
    type: string,
    label: string,
    property: string,
    placeholder: string
  ) {
    return (
      <div className="form-element">
        <label className="label">{label}</label>
        {type === 'text' &&
          <input
            className="form-control"
            type={type}
            name={property}
            value={this.state.details[property]}
            onChange={this.updateDetails(property)}
          />}
        {type === 'textarea' &&
          <textarea
            className="form-control"
            name={property}
            value={this.state.details[property]}
            onChange={this.updateDetails(property)}
          />}
        {type === 'date' &&
          <input
            className="form-control"
            type={type}
            name={property}
            value={this.state.details[property]}
            onChange={this.updateDetails(property)}
          />}
        {type === 'time' &&
          <input
            className="form-control"
            type={type}
            name={property}
            value={this.state.details[property]}
            onChange={this.updateDetails(property)}
          />}
      </div>
    )
  }

  renderVenueInput(label: string, property: string, placeholder: string) {
    return (
      <div className="form-element">
        <label className="label">{label}</label>
        <input
          type="text"
          name={property}
          value={this.state.venue[property]}
          placeholder={placeholder}
          onChange={this.updateVenue(property)}
        />
      </div>
    )
  }
}
