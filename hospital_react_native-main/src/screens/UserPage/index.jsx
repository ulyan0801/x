import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {ListItem} from '@rneui/base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from '../../utils/storage';
// import Dialog from '../../components/dialog'
import Card from '../../components/card';

import { useBoundStore } from '../../store';
import { shallow } from 'zustand/shallow';

import {Dialog, Portal,Button} from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const defaultHeader = require('../../assets/images/default_header.png');

export default function User({navigation}) {

  const {t,i18n} = useTranslation()

  const changeLang = useBoundStore((state)=>
    state.changeLang
  )
  const lang = useBoundStore((state) => state.lang)
  
  const userList = [
    {
      title: t("Orders"),
      icon: 'calendar-outline',
      color: '#333',
      func: () => {
        navigation.push('OrdersPage');
      },
    },
    // {
    //   title: '处方信息',
    //   icon: 'document-text-outline',
    //   color: '#333',
    //   func:()=>{
    //     navigation.push('OrdersPage');
    //   }
    // },
    // {
    //   title: '修改个人信息',
    //   icon: 'settings-outline',
    //   color: '#333',
    //   func:()=>{
    //     navigation.push('OrdersPage');
    //   }
    // },
    {
      title: t("logout"),
      icon: 'log-out-outline',
      color: '#333',
      func: () => {
        setDialogVisible(true);
      },
    },
  ];

  const [userData, setUserData] = useState({});
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const transEN = () => {
    i18n.changeLanguage('en');
    // changeLang('en')
    storage.save({
      key:'lang',
      data:{
        lang:'en_US'
      },
      expires:null
    })
    console.log('en_US');
    

  }

  const transZH = () => {
    i18n.changeLanguage('zh');
    // changeLang('zh')
    storage.save({
      key:'lang',
      data:{
        lang:"zh_CN"
      },
      expires:null
    })
    console.log('zh_CN');
    
  }
  const transRU = () => {
    i18n.changeLanguage('ru');
    storage.save({
      key:'lang',
      data:{
        lang:"ru_RU"
      },
      expires:null
    })
  }

  // 读取userData
  const getUserData = () => {
    storage
      .load({
        key: 'userData',
        autoSync: true,
        syncInBackground: true,
      })
      .then(ret => {
        console.log(ret);
        setUserData(ret);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onDetermine = () => {
    // 清除userData
    storage.remove({
      key: 'userData',
    });
    setUserData({});
    setDialogVisible(!dialogVisible);
    const nav = navigation.getParent();
    console.log(nav);

    // navigation.goBack('LoginPage')
    nav.replace('LoginPage');
  };

  const onCancel = () => {
    setDialogVisible(!dialogVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card headType={true}>
          <View style={styles.headerBox}>
            <Image source={defaultHeader} style={styles.headerImg}></Image>
            <View style={styles.headerTextBox}>
              <Text style={styles.headerTextTop}>
                {userData?.patientName ? (
                  userData?.patientName
                ) : (
                  <View style={styles.headerTextLogin}>
                    <Text style={styles.headerTextLoginText}>未登录</Text>
                    <Ionicons
                      name="chevron-forward-outline"
                      size={25}
                      color="#999"
                    />
                  </View>
                )}
              </Text>
              <Text style={styles.headerTextBottom}>
                {userData?.patientTel || '请登录'}
              </Text>
            </View>
          </View>
          {userList.map((item, index) => {
            return (
              <ListItem bottomDivider key={index} onPress={item.func || null}>
                <Ionicons name={item.icon} size={20} color={item.color} />
                <ListItem.Content>
                  <ListItem.Title>{item.title}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            );
          })}
          <Button onPress={() => transEN()}>Change to English</Button>
          <Button onPress={() => transZH()}>切换中文</Button>
          <Button onPress={() => transRU()}>Переключиться на русский</Button>
        </Card>
      </ScrollView>
      {/* <Dialog
        onDetermine={onDetermine}
        onCancel={onCancel}
        dialogIsVisible={dialogVisible}
        dialogTitle='确认退出？'
        dialogContent='退出后需要重新登录'
      /> */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => onCancel()}>
          <Dialog.Title>{t("ConfirmLogout")}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{t("LogoutRequiresReLogin")}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => onCancel()}>{t("Cancel")}</Button>
            <Button onPress={() => onDetermine()}>{t("Confirm")}</Button>
          </Dialog.Actions>
        </Dialog>

      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerBox: {
    borderColor: '#DEDEDE',
    borderStyle: 'solid',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    padding: 16,
    width: '100%',
    flexDirection: 'row',
  },
  headerImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTextBox: {
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  headerTextTop: {
    fontSize: 18,
  },
  headerTextLogin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextLoginText: {
    lineHeight: 25,
    fontSize: 18,
  },
  headerTextBottom: {
    fontSize: 16,
  },
});
