import {
  ImageBackground,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import {Button} from "@rneui/themed";
import {styles} from './styles';
import {useState} from 'react';

const host = 'https://kasperxms.xyz:10002';

export const RegisterScreen = ({navigation}) => {
  const showToast = (msg: string) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPsw, setConfirmPsw] = useState('');

  return (
    <ImageBackground
      source={require('./img/secretBoxBG.png')}
      style={{width: '100%', height: '100%'}}>
      <View
        style={{
          width: '100%',
          height: '100%',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <Text style={styles.registerTip}>Username</Text>
        <TextInput
          style={styles.registerInput}
          onChangeText={text => setUsername(text)}></TextInput>
        <Text style={styles.registerTip}>Email</Text>
        <TextInput
          style={styles.registerInput}
          onChangeText={text => setEmail(text)}></TextInput>
        <Text style={styles.registerTip}>Password</Text>
        <TextInput
          style={styles.registerInput}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}></TextInput>
        <Text style={styles.registerTip}>Confirm Password</Text>
        <TextInput
          style={styles.registerInput}
          secureTextEntry={true}
          onChangeText={text => setConfirmPsw(text)}></TextInput>
        <View style={{marginHorizontal: 40, marginTop: 30}}>
          <Button
            title={'Register'}
            color={'#66FF99'}
            onPress={() => {
              if (
                username.length > 0 &&
                email.length > 0 &&
                password.length > 0 &&
                confirmPsw.length > 0
              ) {
                const regEmail =
                  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
                if (regEmail.test(email)) {
                  if (password === confirmPsw) {
                    fetch(host + '/register', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                      },
                      body:
                        'email=' +
                        email +
                        '&username=' +
                        username +
                        '&password=' +
                        password,
                    })
                      .then(response => response.json())
                      .then(responseJson => {
                        if (responseJson.status) {
                          showToast('Registration successful!');
                          navigation.goBack();
                        } else {
                          showToast(responseJson.msg);
                        }
                      })
                      .catch(error => {
                        console.error(error);
                      });
                  } else {
                    showToast('Inconsistent password!');
                  }
                } else {
                  showToast('Invalid email address!!');
                }
              } else {
                showToast('All information must not be EMPTY!!');
              }
            }}></Button>
        </View>
      </View>
    </ImageBackground>
  );
};
