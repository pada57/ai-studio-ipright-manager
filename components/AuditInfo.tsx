import React from 'react';
import { format } from 'date-fns';

interface AuditInfoProps {
    createdBy: string;
    createdAt: string;
    lastModifiedBy: string;
    lastModifiedAt: string;
}

const formatDate = (dateString: string) => {
    try {
        return format(new Date(dateString), "yyyy-MM-dd 'at' HH:mm");
    } catch (e) {
        return 'Invalid Date';
    }
}

export const AuditInfo: React.FC<AuditInfoProps> = ({ createdBy, createdAt, lastModifiedBy, lastModifiedAt }) => {
    return (
        <div className="text-xs text-gray-500 flex flex-wrap gap-x-4 gap-y-1 justify-center">
            <span>
                <strong>Created:</strong> {formatDate(createdAt)} by <em>{createdBy}</em>
            </span>
            <span>
                <strong>Last Modified:</strong> {formatDate(lastModifiedAt)} by <em>{lastModifiedBy}</em>
            </span>
        </div>
    );
};
