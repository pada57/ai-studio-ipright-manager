import React from 'react';
import type { IpRight, Rule } from '../types';
import { Modal } from './common/Modal';
import { IpRightDetail } from './IpRightDetail';

interface IpRightDetailModalProps {
  ipRight: IpRight | null;
  rules: Rule[];
  onClose: () => void;
}

export const IpRightDetailModal: React.FC<IpRightDetailModalProps> = ({ ipRight, rules, onClose }) => {
  if (!ipRight) {
    return null;
  }

  return (
    <Modal isOpen={!!ipRight} onClose={onClose} title="IP Right Details">
      <IpRightDetail ipRight={ipRight} rules={rules} />
    </Modal>
  );
};
