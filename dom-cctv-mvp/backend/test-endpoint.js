// Script de prueba para verificar el endpoint /events/days
const axios = require('axios');

async function testEventDays() {
  try {
    // Configurar fechas para el mes actual
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
    
    console.log('Testing endpoint with dates:', startDate, 'to', endDate);
    
    // Primero necesitamos obtener un token de auth
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@domcctv.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('Got auth token');
    
    // Ahora probar el endpoint
    const response = await axios.get('http://localhost:3001/api/events/days', {
      params: {
        startDate,
        endDate
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testEventDays();