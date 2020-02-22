import React from 'react';
import './App.css';


const BREAK_LENGTH = 5;
const SESSION_LENGTH = 25;
const SESSION_RUNNING = "Session";
const SESSION_PAUSED = "Break";

var initialState = {
  breakLength: BREAK_LENGTH,
  sessionLength: SESSION_LENGTH,
  timeDisplaySeconds: 0,
  timeDisplayMinutes: SESSION_LENGTH,
  session: true,
  timeDisplayLabel: SESSION_RUNNING,
  timer: false
}

class Title extends React.Component {
  render() {
    return (
      <div id="title">
        <h1>Pomodoro Clock</h1>
        <h6>Code and Design by Armin Hafner</h6>
      </div>
    );
  }
}

class Break extends React.Component {
  render () {
    return (
      <div id="break-label">
        <p>Break</p>
        <button id="break-increment" onClick={this.props.incrementBreakByOne}><i className="fas fa-arrow-up"></i></button>
       <p id="break-length">{this.props.breakLength}</p>
        <button id="break-decrement" onClick={this.props.decrementBreakByOne}><i className="fas fa-arrow-down"></i></button>
      </div>
    );
  }
}


class Session extends React.Component {
  render () {
    return (
      <div id="session-label">
        <p>Session</p>
        <button id="session-increment" onClick={this.props.incrementSessionByOne}><i className="fas fa-arrow-up"></i></button>
       <p id="session-length">{this.props.sessionLength}</p>
        <button id="session-decrement" onClick={this.props.decrementSessionByOne}><i className="fas fa-arrow-down"></i></button>
       </div>
    );
  }
}

class TimeDisplay extends React.Component {
  timeCheck (count) {
    if (count<10) {
      return "0" + count;
    }
    return count;
  }
  render() {
    return (
      <div id="time-display-container">
        <div id="timer-display">
          <p id="timer-label">{this.props.timeDisplayLabel}</p>
          <p id="time-left">{this.timeCheck(this.props.timeDisplayMinutes)}:{this.timeCheck(this.props.timeDisplaySeconds)}</p>
        </div>
      </div>
    );
  }
}

class TimeControls extends React.Component {
  render() {
    return (
      <div id="controls">
        <button id="reset" onClick={this.props.resetToDefault}>Reset</button>
        <button id="start_stop" onClick={this.props.startStop}><i class="fas fa-play"></i><i class="fas fa-pause"></i></button>
      </div>
    );
  }
}

class AudioFile extends React.Component {
  render() {
    return (
      <div>
        <audio id="beep" src="https://dl.dropbox.com/s/nacdk0xey4io5d8/wink-sound-effect.mp3"/>
      </div>
    );
  }
}

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = initialState;
    this.decrementBreakByOne=this.decrementBreakByOne.bind(this);
    this.incrementBreakByOne=this.incrementBreakByOne.bind(this);
    this.decrementSessionByOne=this.decrementSessionByOne.bind(this);
    this.incrementSessionByOne=this.incrementSessionByOne.bind(this);
    this.resetToDefault=this.resetToDefault.bind(this);
    this.runTime=this.runTime.bind(this);
    this.startStop=this.startStop.bind(this);
    this.playSound=this.playSound.bind(this);
  }

  decrementBreakByOne() {
    if (this.state.breakLength>1 && this.state.timer===false) {
      this.setState({breakLength: this.state.breakLength-1});
    }
  }
  incrementBreakByOne() {
    if (this.state.breakLength<=59 && this.state.timer===false) {
      this.setState({breakLength: this.state.breakLength+1});
    }
  }

  decrementSessionByOne() {
    if (this.state.sessionLength>1 && this.state.timer===false) {
      this.setState({
        sessionLength: this.state.sessionLength-1,
        timeDisplayMinutes: this.state.sessionLength-1,
        timeDisplaySeconds: 0,
        timer: false
      });
    }
  }
  incrementSessionByOne() {
    if (this.state.sessionLength<=59 && this.state.timer===false) {
      this.setState({
        sessionLength: this.state.sessionLength+1,
        timeDisplayMinutes: this.state.sessionLength+1,
        timeDisplaySeconds: 0,
        timer: false
      });
    }
  }

  resetToDefault() {
    this.setState(initialState);
    clearInterval(window.interval);
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime=0;
    console.log("reset");
  }

  runTime() {
       if (this.state.timeDisplaySeconds===0 && this.state.timeDisplayMinutes===0 && this.state.session) {
         this.setState({
           session: false,
           timeDisplayLabel: SESSION_PAUSED,
           timeDisplayMinutes: this.state.breakLength
         });
         this.playSound();
       } else if (this.state.timeDisplaySeconds===0 && this.state.timeDisplayMinutes===0 && this.state.session===false) {
         this.setState({
           session: true,
           timeDisplayLabel: SESSION_RUNNING,
           timeDisplayMinutes: this.state.sessionLength
         });
       } else if (this.state.timeDisplaySeconds===0) {
         this.setState({
           timeDisplaySeconds: 59,
           timeDisplayMinutes: this.state.timeDisplayMinutes-1
         });
       } else {
         this.setState({timeDisplaySeconds: this.state.timeDisplaySeconds-1});
       }
  }

  startStop() {
        if (this.state.timer) {
          clearInterval(window.interval);
        }
        if (this.state.timer===false) {
           window.interval = setInterval(this.runTime, 1000);
        }
        this.setState({timer: !this.state.timer});
   }

  playSound() {
    document.getElementById("beep").play();
    console.log("Sound beep");
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Title />
        <Break breakLength={this.state.breakLength}
               decrementBreakByOne={this.decrementBreakByOne}
               incrementBreakByOne={this.incrementBreakByOne} />
        <Session sessionLength={this.state.sessionLength}
                 decrementSessionByOne={this.decrementSessionByOne}
                 incrementSessionByOne={this.incrementSessionByOne} />
        <TimeDisplay timeDisplayLabel={this.state.timeDisplayLabel}
                     timeDisplayMinutes={this.state.timeDisplayMinutes}
                     timeDisplaySeconds={this.state.timeDisplaySeconds} />
        <TimeControls resetToDefault={this.resetToDefault}
                      startStop={this.startStop} />
        <AudioFile />
      </div>
    );
  }
}

export default App;
