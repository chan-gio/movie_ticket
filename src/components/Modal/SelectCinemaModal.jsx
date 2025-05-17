import { Modal, Input as SearchInput, Select } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectCinemaModal.module.scss";

const { Option } = Select;

const cinemaData = [
  { name: "Đồng Đa", address: "890 Trần Hưng Đạo, Quận 5, Tp. Hồ Chí Minh", chain: "DDC" },
  { name: "Beta Quang Trung", address: "645 Quang Trung, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh", chain: "Beta Cinemas" },
  { name: "Beta Trần Quang Khải", address: "Tầng 2 & 3, Tòa nhà IMC, 62 Đường Trần Quang Khải, Phường Tân Định, Quận 1, Tp. Hồ Chí Minh", chain: "Beta Cinemas" },
  { name: "Beta Ung Văn Khiêm", address: "Tầng 1, tòa nhà PHÁT SKY, 26 Ung Văn Khiêm, phường 25, Quận Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam", chain: "Beta Cinemas" },
  { name: "Cinestar Hai Bà Trưng", address: "135 Hai Bà Trưng, P. Bến Nghé Quận 1, Tp. Hồ Chí Minh", chain: "Cinestar" },
  { name: "Cinestar Quốc Thanh", address: "271 Nguyễn Trãi, P. Nguyễn Cư Trinh, Quận 1, Tp. Hồ Chí Minh", chain: "Cinestar" },
  { name: "Cinestar Quận 6", address: "1466 Đ. Võ Văn Kiệt, Phường 1, Quận 6, Hồ Chí Minh", chain: "Cinestar" },
  { name: "DCINE Bến Thành", address: "56 Mạc Đỉnh Chi, Quận 1, Tp. Hồ Chí Minh", chain: "DCINE" },
  { name: "Mega GS Cao Thắng", address: "Lầu 6, 19 Cao Thắng, P2, Q.3, Tp. Hồ Chí Minh", chain: "Mega GS" },
  { name: "Mega GS Lý Chính Thắng", address: "Lầu 6, 19 Lý Chính Thắng, P2, Q.3, Tp. Hồ Chí Minh", chain: "Mega GS" },
];

function SelectCinemaModal({ visible, onOk, onCancel }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("Tp. Hồ Chí Minh");
  const navigate = useNavigate();

  const filteredCinemas = cinemaData.filter(
    (cinema) =>
      cinema.address.includes(selectedCity) &&
      (cinema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       cinema.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCinemaClick = (cinema) => {
    onOk();
    navigate(`/cinema/${cinema.name}`, { state: { cinema } });
  };

  return (
    <Modal
      title="Đặt vé phim chiếu rạp"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <div className={styles.searchContainer}>
        <SearchInput
          placeholder="Tìm rạp tại"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <Select
          value={selectedCity}
          onChange={(value) => setSelectedCity(value)}
          className={styles.citySelect}
        >
          <Option value="Tp. Hồ Chí Minh">Tp. Hồ Chí Minh</Option>
          <Option value="Hà Nội">Hà Nội</Option>
        </Select>
      </div>
      <div className={styles.cinemaList}>
        {filteredCinemas.map((cinema, index) => (
          <div
            key={index}
            className={styles.cinemaItem}
            onClick={() => handleCinemaClick(cinema)}
          >
            <div className={styles.cinemaImage}>
              <img
                src={`https://play-lh.googleusercontent.com/nxo4BC4BQ5hXuNi-UCdPM5kC0uZH1lq7bglINlWNUA_v8yMfHHOtTjhLTvo5NDjVeqx-?text=${cinema.chain}`}
                alt={cinema.chain}
              />
            </div>
            <div className={styles.cinemaInfo}>
              <div className={styles.cinemaName}>{cinema.chain} {cinema.name}</div>
              <div className={styles.cinemaAddress}>{cinema.address}</div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default SelectCinemaModal;