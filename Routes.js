import React, {useState} from 'react';
import {Image, TouchableOpacity, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Accounts from './src/screens/Accounts';
import AccountView from './src/screens/AccountsView';
import Verification from './src/screens/Verification';
import {Context as context} from './Context';

const Stack = createNativeStackNavigator();

const MyRoutes = () => {
  const auth = context();
  const [isProtectedRoutes, setProtected] = useState(0);
  const onLogout = () => {
    auth.removeToken().then(() => {
      setProtected(false);
    });
  };

  const showConfirmDialog = () => {
    Alert.alert('', 'Are you sure to Logout', [
      {text: 'Confirm', onPress: onLogout},
      {
        text: 'Cancel',
      },
    ]);
  };

  const handleVerification = data => {
    setProtected(data);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isProtectedRoutes ? (
          <>
            <Stack.Screen
              name="Accounts"
              component={Accounts}
              options={{
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#01403c',
                },
                headerRight: () => (
                  <TouchableOpacity onPress={showConfirmDialog}>
                    <Image source={require('./assets/logout-1.png')} />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              name="AccountView"
              component={AccountView}
              options={({route}) => ({
                title: route.params.name,
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#01403c',
                },
                headerRight: () => (
                  <TouchableOpacity onPress={showConfirmDialog}>
                    <Image source={require('./assets/logout-1.png')} />
                  </TouchableOpacity>
                ),
              })}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              options={{
                title: 'Login',
                headerTintColor: '#fff',
                headerTitleStyle: {
                  color: '#fff',
                  fontSize: 20,
                },
                headerStyle: {
                  backgroundColor: '#01403c',
                },
              }}>
              {props => <Login {...props} />}
            </Stack.Screen>
            <Stack.Screen
              name="Verification"
              options={{
                title: 'Login',
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#01403c',
                },
              }}>
              {props => (
                <Verification {...props} onVerification={handleVerification} />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyRoutes;
