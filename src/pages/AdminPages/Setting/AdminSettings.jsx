import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Typography,
  message,
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
} from "@ant-design/icons";
import styles from "./AdminSettings.module.scss";
import "../GlobalStyles.module.scss";
import SettingService from "../../../services/SettingService";
import { uploadImageToCloudinary } from "../../../utils/cloudinaryConfig";

const { Title, Text: TypographyText } = Typography;

function AdminSettings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [fileListLogo, setFileListLogo] = useState([]);
  const [fileListBanner, setFileListBanner] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null); // Store the Cloudinary URL for the logo
  const [bannerUrls, setBannerUrls] = useState([]); // Store up to 4 banner URLs
  const [uploadProgressLogo, setUploadProgressLogo] = useState(0); // Track progress for logo upload
  const [uploadProgressBanner, setUploadProgressBanner] = useState({}); // Track progress for each banner upload

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const settings = await SettingService.getSetting();
        form.setFieldsValue({
          name: settings.name,
          vip: settings.vip,
          couple: settings.couple,
        });
        setLogoUrl(settings.name || null);
        // Parse banner field (could be a JSON string or array)
        let banners = [];
        if (settings.banner) {
          try {
            // Try parsing as JSON if it's a string
            banners = typeof settings.banner === "string"
              ? JSON.parse(settings.banner)
              : settings.banner;
            // Ensure banners is an array of strings
            banners = Array.isArray(banners)
              ? banners.filter((url) => typeof url === "string" && url.trim() !== "")
              : [];
          } catch (err) {
            console.error("Error parsing banner field:", err);
            // If parsing fails, treat as a comma-separated string
            banners = typeof settings.banner === "string"
              ? settings.banner.split(",").filter((url) => url.trim() !== "")
              : [];
          }
        }
        setBannerUrls(banners);
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
      } catch (error) {
        message.error(error.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Ensure bannerUrls contains only valid strings
      const validBannerUrls = bannerUrls.filter(
        (url) => typeof url === "string" && url.trim() !== ""
      );

      const settingData = {
        name: logoUrl || values.name,
        vip: values.vip,
        couple: values.couple,
        banner: validBannerUrls, // Send as an array of strings
      };
      console.log("Submitting settings:", settingData);

      const updatedSettings = await SettingService.updateSetting(settingData);
      console.log("Updated settings:", updatedSettings);

      form.setFieldsValue({
        name: updatedSettings.name,
        vip: updatedSettings.vip,
        couple: updatedSettings.couple,
      });
      setLogoUrl(updatedSettings.name || null);

      // Parse the updated banner field
      let updatedBanners = [];
      if (updatedSettings.banner) {
        try {
          updatedBanners = typeof updatedSettings.banner === "string"
            ? JSON.parse(updatedSettings.banner)
            : updatedSettings.banner;
          updatedBanners = Array.isArray(updatedBanners)
            ? updatedBanners.filter((url) => typeof url === "string" && url.trim() !== "")
            : [];
        } catch (err) {
          console.error("Error parsing updated banner field:", err);
          updatedBanners = typeof updatedSettings.banner === "string"
            ? updatedSettings.banner.split(",").filter((url) => url.trim() !== "")
            : [];
        }
      }
      setBannerUrls(updatedBanners);
      setFileListLogo(
        updatedSettings.name
          ? [{ uid: "-1", name: "logo", url: updatedSettings.name, status: "done" }]
          : []
      );
      setFileListBanner(
        updatedBanners.map((url, index) => ({
          uid: `-${index + 1}`,
          name: `banner_${index + 1}`,
          url,
          status: "done",
        }))
      );
      message.success("Settings saved successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      message.error(error.response?.data?.message || error.message || "Failed to save settings");
    } finally {
      setLoading(false);
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
    message.info("Form reset to initial values");
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
            console.log(`Logo upload progress: ${progress}%`);
            setUploadProgressLogo(progress);
          }
        );
        console.log("Logo uploaded, URL:", url);
        if (url) {
          setLogoUrl(url); // Store the Cloudinary URL
          setFileListLogo([{ ...updatedFileList[0], url, status: "done" }]);
          form.setFieldsValue({ name: url }); // Set the uploaded URL in the form
          message.success("Logo uploaded successfully");
        } else {
          throw new Error("Failed to upload logo");
        }
      } catch (error) {
        console.error("Logo upload error:", error);
        message.error(error.message || "Failed to upload logo to Cloudinary");
        setFileListLogo([]);
        setLogoUrl(null);
      } finally {
        setUploadProgressLogo(0); // Reset progress
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
      })); // Reset progress
      try {
        const url = await uploadImageToCloudinary(
          newFile.originFileObj,
          import.meta.env.VITE_MOVIE_POSTER_UPLOAD_PRESET,
          (progress) => {
            console.log(`Banner ${newFileList.length} upload progress: ${progress}%`);
            setUploadProgressBanner((prev) => ({
              ...prev,
              [`banner_${newFileList.length - 1}`]: progress,
            }));
          }
        );
        console.log(`Banner ${newFileList.length} uploaded, URL:`, url);
        if (url) {
          setBannerUrls((prev) => [...prev, url]);
          setFileListBanner((prev) =>
            prev.map((f) =>
              f.uid === newFile.uid ? { ...f, url, status: "done" } : f
            )
          );
          message.success("Banner uploaded successfully");
        } else {
          throw new Error("Failed to upload banner");
        }
      } catch (error) {
        console.error("Banner upload error:", error);
        message.error(error.message || "Failed to upload banner to Cloudinary");
        setFileListBanner((prev) => prev.filter((f) => f.uid !== newFile.uid));
        setBannerUrls((prev) =>
          prev.filter((_, index) => fileListBanner[index]?.uid !== newFile.uid)
        );
      } finally {
        setUploadProgressBanner((prev) => ({
          ...prev,
          [`banner_${newFileList.length - 1}`]: 0,
        })); // Reset progress
      }
    }
  };

  const handleLogoRemove = () => {
    setFileListLogo([]);
    setLogoUrl(null);
    form.setFieldsValue({ name: "" });
    setUploadProgressLogo(0);
    return true; // Allow removal
  };

  const handleBannerRemove = (file) => {
    setFileListBanner((prev) => prev.filter((item) => item.uid !== file.uid));
    setBannerUrls((prev) =>
      prev.filter((_, index) => fileListBanner[index]?.uid !== file.uid)
    );
    message.success("Banner removed successfully");
  };

  // Validate URL format
  const validateUrl = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please upload or enter an image URL"));
    }
    if (typeof value === "string") {
      const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i;
      if (!urlPattern.test(value)) {
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
      // Validate file type and size
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }
      return false; // Prevent automatic upload
    },
    showUploadList: false,
    disabled: fileListLogo.length > 0 || uploadProgressLogo > 0,
  };

  const uploadPropsBanner = {
    onChange: handleBannerUploadChange,
    fileList: fileListBanner,
    beforeUpload: (file) => {
      // Validate file type and size
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }
      if (bannerUrls.length >= 4) {
        message.error("Maximum 4 banner images allowed");
        return Upload.LIST_IGNORE;
      }
      return false; // Prevent automatic upload
    },
    showUploadList: false,
    disabled: bannerUrls.length >= 4,
  };

  return (
    <div className={styles.container}>
      <Row justify="space-between" align="middle" className={styles.header}>
        <Col>
          <Title level={2} className={styles.pageTitle}>
            Settings
          </Title>
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
                  couple: 100,
                }}
              >
                <Title level={4} className={styles.sectionTitle}>
                  General Settings
                </Title>
                <TypographyText className={styles.headText}>
                  Configure the site’s branding and pricing settings.
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
                                  style={{ width: "100px", height: "100px", marginTop: "8px" }}
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
                                const urlPattern =
                                  /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i;
                                if (urlPattern.test(url)) {
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
                                  message.error(
                                    "Please enter a valid image URL"
                                  );
                                }
                              } else if (bannerUrls.length >= 4) {
                                message.error(
                                  "Maximum 4 banner images allowed"
                                );
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
                          min: 100,
                          max: 200,
                          message: "Couple bonus must be between 100 and 200",
                        },
                      ]}
                      extra={
                        <TypographyText type="secondary">
                          Price increase for couple tickets (100 to 200).
                        </TypographyText>
                      }
                    >
                      <InputNumber
                        min={100}
                        max={200}
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
                      Reset
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      htmlType="submit"
                      loading={loading}
                      className={styles.saveButton}
                      disabled={!logoUrl} // Disable submit until logo is uploaded
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