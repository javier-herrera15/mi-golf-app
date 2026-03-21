import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from './supabase';

// Horarios base del club
const HORARIOS_BASE = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'];

export default function DetallesScreen() {
  const { nombre } = useLocalSearchParams();
  const router = useRouter();
  
  // ESTADOS
  const [loading, setLoading] = useState(true);
  const [horariosEstado, setHorariosEstado] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [nombreReserva, setNombreReserva] = useState('');

  // FUNCIÓN MÁGICA: Cargar reservas reales
  const cargarDisponibilidad = async () => {
    setLoading(true);
    // 1. Pedimos a Supabase las reservas de este campo
    const { data: reservasExistentes, error } = await supabase
      .from('reservas')
      .select('hora')
      .eq('campo_nombre', nombre);

    if (error) {
      console.error(error);
    } else {
      // 2. Mapeamos los horarios base y marcamos como ocupados los que coincidan
      const horasOcupadas = reservasExistentes.map(r => r.hora);
      const nuevaLista = HORARIOS_BASE.map(h => ({
        hora: h,
        disponible: !horasOcupadas.includes(h)
      }));
      setHorariosEstado(nuevaLista);
    }
    setLoading(false);
  };

  // Se ejecuta al abrir la pantalla
  useEffect(() => {
    cargarDisponibilidad();
  }, [nombre]);

  const confirmarReserva = async () => {
    if (nombreReserva.length < 3) return alert("Escribe tu nombre");

    // 1. Preguntamos a Supabase quién es el usuario actual
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    // 🚨 EL CHIVATO: Si la app pierde tu sesión, te avisará y no guardará el NULL
    if (!user) {
      alert("¡Ups! La app ha perdido tu sesión. Vuelve a la pantalla de Login.");
      return; 
    }

    // 2. Si todo va bien, guardamos la reserva CON tu ID
    const { error } = await supabase
      .from('reservas')
      .insert([{ 
        campo_nombre: nombre, 
        hora: horaSeleccionada, 
        usuario_nombre: nombreReserva,
        user_id: user.id // ¡Obligamos a que mande el ID!
      }]);

    if (!error) {
      alert("¡Reserva guardada a tu nombre!");
      setModalVisible(false);
      setNombreReserva('');
      cargarDisponibilidad(); 
    } else {
      alert("Error al guardar en Supabase: " + error.message);
    }
  };

  const renderHora = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.horaCard, !item.disponible && styles.horaOcupada]}
      disabled={!item.disponible}
      onPress={() => { setHoraSeleccionada(item.hora); setModalVisible(true); }}
    >
      <Text style={styles.horaText}>{item.hora}</Text>
      <Text style={styles.estadoText}>{item.disponible ? 'Libre' : 'RESERVADO'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.botonVolver}>
        <Text style={styles.textoVolver}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>{nombre}</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#38A169" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={horariosEstado}
          keyExtractor={item => item.hora}
          renderItem={renderHora}
          numColumns={2}
          contentContainerStyle={styles.lista}
        />
      )}

      {/* MODAL (Mantenemos el que tenías pero con el fix del color de letra) */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitulo}>Confirmar {horaSeleccionada}h</Text>
            <TextInput
              style={[styles.input, { color: '#000000' }]}
              placeholder="Tu nombre completo"
              placeholderTextColor="#A0AEC0"
              value={nombreReserva}
              onChangeText={setNombreReserva}
            />
            <TouchableOpacity style={styles.botonConfirmar} onPress={confirmarReserva}>
              <Text style={styles.textoBoton}>Reservar ahora</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  botonVolver: { padding: 20, marginTop: 40 },
  textoVolver: { color: '#38A169', fontWeight: 'bold' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginHorizontal: 20, marginBottom: 20 },
  lista: { paddingHorizontal: 15 },
  horaCard: { flex: 1, backgroundColor: '#F0FFF4', margin: 8, padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#38A169' },
  horaOcupada: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' }, // Rojo si está ocupado
  horaText: { fontSize: 18, fontWeight: 'bold' },
  estadoText: { fontSize: 12 },
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { backgroundColor: 'white', borderRadius: 20, padding: 35, width: '85%', alignItems: 'center' },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, borderColor: '#CBD5E0', width: '100%', marginBottom: 25, padding: 10, fontSize: 16 },
  botonConfirmar: { backgroundColor: '#38A169', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10, marginBottom: 15 },
  textoBoton: { color: 'white', fontWeight: 'bold' },
  textoCancelar: { color: '#E53E3E' }
});