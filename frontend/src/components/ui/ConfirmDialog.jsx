import React from 'react';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';

const ConfirmDialog = ({
    isOpen,
    title = 'Confirm',
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    destructive = false,
    loading = false,
    onConfirm,
    onCancel,
}) => {
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
                {description ? (
                    <p className="text-sm text-muted-foreground mb-5">{description}</p>
                ) : null}
                <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" onClick={onCancel} disabled={loading}>{cancelText}</Button>
                    <Button
                        variant={destructive ? 'destructive' : 'default'}
                        onClick={onConfirm}
                        loading={loading}
                        iconName={destructive ? 'Trash2' : 'Check'}
                        iconPosition="left"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
