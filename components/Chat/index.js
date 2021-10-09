import React from 'react';
import {StyleSheet, TouchableOpacity, Image, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Need to know if a chat message is sent my this user or another user
const Chat = ({chat}) => {
  const {owner} = chat;
  const currentUser = auth().currentUser.uid;

  // Check if the owner of the chat message is the current authenticated user
  // Then render the appropriate chat message type
  return owner === currentUser ? (
    <Sent chat={chat} />
  ) : (
    <Received chat={chat} />
  );
};

// A message not sent by the current user
const Received = ({chat}) => {
  const styles = StyleSheet.create({
    rowStyle: {
      margin: 0,
      height: 75,
      width: '90%',
      marginRight: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      padding: 0,
      fontSize: 18,
      maxWidth: '80%',
      letterSpacing: 0,
      fontWeight: '600',
      textAlign: 'left',
      color: '#131313',
    },
    image: {
      width: 45,
      height: 45,
      marginLeft: 0,
      marginRight: 5,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    touchable: {
      padding: 4,
      elevation: 6,
      minWidth: 10,
      height: 'auto',
      maxWidth: '100%',
      borderRadius: 40,
      marginRight: 'auto',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      backgroundColor: '#00c3ff',
    },
  });

  // Retrieve the necessary pieces of information
  const {id, imageUrl, text} = chat;

  return (
    <View style={styles.rowStyle}>
      {/* TouchableOpacity is the equivalent to Flutters GestureDetector */}
      <TouchableOpacity key={id} style={styles.touchable}>
        {/* Just the user's profile picture, and the chat message */}
        <Image style={styles.image} source={{uri: imageUrl}} />
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

// A message sent by the user
const Sent = ({chat}) => {
  const styles = StyleSheet.create({
    rowStyle: {
      margin: 0,
      height: 75,
      width: '90%',
      marginLeft: 'auto',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    text: {
      padding: 0,
      fontSize: 18,
      maxWidth: '80%',
      letterSpacing: 0,
      fontWeight: '600',
      textAlign: 'right',
      color: '#131313',
    },
    image: {
      width: 45,
      height: 45,
      marginLeft: 4,
      marginRight: 0,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    touchable: {
      padding: 4,
      minWidth: 10,
      elevation: 6,
      height: 'auto',
      maxWidth: '100%',
      marginRight: 0,
      marginLeft: 'auto',
      borderRadius: 40,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      backgroundColor: '#ffa600',
    },
  });

  // Retrieve the necessary pieces of information
  const {id, imageUrl, text} = chat;

  // Additional logic to delete a chat message that the user owns
  const handleDelete = async () => {
    await firestore().collection('chats').doc(id).delete();
  };

  return (
    <View style={styles.rowStyle}>
      <TouchableOpacity
        key={id}
        onPress={handleDelete}
        style={styles.touchable}>
        {/* Just the user's profile picture, and the chat message */}
        <Text style={styles.text}>{text}</Text>
        <Image style={styles.image} source={{uri: imageUrl}} />
      </TouchableOpacity>
    </View>
  );
};

export default Chat;
