import {
  ImageBackground,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import { Button } from "@rneui/themed";
import {styles} from './styles';
import {useState} from 'react';

const host = 'https://kasperxms.xyz:10002';

export const EditProfileScreen = ({route, navigation}) => {
  const showToast = (msg: string) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };
  const {userid, username, signature} = route.params;
  const [username_, setUsername] = useState('');
  const [signature_, setSignature] = useState('');
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
          onChangeText={text => setUsername(text)}
          defaultValue={username}></TextInput>
        <Text style={styles.registerTip}>Signature</Text>
        <TextInput
          style={styles.registerInput}
          onChangeText={text => setSignature(text)}
          defaultValue={signature}></TextInput>
        <Text style={styles.registerTip}>
          Set avatar (will be available in incoming updates)
        </Text>
        <View style={{marginHorizontal: 40, marginTop: 30}}>
          <Button
            title={'Update profile'}
            color={'#66FF99'}
            onPress={() => {
              fetch(host + '/updateProfile', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'userid=' + userid + '&username=' + username_ + '&signature=' + signature_,
              })
                .then(response => response.json())
                .then(responseJson => {
                  if (responseJson.isSuccess) {
                    showToast('Successfully updated profile');
                    navigation.goBack();
                  } else {
                    showToast(responseJson.msg);
                  }
                })
                .catch(error => {
                  console.error(error);
                });
            }}></Button>
        </View>
      </View>
    </ImageBackground>
  );
};
