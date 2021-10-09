import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, View, StyleSheet} from 'react-native';
import ChatScreen from './screens/chatScreen';
import auth from '@react-native-firebase/auth';
import LoginScreen from './screens/loginScreen';

const App = () => {
  // Track the user's authentication state
  const [user, setUser] = useState(null);

  // Run the Firebase authentication on the user just once
  useEffect(() => {
    // onAuthStateChanged is an auth listener
    const unsubscribe = auth().onAuthStateChanged(u => {
      u ? setUser(u) : setUser(null); // Set the user if authenticated, otherwise leave null
    });
    // Returns a function that you can use to turn off the realtime stream when component is destroyed
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    // SafeAreaView means the component will not be blocked by any device notches
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar barStyle={'dark-content'} />
      {/* Container showing chat or login depending on if the user is logged in */}
      <View style={styles.viewStyle}>
        {user ? <ChatScreen /> : <LoginScreen />}
      </View>
    </SafeAreaView>
  );
};

// Simple styles
const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#151718',
  },
  viewStyle: {
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#151718',
  },
});

export default App;
