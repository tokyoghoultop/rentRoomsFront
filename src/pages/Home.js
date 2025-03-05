import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CardMedia,
  Button,
  CircularProgress,
} from "@mui/material";
import useRoomStore from "../stores/roomStore";
import { useNavigate } from "react-router-dom";

function Home() {
  const { rooms, loading, error, fetchRooms } = useRoomStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card sx={{ margin: "20px auto" }}>
      <CardContent>
        <Grid
          container
          spacing={2}
          sx={{ padding: "20px", display: "flex", justifyContent: "center" }}
        >
          {rooms.map((room) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={room.id}
              style={{ width: 400 }}
            >
              <Card sx={{ margin: "10px" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={room.imageUrl}
                  alt={room.roomName}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {room.roomName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  {room.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  Capacity: {room.capacity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                  Price: {room.location}
                  </Typography>

                  <div
                    className="w-100"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Chip
                      label={room.status}
                      color={room.status === "Available" ? "success" : "error"}
                      sx={{ marginBottom: 1, marginTop: 1 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      disabled={room.status !== "Available"}
                      onClick={() => navigate(`/calendar/${room.id}`)}
                    >
                      {room.status === "Available" ? "Book Now" : "Occupied"}
                      {room.id}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Home;
