import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  View,
} from 'react-native';
import { Button } from "@rneui/themed";
import {useState} from 'react';
import {AnswerCardInput, DetailCard, Qa} from './components';
import {styles} from './styles';

const host = 'https://kasperxms.xyz:10002';
const Stack = createNativeStackNavigator();

export const OtherScreen = ({route, navigation}) => {
  const {userid} = route.params;
  return (
    <Stack.Navigator
      initialRouteName="OtherIndexScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={'OtherIndexScreen'}
        component={OtherIndexScreen}
        initialParams={{userid: userid}}
      />
      <Stack.Screen
        name={'UQDetail'}
        component={UQDetail}
        options={{
          headerShown: true,
          title: 'Question Detail',
          headerStyle: {backgroundColor: '#66FF99'},
        }}
      />
      <Stack.Screen
        name={'AQDetail'}
        component={AQDetail}
        options={{
          headerShown: true,
          title: 'Question Detail',
          headerStyle: {backgroundColor: '#66FF99'},
        }}
      />
    </Stack.Navigator>
  );
};

export function OtherIndexScreen({route, navigation}) {
  const {userid} = route.params;
  var uqs = [];
  var aqs = [];
  const [isAnswered, setAnswered] = useState(false);
  const [unAnsFontColor, setUnAnsFontColor] = useState('#444444');
  const [ansFontColor, setAnsFontColor] = useState('#999999');
  const showToast = (msg: string) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const renderItem = ({item}) => {
    return <Qa qa={item} navigation={navigation} isAnswered={isAnswered}></Qa>;
  };

  fetch(host + '/getUQAsker?askerid=' + userid + '&begin=' + 0 + '&end=' + 8, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then(response => response.json())
    .then(responseJson => {
      for (var i = 0; i < responseJson.length; i++) {
        uqs.push(responseJson[i]);
      }
    })
    .catch(error => {
      console.error(error);
    });

  fetch(host + '/getAQAsker?askerid=' + userid + '&begin=' + 0 + '&end=' + 8, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then(response => response.json())
    .then(responseJson => {
      for (var i = 0; i < responseJson.length; i++) {
        aqs.push(responseJson[i]);
      }
    })
    .catch(error => {
      console.error(error);
    });

  const [qaData, setQaData] = useState(uqs);
  const [refreshing, setRefreshing] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [bindQid, setBindQid] = useState('');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log(ansFontColor);
    console.log(isAnswered);
    if (isAnswered) {
      aqs = [];
      fetch(
        host + '/getAQAsker?askerid=' + userid + '&begin=' + 0 + '&end=' + 8,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          for (var i = 0; i < responseJson.length; i++) {
            aqs.push(responseJson[i]);
          }
          console.log(aqs);
          setQaData(aqs);
          setRefreshing(false);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      uqs = [];
      fetch(
        host + '/getUQAsker?askerid=' + userid + '&begin=' + 0 + '&end=' + 8,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          for (var i = 0; i < responseJson.length; i++) {
            uqs.push(responseJson[i]);
          }
          setQaData(uqs);
          setRefreshing(false);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [isAnswered, uqs, aqs]);

  return (
    <ImageBackground
      source={require('./img/secretBoxBG.png')}
      style={{width: '100%', height: '100%'}}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontSize: 18}}>Question code:</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#999999',
                fontSize: 18,
                paddingVertical: 3,
                marginVertical: 10,
                width: 150,
                textAlign: 'center',
              }}
              onChangeText={text => setBindQid(text)}></TextInput>
            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: '#66FF99'}}
              onPress={() => {
                fetch(host + '/updateAskerId', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: 'qid=' + bindQid + '&askerid=' + userid,
                })
                  .then(response => response.json())
                  .then(responseJson => {
                    if (responseJson.isSuccess) {
                      showToast('Question Successfully Binded');
                      setModalVisible(false);
                    } else {
                      showToast('Invalid Code or Network Error!');
                      setModalVisible(false);
                    }
                  })
                  .catch(error => {
                    console.error(error);
                  });
              }}>
              <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                BIND
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      <View style={{flexDirection: 'row', marginHorizontal: 10}}>
        <View
          style={styles.ansSelect}
          onTouchEnd={() => {
            setAnswered(false);
            setAnsFontColor('#999999');
            setUnAnsFontColor('#444444');
            setQaData(uqs);
            console.log(isAnswered);
          }}>
          <Text style={{fontSize: 20, color: unAnsFontColor}}>Unanswered</Text>
        </View>
        <View
          style={styles.ansSelect}
          onTouchEnd={() => {
            setAnswered(true);
            setAnsFontColor('#444444');
            setUnAnsFontColor('#999999');
            setQaData(aqs);
            console.log(isAnswered);
          }}>
          <Text style={{fontSize: 20, color: ansFontColor}}>Answered</Text>
        </View>
      </View>
      <FlatList
        data={qaData}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={renderItem}
        keyExtractor={item => item.qid}
        extraData={qaData}
      />
      <View style={{marginHorizontal: 40, marginVertical: 15}}>
        <Button
          title={'Bind question'}
          color={'#66FF99'}
          onPress={() => {
            setModalVisible(true);
          }}></Button>
      </View>
    </ImageBackground>
  );
}

export function UQDetail({route, navigation}) {
  const showToast = (msg: string) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };
  const {qa} = route.params;
  const [answer, setAnswer] = useState('');
  return (
    <ImageBackground
      style={{width: '100%', height: '100%'}}
      source={require('./img/secretBoxBG.png')}>
      <DetailCard
        text={qa.question}
        time={'Asked at ' + qa.askTime}></DetailCard>
    </ImageBackground>
  );
}

export function AQDetail({route, navigation}) {
  const showToast = (msg: string) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };
  const {qa} = route.params;
  return (
    <ImageBackground
      style={{width: '100%', height: '100%'}}
      source={require('./img/secretBoxBG.png')}>
      <DetailCard
        text={qa.question}
        time={'Asked at: ' + qa.askTime}></DetailCard>
      <DetailCard
        text={qa.answer}
        time={'Answered at: ' + qa.answerTime}></DetailCard>
    </ImageBackground>
  );
}
