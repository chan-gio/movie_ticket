/* eslint-disable no-unused-vars */
import { useParams, Link } from "react-router-dom";
import { Card, Row, Col, Typography, Select, Button, Space } from "antd";
import styles from "./MovieDetails.module.scss";
import { useState } from "react";
import ContentBox from "../../../components/UserPages/DetailPage/ContentBox";
import Showtime from "../../../components/UserPages/DetailPage/Showtime";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const movie = {
  id: 1,
  title: "Movie 1",
  picture: "https://play-lh.googleusercontent.com/nxWjOiNZKJZ8mfVLTqxWprprDXhO-D1S1C_S-m7VLWHBp32IziTVMs1u5R6ISb79zTKK",
  genre: "Action, Adventure",
  releaseDate: "2025-01-15",
  directed: "John Director",
  duration: "2h 15m",
  cast: "Actor A, Actor B, Actor C",
  synopsis:
    "An action-packed adventure through a thrilling world of challenges and triumphs.",
};

const showtimes = [
  {
    id: 1,
    cinema: "Cinema 1",
    picture: "https://via.placeholder.com/100",
    address: "123 Main St, City A",
    times: ["10:00 AM", "2:00 PM", "6:00 PM"],
    price: 10,
  },
  {
    id: 2,
    cinema: "Cinema 2",
    picture: "https://via.placeholder.com/100",
    address: "456 Elm St, City B",
    times: ["11:00 AM", "3:00 PM", "7:00 PM"],
    price: 12,
  },
  {
    id: 3,
    cinema: "Cinema 3",
    picture: "https://via.placeholder.com/100",
    address: "456 Elm St, City B",
    times: ["11:00 AM", "3:00 PM", "7:00 PM"],
    price: 12,
  },
];

const dates = ["2025-05-15", "2025-05-16", "2025-05-17"];

const locations = ["City A", "City B"];

function MovieDetails() {
  const { id } = useParams();
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return (
    <div className={styles.movieDetails}>
      <ContentBox movie={movie} />

      <Showtime dates={dates} locations={locations} showtimes={showtimes} />

      <div className={styles.viewMore}>
        <div className={styles.dividerLine}></div>
        <Link to="#" className={styles.viewMoreLink}>
          view more
        </Link>
        <div className={styles.dividerLine}></div>
      </div>
    </div>
  );
}

export default MovieDetails;
