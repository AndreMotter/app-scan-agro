import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_BASE_URL } from "../../constants/api";

export default function Cultura() {
  const [culturas, setCulturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modo, setModo] = useState<"lista" | "novo" | "editar">("lista");

  const [nome, setNome] = useState("");
  const [nomecientifico, setNomeCientifico] = useState("");
  const [descricao, setDescricao] = useState("");

  const [codigocultura, setCodigocultura] = useState<number | null>(null);

  function BotaoSair() {
    router.replace("/auth/login" as any);
  }

  async function ListarCulturas() {
    try {
      const resp = await fetch(API_BASE_URL + "/sgr-cultura/ListarTodos");
      const data = await resp.json();
      setCulturas(data);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar culturas.");
    } finally {
      setLoading(false);
    }
  }

  function AbrirEditarCultura(item: any) {
    setCodigocultura(item.codigocultura);
    setNome(item.nome);
    setNomeCientifico(item.nomecientifico ?? "");
    setDescricao(item.descricao ?? "");
    setModo("editar");
  }

  function AbrirIncluirCultura() {
    LimparCultura();
    setModo("novo");
  }

  function LimparCultura() {
    setCodigocultura(null);
    setNome("");
    setNomeCientifico("");
    setDescricao("");
  }

  async function SalvarCultura() {
    if (!nome.trim()) {
      Alert.alert("Atenção", "O nome da cultura é obrigatório!");
      return;
    }

    try {
      if (modo === "editar") {
        if (!codigocultura) {
          Alert.alert("Erro", "Nenhuma cultura selecionada para edição.");
          return;
        }

        const resp = await fetch(
          API_BASE_URL + `/sgr-cultura/Alterar/${codigocultura}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nome,
              nomecientifico,
              descricao,
            }),
          }
        );

        if (!resp.ok) {
          Alert.alert("Erro", "Não foi possível alterar a cultura.");
          return;
        }
      } else {
        const resp = await fetch(API_BASE_URL + "/sgr-cultura/Salvar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome,
            nomecientifico,
            descricao,
          }),
        });

        if (!resp.ok) {
          Alert.alert("Erro", "Não foi possível salvar a cultura.");
          return; 
        }
      }

      LimparCultura();
      setModo("lista");
      ListarCulturas();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar a cultura.");
    }
  }

  async function ExcluirCultura(codigocultura: number) {
    Alert.alert("Excluir", "Tem certeza que deseja excluir esta cultura?", [
      { text: "Cancelar" },
      {
        text: "Sim",
        onPress: async () => {
          try {
            const resp = await fetch(
              API_BASE_URL + `/sgr-cultura/Excluir/${codigocultura}`,
              {
                method: "DELETE",
              }
            );

            if (!resp.ok) {
              Alert.alert("Erro", "Não foi possível excluir.");
            }
            ListarCulturas();
          } catch (e) {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  }

  useEffect(() => {
    ListarCulturas();
  }, []);

  if (modo === "lista")
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Culturas</Text>

        <TouchableOpacity
          style={styles.botaoNovo}
          onPress={() => AbrirIncluirCultura()}
        >
          <FontAwesome name="plus" size={18} color="#fff" />
          <Text style={styles.txtNovo}> Incluir Cultura</Text>
        </TouchableOpacity>

        {loading ? (
          <Text>Carregando...</Text>
        ) : (
          <FlatList
            data={culturas}
            keyExtractor={(item) => item.codigocultura.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View>
                  <Text style={styles.itemTitulo}>
                    {item.codigocultura}-{item.nome}
                  </Text>
                  <Text style={styles.itemSub}>{item.nomecientifico}</Text>
                </View>

                <View style={styles.itemBotoes}>
                  <TouchableOpacity onPress={() => AbrirEditarCultura(item)}>
                    <FontAwesome name="edit" size={22} color="#1976D2" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => ExcluirCultura(item.codigocultura)}
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
          {modo === "editar" ? "Editar" : "Incluir"}Cultura
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Nome Científico"
          value={nomecientifico}
          onChangeText={setNomeCientifico}
        />

        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={descricao}
          onChangeText={setDescricao}
        />

        <TouchableOpacity style={styles.botaoSalvar} onPress={SalvarCultura}>
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

  botaoNovo: {
    flexDirection: "row",
    backgroundColor: "#43A047",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  txtNovo: { color: "#fff", fontWeight: "bold", marginLeft: 8 },

  item: {
    backgroundColor: "#eee",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemTitulo: { fontWeight: "bold", fontSize: 18 },
  itemSub: { fontSize: 14, color: "#555" },

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
