import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {GenericStyles} from '../styles/Styles';
import {Context as context} from '../../Context';
import Loader from './Loader';

/**
 * Fuctional component variables
 */
const Login = ({navigation}) => {
  const auth = context();
  const [login, setLogin] = useState({
    username: '',
    password: '',
    hidePassword: true,
  });
  const passwordInputRef = useRef();

  const onLogin = () => {
    if (!login.username) {
      Alert.alert('Please fill Username');
      return;
    }
    if (!login.password) {
      Alert.alert('Please fill Password');
      return;
    }
    auth.setState(prevState => ({
      ...prevState,
      loading: true,
    }));
    auth.saveToken(login).then(data => {
      if (data && data.status === 'mfa') {
        auth.setState(prevState => ({
          ...prevState,
          error: '',
          success: '',
          loading: false,
          secure: {
            hash: data.hash,
            session: data.session,
            username: login.username,
          },
          pwd: login.password,
        }));
        navigation.navigate('Verification');
      } else {
        auth.setState(prevState => ({
          ...prevState,
          error: 'Invalid username or password',
          success: '',
          loading: false,
        }));
      }
    });
  };

  const handleInput = name => value => {
    setLogin(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const setPasswordVisibility = () => {
    setLogin(prevState => ({
      ...prevState,
      hidePassword: !login.hidePassword,
    }));
  };

  return (
    <ScrollView style={GenericStyles.container}>
      <Loader loading={auth.state.loading} />
      <View style={styles.logo}>
        <Image source={require('../../assets/splashlogo.png')} />
      </View>
      <View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            mode="outlined"
            label="Username"
            placeholder="Enter your username"
            placeholderTextColor="#888"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() =>
              passwordInputRef.current && passwordInputRef.current.focus()
            }
            onChangeText={handleInput('username')}
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
            theme={styles.textInputOutlineStyle}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            mode="outlined"
            label="Password"
            placeholder="Password"
            ref={passwordInputRef}
            placeholderTextColor="#888"
            onSubmitEditing={Keyboard.dismiss}
            secureTextEntry={login.hidePassword}
            returnKeyType="next"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
            onChangeText={handleInput('password')}
            theme={styles.textInputOutlineStyle}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.touachableButton}
            onPress={setPasswordVisibility}>
            <Image
              source={
                login.hidePassword
                  ? require('../../assets/eye.png')
                  : require('../../assets/eye-slash.png')
              }
              style={styles.buttonImage}
            />
          </TouchableOpacity>
        </View>
        {auth.state.error && (
          <View style={styles.errorWrapper}>
            <Text style={styles.error}>{auth.state.error}</Text>
          </View>
        )}
        <View style={{paddingTop: 30}}>
          <TouchableOpacity
            style={GenericStyles.btnWrapper}
            onPress={onLogin}
            activeOpacity={0.5}>
            <Text style={GenericStyles.buttonTextStyle}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;

/**
 * Fuctional component styles
 */
const styles = StyleSheet.create({
  touachableButton: {
    position: 'absolute',
    top: 16,
    right: 3,
    height: 40,
    width: 35,
    padding: 2,
  },
  buttonImage: {
    resizeMode: 'contain',
    height: '70%',
    width: '70%',
  },
  errorWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#ff0000',
    fontSize: 14,
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 60,
    color: '#fb5b5a',
    marginBottom: 40,
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    marginTop: 20,
    marginBottom: 5,
  },
  TextInput: {
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    color: '#000',
    backgroundColor: '#FFF',
    activeOutlineColor: '#01403c',
  },
  forgot_button: {
    height: 30,
    marginTop: 15,
    marginBottom: 30,
    color: '#01403C',
  },

  logo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
    marginBottom: 70,
  },
  textInputOutlineStyle: {
    colors: {primary: '#01403c', placeholderTextColor: '#01403c'},
  },
});
