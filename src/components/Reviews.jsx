import React, { useState } from 'react';
import { Stack, Button, Select, MenuItem } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CustomRating from './CustomRating';
import CustomAvatar from './CustomAvatar';
import '../styles/Reviews.css';

const Reviews = () => {
  const [sortBy, setSortBy] = useState('recent');

  const reviews = [
    {
      id: 1,
      user: {
        name: 'Omar Sundaram',
        avatar: 'https://example.com/avatar1.jpg'
      },
      rating: 4,
      date: 'hace 2 días',
      comment: 'La ciudad amurallada es preciosa, llena de vida y color. El tour nos llevó a rincones únicos y aprendimos muchísimo sobre la historia de Cartagena.'
    },
    {
      id: 2,
      user: {
        name: 'Emily H.',
        avatar: 'https://example.com/avatar2.jpg'
      },
      rating: 5,
      date: 'hace 9 días',
      comment: 'This tour was amazing! The guide was super knowledgeable, and the architecture is stunning. You can feel the history in every corner. A must-visit!'
    },
    {
      id: 3,
      user: {
        name: 'Juan Carlos',
        avatar: 'https://example.com/avatar3.jpg'
      },
      rating: 3,
      date: 'hace 15 días',
      comment: 'El recorrido estuvo bien, aunque me hubiera gustado más tiempo para tomar fotos. El guía conocía muy bien la historia del lugar.'
    }
  ];

  const ratingStats = {
    average: 4.3,
    total: 15,
    distribution: [
      { stars: 5, count: 10 },
      { stars: 4, count: 3 },
      { stars: 3, count: 2 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 }
    ]
  };

  return (
    <section className="reviews-section">
      <h2>Reseñas</h2>
      
      <div className="reviews-header">
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{ratingStats.average}/5</span>
            <CustomRating value={ratingStats.average} readOnly />
            <span className="total-reviews">{ratingStats.total} reseñas</span>
          </div>

          <div className="rating-bars">
            {ratingStats.distribution.map(({ stars, count }) => (
              <div key={stars} className="rating-bar-row">
                <span>{stars}★</span>
                <div className="rating-bar">
                  <div 
                    className="rating-bar-fill" 
                    style={{ width: `${(count / ratingStats.total) * 100}%` }}
                  />
                </div>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-actions">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              borderRadius: '30px',
              textTransform: 'none',
              backgroundColor: '#6749D9',
              padding: '10px 20px'
            }}
          >
            Escribir una opinión
          </Button>

          <div className="reviews-filters">
            <div className="reviews-sort">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
                sx={{
                  borderRadius: '30px',
                  minWidth: '150px',
                  height: '40px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '30px'
                  }
                }}
              >
                <MenuItem value="relevant">Más Relevantes</MenuItem>
                <MenuItem value="recent">Más Recientes</MenuItem>
              </Select>
            </div>

            <Button
              variant="contained"
              startIcon={<FilterAltIcon />}
              sx={{
                borderRadius: '30px',
                textTransform: 'none',
                backgroundColor: '#1C1B1F',
                height: '40px',
                padding: '8px 16px'
              }}
            >
              Filtrar
            </Button>
          </div>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <Stack direction="row" spacing={2} alignItems="center">
                <CustomAvatar 
                  src={review.user.avatar} 
                  alt={review.user.name}
                />
                <div className="user-info">
                  <CustomRating value={review.rating} readOnly />
                  <span className="user-name">{review.user.name}</span>
                  <span className="review-date">{review.date}</span>
                </div>
              </Stack>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>

      <div className="reviews-pagination">
        <Button
          variant="contained"
          sx={{
            borderRadius: '30px',
            textTransform: 'none',
            backgroundColor: '#1C1B1F',
            padding: '10px 20px'
          }}
        >
          Ver más reseñas
        </Button>
      </div>
    </section>
  );
};

export default Reviews;
