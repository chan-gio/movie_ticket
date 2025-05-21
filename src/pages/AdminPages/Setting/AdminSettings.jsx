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
} from "antd";
import {
  SaveOutlined,
  UndoOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import styles from "./AdminSettings.module.scss";
import "../GlobalStyles.module.scss";
import SettingService from "../../../services/SettingService";

const { Title, Text: TypographyText } = Typography;

function AdminSettings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [fileListLogo, setFileListLogo] = useState([]);
  const [fileListBanner, setFileListBanner] = useState([]);
  const [bannerUrls, setBannerUrls] = useState([]); // Store up to 4 banner URLs

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const settings = await SettingService.getSetting();
        form.setFieldsValue({
          name: settings.name,
          vip: settings.vip,
          couple: settings.couple,
          banner: settings.banner,
        });
        // If banner is a single URL, convert to array for consistency
        setBannerUrls(settings.banner ? [settings.banner] : []);
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
      const settingData = {
        name: values.name,
        vip: values.vip,
        couple: values.couple,
        banner: bannerUrls.join(","), // Store as comma-separated string
      };
      await SettingService.updateSetting(settingData);
      message.success("Settings saved successfully");
    } catch (error) {
      message.error(error.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setBannerUrls([]);
    setFileListLogo([]);
    setFileListBanner([]);
    message.info("Form reset to initial values");
  };

  // Simulate image upload (replace with actual Cloudinary or similar service)
  const handleUploadChange = (field) => (info) => {
    if (field === "logo") {
      setFileListLogo(info.fileList);
      if (info.file.status === "done" || info.file.url) {
        form.setFieldsValue({
          name:
            info.file.url ||
            `https://example.com/uploads/logo/${info.file.name}`,
        });
        message.success("Logo uploaded successfully");
      }
    } else if (field === "banner") {
      setFileListBanner(info.fileList);
      if (info.file.status === "done" || info.file.url) {
        const url =
          info.file.url ||
          `https://example.com/uploads/banner/${info.file.name}`;
        if (bannerUrls.length < 4) {
          setBannerUrls((prev) => [...prev, url]);
          message.success("Banner uploaded successfully");
        }
      }
    }
  };

  // Remove a banner URL
  const handleRemoveBanner = (url) => {
    setBannerUrls((prev) => prev.filter((item) => item !== url));
    setFileListBanner((prev) => prev.filter((item) => item.url !== url));
    message.success("Banner removed successfully");
  };

  // Validate URL format
  const validateUrl = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter or upload an image URL"));
    }
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i;
    if (!urlPattern.test(value)) {
      return Promise.reject(
        new Error("Please enter a valid image URL (e.g., .png, .jpg)")
      );
    }
    return Promise.resolve();
  };

  // Validate banner field (ensure at least one URL)
  const validateBanner = (_, value) => {
    if (bannerUrls.length === 0) {
      return Promise.reject(
        new Error("Please upload or enter at least one banner URL")
      );
    }
    return Promise.resolve();
  };

  // Upload props for logo (single image)
  const uploadPropsLogo = {
    onChange: handleUploadChange("logo"),
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
    disabled: fileListLogo.length > 0,
  };

  // Upload props for banner (up to 4 images)
  const uploadPropsBanner = {
    onChange: handleUploadChange("banner"),
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
                  banner: "",
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
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label={
                        <span className={styles.label}>
                          Banner Images (Max 4)
                        </span>
                      }
                      name="banner"
                      rules={[{ validator: validateBanner }]}
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
                                    { url, name: url.split("/").pop() },
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
                        {bannerUrls.length > 0 && (
                          <List
                            size="small"
                            bordered
                            dataSource={bannerUrls}
                            renderItem={(url) => (
                              <List.Item
                                actions={[
                                  <Button
                                    icon={<DeleteOutlined />}
                                    type="link"
                                    danger
                                    onClick={() => handleRemoveBanner(url)}
                                  >
                                    Remove
                                  </Button>,
                                ]}
                              >
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {url}
                                </a>
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
