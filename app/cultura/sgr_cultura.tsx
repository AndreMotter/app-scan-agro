import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { API_BASE_URL } from "../../constants/api";
import { stylesGlobal } from "../../styles/global";

export default function Cultura() {
  const [culturas, setCulturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modo, setModo] = useState<"lista" | "novo" | "editar">("lista");

  const [nome, setNome] = useState("");
  const [nomecientifico, setNomeCientifico] = useState("");
  const [descricao, setDescricao] = useState("");
  const [correferencia, setCorreferencia] = useState("");
  const [imagem, setImagem] = useState("");
  const [situacao, setSituacao] = useState(true);

  const [codigocultura, setCodigocultura] = useState<number | null>(null);

  const lista_cores = [
    { nome: "🔴 Vermelho", valor: "#F44336" },
    { nome: "🌸 Rosa", valor: "#E91E63" },
    { nome: "🟣 Roxo", valor: "#9C27B0" },
    { nome: "🟪 Roxo Escuro", valor: "#673AB7" },
    { nome: "🔵 Azul Anil", valor: "#3F51B5" },
    { nome: "🔵 Azul", valor: "#2196F3" },
    { nome: "🔷 Azul Claro", valor: "#03A9F4" },
    { nome: "🔹 Ciano", valor: "#00BCD4" },
    { nome: "💎 Turquesa", valor: "#009688" },
    { nome: "🟢 Verde", valor: "#4CAF50" },
    { nome: "🟩 Verde Claro", valor: "#8BC34A" },
    { nome: "🟨 Lima", valor: "#CDDC39" },
    { nome: "🟡 Amarelo", valor: "#FFEB3B" },
    { nome: "🟧 Âmbar", valor: "#FFC107" },
    { nome: "🟧 Laranja", valor: "#FF9800" },
    { nome: "🟧 Laranja Escuro", valor: "#FF5722" },
    { nome: "🟫 Marrom", valor: "#795548" },
    { nome: "⬜ Cinza", valor: "#9E9E9E" },
    { nome: "⬛ Cinza Escuro", valor: "#616161" },
    { nome: "🔳 Cinza Azulado", valor: "#607D8B" },
    { nome: "⚫ Preto", valor: "#000000" },
    { nome: "⚪ Branco", valor: "#FFFFFF" },
    { nome: "🤍 Bege", valor: "#F5F5DC" },
    { nome: "🥇 Dourado", valor: "#FFD700" },
    { nome: "🥈 Prata", valor: "#C0C0C0" },
    { nome: "🥉 Bronze", valor: "#CD7F32" },
    { nome: "🍷 Vinho", valor: "#800000" },
    { nome: "🫒 Oliva", valor: "#808000" },
    { nome: "🌿 Verde Musgo", valor: "#556B2F" },
    { nome: "🛢 Azul Petróleo", valor: "#004953" },
  ];


  async function ListarCulturas() {
    try {
     const token = await AsyncStorage.getItem("token");
      const resp = await fetch(API_BASE_URL + "/sgr-cultura/ListarTodos", {
        headers: { Authorization: "Bearer " + token },
      });
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
    setSituacao(true);
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
    setCorreferencia("");
    setImagem("");
    setSituacao(true);
  }

  async function SalvarCultura() {
    if (!nome.trim()) {
      Alert.alert("Atenção", "O nome da cultura é obrigatório!");
      return;
    }

    try {
     const token = await AsyncStorage.getItem("token");
      if (modo === "editar") {
        if (!codigocultura) {
          Alert.alert("Erro", "Nenhuma cultura selecionada para edição.");
          return;
        }

        const resp = await fetch(
          API_BASE_URL + `/sgr-cultura/Alterar/${codigocultura}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
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
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
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
    const token = await AsyncStorage.getItem("token");
    Alert.alert("Excluir", "Tem certeza que deseja excluir esta cultura?", [
      { text: "Cancelar" },
      {
        text: "Sim",
        onPress: async () => {
          try {
            const resp = await fetch(
              API_BASE_URL + `/sgr-cultura/Excluir/${codigocultura}`,
              {
                method: "DELETE", headers: { Authorization: "Bearer " + token },
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

        <TouchableOpacity style={stylesGlobal.button} onPress={() => AbrirIncluirCultura()}>
          <Text style={stylesGlobal.buttonText}><FontAwesome name="plus" size={18}></FontAwesome> Incluir Cultura</Text>
        </TouchableOpacity>

        {loading ? (
           <ActivityIndicator size="large" color="#1976D2" />
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

                  <TouchableOpacity onPress={() => ExcluirCultura(item.codigocultura)}>
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
          {modo === "editar" ? "Editar" : "Incluir"} Cultura
        </Text>

        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />

        <TextInput style={styles.input} placeholder="Nome Científico" value={nomecientifico} onChangeText={setNomeCientifico} />

        <TextInput style={styles.input} placeholder="Descrição" value={descricao} onChangeText={setDescricao}/>

        <Text style={styles.label}>Cor de Referência</Text>

        <View style={styles.select}>
          <Picker selectedValue={correferencia} onValueChange={(v) => setCorreferencia(v)}>         
            <Picker.Item label="Selecione uma cor..." value="" />
            {lista_cores.map((c, i) => (
                <Picker.Item key={i} label={c.nome} value={c.valor} />
            ))}
          </Picker>
        </View>

        <TextInput style={styles.input} placeholder="URL da Imagem" value={imagem} onChangeText={setImagem} />

        <TouchableOpacity style={styles.botaoSalvar} onPress={SalvarCultura}>
          <Text style={styles.txtBtn}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoVoltar} onPress={() => setModo("lista")}>
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

  label: {
  fontWeight: "bold",
  marginBottom: 5,
},

select: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  marginBottom: 12,
},

switchContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 10,
  justifyContent: "space-between",
},

  txtBtn: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
