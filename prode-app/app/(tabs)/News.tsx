import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview'; // Importar WebView
import svgMap from '@/assets/svgMap'; // Importar mapa de SVGs

export default function News() {
  const [selectedNewsUrl, setSelectedNewsUrl] = useState<string | null>(null);
  const [newsData, setNewsData] = useState<any[]>([]); // Estado para almacenar los datos de las noticias

  // Referencia a la instancia de WebView
  const webViewRef = useRef<WebView>(null);

  // Código JavaScript que se inyectará en la WebView
  const jsCode = `
  (function() {
    document.getElementById('ad-slot-footer').remove();
    document.getElementById('ad-slot-itt').remove();
    var ads = document.querySelectorAll('.horizontalAdWrapper');
    ads.forEach(ad => ad.remove());
    true;
  })();
`;

  // Función para cargar las noticias desde la URL
  const fetchNewsData = async (url: string) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setNewsData(data); // Actualiza el estado con las nuevas noticias
    } catch (error) {
      console.error('Error fetching news data:', error);
    }
  };

  // Función para manejar el click en los iconos del scroll horizontal
  const handleIconPress = (key: string) => {
    fetchNewsData(`http://127.0.0.1:3000/get_json/news_${key}.json`); // Llamar a fetch con el key del icono
  };

  const handlePress = (url: string) => {
    setSelectedNewsUrl(url);
  };

  const handleCloseModal = () => {
    setSelectedNewsUrl(null);
  };

  // Función que se llama cuando la página ha terminado de cargar
  const onLoadEnd = () => {
    // Inyectar el JavaScript al WebView después de que la página se haya cargado
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(jsCode);
    }
  };

  // Cargar las noticias por defecto al iniciar el componente
  useEffect(() => {
    fetchNewsData('http://127.0.0.1:3000/get_json/news.json'); // URL por defecto
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.gradientContainer}>
        <LinearGradient 
          style={styles.rectangleLineargradient} 
          locations={[0.28, 1]} 
          colors={['rgba(255, 249, 249, 0.1)', 'rgba(0, 0, 0, 0.2)']} 
        />
        <Text style={styles.title}>Últimas Noticias</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.frameGroup}>
          {Object.keys(svgMap).map((key) => {
            const IconComponent = svgMap[key];
            return (
              <TouchableOpacity key={key} onPress={() => handleIconPress(key)}>
                <View style={styles.frameWrapperShadowBox}>
                  <IconComponent width={40} height={40} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <ScrollView
        style={styles.news}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {newsData.map((noticia, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.square} 
            onPress={() => handlePress(noticia.link)} // Enviar el link al manejar el clic
          >
            {noticia.video ? (
              <Video
                source={{ uri: noticia.video }}
                style={styles.media}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                isMuted={true}
              />
            ) : (
              <Image
                style={styles.media}
                resizeMode="cover"
                source={{ uri: noticia.imagen || 'default_image_url' }}
              />
            )}
            <Text style={styles.titlenews}>{noticia.titulo}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedNewsUrl && (
        <Modal
          visible={!!selectedNewsUrl}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <WebView
              ref={webViewRef}
              originWhitelist={['*']}
              source={{ uri: selectedNewsUrl }}
              style={styles.webview}
              onLoadEnd={onLoadEnd} // Llamar a la función onLoadEnd cuando la carga termine
            />
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
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
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  frameWrapperShadowBox: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowOpacity: 1,
    elevation: 8,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: "rgba(0, 0, 0, 0.08)",
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 64,
  },
  frameGroup: {
    flexDirection: "row",
    marginBottom: 30,
  },
  scrollView: {
    paddingTop: 0,
  },
  square: {
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 15,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  titlenews: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter-Regular",
    color: 'black',
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    padding: 5,
  },
  media: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 160
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  news: {
    width: '96%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  webview: {
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#fff',
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#004A79',
    fontWeight: "bold",
  },
});
