import { useEffect, useState, useCallback } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Spin,
  Upload,
  List,
  Progress,
} from "antd";
import {
  SaveOutlined,
  UndoOutlined,
  UploadOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  useSettings,
  useUpdateSettings,
  useResetSettings,
  useRefreshSettings,
  useParseBannerData,
  useValidateImageUrl,
} from "../../../hooks/useSettings";
import { toastSuccess, toastError, toastInfo, toastWarning } from "../../../utils/toastNotifier";
import { uploadImageToCloudinary } from "../../../utils/cloudinaryConfig";
import styles from "./AdminSettings.module.scss";
import "../GlobalStyles.module.scss";

const { Title, Text: TypographyText } = Typography;

function AdminSettings() {
  const [form] = Form.useForm();
  const [fileListLogo, setFileListLogo] = useState([]);
  const [fileListBanner, setFileListBanner] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);
  const [bannerUrls, setBannerUrls] = useState([]);
  const [uploadProgressLogo, setUploadProgressLogo] = useState(0);
  const [uploadProgressBanner, setUploadProgressBanner] = useState({});

  // Custom hooks
  const {
    data: settings,
    isLoading: loading,
    isError,
    error,
  } = useSettings();

  const updateSettingsMutation = useUpdateSettings();
  const resetSettingsMutation = useResetSettings();
  const refreshSettingsMutation = useRefreshSettings();
  const parseBannerData = useParseBannerData();
  const validateImageUrl = useValidateImageUrl();

  // Memoize the parseBannerData function to prevent infinite loops
  const parseBannerDataMemo = useCallback((bannerData) => {
    if (!bannerData) return [];
    
    try {
      // Try parsing as JSON if it's a string
      let banners = typeof bannerData === "string" 
        ? JSON.parse(bannerData) 
        : bannerData;
      
      // Ensure banners is an array of strings
      banners = Array.isArray(banners)
        ? banners.filter(url => typeof url === "string" && url.trim() !== "")
        : [];
      
      return banners;
    } catch (err) {
      console.error("Error parsing banner data:", err);
      // If parsing fails, treat as a comma-separated string
      return typeof bannerData === "string"
        ? bannerData.split(",").filter(url => url.trim() !== "")
        : [];
    }
  }, []);

  // Memoize the validateImageUrl function
  const validateImageUrlMemo = useCallback((url) => {
    if (!url) return false;
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i;
    return urlPattern.test(url);
  }, []);

  // Set form values when settings data is loaded
  useEffect(() => {
    if (settings) {
      form.setFieldsValue({
        name: settings.name,
        vip: settings.vip,
        couple: settings.couple,
      });
      
      setLogoUrl(settings.name || null);
      
      // Parse banner data
      const banners = parseBannerDataMemo(settings.banner);
      setBannerUrls(banners);
      
      // Set file lists
      setFileListLogo(
        settings.name
          ? [{ uid: "-1", name: "logo", url: settings.name, status: "done" }]
          : []
      );
      
      setFileListBanner(
        banners.map((url, index) => ({
          uid: `-${index + 1}`,
          name: `banner_${index + 1}`,
          url,
          status: "done",
        }))
      );
    }
  }, [settings, form, parseBannerDataMemo]);

  const handleSubmit = async (values) => {
    try {
      // Ensure bannerUrls contains only valid strings
      const validBannerUrls = bannerUrls.filter(
        (url) => typeof url === "string" && url.trim() !== ""
      );

      const settingData = {
        name: logoUrl || values.name,
        vip: values.vip,
        couple: values.couple,
        banner: validBannerUrls,
      };

      await updateSettingsMutation.mutateAsync(settingData);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setBannerUrls([]);
    setFileListLogo([]);
    setFileListBanner([]);
    setLogoUrl(null);
    setUploadProgressLogo(0);
    setUploadProgressBanner({});
    toastInfo("Form reset to initial values");
  };

  const handleRefresh = async () => {
    try {
      await refreshSettingsMutation.mutateAsync();
    } catch (error) {
      console.error("Error refreshing settings:", error);
    }
  };

  const handleLogoUploadChange = async ({ fileList: newFileList }) => {
    const updatedFileList = newFileList.slice(-1); // Limit to one file
    setFileListLogo(updatedFileList);

    if (updatedFileList.length > 0) {
      const file = updatedFileList[0].originFileObj;
      setUploadProgressLogo(0); // Reset progress
      try {
        const url = await uploadImageToCloudinary(
          file,
          import.meta.env.VITE_MOVIE_POSTER_UPLOAD_PRESET,
          (progress) => {
            setUploadProgressLogo(progress);
          }
        );
        if (url) {
          setLogoUrl(url);
          setFileListLogo([{ ...updatedFileList[0], url, status: "done" }]);
          form.setFieldsValue({ name: url });
          toastSuccess("Logo uploaded successfully");
        } else {
          throw new Error("Failed to upload logo");
        }
      } catch (error) {
        console.error("Logo upload error:", error);
        toastError(error.message || "Failed to upload logo to Cloudinary");
        setFileListLogo([]);
        setLogoUrl(null);
      } finally {
        setUploadProgressLogo(0);
      }
    } else {
      setLogoUrl(null);
    }
  };

  const handleBannerUploadChange = async ({ fileList: newFileList }) => {
    const newFile = newFileList[newFileList.length - 1];
    setFileListBanner(newFileList);
    if (newFile) {
      setUploadProgressBanner((prev) => ({
        ...prev,
        [`banner_${newFileList.length - 1}`]: 0,
      }));
      try {
        const url = await uploadImageToCloudinary(
          newFile.originFileObj,
          import.meta.env.VITE_MOVIE_POSTER_UPLOAD_PRESET,
          (progress) => {
            setUploadProgressBanner((prev) => ({
              ...prev,
              [`banner_${newFileList.length - 1}`]: progress,
            }));
          }
        );
        if (url) {
          setBannerUrls((prev) => [...prev, url]);
          setFileListBanner((prev) =>
            prev.map((f) =>
              f.uid === newFile.uid ? { ...f, url, status: "done" } : f
            )
          );
          toastSuccess("Banner uploaded successfully");
        } else {
          throw new Error("Failed to upload banner");
        }
      } catch (error) {
        console.error("Banner upload error:", error);
        toastError(error.message || "Failed to upload banner to Cloudinary");
        setFileListBanner((prev) => prev.filter((f) => f.uid !== newFile.uid));
        setBannerUrls((prev) =>
          prev.filter((_, index) => fileListBanner[index]?.uid !== newFile.uid)
        );
      } finally {
        setUploadProgressBanner((prev) => ({
          ...prev,
          [`banner_${newFileList.length - 1}`]: 0,
        }));
      }
    }
  };

  const handleLogoRemove = () => {
    setFileListLogo([]);
    setLogoUrl(null);
    form.setFieldsValue({ name: "" });
    setUploadProgressLogo(0);
    return true;
  };

  const handleBannerRemove = (file) => {
    setFileListBanner((prev) => prev.filter((item) => item.uid !== file.uid));
    setBannerUrls((prev) =>
      prev.filter((_, index) => fileListBanner[index]?.uid !== file.uid)
    );
    toastSuccess("Banner removed successfully");
  };

  // Validate URL format
  const validateUrl = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please upload or enter an image URL"));
    }
    if (typeof value === "string") {
      if (!validateImageUrlMemo(value)) {
        return Promise.reject(
          new Error("Please enter a valid image URL (e.g., .png, .jpg)")
        );
      }
    }
    return Promise.resolve();
  };

  const uploadPropsLogo = {
    onChange: handleLogoUploadChange,
    fileList: fileListLogo,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        toastError("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toastError("Image must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    showUploadList: false,
    disabled: fileListLogo.length > 0 || uploadProgressLogo > 0,
  };

  const uploadPropsBanner = {
    onChange: handleBannerUploadChange,
    fileList: fileListBanner,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        toastError("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        toastError("Image must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }
      if (bannerUrls.length >= 4) {
        toastError("Maximum 4 banner images allowed");
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    showUploadList: false,
    disabled: bannerUrls.length >= 4,
  };

  // Handle error state
  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <TypographyText type="danger">
            Error: {error?.message || "Failed to load settings"}
          </TypographyText>
          <Button 
            type="primary" 
            onClick={handleRefresh}
            style={{ marginTop: 16 }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Settings
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={refreshSettingsMutation.isPending}
            className={styles.refreshButton}
          >
            Refresh
          </Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className={styles.mainContent}>
        <Col xs={24} lg={24}>
          <Card className={styles.card}>
            {loading ? (
              <div className={styles.loading}>
                <Spin size="large" />
              </div>
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  name: "",
                  vip: 0,
                  couple: 0,
                }}
              >
                <Title level={4} className={styles.sectionTitle}>
                  General Settings
                </Title>
                <TypographyText className={styles.headText}>
                  Configure the site's branding and pricing settings.
                </TypographyText>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className={styles.label}>Site Logo</span>}
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please upload or enter a logo URL",
                        },
                        { validator: validateUrl },
                      ]}
                      extra={
                        <TypographyText type="secondary">
                          Upload one logo image or enter its URL (e.g.,
                          https://example.com/logo.png).
                        </TypographyText>
                      }
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Space>
                          <Input
                            placeholder="Enter logo URL"
                            className={styles.input}
                          />
                          <Upload {...uploadPropsLogo}>
                            <Button
                              icon={<UploadOutlined />}
                              className={styles.uploadButton}
                            >
                              Upload
                            </Button>
                          </Upload>
                        </Space>
                        {fileListLogo.length > 0 && (
                          <div className={styles.previewContainer}>
                            <TypographyText>
                              Selected: {fileListLogo[0].name}
                            </TypographyText>
                            {fileListLogo[0].url && (
                              <>
                                <img
                                  src={fileListLogo[0].url}
                                  alt="Logo Preview"
                                  className={styles.previewImage}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    marginTop: "8px",
                                  }}
                                />
                                <CloseCircleOutlined
                                  className={styles.removeIcon}
                                  onClick={handleLogoRemove}
                                  style={{ marginLeft: "8px" }}
                                />
                              </>
                            )}
                          </div>
                        )}
                        {uploadProgressLogo > 0 && (
                          <Progress percent={uploadProgressLogo} size="small" />
                        )}
                      </Space>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={
                        <span className={styles.label}>
                          Banner Images (Max 4)
                        </span>
                      }
                      extra={
                        <TypographyText type="secondary">
                          Upload up to 4 banner images or enter their URLs
                          (e.g., https://example.com/banner.jpg).
                        </TypographyText>
                      }
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Space>
                          <Input
                            placeholder="Enter banner URL"
                            value=""
                            onChange={(e) => {
                              const url = e.target.value;
                              if (url && bannerUrls.length < 4) {
                                if (validateImageUrlMemo(url)) {
                                  setBannerUrls((prev) => [...prev, url]);
                                  setFileListBanner((prev) => [
                                    ...prev,
                                    {
                                      uid: `-${prev.length + 1}`,
                                      name: url.split("/").pop(),
                                      url,
                                      status: "done",
                                    },
                                  ]);
                                } else {
                                  toastError("Please enter a valid image URL");
                                }
                              } else if (bannerUrls.length >= 4) {
                                toastError("Maximum 4 banner images allowed");
                              }
                            }}
                            className={styles.input}
                          />
                          <Upload {...uploadPropsBanner}>
                            <Button
                              icon={<UploadOutlined />}
                              className={styles.uploadButton}
                            >
                              Upload
                            </Button>
                          </Upload>
                        </Space>
                        {Object.keys(uploadProgressBanner).map((key) => {
                          if (uploadProgressBanner[key] > 0) {
                            return (
                              <Progress
                                key={key}
                                percent={uploadProgressBanner[key]}
                                size="small"
                              />
                            );
                          }
                          return null;
                        })}
                        {fileListBanner.length > 0 && (
                          <List
                            size="small"
                            bordered
                            dataSource={fileListBanner}
                            renderItem={(file, index) => (
                              <List.Item
                                actions={[
                                  <Button
                                    icon={<DeleteOutlined />}
                                    type="link"
                                    danger
                                    onClick={() => handleBannerRemove(file)}
                                  >
                                    Remove
                                  </Button>,
                                ]}
                              >
                                {file.url ? (
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {file.name}
                                  </a>
                                ) : (
                                  <span>{file.name}</span>
                                )}
                              </List.Item>
                            )}
                          />
                        )}
                      </Space>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className={styles.label}>VIP Bonus</span>}
                      name="vip"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the VIP bonus value",
                        },
                        {
                          type: "number",
                          min: 0,
                          max: 100,
                          message: "VIP bonus must be between 0 and 100",
                        },
                      ]}
                      extra={
                        <TypographyText type="secondary">
                          Price increase for VIP tickets (0 to 100).
                        </TypographyText>
                      }
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        className={styles.inputNumber}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={<span className={styles.label}>Couple Bonus</span>}
                      name="couple"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the couple bonus value",
                        },
                        {
                          type: "number",
                          min: 0,
                          max: 100,
                          message: "Couple bonus must be between 0 and 100",
                        },
                      ]}
                      extra={
                        <TypographyText type="secondary">
                          Price increase for couple tickets (0 to 100).
                        </TypographyText>
                      }
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        className={styles.inputNumber}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify="end" className={styles.formActions}>
                  <Space>
                    <Button
                      icon={<UndoOutlined />}
                      onClick={handleReset}
                      className={styles.resetButton}
                    >
                      Reset Form
                    </Button>
                    <Button
                      type="default"
                      onClick={() => resetSettingsMutation.mutate()}
                      loading={resetSettingsMutation.isPending}
                      className={styles.resetButton}
                    >
                      Reset to Default
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      htmlType="submit"
                      loading={updateSettingsMutation.isPending}
                      className={styles.saveButton}
                      disabled={!logoUrl}
                    >
                      Save Settings
                    </Button>
                  </Space>
                </Row>
              </Form>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AdminSettings;
