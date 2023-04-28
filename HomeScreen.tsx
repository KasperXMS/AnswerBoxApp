import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {Button} from '@rneui/themed';
import * as React from 'react';
import {styles} from './styles';
import {useState} from 'react';
import {AnswerCardInput, DetailCard, Qa} from './components';
import {RefreshControl} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OtherScreen} from './OtherScreen';
import {TouchableHighlight} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {EditProfileScreen} from './EditProfileScreen';
import SystemShare from "./SystemShare";

const host = 'https://kasperxms.xyz:10002';

export function SelfIndexScreen({route, navigation}) {
  const {userid} = route.params;
  var uqs = [];
  var aqs = [];
  const [modalVisible, setModalVisible] = useState(false);
  const [isAnswered, setAnswered] = useState(false);
  const [username, setUsername] = useState('Default');
  const [signature, setSignature] = useState('Default');
  const [unAnsFontColor, setUnAnsFontColor] = useState('#444444');
  const [ansFontColor, setAnsFontColor] = useState('#999999');
  const showToast = (msg: string) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const renderItem = ({item}) => {
    return <Qa qa={item} navigation={navigation} isAnswered={isAnswered}></Qa>;
  };

  fetch(host + '/getUser?userid=' + userid, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.isValid) {
        setSignature(responseJson.user.signature);
        setUsername(responseJson.user.username);
      } else {
        showToast('Network error!');
      }
    })
    .catch(error => {
      console.error(error);
    });

  fetch(host + '/getUQ?userid=' + userid + '&begin=' + 0 + '&end=' + 8, {
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

  fetch(host + '/getAQ?userid=' + userid + '&begin=' + 0 + '&end=' + 8, {
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    console.log(ansFontColor);
    console.log(isAnswered);
    if (isAnswered) {
      aqs = [];
      fetch(host + '/getAQ?userid=' + userid + '&begin=' + 0 + '&end=' + 8, {
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
          console.log(aqs);
          setQaData(aqs);
          setRefreshing(false);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      uqs = [];
      fetch(host + '/getUQ?userid=' + userid + '&begin=' + 0 + '&end=' + 8, {
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
      <View style={styles.idBoardContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>
                Your Answer Box:
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 16,
                }}>
                {'http://kasperxms.xyz/secretbox/answerbox.html?userid=' +
                  userid}
              </Text>

              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#66FF99'}}
                onPress={() => {
                  Clipboard.setString(
                    'http://kasperxms.xyz/secretbox/answerbox.html?userid=' +
                      userid,
                  );
                  showToast('Link copied!');
                  setModalVisible(false);
                }}>
                <Text
                  style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                  COPY LINK
                </Text>
              </TouchableHighlight>
              <View style={{height: 20}}></View>
              <TouchableHighlight
                style={{...styles.openButton, backgroundColor: '#66FF99'}}
                onPress={() => {
                  SystemShare.share(
                    'Welcome to ask me secret questions at: http://kasperxms.xyz/secretbox/answerbox.html?userid=' +
                      userid,
                  );
                  setModalVisible(false);
                }}>
                <Text
                  style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                  SHARE
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <View style={styles.idBoard}>
          <View style={styles.row}>
            <Image source={require('./img/c.jpg')} style={styles.avatar} />
            <View style={styles.column}>
              <Text style={styles.username}>{username}</Text>
              <Text style={styles.quote}>{signature}</Text>
              <TouchableHighlight
                style={styles.editBtn}
                onPress={() => {
                  navigation.navigate('EditProfileScreen', {
                    userid: userid,
                    username: username,
                    signature: signature,
                  });
                }}>
                <Text style={{color: 'white'}}>Edit profile</Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={{height: 10}}></View>
          <View style={styles.row}>
            <Text style={styles.flwNum}>0</Text>
            <Text style={styles.flwLbl}>Following</Text>
            <Text style={styles.flwNum}>0</Text>
            <Text style={styles.flwLbl}>Followers</Text>
          </View>
          <View style={{marginBottom: 30}}></View>
          <Button
            title={'Share Your SecretBox'}
            color={'#66FF99'}
            onPress={() => setModalVisible(true)}></Button>
        </View>
      </View>
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
      <ScrollView>
        <DetailCard
          text={qa.question}
          time={'Asked at ' + qa.askTime}></DetailCard>
        <AnswerCardInput
          defaultText={qa.answer}
          onTextChange={setAnswer}></AnswerCardInput>
        <View
          style={{marginHorizontal: 20, marginBottom: 10, marginTop: 50}}>
          <Button
            color={'#66FF99'}
            title={'Upload'}
            onPress={() => {
              fetch(host + '/updateQA', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'qid=' + qa.qid + '&answer=' + answer,
              })
                .then(response => response.json())
                .then(responseJson => {
                  if (responseJson.isSuccess) {
                    showToast('Successfully Answered');
                    navigation.navigate('SelfIndexScreen', {userid: qa.userid});
                  } else {
                    showToast('Network Error!');
                  }
                })
                .catch(error => {
                  console.error(error);
                });
            }}></Button>
        </View>
      </ScrollView>
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
      <ScrollView>
        <DetailCard
          text={qa.question}
          time={'Asked at: ' + qa.askTime}></DetailCard>
        <DetailCard
          text={qa.answer}
          time={'Answered at: ' + qa.answerTime}></DetailCard>
        <View style={{height: 100}}></View>
        <View style={{marginHorizontal: 20, marginBottom: 5, bottom: 20}}>
          <Button
            color={'#66FF99'}
            title={'Modify Answer'}
            onPress={() => {
              navigation.navigate('UQDetail', {qa: qa});
            }}></Button>
        </View>
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 10,
            marginTop: 10,
            bottom: 20,
          }}>
          <Button
            color={'#CC3300'}
            title={'Delete'}
            onPress={() => {
              fetch(host + '/deleteQA', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'qid=' + qa.qid,
              })
                .then(response => response.json())
                .then(responseJson => {
                  if (responseJson.isSuccess) {
                    showToast('Successfully Deleted');
                    navigation.navigate('SelfIndexScreen', {userid: qa.userid});
                  } else {
                    showToast('Network Error!');
                  }
                })
                .catch(error => {
                  console.error(error);
                });
            }}></Button>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export function SelfScreen({route, navigation}) {
  const {userid} = route.params;
  return (
    <Stack.Navigator
      initialRouteName="SelfIndexScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={'SelfIndexScreen'}
        component={SelfIndexScreen}
        initialParams={{userid: userid}}
      />
      <Stack.Screen
        name={'EditProfileScreen'}
        component={EditProfileScreen}
        initialParams={{userid: userid}}
        options={{
          headerShown: true,
          title: 'Edit Profile',
          headerStyle: {backgroundColor: '#66FF99'},
        }}
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
}

export function HomeScreen({route, navigation}) {
  const {userid} = route.params;
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert('Log Out?', 'Are you sure to log out?', [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: 'Log out',
            style: 'destructive',
            // If the user confirmed, then we dispatch the action we blocked earlier
            // This will continue the action that had triggered the removal of the screen
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]);
      }),
    [navigation],
  );
  return (
    <Tab.Navigator
      initialRouteName="My Answer Box"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'My Answer Box') {
            iconName = focused ? 'mail-open' : 'mail-open-outline';
          } else if (route.name === 'My Asked Questions') {
            iconName = focused ? 'help' : 'help-outline';
          } else {
            iconName = focused ? 'mail-open' : 'mail-open-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen
        name="My Answer Box"
        component={SelfScreen}
        initialParams={{userid: userid}}
      />
      <Tab.Screen
        name="My Asked Questions"
        component={OtherScreen}
        initialParams={{userid: userid}}
      />
    </Tab.Navigator>
  );
}
