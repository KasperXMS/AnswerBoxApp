import * as React from 'react';
import {ThemeProvider, Button} from '@rneui/themed';
import {
  View,
  Text,
  ImageBackground,
  Alert,
  Image,
  ToastAndroid,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useState} from 'react';
import {RowInput} from './components';
import {HomeScreen} from './HomeScreen';
import {RegisterScreen} from './RegisterScreen';

const host = 'https://kasperxms.xyz:10002';

function LoginScreen({navigation}) {
  const showToast = (msg: string) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <ThemeProvider>
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        source={require('./img/secretBoxBG.png')}>
        <View
          style={{
            height: '36%',
            marginTop: '10%',
            marginHorizontal: '30%',
          }}>
          <Image
            source={require('./img/mailbox.png')}
            style={{width: 150, height: 150}}></Image>
        </View>
        <RowInput
          label={'Username'}
          hint={'Email or username'}
          isPassw={false}
          onChangeText={setUsername}></RowInput>
        <View style={{height: 30}}></View>
        <RowInput
          label={'Password'}
          hint={'Password'}
          isPassw={true}
          onChangeText={setPassword}></RowInput>
        <View style={{height: 40}}></View>
        <View style={{marginHorizontal: '30%'}}>
          <Button
            color={'#66FF99'}
            title="Login"
            onPress={() => {
              fetch(host + '/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'identifier=' + username + '&password=' + password,
              })
                .then(response => response.json())
                .then(responseJson => {
                  console.log(responseJson);
                  if (responseJson.login === 'success') {
                    navigation.navigate('HomeScreen', {
                      userid: responseJson.userid,
                    });
                  } else {
                    showToast('Incorrect Email/Username or Password!');
                  }
                })
                .catch(error => {
                  console.error(error);
                });
            }}></Button>
        </View>
        <View style={{height: 30}}></View>
        <View style={{marginHorizontal: '20%'}}>
          <Button color={'#66CCFF'} title="No Account? Register" onPress={() => {navigation.navigate('RegisterScreen')}}></Button>
        </View>
      </ImageBackground>
    </ThemeProvider>
  );
}

const Stack = createNativeStackNavigator();

const MyApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name={'LoginScreen'} component={LoginScreen} />
        <Stack.Screen name={'HomeScreen'} component={HomeScreen} />
        <Stack.Screen name={'RegisterScreen'} component={RegisterScreen} options={{headerShown: true, title: 'Register', headerStyle: {backgroundColor: '#66FF99'}}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyApp;
