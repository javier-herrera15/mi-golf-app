import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabase'; // Dos niveles hacia arriba

// Datos usando tus fotos locales exactamente como las has nombrado
const CAMPOS_GOLF = [
  { 
    id: '1', 
    nombre: 'Club de Campo Villa de Madrid', 
    ubicacion: 'Madrid', 
    precio: '90€', 
    imagen: require('./fotos/RCCVM_logo.jpg') 
  },
  { 
    id: '2', 
    nombre: 'Real Club de Golf Vistahermosa', 
    ubicacion: 'Puerto de Santa María, Cádiz', 
    precio: '75€', 
    imagen: require('./fotos/RCGVH_logo.jpg') 
  },
  { 
    id: '3', 
    nombre: 'Santa Clara Golf Marbella', 
    ubicacion: 'Marbella, Málaga', 
    precio: '105€', 
    imagen: require('./fotos/Santa_Clara_logo.jpg') 
  },
];

export default function HomeScreen() {
  const router = useRouter();
  useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.replace('/login');
     }
    };
    checkUser();
  }, []);

  // Esta función dibuja cada "tarjeta" de campo de golf
  const renderCampo = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/detalles', params: { nombre: item.nombre } })}
>
      <Image 
        source={item.imagen} 
        style={styles.imagen} 
        resizeMode="contain" // <-- ¡Aquí está la magia!
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.ubicacion}>📍 {item.ubicacion}</Text>
        <Text style={styles.precio}>Desde {item.precio}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.titulo}>Reserva tu Tee Time ⛳</Text>
      <TouchableOpacity 
        style={styles.botonMisReservas} 
        onPress={() => router.push('/mis-reservas')}
      >
      <Text style={styles.textoMisReservas}>Ver mis reservas 📋</Text>
    </TouchableOpacity>
      
      <FlatList
        data={CAMPOS_GOLF}
        keyExtractor={item => item.id}
        renderItem={renderCampo}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A202C',
    marginHorizontal: 20,
    marginTop: 50,
    marginBottom: 25,
  },
  lista: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  imagen: {
    width: '100%',
    height: 190,
  },
  infoContainer: {
    padding: 18,
  },
  nombre: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
  },
  ubicacion: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 12,
  },
  precio: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#38A169',
  },
  botonMisReservas: {
  backgroundColor: '#E6FFFA',
  padding: 10,
  borderRadius: 10,
  marginHorizontal: 20,
  marginBottom: 20,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#38A169',
  },
  textoMisReservas: { color: '#38A169', fontWeight: 'bold' },
});