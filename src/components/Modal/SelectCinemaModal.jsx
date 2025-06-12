// src/components/SelectCinemaModal.jsx
import { Modal, Input as SearchInput, Select, Spin, message, Skeleton } from 'antd';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { useCinemas, useSearchCinemasByName } from '../../hooks/useCinemas';
import styles from './SelectCinemaModal.module.scss';

const { Option } = Select;

// Hàm chuẩn hóa văn bản tiếng Việt
const normalizeVietnamese = (text) => {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

function SelectCinemaModal({ visible, onOk, onCancel }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [filteredCinemas, setFilteredCinemas] = useState([]);
  const navigate = useNavigate();
  const observer = useRef();

  // Debounced search term for API calls
  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => setDebouncedSearchTerm(value), 1000),
    []
  );

  // Update debounced search term when searchTerm changes
  useEffect(() => {
    debouncedSetSearchTerm(searchTerm);
  }, [searchTerm, debouncedSetSearchTerm]);

  // Gọi cả hai hook vô điều kiện
  const cinemasQuery = useCinemas({ city: selectedCity });
  const searchCinemasQuery = useSearchCinemasByName({ searchTerm: debouncedSearchTerm });

  // Chọn query dựa trên điều kiện
  const {
    data: cinemaPages,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    error,
  } = searchTerm && !selectedCity ? searchCinemasQuery : cinemasQuery;

  // Gộp dữ liệu từ các trang với useMemo
  const allCinemas = useMemo(
    () => cinemaPages?.pages.flatMap((page) => page.data) || [],
    [cinemaPages]
  );

  // Lọc client-side khi có searchTerm và selectedCity
  useEffect(() => {
    if (searchTerm && selectedCity) {
      const normalizedSearch = normalizeVietnamese(searchTerm);
      const filtered = allCinemas.filter((cinema) => {
        const normalizedName = normalizeVietnamese(cinema.name);
        const normalizedAddress = normalizeVietnamese(cinema.address);
        return (
          normalizedName.includes(normalizedSearch) ||
          normalizedAddress.includes(normalizedSearch)
        );
      });
      setFilteredCinemas(filtered);
    } else {
      setFilteredCinemas(allCinemas);
    }
  }, [allCinemas, selectedCity, searchTerm]);

  // Reset state khi modal mở
  useEffect(() => {
    if (visible) {
      setSearchTerm('');
      setDebouncedSearchTerm('');
      setSelectedCity(null);
    }
  }, [visible]);

  // Infinite loading
  const lastCinemaElementRef = useCallback(
    (node) => {
      if (isLoading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // Xử lý lỗi
  useEffect(() => {
    if (error) {
      message.error(error.message || 'Không thể tải danh sách rạp');
    }
  }, [error]);

  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Update searchTerm immediately
  };

  // Xử lý chọn thành phố
  const handleCityChange = (value) => {
    setSelectedCity(value);
    setSearchTerm(''); // Reset search term when city changes
    setDebouncedSearchTerm(''); // Reset debounced search term
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
          placeholder="Tìm rạp theo tên hoặc địa chỉ"
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
          <Option value={null}>Tất cả thành phố</Option>
          <Option value="Tp. Hồ Chí Minh">Tp. Hồ Chí Minh</Option>
          <Option value="Hà Nội">Hà Nội</Option>
          <Option value="Hải Phòng">Hải Phòng</Option>
        </Select>
      </div>
      {isLoading ? (
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
          {filteredCinemas.length === 0 ? (
            <p>Không tìm thấy rạp nào.</p>
          ) : (
            filteredCinemas.map((cinema, index) => {
              const isLastElement = filteredCinemas.length === index + 1;
              return (
                <div
                  key={cinema.cinema_id}
                  ref={isLastElement ? lastCinemaElementRef : null}
                  className={styles.cinemaItem}
                  onClick={() => handleCinemaClick(cinema)}
                >
                  <div className={styles.cinemaImage}>
                    <img
                      src="https://via.placeholder.com/50"
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
          {isFetchingNextPage && (
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