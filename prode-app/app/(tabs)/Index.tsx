import React, { useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import Tables from '../tables';
import Inicio from '../inicio';
import { LinearGradient } from 'expo-linear-gradient';

const Test = () => {
  // Estado para manejar qué componente cargar
  const [selectedPage, setSelectedPage] = useState<"tables" | "inicio">("inicio");

  // Funciones para cambiar la vista
  const loadTables = () => setSelectedPage("tables");
  const loadInicio = () => setSelectedPage("inicio");

  return (
    <View>
      <View style={styles.gradientContainer}>
        <LinearGradient 
          style={styles.rectangleLineargradient} 
          locations={[0.28, 1]} 
          colors={['rgba(255, 249, 249, 0.1)', 'rgba(0, 0, 0, 0.2)']} 
        />
        <View style={styles.buttonContainer}>
          <Button title="Inicio" onPress={loadInicio} />
          <Button title="Tablas" onPress={loadTables} />
        </View>
      </View>
      
      {/* Renderiza el componente seleccionado */}
      {selectedPage === "tables" && <Tables />}
      {selectedPage === "inicio" && <Inicio />}
    </View>
  );
};

const styles = StyleSheet.create({
    rectangleLineargradient: {
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        width: "100%",
        height: 110,
        position: 'absolute',
      },
      gradientContainer: {
        backgroundColor: '#004A79',
        width: '100%',
        height: 70,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'flex-end',
        marginBottom: 10,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
      },
  });

export default Test;
