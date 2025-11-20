import { StyleSheet } from "react-native";

export const stylesGlobal = StyleSheet.create({

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
