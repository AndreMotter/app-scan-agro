import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { API_BASE_URL } from "../../constants/api";
import { stylesGlobal } from "../../styles/global";

export default function Usuario() {

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modo, setModo] = useState<"lista" | "novo" | "editar">("lista");

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const [codigousuario, setCodigousuario] = useState<number | null>(null);

  async function ListarUsuarios() {
    try {
      const resp = await fetch(API_BASE_URL + "/sgr-usuario/ListarTodos");
      const data = await resp.json();
      setUsuarios(data);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  function AbrirEditarUsuario(item: any) {
    setCodigousuario(item.codigousuario);
    setLogin(item.login ?? "");
    setSenha("");
    setModo("editar");
  }

  function AbrirIncluirUsuario() {
    LimparUsuario();
    setModo("novo");
  }

  function LimparUsuario() {
    setCodigousuario(null);
    setLogin("");
    setSenha("");
  }

  async function SalvarUsuario() {
    if (!login.trim()) {
      Alert.alert("Atenção", "O login é obrigatório!");
      return;
    }
    try {
      if (modo === "editar") {
        const resp = await fetch(
          API_BASE_URL + `/sgr-usuario/Alterar/${codigousuario}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              login,
              senha: senha || undefined,
            }),
          }
        );

        if (!resp.ok) {
          Alert.alert("Erro", "Não foi possível alterar o usuário.");
          return;
        }
      } else {
        const resp = await fetch(API_BASE_URL + "/sgr-usuario/Salvar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            login,
            senha,
          }),
        });

        if (!resp.ok) {
          Alert.alert("Erro", "Não foi possível salvar o usuário.");
          return;
        }
      }

      LimparUsuario();
      setModo("lista");
      ListarUsuarios();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar o usuário.");
    }
  }

  async function ExcluirUsuario(id: number) {
    Alert.alert("Excluir", "Tem certeza que deseja excluir este usuário?", [
      { text: "Cancelar" },
      {
        text: "Sim",
        onPress: async () => {
          try {
            const resp = await fetch(
              API_BASE_URL + `/sgr-usuario/Excluir/${id}`,
              {
                method: "DELETE",
              }
            );

            if (!resp.ok) {
              Alert.alert("Erro", "Não foi possível excluir.");
            }

            ListarUsuarios();
          } catch (e) {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  }

  useEffect(() => {
    ListarUsuarios();
  }, []);

  if (modo === "lista")
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Usuários</Text>

        <TouchableOpacity style={stylesGlobal.button} onPress={() => AbrirIncluirUsuario()} >
          <Text style={stylesGlobal.buttonText}>
            <FontAwesome name="plus" size={18} /> Incluir Usuário
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#1976D2" />
        ) : (
          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.codigousuario.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View>
                  <Text style={styles.itemTitulo}>
                    {item.codigousuario} - {item.login}
                  </Text>
                </View>

                <View style={styles.itemBotoes}>
                  <TouchableOpacity onPress={() => AbrirEditarUsuario(item)}>
                    <FontAwesome name="edit" size={22} color="#1976D2" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => ExcluirUsuario(item.codigousuario)}
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
          {modo === "editar" ? "Editar" : "Incluir"} Usuário
        </Text>

        <TextInput style={styles.input} placeholder="Login" value={login} onChangeText={setLogin} />

        <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />

        <TouchableOpacity style={styles.botaoSalvar} onPress={SalvarUsuario}>
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
