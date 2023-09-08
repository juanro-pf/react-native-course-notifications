import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Platform, StyleSheet, View } from 'react-native';
import * as Notifications from "expo-notifications";
import { useEffect } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true
    };
  }
});

export default function App() {

  useEffect(() => {

    async function configurePushNotifications() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = Notifications.requestPermissionsAsync();
        finalStatus = status
      }

      if (finalStatus !== "granted") {
        Alert.alert("Permission required", "Push Notification are required.");
        return;
      }

      const { data: pushTokenData } = await Notifications.getExpoPushTokenAsync({
        projectId: "8758dc3e-abd9-4ba6-bc0c-c2c409513782"
      });
      console.log(pushTokenData);

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT
        });
      }
    };

    configurePushNotifications();

  }, []);


  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log(notification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    }
  }, []);


  function scheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification",
        body: "This is the body of the notificatiobn",
        data: { userName: "Juan" }
      },
      trigger: {
        seconds: 5
      }
    });
  };

  function sendPushNotificationHandler() {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "to": "ExponentPushToken[XrsPwuBehRtLCjxpDltHLv]",
        "title": "Helloooo",
        "body": "Ehhhhh"
      })
    }).then(res => res.json().then(data => console.log(data)));
  }

  return (
    <View style={styles.container}>
      <Button title='Schedule notification' onPress={scheduleNotificationHandler} />
      <Button title='Send Push Notification' onPress={sendPushNotificationHandler} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
