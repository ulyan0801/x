import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import Index from './src/index';
import "./src/i18n/languages";

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Index />
      </NavigationContainer>
    </PaperProvider>
  );
}
