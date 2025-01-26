import { useState, useEffect } from 'react';

const useEventForm = (initialEvent) => {
  const [formData, setFormData] = useState({
    label: "",
    startDate: "",
    endDate: "",
    artists: [],  
  });

  useEffect(() => {
    if (initialEvent) {
      setFormData({
        label: initialEvent.label || "",
        startDate: initialEvent.startDate || "",
        endDate: initialEvent.endDate || "",
        artists: initialEvent.artists || [],  
      });
    }
  }, [initialEvent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return [formData, handleChange];
};
export default useEventForm;