import React from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HealthStackParamList} from '../../../app/navigation/types';
import {useHealthRecord} from '../hooks/useHealthRecords';
import {RECORD_TYPE_LABELS, RECORD_TYPE_COLORS} from '../../../data/generators/healthRecords';
import {LoadingSpinner} from '../../../shared/components/LoadingSpinner';
import {Card} from '../../../shared/components/Card';
import {useTheme, themeClasses} from '../../../shared/theme/ThemeProvider';

type Props = NativeStackScreenProps<HealthStackParamList, 'RecordDetail'>;

export function RecordDetailScreen({route}: Props) {
  const {recordId} = route.params;
  const {isDark} = useTheme();
  const record = useHealthRecord(recordId);

  if (!record) return <LoadingSpinner />;

  const colorClass = RECORD_TYPE_COLORS[record.type];

  return (
    <ScrollView className={`flex-1 p-4 ${themeClasses.bg(isDark)}`}>
      <View className={`self-start px-3 py-1 rounded-full mb-3 ${colorClass.split(' ')[0]}`}>
        <Text className={`text-sm font-medium ${colorClass.split(' ')[1]}`}>
          {RECORD_TYPE_LABELS[record.type]}
        </Text>
      </View>
      <Text className={`text-2xl font-bold mb-2 ${themeClasses.text(isDark)}`}>{record.title}</Text>
      <Text className={`text-sm mb-4 ${themeClasses.textMuted(isDark)}`}>
        {record.provider} · {record.date}
      </Text>
      <Card>
        <Text className={`text-base leading-6 ${themeClasses.text(isDark)}`}>{record.description}</Text>
      </Card>
      <View className="flex-row flex-wrap mt-4 gap-2">
        {record.tags.map(tag => (
          <Text key={tag} className="text-sm text-ayurveda-sage bg-ayurveda-sage/10 px-3 py-1 rounded-full">
            #{tag}
          </Text>
        ))}
      </View>
      {record.attachmentUrl && (
        <View className="mt-6">
          <Text className={`text-base font-semibold mb-2 ${themeClasses.text(isDark)}`}>Attachment</Text>
          <Image
            source={{uri: record.attachmentUrl}}
            className="w-full h-64 rounded-xl bg-gray-100"
            resizeMode="cover"
            accessibilityLabel={`Attachment for ${record.title}`}
          />
          <Text className={`text-xs mt-1 ${themeClasses.textMuted(isDark)}`}>
            Type: {record.attachmentType?.toUpperCase()}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
