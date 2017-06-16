import React, { Component } from 'react'
import enUS from 'antd/lib/locale-provider/en_US'
import {
  Button,
  Col,
  DatePicker,
  Input,
  LocaleProvider,
  Modal,
  Select,
  TimePicker,
  message
} from 'antd'
const { Option, OptGroup } = Select
const InputGroup = Input.Group
import Api from './api'
import States from './states'

const initialState = {
  candidateOptions: [],
  candidate: 'Brand New Congress',
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
  submitStatus: false
}

export default class NewEventForm extends Component {
  state = Object.assign({}, initialState)

  reset = () => {
    this.setState(initialState)
  }

  componentDidMount() {
    Api.get
      .candidates()
      .then(candidateOptions => this.setState({ candidateOptions }))
  }

  updateDetails = property => ev => {
    if (typeof ev == 'string') {
      this.setState({
        details: { ...this.state.details, [property]: ev }
      })
    } else if (ev._isAMomentObject) {
      this.setState({
        details: { ...this.state.details, [property]: ev }
      })
    } else {
      this.setState({
        details: { ...this.state.details, [property]: ev.target.value }
      })
    }
  }

  updateVenue = property => ev => {
    if (typeof ev == 'string') {
      this.setState({
        venue: { ...this.state.venue, [property]: ev }
      })
    } else if (ev._isAMomentObject) {
      this.setState({
        venue: { ...this.state.venue, [property]: ev }
      })
    } else {
      this.setState({
        venue: { ...this.state.venue, [property]: ev.target.value }
      })
    }
  }

  submit = event => {
    event.preventDefault()
    this.setState({ submitStatus: true })

    try {
      const start_time = this.state.details.date
      const end_time = start_time.clone()

      start_time.hours(this.state.details.startTime.hours())
      start_time.minutes(this.state.details.startTime.minutes())
      end_time.hours(this.state.details.endTime.hours())
      end_time.minutes(this.state.details.endTime.minutes())

      Api.create
        .event(this.state.candidate, {
          name: this.state.details.name,
          intro: this.state.details.intro,
          host_name: this.state.details.hostName,
          host_email: this.state.details.hostEmail,
          host_phone: this.state.details.hostPhone,
          start_time: start_time.format(),
          end_time: end_time.format(),
          time_zone: this.state.details.time_zone,
          venue: this.state.venue
        })
        .then(body => {
          this.setState(
            Object.assign({}, initialState, {
              submitStatus: false,
              candidate: this.state.candidate,
              candidateOptions: this.state.candidateOptions
            })
          )

          const timeoutClose = () => setTimeout(this.props.onRequestClose, 500)

          message.success(
            `Successfully submitted!\nYou'll be contacted soon by our organizers.`,
            1.5,
            timeoutClose
          )
        })
        .catch(err => {
          message.error(err.message)
          this.setState({ submitStatus: err.message })
        })
    } catch (err) {
      console.error(err)
      message.error(
        'Invalid date – make sure you have filled out Event Date, Start Time, and End Time'
      )
      return this.setState({
        submitStatus:
          'Invalid date – make sure you have filled out Event Date, Start Time, and End Time'
      })
    }
  }

  close = () => this.props.onRequestClose()

  render() {
    const {
      candidateOptions,
      candidate,
      details,
      venue,
      submitStatus
    } = this.state

    const footer = (
      <div className="newEventActions">
        <div className="buttonContainer">
          <Button size="large" onClick={this.close}>
            Cancel
          </Button>
        </div>
        <div className="buttonContainer">
          <Button
            size="large"
            onClick={this.submit}
            loading={submitStatus === true}
            style={{ backgroundColor: '#7932AC', color: 'white' }}
          >
            Submit
          </Button>
        </div>
      </div>
    )

    return (
      <LocaleProvider locale={enUS}>
        <Modal
          title="Host an Event"
          visible={true}
          onOk={this.submit}
          okText="Submit"
          onCancel={() => this.props.onRequestClose()}
          footer={footer}
          width={650}
          className="newEventModal"
          style={{
            top: 20
          }}
        >
          <form
            style={{
              maxHeight: '80%',
              overflowY: 'scroll'
            }}
          >
            <div className="newEventInputs">
              <div className="newEventDetails">
                <h3 style={{ fontWeight: 'bold' }}>Event Details</h3>
                <div className="form-element">
                  <label> Candidate </label>
                  <Select
                    size="large"
                    value={candidate}
                    onChange={val => this.setState({ candidate: val })}
                  >
                    <OptGroup label="General">
                      <Option value="Brand New Congress">
                        Brand New Congress
                      </Option>
                    </OptGroup>
                    <OptGroup label="Specific Candidate">
                      {candidateOptions
                        .filter(v => v != 'General Brand New Congress')
                        .sort()
                        .map((c, idx) =>
                          <Option key={idx} value={c}>{c}</Option>
                        )}
                    </OptGroup>
                  </Select>
                </div>
                <br />
                {this.renderDetailsInput(
                  'text',
                  'Event Name',
                  'name',
                  'Weekend Canvassing'
                )}
                <br />
                {this.renderDetailsInput(
                  'textarea',
                  'Description',
                  'intro',
                  `Let's meet at the Starbucks on West Street, and knock doors throughout the neighborhood`
                )}
                <br />
                {this.renderDetailsInput(
                  'text',
                  'Your Name',
                  'hostName',
                  'First Last'
                )}
                <br />
                {this.renderDetailsInput(
                  'text',
                  'Your Email',
                  'hostEmail',
                  'your.email@email.com'
                )}
                <br />
                {this.renderDetailsInput(
                  'text',
                  'Your Phone',
                  'hostPhone',
                  '892-555-2013'
                )}
                <br />
                {this.renderDetailsInput('date', 'Event Date', 'date', '')}
                <br />
                <div className="timeFields">
                  {this.renderDetailsInput(
                    'time',
                    'Start Time',
                    'startTime',
                    ''
                  )}
                  <br />
                  {this.renderDetailsInput('time', 'End Time', 'endTime', '')}
                </div>
                <br />
                <div className="form-element">
                  <label> Time Zone </label>
                  <Select
                    size="large"
                    value={details.time_zone}
                    onChange={ev =>
                      this.setState({
                        details: {
                          ...this.state.details,
                          time_zone: ev
                        }
                      })}
                  >
                    {[
                      'Pacific Time (US & Canada)',
                      'Mountain Time (US & Canada)',
                      'Central Time (US & Canada)',
                      'Eastern Time (US & Canada)'
                    ].map(c => <Option key={c} value={c}>{c}</Option>)}
                  </Select>
                </div>
              </div>

              <div className="newEventVenue">
                <h3 style={{ fontWeight: 'bold' }}>Venue Details</h3>
                {this.renderVenueInput('Venue Name', 'name', 'The Office')}
                <br />
                {this.renderVenueInput(
                  'Address',
                  'address',
                  '714 S Gay Street'
                )}
                <br />
                <label> City and State </label>
                <InputGroup>
                  <Input
                    value={venue.city}
                    style={{ width: '80%' }}
                    placeholder="Knoxville"
                    onChange={this.updateVenue('city')}
                  />
                  <Select
                    placholder="TN"
                    value={venue.state}
                    style={{ width: '20%' }}
                    onChange={this.updateVenue('state')}
                  >
                    {Object.keys(States).map(abrev =>
                      <Option key={abrev} value={abrev}>{abrev}</Option>
                    )}
                  </Select>
                </InputGroup>
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                fontSize: 'larger'
              }}
            >
              {this.state.submitStatus}
            </div>
          </form>
        </Modal>
      </LocaleProvider>
    )
  }

  renderDetailsInput(type, label, property, placeholder) {
    return (
      <div>
        <label>{label}</label>
        {type === 'text' &&
          <Input
            placeholder={placeholder}
            name={property}
            value={this.state.details[property]}
            onChange={this.updateDetails(property)}
          />}
        {type === 'textarea' &&
          <Input
            type="textarea"
            autosize
            name={property}
            value={this.state.details[property]}
            onChange={this.updateDetails(property)}
          />}
        {type === 'date' &&
          <DatePicker
            style={{ width: '100%' }}
            name={property}
            value={this.state.details[property]}
            onChange={this.updateDetails(property)}
          />}
        {type === 'time' &&
          <TimePicker
            style={{ width: '95%' }}
            size="large"
            name={property}
            value={this.state.details[property]}
            onChange={this.updateDetails(property)}
            hideDisabledOptions
            disabledMinutes={selectedHour => {
              const notAllowed = new Array(60)
                .fill(null)
                .map((_, idx) => (idx % 15 !== 0 ? idx : false))
                .filter(exists => exists)
              return notAllowed
            }}
            use12Hours
            format="h:mm A"
          />}
      </div>
    )
  }

  renderVenueInput(label: string, property: string, placeholder: string) {
    return (
      <div>
        <label>{label}</label>
        <Input
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
