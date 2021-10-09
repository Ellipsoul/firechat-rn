import React from 'react';
import auth from '@react-native-firebase/auth';
import {
  GoogleSigninButton,
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import {View, StyleSheet} from 'react-native';

// UI for user to log in with Google
const LoginScreen = () => {
  GoogleSignin.configure({
    // Grab this from the google-services.json file, other_platform_oauth_client, client_type 3
    // eslint-disable-next-line prettier/prettier
    webClientId: '789353745622-7sf0td1aek0s0rlcove3g3oi6ce172d6.apps.googleusercontent.com',
  });

  // Async function to log into Firebase using Google
  const handleLogin = async () => {
    try {
      const {idToken} = await GoogleSignin.signIn(); // Google Sign In will return an ID token
      // Then use the ID Token to create a Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Finally use the credentials to sign into Firebase
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console(`Oops! Seems like something went wrong logging in! ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Easy button for Google Sign In out of the box */}
      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#151718',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButton: {width: 225, height: 60},
});

export default LoginScreen;
