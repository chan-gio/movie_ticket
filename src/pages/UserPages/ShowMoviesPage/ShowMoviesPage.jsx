import React from "react";
import { Row, Col, Select } from "antd";
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import styles from "./ShowMoviesPage.module.scss";
import bannerImg from "/assets/banner.png";
import MovieCard from "../../../components/UserPages/ShowMoviesPage/MovieCard";

const { Option } = Select;

export default function ShowMoviesPage() {
  const fakeMovies = [
    {
      id: 1,
      title: "Movie 1",
      poster: "https://wallpapercave.com/wp/wp1816326.jpg",
      genre: "Action",
    },
    {
      id: 2,
      title: "Movie 2",
      poster: "https://upload.wikimedia.org/wikipedia/en/thumb/9/98/John_Wick_TeaserPoster.jpg/250px-John_Wick_TeaserPoster.jpg",
      genre: "Comedy",
    },
    {
      id: 3,
      title: "Movie 3",
      poster: "https://play-lh.googleusercontent.com/ZucjGxDqQ-cHIN-8YA1HgZx7dFhXkfnz73SrdRPmOOHEax08sngqZMR_jMKq0sZuv5P7-T2Z2aHJ1uGQiys",
      genre: "Drama",
    },
    {
      id: 4,
      title: "Movie 4",
      poster: "https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/1/2/1200x1800.jpg",
      genre: "Sci-Fi",
    },
    {
      id: 5,
      title: "Movie 5",
      poster: "https://wallpapercave.com/wp/wp1816326.jpg",
      genre: "Thriller",
    },
  ];

  return (
    <div className={styles.container}>
      <div
        className={styles.headerContainer}
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        <span>
          Danh sách phim đang chiếu <br />
          Danh sách các phim hiện đang chiếu rạp trên toàn quốc 16/05/2025. Xem
          lịch chiếu phim, giá vé tiện lợi, đặt vé nhanh chỉ với 1 bước!
        </span>
      </div>

      <Row>
        {/* Filter column */}
        <Col xs={24} md={24} lg={6}>
          <div className={styles.filterColumn}>
            <Select
              placeholder="Chọn thể loại"
              className={styles.select}
              suffixIcon={<CalendarOutlined />}
              onChange={(value) => console.log("Selected date:", value)}
            >
              <Option value="action">Hành động</Option>
              <Option value="comedy">Hài</Option> 
              <Option value="drama">Tâm lý</Option>
              <Option value="sci-fi">Khoa học viễn tưởng</Option>
            </Select>
            <Select
              placeholder="Chọn thành phố"
              className={styles.select}
              suffixIcon={<EnvironmentOutlined />}
              onChange={(value) => console.log("Selected city:", value)}
            >
              <Option value="hanoi">Hà Nội</Option>
              <Option value="hcm">Hồ Chí Minh</Option>
              <Option value="danang">Đà Nẵng</Option>
              <Option value="haiphong">Hải Phòng</Option>
              <Option value="cantho">Cần Thơ</Option>
              <Option value="nha-trang">Nha Trang</Option>
            </Select>
            <Select
              placeholder="Chọn ngày"
              className={styles.select}
              suffixIcon={<CalendarOutlined />}
              onChange={(value) => console.log("Selected date:", value)}
            >
              <Option value="2025-05-15">15/05/2025</Option>
              <Option value="2025-05-16">16/05/2025</Option>
              <Option value="2025-05-17">17/05/2025</Option>
              <Option value="2025-05-18">18/05/2025</Option>
            </Select>
          </div>
        </Col>

        {/* Movie grid column */}
        <Col xs={24} md={24} lg={18}>
          <Row>
            {fakeMovies.map((movie) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                style={{ padding: "10px" }}
                key={movie.id}
              >
                <MovieCard movie={movie} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}
