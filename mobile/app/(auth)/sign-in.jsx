import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, } from 'react-native'
import { useState } from 'react'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import {authStyles} from '../../assets/styles/auth.styles';
import {Image} from 'expo-image';
import { COLORS } from '../../constants/colors';
import {Ionicons} from "@expo/vector-icons";

const SignInScreen = () => {
  
  const router = useRouter();

  const {signIn, setActive, isLoaded} = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor vuelve a intentarlo")
      return
    }

    if(!isLoaded) return;

    setLoading(true)

    try {
      const signInAttempt = await signIn.create({
        identifier:email,
        password
      })
      
      if(signInAttempt.status==="complete"){
        await setActive({session:signInAttempt.createdSessionId})
      }else{
        Alert.alert("ERROR", "No se puede crear una cuenta, Intentelo más tarde");
        console.log(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err){
      Alert.alert("Error", err.errors?.[0]?.messaged || "Fallo al Registrarse")
      console.log(JSON.stringify(err, null, 2))

    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={authStyles.container}>
        <KeyboardAvoidingView
          style={authStyles.keyboardView}
          behavior={Platform.OS === 'android' ? 'padding' : "height"}
          keyboardVerticalOffset={Platform.OS === "android" ? 64 : 0}
        >

          <ScrollView
            contentContainerStyle={authStyles.scrollContent}
            showsHorizontalScrollIndicator ={false}
          >

            <View style={authStyles.imageContainer}>
              <Image 
                source={require("../../assets/images/icsiLogo.png")}
                style={authStyles.image}
                contentFit="contain"
              />
            </View>

            <Text style={authStyles.title}>Inventario Siemens</Text>

            {/*FORMULARIO */}
            <View style={authStyles.formContainer}>
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="Ingresa tu correo"
                  placeholderTextColor={COLORS.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {/*FORMULARIO CONTRASEÑA */}
              <View style={authStyles.inputContainer}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor={COLORS.textLight}
                  value={password}
                  onChangeText={setpassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={authStyles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                     name={showPassword ? "eye-outline" : "eye-off-outline"}
                     size={20}
                     color={COLORS.textLight}
                  />
                </TouchableOpacity>
              </View>
              
              {/*BOTON INICIAR SESION */}
              <TouchableOpacity
                style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={authStyles.buttonText}>{loading ? "Signing In..." : "Iniciar Sesión"}</Text>
              </TouchableOpacity>

              {/*BOTON REGISTRARSE */}
              <TouchableOpacity
                style={authStyles.linkContainer}
                onPress={() => router.push("/(auth)/sign-up")}
              >
                <Text style={authStyles.link}>Registrate . </Text> 
              </TouchableOpacity>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
    </View>
  )
}

export default SignInScreen