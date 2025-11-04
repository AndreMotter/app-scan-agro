import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  function handleEntrar() {
    // aqui tu pode validar login/senha e redirecionar
    router.replace("/home" as any);
  }

  return (
    <View style={styles.container}>    
      <Image source={require("../../assets/images/scan_agro_sem_fundo.png")} style={styles.logo} /> 
      <Text style={styles.label}>Login:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu login"
        value={usuario}
        onChangeText={setUsuario}
      />

      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleEntrar}>
        <Text style={styles.buttonText}> <FontAwesome name="sign-in" size={18} color="#000" /> Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  label: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: "80%",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#FFC107",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
  },
});
