import {Text, TextInput, TouchableHighlight, View} from 'react-native';
import * as React from 'react';
import {styles} from './styles';
import {useState} from 'react';

export const RowInput = (props: {
  label: string;
  hint: string;
  isPassw: boolean;
  onChangeText: any;
}) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{props.label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={props.hint}
          secureTextEntry={props.isPassw}
          onChangeText={text => props.onChangeText(text)}></TextInput>
      </View>
    </View>
  );
};

export const Qa = (props: {qa: any; navigation: any; isAnswered: boolean}) => {
  return (
    <TouchableHighlight
      underlayColor={'#999999'}
      style={styles.qaCard}
      onPress={() => {
        if (props.isAnswered) {
          props.navigation.navigate('AQDetail', {qa: props.qa});
        } else {
          props.navigation.navigate('UQDetail', {qa: props.qa});
        }
      }}>
      <View>
        <View style={styles.row}>
          <Text
            style={{
              color: 'white',
              backgroundColor: '#33CC99',
              width: 22,
              height: 21,
              paddingHorizontal: 5,
              paddingVertical: 1,
            }}>
            Q
          </Text>
          <Text
            style={styles.qaCardText}
            onPress={() => {
              if (props.isAnswered) {
                props.navigation.navigate('AQDetail', {qa: props.qa});
              } else {
                props.navigation.navigate('UQDetail', {qa: props.qa});
              }
            }}>
            {props.qa.question}
          </Text>
        </View>
        <View style={{height: 10}}></View>
        {props.isAnswered && (
          <View style={styles.row}>
            <Text
              style={{
                color: 'white',
                backgroundColor: '#FFCC33',
                width: 22,
                height: 21,
                paddingHorizontal: 5,
                paddingVertical: 1,
              }}>
              A
            </Text>
            <Text
              style={styles.qaCardText}
              onPress={() => {
                if (props.isAnswered) {
                  console.log(props.qa);
                  props.navigation.navigate('AQDetail', {qa: props.qa});
                } else {
                  props.navigation.navigate('UQDetail');
                }
              }}>
              {props.qa.answer}
            </Text>
          </View>
        )}
      </View>
    </TouchableHighlight>
  );
};

export const DetailCard = (props: {text: string; time: string}) => {
  return (
    <View style={styles.detailCard}>
      <Text style={styles.detailCardText}>{props.text}</Text>
      <Text style={styles.detailCardTime}>{props.time}</Text>
    </View>
  );
};

export const AnswerCardInput = (props: {
  onTextChange: any;
  defaultText: string;
}) => {
  return (
    <View style={styles.detailCard}>
      <Text style={styles.answerTip}>Write your answer:</Text>
      <TextInput
        style={styles.answerInputBox}
        multiline={true}
        defaultValue={props.defaultText}
        onChangeText={text => props.onTextChange(text)}></TextInput>
    </View>
  );
};
