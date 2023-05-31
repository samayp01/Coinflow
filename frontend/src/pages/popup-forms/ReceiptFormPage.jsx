import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { recognizeReceipt } from '../../services/receiptService';
import '../../style/FormPopup.css';

function ReceiptFormPage({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [pictureTaken, setPictureTaken] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  const webcamRef = useRef(null);

  const webcamConfig = {
    width: 300,
    height: 600,
    facingMode: 'environment',
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const imageSrc = webcamRef.current.getScreenshot();
    setLoading(true);

    setPictureTaken(true);
    setImageSrc(imageSrc);
    
    const blob = await (await fetch(imageSrc)).blob();
    const file = new File([blob], 'receipt-pic.jpg', { type: 'image/jpeg' });

    const res = await recognizeReceipt(file);

    let parsedReceipt;
    if (res) {
      parsedReceipt = {
        id: res.id,
        merchant: res.merchant,
        amount: res.amount,
        date: res.date ? formatDate(res.date) : null,
      };
    } else {
      parsedReceipt = {
        error: 'Unable to parse receipt.',
      };
    }

    setLoading(false);
    onClose(parsedReceipt);
  };

  return (
    <div className="form-popup-overlay">
      <div className="form-popup">
        <button className="close-button" onClick={onClose}>
        ❌
        </button>
        <h2>Receipt Form</h2>
        <form onSubmit={handleSubmit}>
          <div className='camera-container'>
            {pictureTaken && <img src={imageSrc} alt='Loading...' />}
            {!pictureTaken && 
              <Webcam audio={false} 
                screenshotFormat="image/jpeg" 
                ref={webcamRef} 
                videoConstraints={webcamConfig} 
                screenshotQuality={0.99}
                />
            }
          </div>

          {!loading && <button id="photo-btn" type="submit">Capture</button>}
          {loading && <span>Reading Receipt...</span>}
        </form>
      </div>
    </div>
  );
};

export default ReceiptFormPage;