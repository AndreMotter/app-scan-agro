import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_BASE_URL } from "../../constants/api";
import { stylesGlobal } from "../../styles/global";

export default function AreaColeta() {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modo, setModo] = useState<"lista" | "novo" | "editar">("lista");

  const [nome, setNome] = useState("");
  const [codigoareacoleta, setCodigoAreaColeta] = useState<number | null>(null);

  async function ListarAreas() {
    try {
      const token = await AsyncStorage.getItem("token");
      const resp = await fetch(API_BASE_URL + "/sgr-areacoleta/ListarTodos", {
        headers: { Authorization: "Bearer " + token },
      });

      const data = await resp.json();
      setAreas(data);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar áreas de coleta.");
    } finally {
      setLoading(false);
    }
  }

  function AbrirEditarArea(item: any) {
    setCodigoAreaColeta(item.codigoareacoleta);
    setNome(item.nome);
    setModo("editar");
  }

  function AbrirIncluirArea() {
    LimparArea();
    setModo("novo");
  }

  function LimparArea() {
    setCodigoAreaColeta(null);
    setNome("");
  }

  async function SalvarArea() {
    if (!nome.trim()) {
      Alert.alert("Atenção", "O nome da área é obrigatório!");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      if (modo === "editar") {
        if (!codigoareacoleta) {
          Alert.alert("Erro", "Nenhuma área selecionada.");
          return;
        }

        const resp = await fetch(
          API_BASE_URL + `/sgr-areacoleta/Alterar/${codigoareacoleta}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ nome }),
          }
        );

        if (!resp.ok) {
          Alert.alert("Erro", "Não foi possível alterar a área.");
          return;
        }
      } else {
        const resp = await fetch(API_BASE_URL + "/sgr-areacoleta/Salvar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ nome }),
        });

        if (!resp.ok) {
          Alert.alert("Erro", "Não foi possível salvar a área.");
          return;
        }
      }

      LimparArea();
      setModo("lista");
      ListarAreas();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar.");
    }
  }

  async function ExcluirArea(codigo: number) {
    const token = await AsyncStorage.getItem("token");

    Alert.alert("Excluir", "Deseja realmente excluir esta área?", [
      { text: "Cancelar" },
      {
        text: "Sim",
        onPress: async () => {
          try {
            const resp = await fetch(
              API_BASE_URL + `/sgr-areacoleta/Excluir/${codigo}`,
              {
                method: "DELETE",
                headers: { Authorization: "Bearer " + token },
              }
            );

            if (!resp.ok) {
              Alert.alert("Erro", "Não foi possível excluir.");
            }

            ListarAreas();
          } catch (e) {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  }

  useEffect(() => {
    ListarAreas();
  }, []);

  if (modo === "lista")
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Áreas de Coleta</Text>

        <TouchableOpacity
          style={stylesGlobal.button}
          onPress={() => AbrirIncluirArea()}
        >
          <Text style={stylesGlobal.buttonText}>
            <FontAwesome name="plus" size={18} /> Incluir Área de Coleta
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#1976D2" />
        ) : (
          <FlatList
            data={areas}
            keyExtractor={(item) => item.codigoareacoleta.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemTitulo}>
                  {item.codigoareacoleta} - {item.nome}
                </Text>

                <View style={styles.itemBotoes}>
                  <TouchableOpacity onPress={() => AbrirEditarArea(item)}>
                    <FontAwesome name="edit" size={22} color="#1976D2" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => ExcluirArea(item.codigoareacoleta)}
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

  if (modo === "novo" || modo === "editar")
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>
          {modo === "editar" ? "Editar" : "Cadastrar"} Área de Coleta
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nome da Área"
          value={nome}
          onChangeText={setNome}
        />

        <TouchableOpacity style={styles.botaoSalvar} onPress={SalvarArea}>
          <Text style={styles.txtBtn}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => setModo("lista")}
        >
          <Text style={styles.txtBtn}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

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
    justifyContent: "space-between",
  },

  itemTitulo: { fontWeight: "bold", fontSize: 18 },

  itemBotoes: { flexDirection: "row", gap: 25 },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },

  botaoSalvar: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },

  botaoVoltar: {
    backgroundColor: "#757575",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  txtBtn: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
