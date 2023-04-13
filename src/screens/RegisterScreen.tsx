/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { WhiteLogo } from '../components/WhiteLogo';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../theme/loginTheme';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> { }

export const RegisterScreen = ({ navigation }: Props) => {

  const { signUp, errorMessage, removeError } = useContext(AuthContext);

  const { email, password, name, onChange } = useForm({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (errorMessage.length === 0) return;

    Alert.alert(
      'Login Incorrecto',
      errorMessage,
      [
        {
          text: 'Ok',
          onPress: removeError,
        },
      ]
    );

  }, [errorMessage]);

  const onRegister = () => {
    Keyboard.dismiss();

    signUp({
      nombre: name,
      correo: email,
      password,
    });
  };

  return (
    <>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#5856D6' }}
        behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
      >

        <View style={loginStyles.formContainer}>
          {/* Keyboard avoid view */}
          <WhiteLogo />

          <Text style={loginStyles.title} >Register</Text>

          <Text style={loginStyles.label} >Name</Text>
          <TextInput
            placeholder="Ingrese su nombre"
            placeholderTextColor="rgba(255,255,255,0.5)"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              (Platform.OS === 'ios') && loginStyles.inputFieldIOS,
            ]}
            selectionColor="rgba(255,255,255,0.4)"

            onChangeText={(value) => onChange(value, 'name')}
            value={name}
            onSubmitEditing={onRegister}

            autoCapitalize="words"
            autoCorrect={false}

          />

          <Text style={loginStyles.label} >Email</Text>
          <TextInput
            placeholder="Ingrese su email"
            placeholderTextColor="rgba(255,255,255,0.5)"
            keyboardType="email-address"
            underlineColorAndroid="white"
            style={[
              loginStyles.inputField,
              (Platform.OS === 'ios') && loginStyles.inputFieldIOS,
            ]}
            selectionColor="rgba(255,255,255,0.4)"

            onChangeText={(value) => onChange(value, 'email')}
            value={email}
            onSubmitEditing={onRegister}

            autoCapitalize="none"
            autoCorrect={false}

          />

          <Text style={loginStyles.label} >Password</Text>
          <TextInput
            placeholder="********"
            placeholderTextColor="rgba(255,255,255,0.5)"
            underlineColorAndroid="white"
            secureTextEntry
            style={[
              loginStyles.inputField,
              (Platform.OS === 'ios') && loginStyles.inputFieldIOS,
            ]}
            selectionColor="rgba(255,255,255,0.4)"

            onChangeText={(value) => onChange(value, 'password')}
            value={password}
            onSubmitEditing={onRegister}

            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Boton login */}
          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={loginStyles.button}
              onPress={onRegister}
            >
              <Text style={loginStyles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>

          {/* Registrarse */}
          <TouchableOpacity
            onPress={() => navigation.replace('LoginScreen')}
            activeOpacity={0.8}
            style={loginStyles.buttonReturn}
          >
            <Text style={loginStyles.buttonText}>Login</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </>

  );
};
