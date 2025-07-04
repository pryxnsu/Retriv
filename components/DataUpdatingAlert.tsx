import React from 'react';
import { Alert, AlertDescription } from './ui/alert';

interface DataUpdatingAlertProp {
    icon: React.ReactElement;
    content: string;
}

const DataUpdatingAlert: React.FC<DataUpdatingAlertProp> = ({ icon, content }) => {
    return (
        <Alert className='flex gap-3 items-center'>
            <span>{icon}</span>
            <AlertDescription>{content}</AlertDescription>
        </Alert>
    );
};

export default DataUpdatingAlert;
