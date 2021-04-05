import React, { useState, useEffect } from 'react';
import {
  Button,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Fragment,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from 'expo-constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'ios-home' : 'ios-home-outline';
            } else if (route.name === 'My Diary') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'black',
          inactiveTintColor: 'gray',
        }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="My Diary" component={DiaryScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen() {
  const { quote, updateQuote } = useQuote()
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.paragraph}>Home</Text>
        <View style={styles.container}>
			{quote && (
				<Fragment>
					<Text style={styles.quoteText}>{quote.text}</Text>
					<Text style={styles.quoteAuthor}>{quote.author}</Text>
					<Button onPress={updateQuote} title="Show Me Another Quote!" />
				</Fragment>
			)}
		</View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DiaryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.paragraph}>My Diary</Text>

        <Text style={styles.prompt}>Today</Text>
        <TextInput
          style={styles.diaryInput}
          placeholder="Your thoughts, feelings, etc."
          multiline="true"
        />
        <Text style={styles.prompt}></Text>
      
        <Text style={styles.prompt}>Rate your happiness</Text>
        <Slider
          style={{width: 200, height: 40, alignSelf:'center'}}
          minimumValue={0}
          maximumValue={10}
          step={1}
          thumbTintColor={'pink'}
          minimumTrackTintColor={'pink'}
        />

        <Text style={styles.prompt}>Rate your productivity</Text>
        <Slider
          style={{width: 200, height: 40, alignSelf:'center'}}
          minimumValue={0}
          maximumValue={10}
          step={1}
          thumbTintColor={'pink'}
          minimumTrackTintColor={'pink'}
        />
        
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.container}
          scrollEnabled={false}>
          <Text style={styles.paragraph}>My Profile</Text>

          <MyImagePicker />

          <Text style={styles.prompt}>Name</Text>
          <TextInput style={styles.profileInput} placeholder="Your name" />

          <Text style={styles.prompt}>D.O.B</Text>
          <TextInput style={styles.profileInput} placeholder="mm/dd/yyyy" />
          <Text style={styles.prompt}>Current mood</Text>
          <TextInput
            style={styles.profileInput}
            placeholder="i.e. happy, exhausted, calm, etc."
          />
          <Text style={styles.prompt}>Dream job</Text>
          <TextInput
            style={styles.profileInput}
            placeholder="i.e. CodeHers Ambassador"
          />
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

function MyImagePicker() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View
      style={{ alignItems: 'center', justifyContent: 'center', margin: 25 }}>
      <Button title="Upload an image" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
}

function useQuote() {
	const [quote, setQuote] = useState(null)

	useEffect(() => {
		updateQuote()
	}, [])

	function updateQuote() {
		fetch("http://localhost:3000/quotes")
			.then((response) => response.json())
			.then((quotes) => {
				const randomIndex = Math.floor(Math.random() * quotes.length)
				setQuote(quotes[randomIndex])
			})
	}

	return { quote, updateQuote }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'white',
    padding: 20,
  },
  paragraph: {
    margin: 24,
    backgroundColor: 'pink',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'McLauren',
  },
  image: {
    height: 100,
    width: 100,
  },
  prompt: {
    fontSize: 18,
    fontFamily: 'Baskerville-Italic',
    textAlign: 'left',
  },
  profileInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 8,
    fontSize: 16,
    fontFamily: 'Baskerville',
  },
  diaryInput: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 8,
    fontSize: 16,
    fontFamily: 'Baskerville',
  },
});
