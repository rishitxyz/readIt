// src/screens/ArticleDetailScreen.tsx
import React from 'react'
import { ScrollView, StyleSheet, View, Image } from 'react-native'
import { Text, Appbar, useTheme } from 'react-native-paper'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { spacing, shapes } from '../theme/theme'
import { getRelativeTime } from '../utils/date'

const DEFAULT_IMAGE = require('../../assets/defaults/article-default.png')

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleDetail'>

export default function ArticleDetailScreen({ route, navigation }: Props) {
  const { article, source } = route.params
  const theme = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* M3 App Bar with a back button */}
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={source.name || 'Feed'} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="labelSmall">{getRelativeTime(article.publishedAt)}</Text>
        <Text
          variant="headlineMedium"
          style={{ color: theme.colors.onSurface, marginBottom: spacing.md }}
        >
          {article.title}
        </Text>

        <Image
          source={article.imageUrl ? { uri: article.imageUrl } : DEFAULT_IMAGE}
          style={styles.image}
          resizeMode="cover"
        />

        <Text
          variant="bodyLarge"
          style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.md }}
        >
          {article.description}
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg },
  image: {
    width: '100%',
    height: 200,
    borderRadius: shapes.large,
  },
})
