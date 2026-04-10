import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  uploadDate: string;
  status: 'approved' | 'pending' | 'rejected';
  assignedTo?: string;
}

interface DocumentCategory {
  id: string;
  name: string;
  icon: string;
  documentCount: number;
  lastUpdated: string;
}

const documents: Document[] = [
  {
    id: '1',
    name: 'Employment_Contract_2026.pdf',
    type: 'PDF',
    category: 'Employment',
    size: '2.4 MB',
    uploadDate: '2026-04-01',
    status: 'approved',
    assignedTo: 'John Doe',
  },
  {
    id: '2',
    name: 'Tax_Return_2025.pdf',
    type: 'PDF',
    category: 'Tax',
    size: '1.8 MB',
    uploadDate: '2026-04-05',
    status: 'approved',
    assignedTo: 'John Doe',
  },
  {
    id: '3',
    name: 'Work_Experience_Letter.docx',
    type: 'DOCX',
    category: 'Employment',
    size: '156 KB',
    uploadDate: '2026-04-10',
    status: 'pending',
    assignedTo: 'John Doe',
  },
  {
    id: '4',
    name: 'Medical_Insurance_Card.jpg',
    type: 'JPG',
    category: 'Health',
    size: '3.2 MB',
    uploadDate: '2026-04-06',
    status: 'approved',
    assignedTo: 'John Doe',
  },
  {
    id: '5',
    name: 'Graduation_Certificate.pdf',
    type: 'PDF',
    category: 'Education',
    size: '5.1 MB',
    uploadDate: '2025-08-20',
    status: 'rejected',
    assignedTo: 'John Doe',
  },
  {
    id: '6',
    name: 'References_Letter.pdf',
    type: 'PDF',
    category: 'Employment',
    size: '1.2 MB',
    uploadDate: '2026-04-08',
    status: 'approved',
    assignedTo: 'John Doe',
  },
];

const categories: DocumentCategory[] = [
  {
    id: '1',
    name: 'Employment',
    icon: '📄',
    documentCount: 4,
    lastUpdated: '2026-04-10',
  },
  {
    id: '2',
    name: 'Tax',
    icon: '💰',
    documentCount: 1,
    lastUpdated: '2026-04-05',
  },
  {
    id: '3',
    name: 'Health',
    icon: '🏥',
    documentCount: 1,
    lastUpdated: '2026-04-06',
  },
  {
    id: '4',
    name: 'Education',
    icon: '🎓',
    documentCount: 1,
    lastUpdated: '2025-08-20',
  },
];

const statusColors = {
  approved: '#10B981',
  pending: '#F59E0B',
  rejected: '#EF4444',
};

export default function DocumentsScreen() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const filteredDocs =
    activeCategory === 'all'
      ? documents
      : documents.filter((doc) => doc.category === activeCategory);

  const approvedCount = documents.filter((doc) => doc.status === 'approved').length;
  const pendingCount = documents.filter((doc) => doc.status === 'pending').length;
  const rejectedCount = documents.filter((doc) => doc.status === 'rejected').length;

  const leavePortal = () => {
    router.push('/leave');
  };

  const handleDownload = (doc: Document) => {
    Alert.alert('Downloading', `${doc.name} will be downloaded to your device.`);
  };

  const handleShare = (doc: Document) => {
    Alert.alert('Share', `Share ${doc.name} via...`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: Colors.primary, padding: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <TouchableOpacity onPress={leavePortal}>
          <Text style={{ color: '#fff', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: '#fff', fontSize: 14 }}>Employee Documents</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
            Document Library
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={{ padding: 20, backgroundColor: Colors.background, gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#10B981', fontSize: 28, fontWeight: 'bold' }}>{approvedCount}</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Approved</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#F59E0B', fontSize: 28, fontWeight: 'bold' }}>{pendingCount}</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Pending</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: Colors.card, padding: 16, borderRadius: 12 }}>
            <Text style={{ color: '#EF4444', fontSize: 28, fontWeight: 'bold' }}>{rejectedCount}</Text>
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Rejected</Text>
          </View>
        </View>
      </View>

      {/* Categories */}
      <View style={{ padding: 20, backgroundColor: Colors.card }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
          Browse by Category
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => setActiveCategory('all')}
            style={{
              backgroundColor: activeCategory === 'all' ? Colors.primary : Colors.background,
              padding: 12,
              borderRadius: 12,
              minWidth: 120,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 4 }}>📚</Text>
            <Text style={{ color: activeCategory === 'all' ? '#fff' : '#6b7280', fontSize: 12, fontWeight: '600' }}>
              All Documents
            </Text>
            <Text style={{ color: activeCategory === 'all' ? '#fff' : '#6b728070', fontSize: 10 }}>
              {documents.length}
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setActiveCategory(category.name)}
              style={{
                backgroundColor: activeCategory === category.name ? Colors.primary : Colors.background,
                padding: 12,
                borderRadius: 12,
                minWidth: 120,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 4 }}>{category.icon}</Text>
              <Text style={{ color: activeCategory === category.name ? '#fff' : '#6b7280', fontSize: 12, fontWeight: '600' }}>
                {category.name}
              </Text>
              <Text style={{ color: activeCategory === category.name ? '#fff' : '#6b728070', fontSize: 10 }}>
                {category.documentCount}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Document List */}
      <View style={{ padding: 20, backgroundColor: Colors.card, marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 12 }}>
          Documents ({filteredDocs.length})
        </Text>
        <View style={{ gap: 12 }}>
          {filteredDocs.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              onPress={() => setSelectedDoc(doc)}
              style={{
                backgroundColor: Colors.background,
                padding: 16,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: doc.type === 'PDF' ? '#EF4440' : doc.type === 'JPG' ? '#F59E0B' : '#3B82F6',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                  {doc.type.substring(0, 2)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: Colors.text, fontWeight: '600', fontSize: 14 }}>
                  {doc.name}
                </Text>
                <Text style={{ color: Colors.text70, fontSize: 11, marginTop: 2 }}>
                  {doc.category} • {doc.size}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <View
                  style={{
                    backgroundColor: `${statusColors[doc.status]}20`,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      color: statusColors[doc.status],
                      fontSize: 10,
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}
                  >
                    {doc.status}
                  </Text>
                </View>
                <Text style={{ color: Colors.text70, fontSize: 10 }}>{doc.uploadDate}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Document Actions */}
      <View style={{ padding: 20, gap: 12 }}>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>📤</Text>
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Upload New Document</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.card,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#d1d5db',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Text style={{ color: '#6b7280', fontWeight: '600', fontSize: 16 }}>📂</Text>
          <Text style={{ color: '#6b7280', fontWeight: '600', fontSize: 16 }}>Request Documents</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}