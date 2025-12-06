import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { API_BASE_URL } from "../../constants/api";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function handleEntrar() {
      if (!usuario || !senha) {
        Alert.alert("Atenção", "Informe login e senha.");
        return;
      }

      try {
        const resp = await fetch(API_BASE_URL + "/sgr-usuario/Login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            login: usuario,
            senha: senha,
          }),
        });

        if (!resp.ok) {
          Alert.alert("Erro", "Usuário ou senha inválidos.");
          return;
        }

        const data = await resp.json();
        await AsyncStorage.setItem("token", data.access_token);
        router.replace("/home" as any);
      } catch (e) {
        Alert.alert("Erro", "Falha ao conectar com o servidor.");
      }
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
