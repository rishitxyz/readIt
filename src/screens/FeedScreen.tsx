import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { Text, Appbar, useTheme } from 'react-native-paper'
import type { MD3Theme } from 'react-native-paper'
import FeedCard from '../components/FeedCard'
import AnimatedFAB from '../components/AnimatedFAB'
import FeedFilter, { FilterValue } from '../components/FeedFilter'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { spacing } from '../theme/theme'

import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { fetchAll } from '../services/feed-service'
import AddNewSource from '../components/modals/AddNewSource'
import { Article } from '../database/schema/article'
import { Source } from '../database/schema/source'
import { SourceWithArticles } from '../database/schema'

export default function FeedScreen() {
  const theme = useTheme<MD3Theme>()
  const [filter, setFilter] = useState<FilterValue>('all')
  const [feeds, setFeeds] = useState<SourceWithArticles[]>([])
  const [addNewSource, setAddNewSource] = useState<boolean>(false)
  const { fabAnimValue, onScroll } = useScrollAnimation()

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'unread':
        return feeds
          .map((feed) => ({
            ...feed,
            articles: feed.articles.filter((article) => !article.isRead),
          }))
          .filter((feed) => feed.articles.length > 0)
      case 'favorites':
        return feeds
          .map((feed) => ({
            ...feed,
            articles: feed.articles.filter((article) => article.isFavourite),
          }))
          .filter((feed) => feed.articles.length > 0)
      default:
        return feeds
    }
  }, [filter, feeds])

  const toggleFavorite = useCallback((articleId: string) => {
    setFeeds((prev) =>
      prev.map((group) => ({
        ...group,
        articles: group.articles.map((article) =>
          article.id === articleId ? { ...article, isFavorite: !article.isFavourite } : article,
        ),
      })),
    )
  }, [])

  const handleCardPress = useCallback(
    (item: Article) => {
      // Mark as read on press
      setFeeds((prev) =>
        prev.map((group) => ({
          ...group,
          articles: group.articles.map((article) =>
            article.id === item.id ? { ...article, isRead: true } : article,
          ),
        })),
      )

      // handle navigation to article page.
      navigation.navigate('ArticleDetail', { article: item })
    },
    [navigation],
  )

  const renderItem = useCallback(
    ({ item, section }: { item: Article; section: { title: string; source: Source } }) => (
      <FeedCard
        article={{ ...item, source: section.source }}
        onToggleFavorite={toggleFavorite}
        onPress={handleCardPress}
      />
    ),
    [toggleFavorite, handleCardPress],
  )

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      const fetchedFeeds = await fetchAll([])
      if (isMounted) setFeeds(fetchedFeeds)
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [])

  const sections = useMemo(() => {
    return filteredItems.map((sourceWithArticles) => ({
      title: sourceWithArticles.source.name,
      source: sourceWithArticles.source,
      data: sourceWithArticles.articles,
    }))
  }, [filteredItems])

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* App Bar */}
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content
          title="ReadIt"
          titleStyle={{
            fontWeight: '700',
            fontSize: 24,
            color: theme.colors.onSurface,
          }}
        />
        <Appbar.Action
          icon="magnify"
          onPress={() => {}}
          iconColor={theme.colors.onSurfaceVariant}
        />
        <Appbar.Action
          icon="dots-vertical"
          onPress={() => {}}
          iconColor={theme.colors.onSurfaceVariant}
        />
      </Appbar.Header>

      <FeedFilter value={filter} onChange={setFilter} />

      <Animated.SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              backgroundColor: theme.colors.background,
            }}
          >
            <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              {title}
            </Text>
          </View>
        )}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // ── Empty State ──
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              variant="headlineSmall"
              style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
            >
              No articles found
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
                textAlign: 'center',
                marginTop: spacing.sm,
              }}
            >
              {filter === 'favorites' ? 'Heart some articles to see them here!' : 'All caught up!'}
            </Text>
          </View>
        }
      />
      <AnimatedFAB
        animValue={fabAnimValue}
        icon={addNewSource ? 'close' : 'plus'}
        onPress={() => {
          setAddNewSource(!addNewSource)
        }}
      />
      <AddNewSource visible={addNewSource} setVisible={setAddNewSource} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 96, // Space for FAB
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: spacing.xl,
  },
})
