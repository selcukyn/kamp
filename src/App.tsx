import React from 'react';

const App = () => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service_id';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'default_template_id';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_public_key';
    // other code...
    return <div>Hello World</div>;
};

export default App;
