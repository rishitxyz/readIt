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
import { FeedItem, GroupedFeedItem } from '../types/feed'
import { fetchAll } from '../services/feed-service'
import { FEED_SOURCES } from '../config/feed-source'

export default function FeedScreen() {
  const theme = useTheme<MD3Theme>()
  const [filter, setFilter] = useState<FilterValue>('all')
  const [feeds, setFeeds] = useState<GroupedFeedItem[]>([])
  const { fabAnimValue, onScroll } = useScrollAnimation()

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'unread':
        return feeds
          .map((feed) => ({
            ...feed,
            feedItems: feed.feedItems.filter((item) => !item.isRead),
          }))
          .filter((feed) => feed.feedItems.length > 0)
      case 'favorites':
        return feeds
          .map((feed) => ({
            ...feed,
            feedItems: feed.feedItems.filter((item) => item.isFavorite),
          }))
          .filter((feed) => feed.feedItems.length > 0)
      default:
        return feeds
    }
  }, [filter, feeds])

  const toggleFavorite = useCallback((feedItemId: string) => {
    setFeeds((prev) =>
      prev.map((group) => ({
        ...group,
        feedItems: group.feedItems.map((feedItem) =>
          feedItem.id === feedItemId ? { ...feedItem, isFavorite: !feedItem.isFavorite } : feedItem,
        ),
      })),
    )
  }, [])

  const handleCardPress = useCallback(
    (item: FeedItem) => {
      // Mark as read on press
      setFeeds((prev) =>
        prev.map((group) => ({
          ...group,
          feedItems: group.feedItems.map((feedItem) =>
            feedItem.id === item.id ? { ...feedItem, isRead: true } : feedItem,
          ),
        })),
      )

      // handle navigation to article page.
      navigation.navigate('ArticleDetail', { article: item })
    },
    [navigation],
  )

  const renderItem = useCallback(
    ({ item }: { item: FeedItem }) => (
      <FeedCard item={item} onToggleFavorite={toggleFavorite} onPress={handleCardPress} />
    ),
    [toggleFavorite, handleCardPress],
  )

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      const fetchedFeeds = await fetchAll(FEED_SOURCES)
      if (isMounted) setFeeds(fetchedFeeds)
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [])

  const sections = useMemo(() => {
    return filteredItems.map((feed) => ({
      title: feed.source,
      data: feed.feedItems,
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
        onPress={() => {
          // TODO: Open modal to add new feed.
        }}
      />
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
