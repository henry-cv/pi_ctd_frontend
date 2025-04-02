class ReservationService {
  // Create a new reservation
  async createReservation(reservationData) {
    try {
      console.log("ReservationService: Creating reservation", reservationData);
      
      // Validate required fields
      if (!reservationData.disponibilidadProductoId) {
        throw new Error("Missing disponibilidadProductoId in reservation data");
      }
      
      if (!reservationData.usuarioEmail) {
        throw new Error("Missing usuarioEmail in reservation data");
      }
      
      if (!reservationData.cantidadPersonas) {
        // Default to 1 person if not specified
        reservationData.cantidadPersonas = 1;
      }
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }
      
      // Log complete request details for debugging
      console.log("API Request Details:", {
        url: '/api/reserva/registrar',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: reservationData
      });
      
      const response = await fetch('/api/reserva/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reservationData)
      });
      
      // Check if response is ok (status in the range 200-299)
      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json().catch(() => null) || 
                         await response.text().catch(() => null) ||
                         { message: `Error: ${response.status} ${response.statusText}` };
                         
        throw { 
          response: {
            status: response.status,
            statusText: response.statusText,
            data: errorData,
            headers: Object.fromEntries(response.headers.entries())
          }
        };
      }
      
      // Parse successful response
      const data = await response.json();
      console.log("ReservationService: Reservation created successfully", data);
      return data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get reservations by user email
  async getUserReservations(userEmail) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`/api/reserva/usuario/${userEmail}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null) || 
                         await response.text().catch(() => null) ||
                         { message: `Error: ${response.status} ${response.statusText}` };
        throw { 
          response: {
            status: response.status,
            data: errorData
          }
        };
      }
      
      return await response.json();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Get a specific reservation by ID
  async getReservationById(id) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`/api/reserva/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null) || 
                         await response.text().catch(() => null) ||
                         { message: `Error: ${response.status} ${response.statusText}` };
        throw { 
          response: {
            status: response.status,
            data: errorData
          }
        };
      }
      
      return await response.json();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Edit an existing reservation
  async editReservation(id, reservationData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`/api/reserva/editar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reservationData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null) || 
                         await response.text().catch(() => null) ||
                         { message: `Error: ${response.status} ${response.statusText}` };
        throw { 
          response: {
            status: response.status,
            data: errorData
          }
        };
      }
      
      return await response.json();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Cancel a reservation
  async cancelReservation(id) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`/api/reserva/cancelar/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null) || 
                         await response.text().catch(() => null) ||
                         { message: `Error: ${response.status} ${response.statusText}` };
        throw { 
          response: {
            status: response.status,
            data: errorData
          }
        };
      }
      
      return await response.json();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Add a review to a reservation
  async addReview(reviewData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch('/api/reserva/agregar-resena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null) || 
                         await response.text().catch(() => null) ||
                         { message: `Error: ${response.status} ${response.statusText}` };
        throw { 
          response: {
            status: response.status,
            data: errorData
          }
        };
      }
      
      return await response.json();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Helper method to handle errors
  handleError(error) {
    console.error("==== RESERVATION API ERROR ====");
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Status Code:", error.response.status);
      console.error("Response Data:", error.response.data);
      
      // If token expired or unauthorized
      if (error.response.status === 401) {
        console.error("Authentication error - token may be expired or invalid");
      } else if (error.response.status === 400) {
        console.error("Bad Request - check your request data");
      } else if (error.response.status === 404) {
        console.error("Not Found - endpoint may be incorrect");
      } else if (error.response.status === 500) {
        console.error("Server Error - backend problem");
      }
    } else if (error.message) {
      // Network error or custom client-side error
      console.error("Error message:", error.message);
      
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        console.error("Network error - server may be down or unreachable");
      }
    } else {
      // Unknown error
      console.error("Unknown error:", error);
    }
    
    console.error("===========================");
  }
}

export default new ReservationService();