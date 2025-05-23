import { Modal, Input as SearchInput, Select, Spin, message, Skeleton } from "antd";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import CinemaService from "../../services/CinemaService";
import styles from "./SelectCinemaModal.module.scss";

const { Option } = Select;

// Hàm chuẩn hóa văn bản tiếng Việt: bỏ dấu, chuyển thường
const normalizeVietnamese = (text) => {
  return text
    .normalize("NFD") // Phân tách ký tự và dấu
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
    .replace(/đ/g, "d") // Thay đ thành d
    .replace(/Đ/g, "D") // Thay Đ thành D
    .toLowerCase();
};

function SelectCinemaModal({ visible, onOk, onCancel }) {
  const [searchTerm, setSearchTerm] = useState("");
const [selectedCity, setSelectedCity] = useState(null); // Mặc định null
  const [allCinemas, setAllCinemas] = useState([]); // Lưu danh sách đầy đủ từ API
  const [cinemas, setCinemas] = useState([]); // Danh sách hiển thị (lọc hoặc không)
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const observer = useRef();

  // Debounced fetchCinemas
  const debouncedFetchCinemas = useCallback(
    debounce((pageNum, term) => {
      fetchCinemas(pageNum, term);
    }, 300),
    [selectedCity]
  );

  // Ref để theo dõi phần tử cuối cùng cho infinite loading
  const lastCinemaElementRef = useCallback(
    (node) => {
      if (loading || (selectedCity && searchTerm)) return; // Không paginate khi lọc client-side
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, selectedCity, searchTerm]
  );

  // Reset và tải rạp khi modal mở hoặc thành phố thay đổi
  useEffect(() => {
    if (visible) {
      setAllCinemas([]);
      setCinemas([]);
      setSearchTerm("");
      setPage(1);
      setHasMore(true);
      fetchCinemas(1, "");
    }
  }, [visible, selectedCity]);

  // Reset state khi modal đóng
  useEffect(() => {
    if (!visible) {
      setAllCinemas([]);
      setCinemas([]);
      setSearchTerm("");
      setSelectedCity(null);
      setLoading(false);
      setPage(1);
      setHasMore(true);
    }
  }, [visible]);

  // Tải thêm rạp khi trang thay đổi (chỉ khi không lọc client-side)
  useEffect(() => {
    if (page > 1 && visible && hasMore && !(selectedCity && searchTerm)) {
      fetchCinemas(page, searchTerm);
    }
  }, [page, searchTerm]);

  // Lọc client-side khi searchTerm thay đổi và có thành phố
  useEffect(() => {
    if (selectedCity && searchTerm) {
      const normalizedSearchWords = normalizeVietnamese(searchTerm)
        .split(/\s+/)
        .filter((word) => word);
      const filteredCinemas = allCinemas.filter((cinema) => {
        const normalizedName = normalizeVietnamese(cinema.name);
        return normalizedSearchWords.every((word) =>
          normalizedName.includes(word)
        );
      });
      setCinemas(filteredCinemas);
      setHasMore(false); // Không paginate khi lọc client-side
    } else if (selectedCity && !searchTerm) {
      setCinemas(allCinemas); // Hiển thị toàn bộ danh sách khi không có searchTerm
      setHasMore(allCinemas.length === 20); // Kiểm tra pagination
    }
  }, [searchTerm, allCinemas, selectedCity]);

  // Hàm lấy danh sách rạp
  const fetchCinemas = async (pageNum, term) => {
    setLoading(true);
    try {
      let data;
      if (selectedCity) {
        // Lấy tất cả rạp trong thành phố đã chọn
        data = await CinemaService.searchCinemaByAddress(selectedCity, pageNum);
      } else if (term !== "") {
        // Tìm kiếm theo tên rạp khi không chọn thành phố
        data = await CinemaService.searchCinemaByName(term, pageNum);
      } else {
        // Lấy tất cả rạp nếu không chọn thành phố và không có searchTerm
        data = await CinemaService.getAllCinemas({ per_pages: 20, pages: pageNum });
      }
      // Đảm bảo data là mảng
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu rạp không đúng định dạng");
      }
      setAllCinemas((prev) => [...prev, ...data]);
      setCinemas((prev) => [...prev, ...data]);
      setHasMore(data.length === 20); // per_pages là 20
    } catch (error) {
      message.error(error.message || "Không thể tải danh sách rạp");
      setAllCinemas((prev) => prev); // Giữ danh sách hiện tại nếu lỗi
      setCinemas((prev) => prev);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi ô tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!selectedCity) {
      // Khi không có thành phố, reset và gọi API với debounce
      setAllCinemas([]);
      setCinemas([]);
      setPage(1);
      setHasMore(true);
      debouncedFetchCinemas(1, value);
    }
    // Lọc client-side được xử lý trong useEffect khi có thành phố
  };

  // Xử lý thay đổi thành phố
  const handleCityChange = (value) => {
    setSelectedCity(value);
    setSearchTerm("");
    setAllCinemas([]);
    setCinemas([]);
    setPage(1);
    setHasMore(true);
  };

  // Xử lý click rạp
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
          placeholder="Tìm rạp theo tên"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <Select
          value={selectedCity}
          onChange={handleCityChange}
          className={styles.citySelect}
          placeholder="Chọn thành phố"
        >
          <Option value={null}>Chọn thành phố</Option>
          <Option value="Tp. Hồ Chí Minh">Tp. Hồ Chí Minh</Option>
          <Option value="Hà Nội">Hà Nội</Option>
          <Option value="Hải Phòng">Hải Phòng</Option>
        </Select>
      </div>
      {loading && cinemas.length === 0 ? (
        <div className={styles.skeletonContainer}>
          {[...Array(3)].map((_, index) => (
            <div key={index} className={styles.skeletonItem}>
              <Skeleton.Image active style={{ width: 50, height: 50, borderRadius: '50%' }} />
              <div className={styles.skeletonText}>
                <Skeleton.Input active style={{ width: 200, height: 16, marginBottom: 8 }} />
                <Skeleton.Input active style={{ width: 150, height: 14 }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.cinemaList}>
          {cinemas.length === 0 ? (
            <p>Không tìm thấy rạp nào.</p>
          ) : (
            cinemas.map((cinema, index) => {
              const isLastElement = cinemas.length === index + 1;
              return (
                <div
                  key={cinema.cinema_id}
                  ref={isLastElement ? lastCinemaElementRef : null}
                  className={styles.cinemaItem}
                  onClick={() => handleCinemaClick(cinema)}
                >
                  <div className={styles.cinemaImage}>
                    <img
                      src={`https://play-lh.googleusercontent.com/nxo4BC4BQ5hXuNi-UCdPM5kC0uZH1lq7bglINlWNUA_v8yMfHHOtTjhLTvo5NDjVeqx-?text=Cinema`}
                      alt="Cinema"
                    />
                  </div>
                  <div className={styles.cinemaInfo}>
                    <div className={styles.cinemaName}>{cinema.name}</div>
                    <div className={styles.cinemaAddress}>{cinema.address}</div>
                  </div>
                </div>
              );
            })
          )}
          {loading && cinemas.length > 0 && (
            <div className={styles.skeletonContainer}>
              {[...Array(2)].map((_, index) => (
                <div key={index} className={styles.skeletonItem}>
                  <Skeleton.Image active style={{ width: 50, height: 50, borderRadius: '50%' }} />
                  <div className={styles.skeletonText}>
                    <Skeleton.Input active style={{ width: 200, height: 16, marginBottom: 8 }} />
                    <Skeleton.Input active style={{ width: 150, height: 14 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

export default SelectCinemaModal;