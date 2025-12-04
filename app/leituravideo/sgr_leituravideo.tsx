import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { API_BASE_URL } from "../../constants/api";

export default function LeituraVideo() {
  const [leituras, setLeituras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtroArea, setFiltroArea] = useState("");
  const [filtroCultura, setFiltroCultura] = useState("");

  async function ListarLeituras(filtroArea_filtrar?: string, filtroCultura_filtrar?: string) {
    try {
      const token = await AsyncStorage.getItem("token");

      const resp = await fetch(API_BASE_URL + `/sgr-leituravideo/ListarTodos?area=${filtroArea_filtrar}&cultura=${filtroCultura_filtrar}`, {
        headers: { Authorization: "Bearer " + token },
      });

      const data = await resp.json();
      setLeituras(data);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar as leituras.");
    } finally {
      setLoading(false);
    }
  }

  async function ExcluirLeitura(codigo: number) {
    const token = await AsyncStorage.getItem("token");

    Alert.alert("Excluir", "Deseja realmente excluir esta leitura?", [
      { text: "Cancelar" },
      {
        text: "Sim",
        onPress: async () => {
          try {
            const resp = await fetch(
              API_BASE_URL + `/sgr-leituravideo/Excluir/${codigo}`,
              {
                method: "DELETE",
                headers: { Authorization: "Bearer " + token },
              }
            );

            if (!resp.ok) {
              Alert.alert("Erro", "Não foi possível excluir.");
            }
            ListarLeituras();
          } catch (e) {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  }

  useEffect(() => {
    ListarLeituras();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lançamentos de Vídeos</Text>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
        
        <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Código Área"
            keyboardType="numeric"
            value={filtroArea}
            onChangeText={(v) => {
            setFiltroArea(v);
            ListarLeituras(v, filtroCultura);
            }}
        />

        <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Código Cultura"
            keyboardType="numeric"
            value={filtroCultura}
            onChangeText={(v) => {
            setFiltroCultura(v);
            ListarLeituras(filtroArea, v);
            }}
        />

        </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1976D2" />
      ) : (
        <FlatList
          data={leituras}
          keyExtractor={(item) => item.codigoleituravideo.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitulo}>
                  #{item.codigoleituravideo}-{item.video}
                </Text>

                <Text style={styles.subItem}>
                  Área: {item.codigoareacoleta}-{item.areacoleta?.nome}
                </Text>

                <Text style={styles.subItem}>
                  Cultura: {item.codigocultura}-{item.cultura?.nome}
                </Text>

                <Text style={styles.subItem}>
                  Quantidade: {item.quantidade}
                </Text>

                <Text style={styles.subItem}>
                  Data/Hora: {new Date(item.datahora).toLocaleString()}
                </Text>
              </View>

              <View style={styles.itemBotoes}>
                <TouchableOpacity
                  onPress={() => ExcluirLeitura(item.codigoleituravideo)}
                >
                  <FontAwesome name="trash" size={22} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  input: {
  width: "100%",
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 12,
  borderRadius: 8,
  marginBottom: 12,
  backgroundColor: "#fff",
  fontSize: 16,
},

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  item: {
    backgroundColor: "#eee",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "row",
    gap: 15,
  },

  itemTitulo: { fontWeight: "bold", fontSize: 18 },

  subItem: { fontSize: 14, color: "#555" },

  itemBotoes: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});
