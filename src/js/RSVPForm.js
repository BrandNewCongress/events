// @flow

import React from 'react'
import Api from './api'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import muiTheme from './bnc-theme'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'
import RaisedButton from 'material-ui/RaisedButton'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

type Props = {
  candidate: string,
  onRequestClose: () => void
}

type State = {
  rsvp: {
    name: string,
    email: string,
    phone: string,
    guests_count: Number,
    volunteer: boolean
  }
}

const initialState: State = {
  rsvp: {
    name: '',
    email: '',
    phone: '',
    guests_count: 0,
    volunteer: false
  }
}

export default class NewEventForm extends React.Component<void, Props, State> {
  state = initialState

  container: ?HTMLElement

  reset = () => {
    this.setState(initialState)
  }

  update = (property: string) => (_: any, newValue: string | Date) => {
    this.setState({ rsvp: { ...this.state.details, [property]: newValue } })
  }

  submit = (event: Event) => {
    event.preventDefault()
    console.log(this.state)
    this.setState({ submitStatus: 'Pending' })

    Api.create.rsvp(this.props.eventId, this.state.rsvp)

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

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div
          ref={el => (this.container = el)}
          className="rsvpModal"
          onClick={e => {
            if (e.target === this.container) {
              this.props.onRequestClose()
            }
          }}
        >
          <form className="rsvpForm" onSubmit={this.submit}>

            <div className="rsvpInputs">
              <h3>RSVP</h3>
              <TextField
                name="name"
                value={this.state.rsvp.name}
                onChange={this.update('name')}
                floatingLabelText="Name"
                fullWidth
              />
              <TextField
                name="phone"
                value={this.state.rsvp.phone}
                onChange={this.update('phone')}
                floatingLabelText="Phone"
                fullWidth
              />
              <Checkbox
                name="volunteer"
                checked={this.state.rsvp.volunteer}
                onCheck={this.update('volunteer')}
                label="I can volunteer to help set up the event"
                labelPosition="left"
              />
              <TextField
                name="phone"
                value={this.state.rsvp.phone}
                onChange={this.update('phone')}
                floatingLabelText="Phone"
                fullWidth
              />
              {this.renderDetailsInput(
                'text',
                'Name',
                'name',
                "What's your name?"
              )}
              {this.renderDetailsInput(
                'text',
                'Phone',
                'phone',
                "What's your phone number?"
              )}
              {this.renderDetailsInput(
                'boolean',
                'Volunteer',
                'volunteer',
                'Can you volunteer to help run the event?'
              )}
              {this.renderDetailsInput(
                'number',
                'Guest Count',
                'guest_count',
                'How many extra guests are you bringing?'
              )}
            </div>

            <div className="rsvpActions">
              <div className="buttonContainer">
                <RaisedButton
                  onClick={() => this.props.onRequestClose()}
                  fullWidth
                >
                  Cancel
                </RaisedButton>
              </div>
              <div className="buttonContainer">
                <RaisedButton primary onClick={this.submit} fullWidth>
                  Submit
                </RaisedButton>
              </div>
            </div>
          </form>
        </div>
      </MuiThemeProvider>
    )
  }
}
