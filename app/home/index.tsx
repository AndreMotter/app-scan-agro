import { FontAwesome } from '@expo/vector-icons';
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  function handleSair() {
    router.replace("/auth/login" as any);
  }

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/scan_agro_sem_fundo.png")} style={styles.logo} /> 
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/cadastros" as any)}>
          <FontAwesome name="user-circle" size={24} color="#000" />
          <Text style={styles.buttonText}>Usuários</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push("cultura/sgr_cultura" as any)}>
          <FontAwesome name="user-circle" size={24} color="#000" />
          <Text style={styles.buttonText}>Culturas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/lancamentos" as any)}>
          <FontAwesome name="list-alt" size={24} color="#000" /> 
          <Text style={styles.buttonText}>Lançamentos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/graficos" as any)}>
          <FontAwesome name="bar-chart" size={24} color="#000" />
          <Text style={styles.buttonText}>Gráficos</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleSair}>
        
        <Text style={styles.logoutText}><FontAwesome name="sign-out" size={18} color="#000" /> Sair</Text>
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
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#FFC107",
    paddingVertical: 12,
    marginVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  logoutButton: {
    position: "absolute",
    bottom: 30,
    backgroundColor: "#E53935",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
