import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';

interface LeaveRequest {
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  days: number;
}

const leaveTypes = [
  { id: 'sick', name: 'Sick Leave', emoji: '🌡️', color: Colors.orange },
  { id: 'casual', name: 'Casual Leave', emoji: '☕', color: Colors.green },
  { id: 'earned', name: 'Earned Leave', emoji: '🌴', color: Colors.blue },
  { id: 'maternity', name: 'Maternity Leave', emoji: '👶', color: Colors.pink },
  { id: 'paternity', name: 'Paternity Leave', emoji: '🤱', color: Colors.purple },
];

export default function LeaveScreen() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedType, setSelectedType] = useState('sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeName: 'Rahul Sharma',
      leaveType: 'Sick Leave',
      startDate: '2026-04-12',
      endDate: '2026-04-13',
      reason: 'Fever and body pain',
      status: 'approved',
      appliedDate: '2026-04-10',
      approvedBy: 'HR Manager',
      days: 2,
    },
    {
      id: '2',
      employeeName: 'Priya Patel',
      leaveType: 'Casual Leave',
      startDate: '2026-04-15',
      endDate: '2026-04-15',
      reason: 'Family function',
      status: 'pending',
      appliedDate: '2026-04-11',
      days: 1,
    },
  ]);

  const [leaveBalance, setLeaveBalance] = useState({
    sick: 12,
    casual: 10,
    earned: 15,
    maternity: 180,
    paternity: 15,
  });

  const handleRequestLeave = () => {
    if (!startDate || !endDate || !reason) {
      Alert.alert('Missing Info', 'Please fill all fields');
      return;
    }
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      employeeName: 'You',
      leaveType: selectedType.toUpperCase(),
      startDate,
      endDate,
      reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      days: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
    };
    setRequests([...requests, newRequest]);
    setShowRequestModal(false);
    setReason('');
  };

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, status: 'approved', approvedBy: 'HR Manager' } : r
    ));
    Alert.alert('Success', 'Leave request approved');
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, status: 'rejected' } : r
    ));
    Alert.alert('Success', 'Leave request rejected');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return Colors.green;
      case 'rejected': return Colors.red;
      default: return Colors.orange;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leave Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowRequestModal(true)}
        >
          <Text style={styles.addButtonText}>+ Request Leave</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Leave Balance</Text>
        <View style={styles.balanceGrid}>
          {leaveTypes.map(type => (
            <View key={type.id} style={styles.balanceCard}>
              <Text style={styles.balanceEmoji}>{type.emoji}</Text>
              <Text style={styles.balanceName}>{type.name}</Text>
              <Text style={styles.balanceValue}>{leaveBalance[type.id as keyof typeof leaveBalance]}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Leave Requests</Text>
        {requests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.requestEmployee}>
                <Text style={styles.employeeName}>{request.employeeName}</Text>
                <Text style={styles.requestType}>{request.leaveType}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                <Text style={styles.statusText}>{getStatusText(request.status)}</Text>
              </View>
            </View>
            <View style={styles.requestDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Period:</Text>
                <Text style={styles.detailValue}>{request.startDate} to {request.endDate}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Days:</Text>
                <Text style={styles.detailValue}>{request.days}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Reason:</Text>
                <Text style={styles.detailValue}>{request.reason}</Text>
              </View>
            </View>
            {request.status === 'pending' && (
              <View style={styles.requestActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: Colors.green }]}
                  onPress={() => handleApprove(request.id)}
                >
                  <Text style={styles.actionButtonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: Colors.red }]}
                  onPress={() => handleReject(request.id)}
                >
                  <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {showRequestModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Request Leave</Text>
            <View style={styles.form}>
              <Text style={styles.formLabel}>Leave Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typePicker}>
                {leaveTypes.map(type => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeButton,
                      selectedType === type.id && { backgroundColor: type.color }
                    ]}
                    onPress={() => setSelectedType(type.id)}
                  >
                    <Text style={[styles.typeButtonEmoji, { color: selectedType === type.id ? '#fff' : '#000' }]}>
                      {type.emoji}
                    </Text>
                    <Text style={[styles.typeButtonName, { color: selectedType === type.id ? '#fff' : '#000' }]}>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Start Date</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => {/* Date picker logic */}}
                  >
                    <Text style={styles.dateInputText}>{startDate || 'Select Start Date'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>End Date</Text>
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => {/* Date picker logic */}}
                  >
                    <Text style={styles.dateInputText}>{endDate || 'Select End Date'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Reason</Text>
                <TouchableOpacity
                  style={[styles.textArea, { minHeight: 100 }]}
                  onPress={() => {/* Text area logic */}}
                >
                  <Text style={styles.textAreaText}>{reason || 'Enter reason...'}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowRequestModal(false)}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalSubmitButton, { backgroundColor: Colors.primary }]}
                  onPress={handleRequestLeave}
                >
                  <Text style={styles.modalSubmitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: Colors.card,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  balanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  balanceCard: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  balanceEmoji: {
    fontSize: 32,
    marginBottom: 5,
  },
  balanceName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 5,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  requestCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  requestEmployee: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 3,
  },
  requestType: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  requestDetails: {
    gap: 5,
  },
  detailItem: {
    flexDirection: 'row',
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.secondaryText,
    width: 60,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.text,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    gap: 15,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  typePicker: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  typeButtonEmoji: {
    fontSize: 20,
    marginBottom: 3,
    textAlign: 'center',
  },
  typeButtonName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  formField: {
    flex: 1,
  },
  dateInput: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dateInputText: {
    color: Colors.text,
  },
  textArea: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  textAreaText: {
    color: Colors.text,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: Colors.secondaryText,
  },
  modalCancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalSubmitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSubmitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
};