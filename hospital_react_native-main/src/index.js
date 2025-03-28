import React from 'react'
import MainTab from './routes'

import 'react-native-url-polyfill/auto';
import 'text-encoding-polyfill';

if (!Symbol.asyncIterator) {
  Symbol.asyncIterator = Symbol.for('Symbol.asyncIterator');
}

export default function index() {
  return (
    <>
    {/* if (storage) {
      storage.load({
        key: 'userData',
        autoSync: false,
        syncInBackground: false,
      }).then(res => {
        if (!res.patientId) {
          <LoginPage/>
        }else{
          <MainTab />

        }
      })
    } */}
    <MainTab />
    </>
  )
}