import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

import BaseInput from './BaseInput';
import { bind } from 'decko';

const LABEL_HEIGHT = 24;
const PADDING = 16;

export default class Sae extends BaseInput {
  static propTypes = {
    height: PropTypes.number,
    /*
     * This is the icon component you are importing from react-native-vector-icons.
     * import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
     * iconClass={FontAwesomeIcon}
     */
    iconClass: PropTypes.func.isRequired,
    /*
     * Passed to react-native-vector-icons library as name prop
     */
    iconName: PropTypes.string,
    /*
     * Passed to react-native-vector-icons library as color prop.
     * This is also used as border color.
     */
    iconColor: PropTypes.string,
  };

  static defaultProps = {
    iconColor: 'white',
    height: 48,
    animationDuration: 300,
    iconName: 'pencil',
  };

  @bind
    getRid(editedValue) {
        if (this.props.getRidOfValues && this.props.getRidOfValues.length>1) {
            if(editedValue.split(this.props.getRidOfValues[1]).length>2) {
                return editedValue.split(this.props.getRidOfValues[1])[0];
            }
            return editedValue.replace(this.props.getRidOfValues[0], '');
        }
        return editedValue;
    }

    @bind
    onChangeText(text) {
        const input = this.props
        let editedValue = text;
        if (this.props.getRidOfValues) {
            editedValue = this.getRid(editedValue);
        }
        const isValidated = this.isValid(editedValue);
        if (this.props.onValidEntry) {
            this.props.onValidEntry(isValidated);
        }
        if (this.props.getRidOfValues) {
            editedValue + "" + this.props.getRidOfValues;
        }
        this.props.onChange(input.id, editedValue, isValidated)
    }

    @bind
    isValid(text) {
        const { value, minCharacters, maxCharacters } = this.props
        const test = (text || value) ? (text || value).length : 0
        return text.length >= minCharacters && text.length <= maxCharacters
    }

  render() {
    const {
      iconClass,
      iconColor,
      iconName,
      label,
      style: containerStyle,
      height: inputHeight,
      inputStyle,
      labelStyle,
    } = this.props;
    const { width, focusedAnim, value } = this.state;
    const AnimatedIcon = Animated.createAnimatedComponent(iconClass);

    return (
      <View
        style={[
          styles.container,
          containerStyle,
          {
            height: inputHeight + PADDING,
          },
        ]}
        onLayout={this._onLayout}
      >
        <TouchableWithoutFeedback onPress={this.focus}>
          <Animated.View
            style={{
              position: 'absolute',
              bottom: focusedAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, LABEL_HEIGHT + PADDING],
              }),
            }}
          >
            <Animated.Text
              style={[
                styles.label,
                labelStyle,
                {
                  fontSize: focusedAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 12],
                  }),
                },
              ]}
            >
              {label}
            </Animated.Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <TextInput
          ref="input"
          {...this.props}
          style={[
            styles.textInput,
            inputStyle,
            {
              width,
              height: inputHeight,
            },
          ]}
          value={value}
          onBlur={this._onBlur}
          onChange={this._onChange}
          onFocus={this._onFocus}
          underlineColorAndroid={'transparent'}
          onChangeText={this.onChangeText}
          secureTextEntry={this.props.secure}
        />
        <Animated.View
          name={iconName}
          color={iconColor}
          style={{
            position: 'absolute',
            bottom: 0,
            right: focusedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [width-120, 0],
            }),
            transform: [
              {
                rotate: focusedAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-360deg'],
                }),
              },
            ],
            backgroundColor: 'transparent',
          }}
        >
          {this.props.sneakPeek}
        </Animated.View>
        {/* bottom border */}
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            height: 0.4,
            width: focusedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, width],
            }),
            backgroundColor: iconColor,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  label: {
    fontFamily: 'GillSans-Light',
    color: 'white',
  },
  textInput: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingTop: PADDING / 2,
    paddingLeft: 0,
    color: 'white',
    fontSize: 18,
  },
});
