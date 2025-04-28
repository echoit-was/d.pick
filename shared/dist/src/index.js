"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.generateId = generateId;
exports.getStatusColor = getStatusColor;
exports.getPriorityLabel = getPriorityLabel;
// 공유 유틸리티 함수
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
function generateId() {
    return Math.random().toString(36).substring(2, 15);
}
function getStatusColor(status) {
    const colors = {
        todo: '#3498db',
        inProgress: '#f39c12',
        review: '#9b59b6',
        done: '#2ecc71'
    };
    return colors[status];
}
function getPriorityLabel(priority) {
    const labels = {
        low: '낮음',
        medium: '중간',
        high: '높음',
        urgent: '긴급'
    };
    return labels[priority];
}
