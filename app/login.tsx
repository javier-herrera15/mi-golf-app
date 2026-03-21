import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from './supabase'; // <-- Importando supabase desde la misma carpeta

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert("Error", error.message);
    else router.replace('/(tabs)'); // Te lleva a la home
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert("Error", error.message);
    else Alert.alert("¡Éxito!", "Usuario creado. Ya puedes darle a Entrar.");
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Golf App ⛳</Text>
      <Text style={styles.subtitulo}>Identifícate para reservar</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        placeholderTextColor="#A0AEC0" // <-- Color del texto de ayuda
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        placeholderTextColor="#A0AEC0" // <-- Color del texto de ayuda
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />

      <TouchableOpacity style={styles.botonLogin} onPress={handleLogin} disabled={loading}>
        <Text style={styles.textoBoton}>{loading ? 'Cargando...' : 'Entrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignUp} disabled={loading}>
        <Text style={styles.textoRegistro}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#FFFFFF' },
  titulo: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#38A169' },
  subtitulo: { fontSize: 16, textAlign: 'center', marginBottom: 40, color: '#718096' },
  input: { 
    borderBottomWidth: 1, 
    borderColor: '#CBD5E0', 
    padding: 15, 
    marginBottom: 20, 
    fontSize: 16,
    color: '#000000', // <-- ¡Color negro forzado para lo que escribe el usuario!
  },
  botonLogin: { backgroundColor: '#38A169', padding: 15, borderRadius: 10, alignItems: 'center' },
  textoBoton: { color: 'white', fontWeight: 'bold' },
  textoRegistro: { textAlign: 'center', marginTop: 20, color: '#38A169', fontWeight: '600' }
});