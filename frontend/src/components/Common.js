import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    {children}
  </div>
);

export const StatCard = ({ label, value, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <Card className={`${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        {Icon && <Icon size={40} className="opacity-20" />}
      </div>
    </Card>
  );
};

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClasses = 'font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, type = 'text', placeholder, className = '', ...props }) => (
  <div className="flex flex-col gap-2">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  </div>
);

export const TextArea = ({ label, placeholder, className = '', ...props }) => (
  <div className="flex flex-col gap-2">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <textarea
      placeholder={placeholder}
      className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  </div>
);

export const Select = ({ label, className = '', children, ...props }) => (
  <div className="flex flex-col gap-2">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <select
      className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);

export const Table = ({ columns, data }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-100 border-b-2 border-gray-300">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="px-4 py-2 text-left font-semibold text-gray-700">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
            {columns.map((col) => (
              <td key={col.key} className="px-4 py-2 text-gray-700">
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Badge = ({ children, variant = 'primary' }) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

export const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Confirm' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="mb-6">{children}</div>
        <div className="flex gap-4 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>{confirmText}</Button>
        </div>
      </Card>
    </div>
  );
};

export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <p className="mt-4 text-gray-600">{message}</p>
  </div>
);

export const Alert = ({ type = 'info', message }) => {
  const typeClasses = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className={`p-4 rounded-lg border ${typeClasses[type]}`}>
      {message}
    </div>
  );
};
