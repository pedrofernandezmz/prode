import React, { useState, FC, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, Button, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import svgMap from '@/assets/svgMap';

// Definir el tipo de datos
type Posicion = {
  "#": number;
  Equipo: string;
  Imagen: string;
  Pts: number;
  PJ: number;
  PG: number;
  PE: number;
  PP: number;
  GF: number;
  GC: number;
  DIF: number;
};

export default function Tables() {
  const [posicionesData, setPosicionesData] = useState<Posicion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://172.20.10.6:3000/get_json/posiciones.json');
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data: Posicion[] = await response.json();
        setPosicionesData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Tabla Puntos Primera</Text>
      </View>
      <View style={styles.table_title}>
        <Text style={[styles.title_cell, styles.fixedWidth, styles.positions]}></Text>
        <Text style={[styles.title_cell, styles.flexibleWidth]}>Equipo</Text>
        <Text style={[styles.title_cell, styles.fixedWidth, styles.bold]}>Pts</Text>
        <Text style={[styles.title_cell, styles.fixedWidth]}>PJ</Text>
        <Text style={[styles.title_cell, styles.fixedWidth]}>PG</Text>
        <Text style={[styles.title_cell, styles.fixedWidth]}>PE</Text>
        <Text style={[styles.title_cell, styles.fixedWidth]}>PP</Text>
        <Text style={[styles.title_cell, styles.fixedWidth]}>GF</Text>
        <Text style={[styles.title_cell, styles.fixedWidth]}>GC</Text>
        <Text style={[styles.title_cell, styles.fixedWidth]}>DIF</Text>
      </View>
      <ScrollView
        style={styles.table_scroll}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.rows}>
          {posicionesData.map((item, index) => {
            const TeamLogo = svgMap[item.Imagen as keyof typeof svgMap];
            return (
              <View
                key={index}
                style={[
                  styles.table_rows,
                  index === 0 && styles.first_position,
                  index === 27 && styles.last_position,
                ]}
              >
                <View style={styles.positions}>
                  <Text style={[styles.row_cell]}>{item["#"]}</Text>
                </View>
                <View style={[styles.flexibleWidth, styles.rowWithImage]}>
                  <View style={styles.rowImage}>
                    {TeamLogo && <TeamLogo width={20} height={20} />}
                  </View>
                  <Text style={styles.row_cell}>{item.Equipo}</Text>
                </View>
                <Text style={[styles.row_cell, styles.fixedWidth, styles.bold]}>{item.Pts}</Text>
                <Text style={[styles.row_cell, styles.fixedWidth]}>{item.PJ}</Text>
                <Text style={[styles.row_cell, styles.fixedWidth]}>{item.PG}</Text>
                <Text style={[styles.row_cell, styles.fixedWidth]}>{item.PE}</Text>
                <Text style={[styles.row_cell, styles.fixedWidth]}>{item.PP}</Text>
                <Text style={[styles.row_cell, styles.fixedWidth]}>{item.GF}</Text>
                <Text style={[styles.row_cell, styles.fixedWidth]}>{item.GC}</Text>
                <Text style={[styles.row_cell, styles.fixedWidth]}>{item.DIF}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.note}>
          <Text> · El campeón clasifica a la Copa Libertadores.</Text>
        </View>
        <View style={styles.note}>
          <Text> · Clasifican de forma directa a la Copa Libertadores: Campeón Copa de la Liga (Estudiantes) + Campeón Liga + Campeón Copa Argentina.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

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
  container: {
    backgroundColor: '#F7F8F9',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Helvetica",
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  table_title: {
    flexDirection: 'row',
    width: '96%',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: 'rgba(32, 33, 36, 0.28)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 6,
    elevation: 6,
    shadowOpacity: 1,
    alignItems: 'center', // Centra los elementos verticalmente
    height: 25,
  },
  rows: {
    marginTop: 5,
    shadowColor: 'rgba(32, 33, 36, 0.28)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 6,
    elevation: 6,
    shadowOpacity: 1,
    marginBottom: 10,
  },
  first_position: {
    backgroundColor: '#90EE90',
  },
  last_position: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  table_rows: {
    flexDirection: 'row',
    width: '96%',
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: '#D2D3D4',
    alignItems: 'center', // Centra los elementos verticalmente
    height: 30,
  },
  table_scroll: {
    width: '100%',
    backgroundColor: '#F7F8F9',
    marginBottom: 15,
    maxHeight: '82%',
  },
  title_cell: {
    fontSize: 14,
    textAlign: 'center',
    color: '#5E5E5E',
    textAlignVertical: 'center', // Asegura que el texto se centre verticalmente dentro de Text
  },
  row_cell: {
    fontSize: 14,
    textAlign: 'center',
    color: 'black',
    textAlignVertical: 'center', // Centra el texto verticalmente dentro de Text
  },
  rowWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowImage: {
    marginHorizontal: 2,
  },
  positions: {
    width: '5%',
    textAlignVertical: 'center', // Centra el texto verticalmente dentro de Text
    borderColor: 'transparent',
    borderWidth: 0.5,
    height: '100%',
    justifyContent: 'center' //ACA SE COLOCAN EL CAMBIO DE FONDO A LAS POSICIONES VER LOGICA
  },
  fixedWidth: {
    width: '7%', // Ancho fijo para las celdas de estadísticas
  },
  flexibleWidth: {
    flex: 1, // Flex para ocupar el espacio restante
    textAlign: 'left',
  },
  bold: {
    fontWeight: 'bold',
    color: 'black',
  },
  note: {
    backgroundColor: '#90ee90',
    fontSize: 12,
    fontFamily: "Arial",
    color: 'black',
    textAlign: "left",
    display: "flex",
    width: '96%',
    shadowColor: 'rgba(32, 33, 36, 0.28)',
    shadowOffset: {
    width: 0,
    height: 1
    },
    shadowRadius: 6,
    elevation: 6,
    shadowOpacity: 1,
    marginBottom: 10,
    },
    scrollViewContent: {
      alignItems: 'center',
      backgroundColor: '#F7F8F9',
    },
});
