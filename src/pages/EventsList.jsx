import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Pagination } from '@mui/material';
import Grid from '@mui/material/Grid';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchEvents = async (page) => {
    const response = await axios.get(`http://localhost:8080/events?page=${page}&size=10`);
    setEvents(response.data.content);
    setTotalPages(response.data.totalPages);
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  return (
    <div>
      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{event.label}</Typography>
                <Typography color="textSecondary">
                  Start: {new Date(event.startDate).toLocaleDateString()}
                </Typography>
                <Typography color="textSecondary">
                  End: {new Date(event.endDate).toLocaleDateString()}
                </Typography>
                <Typography>
                  Artists: {event.artists.map(artist => artist.label).join(", ")}
                </Typography>
              </CardContent>
              <Button size="small" href={`/events/${event.id}`}>Learn More</Button>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={(e, value) => setPage(value - 1)}
        color="primary"
        showFirstButton
        showLastButton
        style={{ padding: 20 }}
      />
    </div>
  );
}

export default EventsList;
