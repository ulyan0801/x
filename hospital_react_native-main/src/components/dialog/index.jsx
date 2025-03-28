import { StyleSheet, Text } from 'react-native'
import { Dialog } from '@rneui/base';
import React from 'react'

export default function DialogCustom({ dialogTitle, dialogContent, dialogIsVisible, onDetermine, onCancel }) {

  return (
    <Dialog
      overlayStyle={styles.dialogBox}
      isVisible={dialogIsVisible}
      onBackdropPress={onCancel}
    >
      <Dialog.Title title={dialogTitle} />
      <Text>{dialogContent}</Text>
      <Dialog.Actions>
        <Dialog.Button title="取消" onPress={onCancel} />
        <Dialog.Button title="确定" onPress={onDetermine} />
      </Dialog.Actions>
    </Dialog>
  )
}

const styles = StyleSheet.create({
  dialogBox: {
    backgroundColor: '#fff'
  }
})