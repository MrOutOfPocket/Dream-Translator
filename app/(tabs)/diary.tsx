import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Dream = {
  date: string;
  dream: string;
  interpretation: string;
};

export default function DiaryScreen() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    try {
      const storedDreams = await AsyncStorage.getItem('dreams');
      if (storedDreams) {
        setDreams(JSON.parse(storedDreams));
      }
    } catch (error) {
      console.error('Error loading dreams:', error);
    }
  };

  const handleShare = async (dream: Dream) => {
    try {
      await Share.share({
        title: 'Dream from ' + formatDate(dream.date),
        message: `Dream from ${formatDate(dream.date)}\n\nDream:\n${dream.dream}\n\nInterpretation:\n${dream.interpretation}`,
      });
    } catch (error) {
      console.error('Error sharing dream:', error);
    }
  };

  const handleDelete = async (dreamToDelete: Dream) => {
    Alert.alert(
      'Delete Dream',
      'Are you sure you want to delete this dream?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedDreams = dreams.filter(
                dream => dream.date !== dreamToDelete.date
              );
              await AsyncStorage.setItem('dreams', JSON.stringify(updatedDreams));
              setDreams(updatedDreams);
              setSelectedDream(null);
            } catch (error) {
              console.error('Error deleting dream:', error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/bg.jpg')}
      style={styles.container}
    >
      <View style={styles.containerOverlay}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentContainer}>
              <Text style={styles.title}>DREAM DIARY</Text>
              
              {dreams.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Your dream diary is empty. Start by analyzing a dream!
                  </Text>
                </View>
              ) : (
                dreams.map((dream, index) => (
                  <ImageBackground
                    key={index}
                    source={require('../../assets/images/bg.jpg')}
                    style={styles.dreamCard}
                    imageStyle={{ borderRadius: 15 }}
                  >
                    <TouchableOpacity
                      style={styles.dreamCardOverlay}
                      onPress={() => setSelectedDream(selectedDream === dream ? null : dream)}
                    >
                      <Text style={styles.dateText}>{formatDate(dream.date)}</Text>
                      <Text style={styles.dreamPreview} numberOfLines={selectedDream === dream ? undefined : 2}>
                        {dream.dream}
                      </Text>
                      {selectedDream === dream && (
                        <View style={styles.interpretationContainer}>
                          <Text style={styles.interpretationTitle}>INTERPRETATION</Text>
                          <Text style={styles.interpretationText}>
                            {dream.interpretation}
                          </Text>
                        </View>
                      )}
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleShare(dream)}>
                          <Ionicons name="share-outline" size={20} color="#e6e6fa" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.deleteButton]}
                          onPress={() => handleDelete(dream)}>
                          <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </ImageBackground>
                ))
              )}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerOverlay: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    margin: 20,
    marginTop: 60,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    shadowColor: '#e6e6fa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  contentOverlay: {
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e6e6fa',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(230, 230, 250, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  dreamCard: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  dreamCardOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  dreamPreview: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  interpretationContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  interpretationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e6e6fa',
    marginBottom: 8,
    textShadowColor: 'rgba(230, 230, 250, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  interpretationText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    padding: 8,
    marginLeft: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(230, 230, 250, 0.1)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
});
