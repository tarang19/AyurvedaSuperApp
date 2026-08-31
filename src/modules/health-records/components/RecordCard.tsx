import React, {memo} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import {HealthRecord, RECORD_TYPE_COLORS, RECORD_TYPE_LABELS} from '../../../data/generators/healthRecords';
import {Card} from '../../../shared/components/Card';
import {useTheme, themeClasses} from '../../../shared/theme/ThemeProvider';

type Props = {
  record: HealthRecord;
  onPress: () => void;
};

function RecordCardComponent({record, onPress}: Props) {
  const {isDark} = useTheme();
  const colorClass = RECORD_TYPE_COLORS[record.type];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card className="mb-3 flex-row">
        {record.attachmentUrl ? (
          <Image
            source={{uri: record.attachmentUrl}}
            className="w-16 h-20 rounded-lg mr-3 bg-gray-100"
            accessibilityLabel={`Attachment preview for ${record.title}`}
          />
        ) : (
          <View className="w-16 h-20 rounded-lg mr-3 bg-ayurveda-sage/10 items-center justify-center">
            <Text className="text-2xl">
              {record.type === 'lab_report' ? '🔬' : record.type === 'prescription' ? '💊' : '📋'}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <View className={`self-start px-2 py-0.5 rounded-full mb-1 ${colorClass.split(' ')[0]}`}>
            <Text className={`text-xs font-medium ${colorClass.split(' ')[1]}`}>
              {RECORD_TYPE_LABELS[record.type]}
            </Text>
          </View>
          <Text className={`text-sm font-semibold ${themeClasses.text(isDark)}`} numberOfLines={1}>
            {record.title}
          </Text>
          <Text className={`text-xs ${themeClasses.textMuted(isDark)}`}>{record.provider}</Text>
          <Text className={`text-xs mt-1 ${themeClasses.textMuted(isDark)}`}>{record.date}</Text>
          <View className="flex-row flex-wrap mt-1 gap-1">
            {record.tags.slice(0, 2).map(tag => (
              <Text key={tag} className="text-xs text-ayurveda-sage">#{tag}</Text>
            ))}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export const RecordCard = memo(RecordCardComponent);
