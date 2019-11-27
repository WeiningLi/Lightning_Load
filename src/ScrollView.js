import React from 'react';

const start = 1500348260
const end = 1503031520
// we use 2 levels of placeholder, the first level contains 45 images each placeholder,
//   and each second level placeholder contains 45 1st level placeholder
//   which uses the idea of skiplist, to achieve the reduction of the # of DOM nodes
//   so that the # of DOM nodes should be O(n^(1/3)) which should very close to the # of visible images
const placeholderHeight1 = 15 // and each row has 3 images
const placeholderHeight2 = 45
// the number above come from 100000^(1/3) is about 45
const interval = 20

class ScrollView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePos: 0 // the position in the scroll view
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  isActive = (level, timestamp) => {
    if (level === 1) {
      // set first level tolerance
      if (Math.abs((timestamp - start) / (end - start) - this.state.activePos) < 0.00035) {
        return true
      }
      return false
    }
    if (level === 2) {
      // set second level tolerance
      if (Math.abs((timestamp + 20 * 45 * 45 / 2 - start) / (end - start) - this.state.activePos) < 0.01) { 
        return true
      }
      return false
    }
  }

  renderRow = (timestamp) => {
    return (
      <p style={{ width: '96vw', height: '25vw', margin: 0 }}>
        <img style={{ width: '28vw', height: '21vw', objectFit: 'cover', padding: '2vw' }}
          src={'https://hiring.verkada.com/thumbs/' + timestamp.toString() + '.jpg'}
          alt='logo' />
        {timestamp + 20 <= end ?
          <img style={{ width: '28vw', height: '21vw', objectFit: 'cover', padding: '2vw' }}
            src={'https://hiring.verkada.com/thumbs/' + (timestamp + interval).toString() + ".jpg"}
            alt='logo' /> : null}
        {timestamp + 40 <= end ?
          <img style={{ width: '28vw', height: '21vw', objectFit: 'cover', padding: '2vw' }}
            src={'https://hiring.verkada.com/thumbs/' + (timestamp + 2 * interval).toString() + '.jpg'}
            alt='logo' /> : null}
      </p>
    );
  }

  // to draw 1st level placeholders
  drawPlaceholder1 = (timestamp) => {
    if (!this.isActive(1, timestamp)) {
      if ((end - timestamp) / 20 > 45) { // check not the last placeholder
        return (
          <div style={{ height: (25 * 15).toString() + 'vw' }}></div>
        );
      }
      else { // return the last placeholder
        return (
          <div style={{ height: (25 * (end - timestamp) / 60).toString() + 'vw' }}></div>
        );
      }
    }
    else {
      let Rows = []
      for (let i = 0; i < placeholderHeight1; i += 1) {
        if (timestamp + i * 60 < end) Rows.push(this.renderRow(timestamp + i * 60))
        else break
      }
      return Rows
    }
  }

  // to draw 2nd level placeholders
  drawPlaceholder2 = (timestamp) => {
    if (!this.isActive(2, timestamp)) {
      if ((end - timestamp) / 20 > 45 * 45) { // check not the last placeholder
        return (
          <div style={{ height: (25 * 15 * 45).toString() + 'vw' }}></div>
        );
      }
      else { // return the last placeholder
        return (
          <div style={{ height: (25 * (end - timestamp) / 60).toString() + 'vw' }}></div>
        );
      }
    }
    else {
      let Placeholder1s = []
      for (let i = 0; i < placeholderHeight2; i += 1) {
        if (timestamp + i * 60 * placeholderHeight1 < end) {
          Placeholder1s.push(this.drawPlaceholder1(timestamp + i * 60 * placeholderHeight1))
        }
        else break
      }
      return Placeholder1s
    }
  }

  drawPlaceholders = () => {
    let Placeholder2s = []
    for (let i = 0; i < (end - start) / (60 * placeholderHeight1 * placeholderHeight2) + 1; i += 1) {
      if (start + i * 60 * placeholderHeight1 * placeholderHeight2 < end) {
        Placeholder2s.push(this.drawPlaceholder2(start + i * 60 * placeholderHeight1 * placeholderHeight2))
      }
      else break
    }
    return Placeholder2s
  }

  handleScroll = () => {
    let totalVW = 25 * ((end - start) / (3 * 20) + 1)
    let totalPX = totalVW / (100 / window.innerWidth)
    let position = window.scrollY / totalPX  // get position in percentage on the scroll view
    position = position.toFixed(5)
    console.log('pos', position)
    if (this.state.activePos !== position) {
      this.setState({
        activePos: position
      })
    }
  }

  render() {
    return (
      <div style={{ width: '96vw', padding: '1.2vw' }}>
        {this.drawPlaceholders()}
      </div>
    );
  }
}

export default ScrollView;
