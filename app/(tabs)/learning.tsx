import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from 'react-native';

interface ResourceSection {
  title: string;
  content: string;
  links?: { title: string; url: string }[];
}

const sections: ResourceSection[] = [
  {
    title: 'STEPS TO LUCID DREAM',
    content: `1. Keep a dream journal and record dreams every morning
2. Do reality checks throughout the day (e.g., look at your hands, check time)
3. Practice meditation before bed to increase awareness
4. Use the MILD technique (Mentally set intention to remember you're dreaming)
5. Maintain a consistent sleep schedule
6. When in a dream, stay calm to maintain lucidity
7. Start with simple actions when you become lucid`,
  },
  {
    title: 'TIPS FOR DREAM RECALL',
    content: `1. Keep a dream journal by your bed
2. Write dreams immediately upon waking
3. Get adequate sleep regularly
4. Practice mindfulness before bed
5. Review your dreams periodically`,
  },
  {
    title: 'UNDERSTANDING DREAM TYPES',
    content: `• Lucid Dreams - Dreams where you're aware you're dreaming
• Recurring Dreams - Dreams that repeat over time
• Nightmares - Disturbing dreams that cause anxiety
• Prophetic Dreams - Dreams that seem to predict events
• Processing Dreams - Dreams that help process daily events`,
  },
];

export default function LearningScreen() {
  const handleLinkPress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/bg.jpg')}
      style={styles.container}
    >
      <View style={styles.containerOverlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
              <Text style={styles.title}>DREAM LEARNING CENTER</Text>
              
              {sections.map((section, index) => (
                <ImageBackground
                  key={index}
                  source={require('../../assets/images/bg.jpg')}
                  style={styles.section}
                  imageStyle={{ borderRadius: 15 }}
                >
                  <View style={styles.sectionOverlay}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Text style={styles.content}>{section.content}</Text>
                    
                    {section.links && (
                      <View style={styles.linksContainer}>
                        {section.links.map((link, linkIndex) => (
                          <TouchableOpacity
                            key={linkIndex}
                            style={styles.linkButton}
                            onPress={() => handleLinkPress(link.url)}>
                            <Text style={styles.linkText}>{link.title}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </ImageBackground>
              ))}
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
    padding: 20,
    paddingTop: 60,
  },
  contentContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    margin: 20,
    marginTop: 60,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
  section: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  sectionOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e6e6fa',
    marginBottom: 10,
    textShadowColor: 'rgba(230, 230, 250, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  content: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  linksContainer: {
    gap: 10,
  },
  linkButton: {
    backgroundColor: 'rgba(230, 230, 250, 0.1)',
    borderRadius: 10,
    padding: 15,
  },
  linkText: {
    color: '#e6e6fa',
    fontSize: 14,
    textAlign: 'center',
  },
});
