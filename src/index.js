import React from 'react';
import { 
  AppRegistry,
  StyleSheet, 
  View, 
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Image,
  Text,
  Platform
} from 'react-native';
import CircleTransition from './components/CircleTransition';
import Swipe from './components/SwipeAction';

const hotel = require('../assets/images/hotels.png');
const bank = require('../assets/images/bank.png');

const { width: windowWidth } = Dimensions.get('window');


const screens = [{
  id: 0,
  title: 'Gorgias',
  subtitle: 'See your favourite Celebrity on Gorgias App.',
  icon: hotel,
  bgcolor: '#5757FF'
}, {
  id: 1,
  title: 'Moment',
  subtitle: 'Create moment using Gorgias appp.',
  icon: bank,
  bgcolor: '#FF4848'
}, {
  id: 2,
  title: 'Gallery',
  subtitle: 'View all celebrity gallery right in your palm.',
  icon: hotel,
  bgcolor: '#59955C'
}, {
  id: 3,
  title: 'Gorgias',
  subtitle: 'See your favourite Celebrity on Gorgias App.',
  icon: bank,
  bgcolor: '#FF62B0'
}, {
  id: 4,
  title: 'Moment',
  subtitle: 'Create moment using Gorgias appp.',
  icon: hotel,
  bgcolor: '#800080'
}, {
  id: 5,
  title: 'Gallery',
  subtitle: 'View all celebrity gallery right in your palm.',
  icon: hotel,
  bgcolor: '#23819C'
}];

export default class index extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      _counter: 0,
      currentTitle: screens[0].title,
      currentSubtitle: screens[0].subtitle,
      currentIcon: screens[0].icon,
      currentbg: screens[0].bgcolor,
    };
    this.onSwipeLeft = this.onSwipeLeft.bind(this);
    this.onSwipeRight = this.onSwipeRight.bind(this);
  }

  componentDidMount() {
    this.animate.call(this);
  }

  animate() {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: 600,
      }
    ).start();
  }

  onSwipeLeft(gestureState) {
    const nextScreen = this.getNextScreen();
    const { _counter } = this.state;
    let newCounter = _counter < screens.length - 1 ? _counter + 1 : 0;

    this._swipeTo(nextScreen, newCounter);
  }

  onSwipeRight(gestureState) {
    const prevScreen = this.getPrevScreen();
    const { _counter } = this.state;
    let newCounter = _counter === 0 ? screens.length - 1 : _counter - 1;

    this._swipeTo(prevScreen, newCounter);
  }

  _swipeTo(newScreen, newCounter) {
    this.setState({
      fadeAnim: new Animated.Value(0),
      _counter: newCounter
    }, () => {
      this.changeContent.call(this, newScreen);
      this.circleTransition.start(newScreen.bgcolor, this.changeColor.bind(this, newScreen));
      this.animate.call(this);
    });
  }

  changeContent(newScreen) {
    this.setState({
      currentTitle: newScreen.title,
      currentSubtitle: newScreen.subtitle,
      currentIcon: newScreen.icon,
    });
  }

  changeColor (newScreen) {
    this.setState({
      currentbg: newScreen.bgcolor,
    });
  }

  getCurrentScreen() {
    return screens[this.state._counter];
  }

  getNextScreen() {
    if (this.state._counter < screens.length - 1) {
      return screens[this.state._counter + 1]; 
    } else {
      return screens[0]; 
    }
  }

  getPrevScreen() {
    if (this.state._counter === 0) {
      return screens[screens.length - 1];
    } else {
      return screens[this.state._counter - 1];
    }
  }

  renderNav() {
    let { fadeAnim } = this.state;

    return (
      <View style={styles.footer}>
        {screens.map((screen, key) => (
          <Animated.View key={key} style={[{
            width: 10,
            height: 10,
            borderRadius: 10,
            borderColor: 'white',
            borderWidth: 2,
            marginRight: 5,
            opacity: 0.6,
            backgroundColor: 'transparent',
          }, key === this.state._counter && 
          { 
            backgroundColor: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['transparent', 'white']
            })
          }]}>
          </Animated.View>
        ))}
      </View>
    );
  }

  renderMain() {
    let { fadeAnim } = this.state;
    return (
      <Swipe style={styles.main} onSwipeLeft={this.onSwipeLeft} onSwipeRight={this.onSwipeRight}>
        <Animated.View style={[styles.body, {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })
          }]
        }]}>
          <Image 
            source={this.state.currentIcon}
            style={styles.pageIcon} 
          />

          <Text style={[styles.title, Platform.OS === 'ios' && {
            fontFamily: 'Avenir Next'
          }]}>
            {this.state.currentTitle}
          </Text>
          <Text style={[styles.subtitle, Platform.OS === 'ios' && {
            fontFamily: 'Avenir Next'
          }]}>
            {this.state.currentSubtitle}
          </Text>
        </Animated.View>

        {this.renderNav()}
      </Swipe>
    );
  }

  render () {
    let {
      nextbg,
      currentbg
    } = this.state;

    return (
      <View style={{flex: 1}}>
        <View style={[styles.container, { backgroundColor: currentbg }]}>
          {this.renderMain()}
          <CircleTransition
            ref={(circle) => { this.circleTransition = circle }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    zIndex: 10
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingLeft: 20,
    paddingRight: 20,
  },
  footer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pageIcon: {
    width: windowWidth / 2,
    height: windowWidth / 2,
    marginBottom: 20
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#fff',
    marginBottom: 15,
    backgroundColor: 'transparent'
  },
  subtitle: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'transparent'
  }
});

AppRegistry.registerComponent('animatedTutorial', () => index);
