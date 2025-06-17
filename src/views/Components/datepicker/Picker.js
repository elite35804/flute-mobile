import React, {Component} from 'react';
import {Animated, View, FlatList} from 'react-native';
import {shallowEqual} from './Util';

class SmoothPicker extends Component {
  options = [];
  countItems = 0;

  state = {
    selected: this.props.initialSelected || 0,
    animScroll: new Animated.Value(0)
  };
  isMomentum = false;
  isScrolling = false;
  isInitIndexed = false;
  scrollPosition = 0;
  currentSelected = 0;                             // Instantly updated value

  get itemSize() {
    return this.props.horizontal ? this.props.itemWidth : this.props.itemHeight;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.selected !== this.state.selected ||
      !shallowEqual(nextProps, this.props, 6)
    );
  }

  componentDidMount() {
    this._timerInit = setInterval(() => {
      if (!this._list) return;

      clearInterval(this._timerInit);
      this._timerInit = null;
      this._initialScroll();
    }, 100);
  }

  setCurrentSelected = (newSelected, timeout = 100) => {
    this.currentSelected = newSelected

    if (this.updateSelectedTimer) {
      clearTimeout(this.updateSelectedTimer)
    }

    if (!timeout) {
      this.setState({selected: this.currentSelected})
    } else {
      // Just update
      this.updateSelectedTimer = setTimeout(
        () => this.setState({selected: this.currentSelected}),
        timeout
      )
    }
  }

  selectIndex = index => {
    if (this.currentSelected === index) return;

    const offset = this._getItemPosition(index);

    // this.shouldNotSendUpdates = true
    // this._handleSelection(this.props.data[index], index, offset)
    this._list && this._list.getNode().scrollToOffset({offset, animated: true});
  };

  _onScrollBeginDrag = () => {
    this.isMomentum = true;
    this.isScrolling = true;
  };

  _onMomentumScrollEnd = () => {
    this.isScrolling = false;
    this.setCurrentSelected(this.currentSelected, false)
    const index = this.currentSelected
    const item = this.props.data[index]

    if (!this.shouldNotSendUpdates) {
      this.props.onSelected && this.props.onSelected({item, index});
    }
    this.shouldNotSendUpdates = false
  };

  _onScroll = ({nativeEvent: ev}) => {
    // if (this.isScrolling) {
    //this._calcSelected(ev);
    this._calcSelectedNew(ev)
    // }
  };
  _onListRef = node => {
    this._list = node;

    if (!this.isInitIndexed && this._list && this.props.initialIndex) {
      this.selectIndex(this.props.initialIndex);
      this.isInitIndexed = true;
    }
  };

  _getItemPosition = index => {
    // eslint-disable-line
    // const { startMargin } = this.props;
    return this.itemSize * index; // + startMargin;
  };

  _getItemLayout = (_, index) => ({
    length: this.itemSize,
    offset: this._getItemPosition(index),
    index
  });

  _initialScroll = () => {
    const {initialSelected: index} = this.props;
    if (index) {
      this.selectIndex(index);
    }
  };

  _calcSelectedNew = ev => {
    const {data, horizontal} = this.props;
    const cursor = horizontal ? ev.contentOffset.x : ev.contentOffset.y;
    this.scrollPosition = cursor

    let pos = Math.round(Math.max(0, cursor) / this.itemSize)
    pos = Math.min(pos, data.length - 1)

    this.setCurrentSelected(pos)
  }

  render() {
    let scrollev = null;
    if (this.props.horizontal) {
      scrollev = Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {x: this.state.animScroll}
            }
          }
        ],
        {useNativeDriver: true, listener: this._onScroll}
      );
    } else {
      scrollev = Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {y: this.state.animScroll}
            }
          }
        ],
        {useNativeDriver: true, listener: this._onScroll}
      );
    }

    console.log(this.props.initialIndex, 'initialIndex');

    return (
      <Animated.FlatList
        {...this.props}
        ref={this._onListRef}
        snapToInterval={this.props.itemWidth}
        snapToAlignment="center"
        getItemLayout={this._getItemLayout}
        onScroll={scrollev}
        onScrollBeginDrag={this._onScrollBeginDrag}
        onMomentumScrollEnd={this._onMomentumScrollEnd}
        renderItem={this._renderItem}
        ListHeaderComponent={this._renderPadding}
        ListFooterComponent={this._renderPadding}
        initialScrollIndex={this.props.initialIndex}
        selected={this.state.selected}
      />
    );
  }

  _renderItem = info => {
    const width = this.props.horizontal
      ? this.props.itemWidth
      : this.props.itemHeight;
    const animWidth = new Animated.Value(width);
    const animIndex = Animated.divide(this.state.animScroll, animWidth);
    return this.props.renderItem(info, animIndex, this.props.data[this.state.selected]);
  };

  _renderPadding = header => {
    const {horizontal, startMargin, endMargin} = this.props;
    if (horizontal) {
      return <View style={{width: header ? startMargin : endMargin}}/>;
    }
    return <View style={{height: header ? startMargin : endMargin}}/>;
  };
}

SmoothPicker.defaultProps = {
  decelerationRate: 0.85,
  showsHorizontalScrollIndicator: false,
  showsVerticalScrollIndicator: false,
  scrollAnimation: true,
  initialSelected: 0,
  itemWidth: null,
  itemHeight: null,
  startMargin: null,
  endMargin: null,
  onSelected: data => data
};

// SmoothPicker.propTypes = {
//   onSelected: PropTypes.func.isRequired,
//   offsetSelection: PropTypes.number.isRequired,
//   scrollAnimation: PropTypes.bool.isRequired,
//   magnet: PropTypes.bool.isRequired,
//   snapInterval: PropTypes.number,
//   initialScrollToIndex: PropTypes.number,
//   startMargin: PropTypes.number,
//   endMargin: PropTypes.number
// };

export default SmoothPicker;
