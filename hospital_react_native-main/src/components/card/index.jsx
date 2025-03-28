import React, { } from 'react'
import { StyleSheet, View, SafeAreaView, ScrollView, useWindowDimensions } from 'react-native'
import { Card } from '@rneui/base';

export default function CardCustom({ children, headType }) {

  const { height } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card containerStyle={{ minHeight: height - 157 }}>
          {
            headType ?
              <View style={styles.headerCircle}>
                {
                  Array(7).fill().map((_, index) => {
                    return <View key={index} style={styles.circleItem}></View>
                  })
                }
              </View>
              : null
          }
          {children}
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  headerCircle: {
    justifyContent: 'space-between',
    flexDirection: "row",
    marginBottom: 15,
  },
  circleItem: {
    borderColor: '#eee',
    borderStyle: 'solid',
    borderWidth: 1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
  },
})