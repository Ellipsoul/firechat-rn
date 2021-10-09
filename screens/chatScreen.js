import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  View,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Chat from '../components/Chat';
import Input from '../components/Input';
import SendButton from '../components/SendButton';
import SignOutButton from '../components/SignOutButton';

// Main chat screen
const ChatScreen = () => {
  // Track state of chats and loading state
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  // Track state of user typing in a message and its time
  const [text, setText] = useState('');
  const timestamp = firestore.FieldValue.serverTimestamp();

  // Handle logic to send a new message
  const sendMessage = async e => {
    const {uid, photoURL} = auth().currentUser;

    // Dont allow empty/large messages
    if (text.length > 1 && text.length < 40) {
      try {
        e.preventDefault();
        setLoading(true);
        // Make a Firestore write
        await firestore()
          .collection('chats')
          .doc()
          .set({
            owner: uid,
            imageUrl: photoURL,
            text: text,
            createdAt: timestamp,
          })
          .then(() => {
            // On success, empty the text field and stop loading state
            setText('');
            setLoading(false);
          })
          .catch(err => {
            // On failure, alert user
            setLoading(false);
            Alert.alert('Message failed to send', err);
          });
      } catch (err) {
        setLoading(false);
        Alert.alert('Error', err);
      }
    } else {
      // Warn the user about chat message length
      setLoading(false);
      Alert.alert('Chat not sent', 'Must be between 1 and 40 characters');
    }
  };

  const handleSignOut = async () => await auth().signOut();

  // Run once to collect chat messages
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .orderBy('createdAt', 'asc')
      .limitToLast(30)
      .onSnapshot(querySnapshot => {
        // Map each document down to its id and data
        const chatsArr = [];
        querySnapshot.forEach(doc => {
          const id = doc.id;
          const data = doc.data();
          // Add docId and chat data to chats array
          chatsArr.push({id, ...data});
        });
        // Finall update the chat array state and stop loading state
        setChats(chatsArr);
        setLoading(false);
      });

    // Unsubscribe from listening to chats after the use has logged out/navigated away
    return () => {
      unsubscribe();
      setLoading(false);
    };
  }, []);

  // UI
  if (loading) {
    // If still loading just return some loading indicator
    return <ActivityIndicator />;
  } else {
    // Otherwise render the chat list
    const username = auth().currentUser.displayName;

    return (
      <View style={styles.container}>
        {/* Top app bar for signing out */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>{username}</Text>
          <SignOutButton handleClick={handleSignOut} />
        </View>

        {/* Chats container */}
        <View style={styles.chatStyle}>
          {/* If there are chats return a FlatList, a scrollable list of items */}
          {/* Data is the array of items to be used. renderItem defined what should be rendered */}
          {chats && (
            <FlatList
              data={chats}
              renderItem={({item}) => <Chat key={item.id} chat={item} />}
            />
          )}
        </View>

        {/* Bottom text field for sending chats */}
        <View style={styles.inputContainer}>
          <Input text={text} setText={setText} />
          <SendButton handleChat={sendMessage} />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  chatStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '90%',
    margin: 0,
    padding: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    // overflowY: 'scroll',
  },
  container: {
    height: '100%',
    width: '100%',
    margin: 0,
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
    paddingBottom: '15%',
    paddingTop: 0,
    backgroundColor: '#151718',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '100%',
    height: 60,
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 0,
    padding: 0,
    paddingBottom: 0,
    backgroundColor: '#151718',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e2123',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  text: {
    fontWeight: '600',
    fontSize: 20,
    color: '#030303',
    marginRight: 'auto',
    marginLeft: 8,
    padding: 4,
  },
  textContainer: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    margin: 0,
    padding: 8,
    elevation: 6,
    backgroundColor: '#ffa600',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ChatScreen;
