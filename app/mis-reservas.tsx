import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from './supabase';

export default function MisReservasScreen() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

const cargarMisReservas = async () => {
    setLoading(true);
    
    // 1. Averiguamos quién eres
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 2. Pedimos SOLO las reservas que coincidan con tu user_id
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('user_id', user.id) // <--- EL FILTRO MÁGICO
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setReservas(data || []);
    }
    
    setLoading(false);
  };

  const cerrarSesion = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Seguro que quieres salir de tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, salir", 
          style: "destructive",
          onPress: async () => {
            await supabase.auth.signOut(); // Le decimos a Supabase que nos desconecte
            router.replace('/login'); // Volvems a la pantalla de Login
          }
        }
      ]
    );
  };

  const cancelarReserva = (id: string) => {
    Alert.alert(
      "Cancelar Reserva",
      "¿Estás seguro de que quieres liberar este Tee Time?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Sí, cancelar", 
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from('reservas').delete().eq('id', id);
            if (!error) {
              alert("Reserva cancelada correctamente");
              cargarMisReservas(); // Recargamos la lista
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    cargarMisReservas();
  }, []);

  const renderReserva = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.campo}>{item.campo_nombre}</Text>
        <Text style={styles.detalle}>📅 Hoy | ⏰ {item.hora}</Text>
        <Text style={styles.usuario}>👤 Reservado por: {item.usuario_nombre}</Text>
      </View>
      <TouchableOpacity 
        style={styles.botonEliminar} 
        onPress={() => cancelarReserva(item.id)}
      >
        <Text style={styles.textoEliminar}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.volver}>←</Text>
        </TouchableOpacity>
        
        {/* Usamos flex: 1 para que el título ocupe el espacio y empuje el botón a la derecha */}
        <Text style={[styles.titulo, { flex: 1 }]}>Mis Salidas ⛳</Text>

        {/* ¡NUEVO BOTÓN DE SALIR! */}
        <TouchableOpacity onPress={cerrarSesion} style={{ padding: 5 }}>
          <Text style={{ color: '#E53E3E', fontWeight: 'bold' }}>Salir</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#38A169" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={item => item.id.toString()}
          renderItem={renderReserva}
          ListEmptyComponent={<Text style={styles.vacio}>Aún no tienes reservas.</Text>}
          contentContainerStyle={{ padding: 20 }}
          onRefresh={cargarMisReservas} // Permite "tirar" hacia abajo para refrescar
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, marginTop: 40 },
  volver: { fontSize: 24, color: '#38A169', marginRight: 15, fontWeight: 'bold' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1A202C' },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  info: { flex: 1 },
  campo: { fontSize: 18, fontWeight: 'bold', color: '#2D3748' },
  detalle: { fontSize: 14, color: '#4A5568', marginVertical: 4 },
  usuario: { fontSize: 12, color: '#718096' },
  botonEliminar: { backgroundColor: '#FFF5F5', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#FEB2B2' },
  textoEliminar: { color: '#E53E3E', fontWeight: 'bold', fontSize: 12 },
  vacio: { textAlign: 'center', marginTop: 50, color: '#718096' }
});