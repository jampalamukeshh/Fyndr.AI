import React, { useEffect, useState } from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Select from 'components/ui/Select';

const matchRangeOptions = [
    { value: 'all', label: 'Any match' },
    { value: '90-100', label: '90% - 100%' },
    { value: '75-89', label: '75% - 89%' },
    { value: '60-74', label: '60% - 74%' },
    { value: '0-59', label: 'Below 60%' }
];

const locationTypeOptions = [
    { value: 'all', label: 'Any location type' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'on-site', label: 'On-site' }
];

const JobFeedFilterSidebar = ({ filters, onFilterChange, onApplyFilters, onClearFilters }) => {
    const [localFilters, setLocalFilters] = useState(filters || {});

    useEffect(() => {
        setLocalFilters(filters || {});
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
        if (onFilterChange) onFilterChange(key, value);
    };

    const handleApply = () => {
        if (onApplyFilters) onApplyFilters(localFilters);
    };

    const handleClear = () => {
        setLocalFilters({});
        if (onClearFilters) onClearFilters();
    };

    return (
        <aside className="hidden lg:block lg:col-span-3">
            <div className="glassmorphic border-r border-white/20 h-full p-6 overflow-y-auto">
                <div className="flex items-center space-x-2 mb-6">
                    <Icon name="Filter" size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                </div>
                <div className="space-y-6">
                    {/* Job Role */}
                    <div>
                        <h3 className="font-medium text-foreground mb-3">Job Role</h3>
                        <Input
                            type="text"
                            placeholder="e.g. AI Engineer, Backend Developer"
                            value={localFilters.role || ''}
                            onChange={e => handleFilterChange('role', e.target.value)}
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-medium text-foreground mb-3">Company</h3>
                        <Input
                            type="text"
                            placeholder="e.g. Groww, CRED, Databricks"
                            value={localFilters.company || ''}
                            onChange={e => handleFilterChange('company', e.target.value)}
                        />
                    </div>

                    {/* Match Percentage */}
                    <div>
                        <h3 className="font-medium text-foreground mb-3">Match Percentage</h3>
                        <Select
                            options={matchRangeOptions}
                            value={localFilters.matchRange || 'all'}
                            onChange={value => handleFilterChange('matchRange', value)}
                            placeholder="Select match range"
                        />
                    </div>

                    {/* Location Type */}
                    <div>
                        <Select
                            options={locationTypeOptions}
                            value={localFilters.locationType || 'all'}
                            onChange={value => handleFilterChange('locationType', value)}
                            placeholder="Select location type"
                        />
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
                        These filters are scoped only to job-specific fields shown in this feed.
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="flex space-x-3 mt-8 pt-6 border-t border-white/10">
                    <Button
                        variant="outline"
                        onClick={handleClear}
                        className="flex-1"
                        iconName="RotateCcw"
                        iconPosition="left"
                    >
                        Clear
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleApply}
                        className="flex-1"
                        iconName="Check"
                        iconPosition="left"
                    >
                        Apply
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default JobFeedFilterSidebar;
