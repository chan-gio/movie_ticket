/* eslint-disable no-unused-vars */
import React from 'react';
import { Modal, Select, Button, message } from 'antd';

const { Option } = Select;

function EditSeatModal({ visible, seatNumber, seatType, onSave, onCancel }) {
  const [newSeatType, setNewSeatType] = React.useState(seatType);

  const handleSave = async () => {
    try {
      // Placeholder for API call to update seat type
      // await SeatService.updateSeat(seatNumber, { seat_type: newSeatType });
      onSave(seatNumber, newSeatType);
      message.success(`Seat ${seatNumber} updated to ${newSeatType}`);
    } catch (error) {
      message.error('Failed to update seat');
    }
  };

  return (
    <Modal
      title={`Edit Seat ${seatNumber}`}
      visible={visible}
      onOk={handleSave}
      onCancel={onCancel}
      okText="Save"
      cancelText="Cancel"
    >
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>Seat Type:</label>
        <Select
          value={newSeatType}
          onChange={setNewSeatType}
          style={{ width: 200 }}
        >
          <Option value="STANDARD">Standard</Option>
          <Option value="VIP">VIP</Option>
          <Option value="COUPLE">Couple</Option>
          <Option value="NOT_AVAILABLE">Not Available</Option>
        </Select>
      </div>
    </Modal>
  );
}

export default EditSeatModal;