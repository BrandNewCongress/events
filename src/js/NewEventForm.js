// @flow

import React from 'react'
import Api from './api'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

type Props = {
  candidate: string,
  onRequestClose: () => void
}

type State = {
  submitStatus: 'NotAsked' | 'Pending' | 'Success' | 'Failure',
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
  },
}

const initialState : State = {
  details: {
    name: '',
    intro: '',
    hostName: '',
    hostEmail: '',
    hostPhone: '',
    date: undefined,
    startTime: undefined,
    endTime: undefined,
  },
  venue: {
    name: '',
    address: '',
    city: '',
    state: '',
  },
  submitStatus: 'NotAsked'
}

export default class NewEventForm extends React.Component<void, Props, State> {
  render() {
    return (
        <div
          ref={el => this.container = el}
          className="newEventModal"
          onClick={(e) => {
            if (e.target === this.container) {
              this.props.onRequestClose()
            }
          }}
        >
          <form
            className="newEventForm"
            onSubmit={this.submit}
          >
            <div className="newEventInputs">
              <div className="newEventDetails">
                <h3>Event Details</h3>
                {this.renderDetailsInput('text', 'Event Name', 'name', 'What is the name of the event?')}
                {this.renderDetailsInput('textarea', 'Description', 'intro', 'What should people know about the event?')}
                {this.renderDetailsInput('text', 'Host Name', 'hostName', 'Who is hosting the event?')}
                {this.renderDetailsInput('text', 'Host Email', 'hostEmail', 'Where can we contact the host by email?')}
                {this.renderDetailsInput('text', 'Host Phone', 'hostPhone', 'Where can we contact the host by phone?')}
                {this.renderDetailsInput('date', 'Event Date', 'date', '')}
                <div className="timeFields">
                  {this.renderDetailsInput('time', 'Start Time', 'startTime', '')}
                  {this.renderDetailsInput('time', 'End Time', 'endTime', '')}
                </div>
              </div>

              <div className="newEventVenue">
                <h3>Venue Details</h3>
                {this.renderVenueInput('Venue Name', 'name', 'What is the name of the venue?')}
                {this.renderVenueInput('Address', 'address', 'What is the venue address?')}
                {this.renderVenueInput('City', 'city', 'In what city is the venue located?')}
                {this.renderVenueInput('State', 'state', 'In what state is the venue located?')}
              </div>
            </div>

            <div className="newEventActions">
              <div className="buttonContainer">
                <button className="btn btn-default" onClick={() => this.props.onRequestClose()}>Cancel</button>
              </div>
              <div className="buttonContainer">
                <button className="btn btn-primary" onClick={this.submit}>Submit</button>
              </div>
            </div>
          </form>
        </div>
    )
  }

  state = initialState

  container: ?HTMLElement

  reset = () => {
    this.setState(initialState)
  }

  updateDetails = (property: string) => (ev: Event) => {
    this.setState({ details: { ...this.state.details, [property]: ev.target.value } })
  }

  updateVenue = (property: string) => (ev: Event) => {
    this.setState({ venue: { ...this.state.venue, [property]: ev.target.value } })
  }

  submit = (event: Event) => {
    event.preventDefault()
    this.setState({ submitStatus: 'Pending' })

    // Api.create.event({
    //   name: this.state.details.name,
    //   intro: this.state.details.intro,
    //   host_name: this.state.details.hostName,
    //   host_email: this.state.details.hostEmail,
    //   host_phone: this.state.details.hostPhone,
    //   start_time: new Date(this.state.details.date + " " + this.state.details.startTime).toISOString(),
    //   end_time: new Date(this.state.details.date + " " + this.state.details.endTime).toISOString(),
    //   venue: this.state.venue
    // })

    new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.8 ? reject() : resolve()
      }, 2000)
    })
    .then(() => { 
      this.setState({ submitStatus: 'Success' })
      this.props.onRequestClose()
    })
    .catch(() => {
      this.setState({ submitStatus: 'Failure' })
    })
  }

  renderDetailsInput(type: string, label: string, property: string, placeholder: string) {
    return (
      <div className="form-element">
        <label className="label">{label}</label>
        {(type === 'text') &&
          <input
            className="form-control"
            type={type}
            name={property}
            value={this.state.details[property]}
            onChange={this.updateDetails(property)}
          />
        }
        {type === 'textarea' &&
          <textarea
            className="form-control"
            name={property}
            value={this.state.details[property]}
            onChange={this.updateDetails(property)}
          >
          </textarea>
        }
        {type === 'date' &&
          <input
            className="form-control"
            type={type}
            name={property}
            value={this.state.details[property]}
            onChange={this.updateDetails(property)}
          />
        }
        {type === 'time' &&
          <input
            className="form-control"
            type={type}
            name={property}
            value={this.state.details[property]}
            onChange={this.updateDetails(property)}
          />
        }
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
