'use client';

import React from 'react';
import DeviceAppEditorForm from '../../components/DeviceAppEditorForm';

const EditDeviceAppPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="p-6">
      <DeviceAppEditorForm id={params.id} />
    </div>
  );
};

export default EditDeviceAppPage;