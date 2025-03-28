import { Button, Space, message, Avatar, Upload, Modal, UploadProps } from 'antd';
import { RedoOutlined, UserOutlined, UploadOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { restoreDefaultAvatarAPI } from "../../../../apis/api";
import { useTranslation } from 'react-i18next';
const { confirm } = Modal;
import styles from './index.module.scss';
// 引入cookie
import cookie from 'react-cookies'
// 拿cookie
let userData = cookie.load("userData")

interface PropsType {
  headImgUrl?: string | null;
  refresh: Function;
}

const uploadHeadImg: React.FC<PropsType> = (props) => {

  const {t} = useTranslation()

  const { headImgUrl, refresh } = props;

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // 文件上传
  const uploadProps: UploadProps = {
    name: 'file',
    accept: "image/png, image/jpeg",
    maxCount: 1,
    headers: {
      userId: userData.adminId || userData.patientId || userData.doctorId,
      userIdentity: userData.userIdentity,
    },
    action: `${baseUrl}/file/upload`,
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error(t('system.tips.fileFormat'));
      }
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        message.error(t('system.tips.fileSize'));
      }
      return isJpgOrPng && isLt2M;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name}`+t('system.uploadSuccess'));
        refresh();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name}`+t('system.uploadFail'));
      }
    }
  };
  // 恢复默认头像
  const restoreDefaultAvatar = () => {
    confirm({
      title: t('system.avatarReset'),
      icon: <ExclamationCircleFilled />,
      content: t('common.modify_warning'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      async onOk() {
        const { code, msg } = await restoreDefaultAvatarAPI();
        if (code === 0) {
          message.success(msg);
          refresh();
        } else {
          message.error(msg);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  return (
    <Space align="end" className={styles.changeHead}>
      <Avatar src={headImgUrl ? baseUrl + headImgUrl : null} size={64} icon={<UserOutlined />} />
      <Space direction="vertical">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} type="primary">{t('system.uploadAvatar')}</Button>
        </Upload>
        <Button icon={<RedoOutlined />} onClick={restoreDefaultAvatar}>{t('system.resetAvatar')}</Button>
      </Space>
    </Space>
  )
}

export default uploadHeadImg;
