import * as React from 'react'
import { View } from 'react-native'
import {
  ActivityIndicator,
  Button,
  MD3Theme,
  Modal,
  Portal,
  SegmentedButtons,
  TextInput,
  useTheme,
} from 'react-native-paper'
import { FEED_SOURCES, FeedType } from '../../config/feed-source'
import { shapes, spacing } from '../../theme/theme'

interface AddNewSourceProps {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNewSource = ({ visible, setVisible }: AddNewSourceProps) => {
  const [sourceType, setSourceType] = React.useState<FeedType>(FeedType.RSS)
  const [source, setSource] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)
  const theme = useTheme<MD3Theme>()

  const addNewSource = () => {
    console.log('yes')
    setLoading(true)
    FEED_SOURCES.push({
      id: '',
      name: '',
      url: source,
      type: sourceType,
    })
    // setLoading(false)
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          padding: 20,
          borderRadius: shapes.extraLarge,
        }}
      >
        <View style={{ gap: 15 }}>
          <SegmentedButtons
            value={sourceType}
            onValueChange={(val) => setSourceType(val as FeedType)}
            buttons={[
              {
                value: FeedType.RSS,
                label: 'RSS',
                icon: 'rss',
                checkedColor: theme.colors.onPrimaryContainer,
                uncheckedColor: theme.colors.onSurfaceVariant,
              },
              {
                value: FeedType.REDDIT,
                label: 'SubReddit',
                icon: 'reddit',
                checkedColor: theme.colors.onPrimaryContainer,
                uncheckedColor: theme.colors.onSurfaceVariant,
              },
            ]}
          />
          <TextInput
            mode="outlined"
            label="Add source"
            value={source}
            onChangeText={(text) => setSource(text)}
            left={<TextInput.Affix text={sourceType === FeedType.REDDIT ? 'r/' : ''} />}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingTop: spacing.lg }}>
          <Button onTouchEnd={() => setVisible(false)}>Cancel</Button>
          <Button mode="contained" onTouchEnd={addNewSource} disabled={source === ''}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : 'Add'}
          </Button>
        </View>
      </Modal>
    </Portal>
  )
}

export default AddNewSource
