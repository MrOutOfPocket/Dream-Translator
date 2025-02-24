import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AdMobInterstitial } from 'expo-ads-admob';

const adUnitId = __DEV__ ? 'ca-app-pub-3940256099942544/1033173712' : 'ca-app-pub-2710323073729207/6519514182';

// Initialize Gemini with API key
const genAI = process.env.EXPO_PUBLIC_GEMINI_API_KEY ? 
  new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY) : null;

const SYSTEM_PROMPT = `You are an expert dream interpreter with deep knowledge of:
- Jungian psychology and archetypes
- Cultural dream symbolism across different societies
- Modern psychological dream analysis
- Traditional dream interpretation techniques

Analyze the dream considering:
1. Universal symbols and their meanings
2. Personal context and emotions
3. Archetypal patterns
4. Potential psychological insights

Provide a thoughtful, insightful interpretation that helps understand the dream's deeper meaning. Be specific but avoid being overly deterministic.`;

export default function TranslatorScreen() {
  const [dream, setDream] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNextAd, setShowNextAd] = useState(false);

  useEffect(() => {
    const initAds = async () => {
      await AdMobInterstitial.setAdUnitID(adUnitId);
    };
    initAds();
  }, []);

  const showAdIfNeeded = async () => {
    if (showNextAd) {
      try {
        await AdMobInterstitial.requestAdAsync();
        await AdMobInterstitial.showAdAsync();
      } catch (error) {
        console.error('Ad error:', error);
      }
    }
    setShowNextAd(!showNextAd); // Toggle for next time
  };

  const analyzeDream = async () => {
    await showAdIfNeeded();
    if (!dream.trim()) return;

    setLoading(true);
    setError(null);

    try {
      if (!genAI) {
        throw new Error('Gemini API key is not configured. Please add your API key to the .env file.');
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `${SYSTEM_PROMPT}\n\nPlease interpret this dream: ${dream}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const interpretation = response.text() || 
        "I apologize, but I couldn't generate an interpretation at this time. Please try again.";
      
      setInterpretation(interpretation);

      // Save to AsyncStorage
      const newDream = {
        date: new Date().toISOString(),
        dream,
        interpretation,
      };

      const existingDreams = await AsyncStorage.getItem('dreams');
      const dreams = existingDreams ? JSON.parse(existingDreams) : [];
      dreams.unshift(newDream);
      await AsyncStorage.setItem('dreams', JSON.stringify(dreams));
    } catch (error) {
      console.error('Error analyzing dream:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze dream. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground 
        source={require('../../assets/images/bg.jpg')}
        style={styles.container}
      >
        <View style={styles.containerOverlay}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.contentContainer}>
              <Text style={styles.title}>DREAM TRANSLATOR</Text>
              
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <ImageBackground 
                source={require('../../assets/images/bg.jpg')}
                style={styles.inputContainer}
                imageStyle={{ borderRadius: 15 }}
              >
                <View style={styles.inputOverlay}>
                  <TextInput
                    style={styles.input}
                    placeholder="Describe your dream..."
                    placeholderTextColor="#fff"
                    value={dream}
                    onChangeText={setDream}
                    multiline
                    numberOfLines={6}
                  />
                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={analyzeDream}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Analyze Dream</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ImageBackground>

              {interpretation ? (
                <ImageBackground 
                  source={require('../../assets/images/bg.jpg')}
                  style={styles.interpretationContainer}
                  imageStyle={{ borderRadius: 15 }}
                >
                  <View style={styles.interpretationOverlay}>
                    <Text style={styles.interpretationTitle}>INTERPRETATION</Text>
                    <Text style={styles.interpretationText}>{interpretation}</Text>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                          Share.share({
                            message: `Dream:\n${dream}\n\nInterpretation:\n${interpretation}`,
                          });
                        }}>
                        <Ionicons name="share-outline" size={24} color="#e6e6fa" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => {
                          Alert.alert(
                            'Delete Interpretation',
                            'Are you sure you want to clear this interpretation?',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel',
                              },
                              {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => {
                                  setInterpretation('');
                                  setDream('');
                                },
                              },
                            ]
                          );
                        }}>
                        <Ionicons name="trash-outline" size={24} color="#ff6b6b" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
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
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  inputOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#07547e',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  interpretationContainer: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  interpretationOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  interpretationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e6e6fa',
    marginBottom: 10,
    textShadowColor: 'rgba(230, 230, 250, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  interpretationText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
});
