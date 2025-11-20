import { FontAwesome } from '@expo/vector-icons';
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { stylesGlobal } from "../../styles/global";

export default function Home() {

  function Sair() {
    router.replace("/auth/login" as any);
  }

  return (
    <View style={stylesGlobal.container}>
      <Image source={require("../../assets/images/scan_agro_sem_fundo.png")} style={stylesGlobal.logo} /> 
      
      <View style={stylesGlobal.buttonContainer}>
        <TouchableOpacity style={stylesGlobal.button} onPress={() => router.push("/cadastros" as any)}>
          <FontAwesome name="user-circle" size={24} color="#000" />
          <Text style={stylesGlobal.buttonText}>Usuários</Text>
        </TouchableOpacity>
        <TouchableOpacity style={stylesGlobal.button} onPress={() => router.push("cultura/sgr_cultura" as any)}>
          <FontAwesome name="user-circle" size={24} color="#000" />
          <Text style={stylesGlobal.buttonText}>Culturas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={stylesGlobal.button} onPress={() => router.push("/lancamentos" as any)}>
          <FontAwesome name="list-alt" size={24} color="#000" /> 
          <Text style={stylesGlobal.buttonText}>Lançamentos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={stylesGlobal.button} onPress={() => router.push("/graficos" as any)}>
          <FontAwesome name="bar-chart" size={24} color="#000" />
          <Text style={stylesGlobal.buttonText}>Gráficos</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={stylesGlobal.logoutButton} onPress={Sair}>   
        <Text style={stylesGlobal.logoutText}><FontAwesome name="sign-out" size={18} color="#000" /> Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
