import React, { useEffect, useState } from 'react';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';

const TextInputDialog = ({
    isOpen,
    title = 'Enter text',
    label = 'Name',
    placeholder,
    initialValue = '',
    confirmText = 'Save',
    cancelText = 'Cancel',
    loading = false,
    onConfirm,
    onCancel,
}) => {
    const [value, setValue] = useState(initialValue || '');

    useEffect(() => {
        if (isOpen) setValue(initialValue || '');
    }, [isOpen, initialValue]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-xl shadow-xl max-w-sm w-full p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-foreground">{title}</h3>
                    <button aria-label="Close" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
                        <Icon name="X" size={18} />
                    </button>
                </div>
                <div className="mb-4">
                    <label htmlFor="text-input-dialog" className="block text-sm font-medium text-foreground mb-1">{label}</label>
                    <input
                        type="text"
                        id="text-input-dialog"
                        className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" onClick={onCancel} disabled={loading}>{cancelText}</Button>
                    <Button
                        variant="default"
                        onClick={() => onConfirm?.(value)}
                        loading={loading}
                        iconName="Save"
                        iconPosition="left"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TextInputDialog;
