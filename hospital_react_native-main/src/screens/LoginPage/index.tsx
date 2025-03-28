import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text, TextInput, Button, Icon,Snackbar} from 'react-native-paper';
import storage from '../../utils/storage';
import {IndexTest, LoginAPI} from '../../api/login';
import {useTranslation} from 'react-i18next';
import { useBoundStore } from '../../store';

export default function LoginPage({navigation}) {
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');

  const [msg,setMsg] = useState('')

  const {t} = useTranslation();

  const register = () => {
    navigation.push('RegisterPage');
  };

  const [visible,setVisible] = useState(false)
  const onShowInfo = () => {
    setVisible(true)
  }

  const lang = useBoundStore((state) => state.lang)

  const handleSubmit = () => {
    console.log(navigation);
    // navigation.push('HomePage')
    const param = {
      tel: tel,
      password: password,
    };
    console.log(param);
    // console.log(lang);
    IndexTest()
    

    LoginAPI(param).then(res => {
      console.log("res=",res.data);
      if (res.data.code === 0) {
        console.log(res.data);
        storage
          .save({
            key: 'userData',
            data: res.data.data,
            expires: null,
          })
          .then(() => {
            navigation.replace('Index');
          });
      } else {
        onShowInfo()
        setMsg(res.data.msg)

        
      }
    });
    // storage.save({key:'userData',data:{patientId:'123'},expires:null}).then(res => {
    //     console.log(res);
    // })
  };

  return (
    <View style={styles.containerStyle}>
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
        <Text style={styles.headingStyle}>{t('username')}</Text>
        <TextInput
          mode="outlined"
          value={tel}
          onChangeText={text => setTel(text)}
        />
        <Text style={styles.headingStyle}>{t('password')}</Text>
        <TextInput
          mode="outlined"
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <Button mode="contained" onPress={() => handleSubmit()}>
          {t('login')}
        </Button>
        <Button mode="contained-tonal" onPress={() => register()}>
          {t('register')}
        </Button>
        <Snackbar
              visible={visible}
              onDismiss={() => setVisible(false)}
              duration={1000}
              >
              {msg}
            </Snackbar>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollViewStyle: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headingStyle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
