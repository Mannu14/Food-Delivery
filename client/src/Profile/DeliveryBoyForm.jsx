import React, { useState } from 'react';
import LoadingShow from '../Loading/Loading';

const DeliveryBoyForm = (userEmail) => {
    const apiUrlProcess = `${window.location.origin}/apis`;

    const [deliveryBoysDetails, setDeliveryBoysDetails] = useState({
        frontImage: null,
        rearImage: null,
        dutyStartTime: '',
        dutyEndTime: '',
        vehicleNumber: '',
        currentLocation: '',
        currentStatus: ''
    });


    const [loading, setLoading] = useState(false);
    const [backendError, setBackendError] = useState('');

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            setDeliveryBoysDetails({ ...deliveryBoysDetails, [name]: files[0] });
        } else {
            setDeliveryBoysDetails({ ...deliveryBoysDetails, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', userEmail.userEmail);
        formData.append('updateProfile', userEmail.updateProfile);
        formData.append('frontImage', deliveryBoysDetails.frontImage);
        formData.append('rearImage', deliveryBoysDetails.rearImage);
        formData.append('dutyStartTime', deliveryBoysDetails.dutyStartTime);
        formData.append('dutyEndTime', deliveryBoysDetails.dutyEndTime);
        formData.append('vehicleNumber', deliveryBoysDetails.vehicleNumber);
        formData.append('currentLocation', deliveryBoysDetails.currentLocation);
        formData.append('currentStatus', deliveryBoysDetails.currentStatus);
        try {
            if (userEmail.userEmail && deliveryBoysDetails.frontImage && deliveryBoysDetails.rearImage
                && deliveryBoysDetails.dutyStartTime && deliveryBoysDetails.vehicleNumber && deliveryBoysDetails.currentLocation && deliveryBoysDetails.currentStatus) {
                const response = await fetch(`${apiUrlProcess}/delivery-boy`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to submit form');
                }
                if (userEmail.userEmail && userEmail.updateProfile) {
                    userEmail.setupProfile();
                }
                alert('Form submitted successfully!');
            }
            else {
                setBackendError('*all the field are required');
            }
        } catch (error) {
            setBackendError('*Failed to submit form');
            console.error('Error submitting form:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="address-box">
                <div className="fields-for-delivery-boy" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                    <div className="input-group" style={{ width: '45%' }}>
                        <input type="file" name="frontImage" style={{ margin: '20px 0' }} onChange={handleInputChange} />
                        <label style={{ top: '-9px', color: '#555', fontSize: '13px' }}>Vehicle Front Image</label>
                    </div>
                    <div className="input-group" style={{ width: '45%' }}>
                        <input type="file" name="rearImage" style={{ margin: '20px 0' }} onChange={handleInputChange} />
                        <label style={{ top: '-9px', color: '#555', fontSize: '13px' }}>Vehicle Rear Image</label>
                    </div>
                </div>
                <div className="time-for-delivery-boy" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
                    <div className="input-group" style={{ width: '45%' }}>
                        <input type="time" name="dutyStartTime" style={{ margin: '20px 0' }} value={deliveryBoysDetails.dutyStartTime} onChange={handleInputChange} />
                        <label style={{ top: '-9px', color: '#555', fontSize: '13px' }}>Duty Start Time</label>
                    </div>
                    <div className="input-group" style={{ width: '45%' }}>
                        <input type="time" name="dutyEndTime" style={{ margin: '20px 0' }} value={deliveryBoysDetails.dutyEndTime} onChange={handleInputChange} />
                        <label style={{ top: '-9px', color: '#555', fontSize: '13px' }}>Duty End Time</label>
                    </div>
                </div>

                <div className="input-group">
                    <input type="text" id="vehicleNumber" style={{ margin: '3px 0', padding: '5px' }} placeholder=' ' name="vehicleNumber" value={deliveryBoysDetails.vehicleNumber} onChange={handleInputChange} />
                    <label htmlFor="vehicleNumber">Vehicle Number</label>
                </div>

                <div className="input-group">
                    <input type="text" id="currentLocation" style={{ margin: '3px 0', padding: '5px' }} placeholder=' ' name="currentLocation" value={deliveryBoysDetails.currentLocation} onChange={handleInputChange} />
                    <label htmlFor="currentLocation">Current Location</label>
                </div>

                <div className="input-group">
                    <input type="text" id="currentStatus" style={{ margin: '3px 0', padding: '5px' }} placeholder=' ' name="currentStatus" value={deliveryBoysDetails.currentStatus} onChange={handleInputChange} />
                    <label htmlFor="currentStatus">Current Status (On Duty/Off Duty)</label>
                </div>

                {backendError && <p style={{ color: 'red', textAlign: 'center', alignItems: 'center', fontSize: '14px' }}>{backendError}</p>}
                <button type="submit" className="order-button">
                    {loading ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '25px' }}><LoadingShow width="25px" height="25px" /> please wait...</div> : 'Submit'}
                </button>
            </form>
        </>
    );
};

export default DeliveryBoyForm;
